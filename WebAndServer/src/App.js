import React, { Component } from "react";
import io from "socket.io-client";
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc'
class App extends Component {
  constructor(props) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();

    this.socket = null;
    this.candidate = [];
  }

  componentWillMount() {
    this.socket = io("/webrtcPeer", {
      path: "/webrtc",
      query: {},
    });

    // this.socket = io.connect(
    //   "https://c54d-2001-ee0-453c-91b0-30d1-fdbe-8778-b671.ngrok.io/webrtcPeer",
    //   {
    //     path: "/webrtc",
    //     query: {},
    //   }
    // );

    this.socket.on("connection-success", (success) => {
      console.log(success);
    });

    this.socket.on("offerOrAnswer", (sdp) => {
      this.textref.value = JSON.stringify(sdp);
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    this.socket.on("candidate", (candidate) => {
      // this.candidate = [...this.candidate, candidate];
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // const pc_config = null;

    const pc_config = {
      iceServers: [
        // {
        //   urls: "stun:stun.l.google.com:19302",
        // },
        {
          urls: "stun:numb.viagenie.ca",
          username: "sultan1640@gmail.com",
          credential: "98376683",
        },
        {
          urls: "turn:numb.viagenie.ca",
          username: "sultan1640@gmail.com",
          credential: "98376683",
        },
      ],
    };

    // RTCPeerConnection giúp kết nối MediaStream và RTCDataChannel trở thành WebRTC.
    this.pc = new RTCPeerConnection(pc_config);

    // onicecandidate sẽ gữi qua máy của đối phương
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate));
        this.sendToPeer("candidate", e.candidate);
      }
    };

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    this.pc.onaddstream = (e) => {
      this.remoteVideoRef.current.srcObject = e.stream;
    };

    // this.pc.ontrack = (e) => {
    //   this.remoteVideoref.current.srcObject = e.streams[0];
    // };

    const constraints = { video: true };

    const success = async (stream) => {
      window.localStream = stream;
      this.localVideoRef.current.srcObject = stream;
      this.pc.addStream(stream);


      //Recording
      let recorder = new RecordRTCPromisesHandler(stream, {
        type: 'video'
      });
      recorder.startRecording();

      const sleep = m => new Promise(r => setTimeout(r, m));
      await sleep(3000);

      await recorder.stopRecording();
      let blob = await recorder.getBlob();
      console.log("BLOB ", blob)
      RecordRTC.invokeSaveAsDialog(blob);
    };

    const failure = (e) => {
      console.log("getUserMedia error", e);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }

  sendToPeer = (messageType, payload) => {
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload,
    });
  };

  createOffer = () => {
    console.log("offer");
    this.pc.createOffer({ offerToReceiveVideo: 1 }).then(
      (sdp) => {
        // console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
        this.sendToPeer("offerOrAnswer", sdp);
      },
      (e) => { }
    );
  };

  setRemoteDescription = () => {
    const desc = JSON.parse(this.textref.value);
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  createAnswer = () => {
    console.log("Answer");
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then(
      (sdp) => {
        // console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
        this.sendToPeer("offerOrAnswer", sdp);
      },
      (e) => { }
    );
  };

  addCandidate = () => {
    // const candidate = JSON.parse(this.textref.value);
    // console.log("Adding candidate", candidate);

    // this.pc.addIceCandidate(new RTCIceCandidate(candidate));

    this.candidate.forEach((candidate) => {
      console.log(JSON.stringify(candidate));
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  render() {
    return (
      <div>
        <video
          style={{ width: 240, height: 240, backgroundColor: "Black" }}
          ref={this.localVideoRef}
          autoPlay
        ></video>
        <video
          style={{ width: 240, height: 240, backgroundColor: "Black" }}
          ref={this.remoteVideoRef}
          autoPlay
        ></video>
        <br />
        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>answer</button>
        <br></br>
        <textarea
          ref={(ref) => {
            this.textref = ref;
          }}
        />
        {/* <br />
        <button onClick={this.setRemoteDescription}>Set remote Desc</button>
        <button onClick={this.addCandidate}>Add candidate</button> */}
      </div>
    );
  }
}

export default App;
