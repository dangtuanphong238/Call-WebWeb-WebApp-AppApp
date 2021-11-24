// import React, { Component } from "react";
// import io from "socket.io-client";

// const audioType = 'audio/*';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.localVideoRef = React.createRef();
//     this.remoteVideoRef = React.createRef();

//     this.socket = null;
//     this.candidate = [];

//     this.state = {
//       your_id: "",
//       id_to_call: "",
//       answer_id: "",

//       recording: false,
//       audios: [],
//     };
//   }

//   componentWillMount() {
//     // this.socket = io("/webrtcPeer", {
//     //   path: "/webrtc",
//     //   query: {},
//     // });

//     // this.socket = io.connect(
//     //   "https://9248-2402-800-63ad-95aa-e499-1fe1-9cdd-b987.ngrok.io/webrtcPeer",
//     //   {
//     //     path: "/webrtc",
//     //     query: {},
//     //   }
//     // );

//     this.socket = io("http://192.168.1.6:8080/webrtcPeer", {
//       path: "/webrtc",
//       query: {},
//     });

//     this.socket.on("connection-success", (success) => {
//       console.log(success.success);
//       this.setState({ your_id: success.success });
//     });

//     this.socket.on("offerOrAnswer", (sdp, id) => {
//       if (this.remoteVideoRef.current.srcObject === null) {
//         console.log("offerOrAnswer", sdp, id);
//         this.textref.value = JSON.stringify(sdp);
//         console.log(id);
//         this.setState({ answer_id: id });
//         this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
//       }
//     });

//     this.socket.on("candidate", (candidate) => {
//       // this.candidate = [...this.candidate, candidate];
//       this.pc.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     // const pc_config = null;

//     const pc_config = {
//       iceServers: [
//         // {
//         //   urls: "stun:stun.l.google.com:19302",
//         // },
//         {
//           urls: "stun:numb.viagenie.ca",
//           username: "sultan1640@gmail.com",
//           credential: "98376683",
//         },
//         {
//           urls: "turn:numb.viagenie.ca",
//           username: "sultan1640@gmail.com",
//           credential: "98376683",
//         },
//       ],
//     };

//     // RTCPeerConnection giúp kết nối MediaStream và RTCDataChannel trở thành WebRTC.
//     this.pc = new RTCPeerConnection(pc_config);

//     // onicecandidate sẽ gữi qua máy của đối phương
//     // Chờ ICE Candidate được tạo trên máy tính của mình.
//     // ICE (Interactive Communication Establishment)
//     this.pc.onicecandidate = (e) => {
//       if (e.candidate) {
//         // console.log(JSON.stringify(e.candidate));
//         console.log("object");
//         this.sendToPeer(
//           "candidate",
//           e.candidate,
//           this.state.answer_id,
//           this.state.your_id
//         );
//       }
//     };

//     this.pc.oniceconnectionstatechange = (e) => {
//       console.log(e);
//     };

//     // url của đối phương
//     this.pc.onaddstream = (e) => {
//       if (e.stream) {
//         this.remoteVideoRef.current.srcObject = e.stream;
//       }
//     };

//     // this.pc.ontrack = (e) => {
//     //   this.remoteVideoref.current.srcObject = e.streams[0];
//     // };

//     const constraints = { video: true, audio: true };

//     const success = (stream) => {
//       window.localStream = stream;
//       this.localVideoRef.current.srcObject = stream;
//       this.pc.addStream(stream);

//       // init recording
//       this.mediaRecorder = new MediaRecorder(stream);
//       // init data storage for video chunks
//       this.chunks = [];
//       // listen for data from media recorder
//       this.mediaRecorder.ondataavailable = e => {
//         if (e.data && e.data.size > 0) {
//           this.chunks.push(e.data);
//         }
//       };
//     };

    
//     const failure = (e) => {
//       console.log("getUserMedia error", e);
//     };

//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then(success)
//       .catch(failure);
//   }

//   startRecording = (e) => {
//     e.preventDefault();
//     // wipe old data chunks
//     this.chunks = [];
//     // start recorder with 10ms buffer
//     this.mediaRecorder.start(10);
//     // say that we're recording
//     this.setState({recording: true});
//   }

//   stopRecording = (e) => {
//     e.preventDefault();
//     // stop the recorder
//     this.mediaRecorder.stop();
//     // say that we're not recording
//     this.setState({recording: false});
//     // save the video to memory
//     this.saveAudio();
//   }

//   saveAudio = () => {
//     // convert saved chunks to blob
//     const blob = new Blob(this.chunks, {type: audioType});
//     // generate video url from blob
//     const audioURL = window.URL.createObjectURL(blob);
//     // append videoURL to list of saved videos for rendering
//     const audios = this.state.audios.concat([audioURL]);
//     this.setState({audios});
//   }

//   deleteAudio = (audioURL) => {
//     // filter out current videoURL from the list of saved videos
//     const audios = this.state.audios.filter(a => a !== audioURL);
//     this.setState({audios});
//   }

//   sendToPeer = (messageType, payload, idtocal, yourid) => {
//     this.socket.emit(messageType, {
//       socketID: this.socket.id,
//       payload,
//       idtocal,
//       yourid,
//     });
//   };

//   createOffer = () => {
//     console.log("offer");
//     if (this.state.id_to_call) {
//       this.pc.createOffer({ offerToReceiveVideo: 1 }).then(
//         (sdp) => {
//           // console.log(JSON.stringify(sdp));
//           this.pc.setLocalDescription(sdp);
//           this.sendToPeer(
//             "offerOrAnswer",
//             sdp,
//             this.state.id_to_call,
//             this.state.your_id
//           );
//         },
//         (e) => { }
//       );
//     }
//   };

//   // setRemoteDescription = () => {
//   //   const desc = JSON.parse(this.textref.value);
//   //   this.pc.setRemoteDescription(new RTCSessionDescription(desc));
//   // };

//   // Người kia sẽ thiết lập mô tả từ xa (remote decription)
//   // của họ cho đối tượng Offer mà bạn đã gửi cho họ bằng cách
//   // gọi pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)).
//   // Người nhận sẽ tạo một đối tượng Answer bằng cách gọi đến pc.createAnswer()
//   createAnswer = () => {
//     console.log("Answer");
//     this.pc.createAnswer({ offerToReceiveVideo: 1 }).then(
//       (sdp) => {
//         this.pc.setLocalDescription(sdp);
//         this.sendToPeer(
//           "offerOrAnswer",
//           sdp,
//           this.state.answer_id,
//           this.state.your_id
//         );
//       },
//       (e) => { }
//     );
//   };

//   addCandidate = () => {
//     // const candidate = JSON.parse(this.textref.value);
//     // console.log("Adding candidate", candidate);

//     // this.pc.addIceCandidate(new RTCIceCandidate(candidate));

//     this.candidate.forEach((candidate) => {
//       console.log(JSON.stringify(candidate));
//       this.pc.addIceCandidate(new RTCIceCandidate(candidate));
//     });
//   };

//   render() {
//     const {recording, audios} = this.state;

//     return (
//       <div>
//         <div>
//           {!recording && <button onClick={e => this.startRecording(e)}>Record</button>}
//           {recording && <button onClick={e => this.stopRecording(e)}>Stop</button>}
//         </div>
//         <div>
//           <h3>Recorded audios:</h3>
//           {audios.map((audioURL, i) => (
//             <div key={`audio_${i}`}>
//               <video controls style={{width: 200}} src={audioURL}   />
//               <div>
//                 <button onClick={() => this.deleteAudio(audioURL)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <video
//           style={{ width: 240, height: 240, backgroundColor: "Black" }}
//           ref={this.localVideoRef}
//           autoPlay
//         ></video>
//         <video
//           style={{ width: 240, height: 240, backgroundColor: "Black" }}
//           ref={this.remoteVideoRef}
//           autoPlay
//         ></video>
//         <br />
//         <input
//           onChange={(e) => this.setState({ id_to_call: e.target.value })}
//         />
//         <button onClick={this.createOffer}>Offer</button>
//         <br />
//         <button onClick={this.createAnswer}>answer</button>
//         <br></br>
//         <textarea
//           ref={(ref) => {
//             this.textref = ref;
//           }}
//         />
//         {this.state.your_id}
//         {/* <br />
//         <button onClick={this.setRemoteDescription}>Set remote Desc</button>
//         <button onClick={this.addCandidate}>Add candidate</button> */}
//       </div>
//     );
//   }
// }

// export default App;


import React, { Component } from "react";
import io from "socket.io-client";

// import Recording from "./Recording";

const videoType = "video/webm";

class App extends Component {
  constructor(props) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();

    this.socket = null;
    this.candidate = [];

    this.state = {
      your_id: "",
      id_to_call: "",
      answer_id: "",
      recording: false,
      videos: [],
      videos_remote: [],
    };
  }

  componentWillMount() {
    // this.socket = io("/webrtcPeer", {
    //   path: "/webrtc",
    //   query: {},
    // });

    // this.socket = io.connect(
    //   "https://9248-2402-800-63ad-95aa-e499-1fe1-9cdd-b987.ngrok.io/webrtcPeer",
    //   {
    //     path: "/webrtc",
    //     query: {},
    //   }
    // );

    this.socket = io("http://localhost:8080/webrtcPeer", {
      path: "/webrtc",
      query: {},
    });

    this.socket.on("connection-success", (success) => {
      console.log(success.success);
      this.setState({ your_id: success.success });
    });

    this.socket.on("offerOrAnswer", (sdp, id) => {
      if (this.remoteVideoRef.current.srcObject === null) {
        console.log("offerOrAnswer", sdp, id);
        this.textref.value = JSON.stringify(sdp);
        console.log(id);
        this.setState({ answer_id: id });
        this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
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
    // Chờ ICE Candidate được tạo trên máy tính của mình.
    // ICE (Interactive Communication Establishment)
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate));
        console.log("object");
        this.sendToPeer(
          "candidate",
          e.candidate,
          this.state.answer_id,
          this.state.your_id
        );
      }
    };

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    // url của đối phương
    this.pc.onaddstream = (e) => {
      if (e.stream) {
        this.remoteVideoRef.current.srcObject = e.stream;
        // init recording
        this.mediaRecorderRemote = new MediaRecorder(e.stream, {
          mimeType: videoType,
        });
        // init data storage for video chunks
        this.chunksRemote = [];
        // listen for data from media recorder
        this.mediaRecorderRemote.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunksRemote.push(e.data);
          }
        };
      }
    };

    // this.pc.ontrack = (e) => {
    //   this.remoteVideoref.current.srcObject = e.streams[0];
    // };

    const constraints = { video: true, audio: true };

    const success = (stream) => {
      window.localStream = stream;
      this.localVideoRef.current.srcObject = stream;
      this.pc.addStream(stream);

      // init recording
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: videoType,
      });
      // init data storage for video chunks
      this.chunks = [];
      // listen for data from media recorder
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };
    };

    const failure = (e) => {
      console.log("getUserMedia error", e);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    this.chunksRemote = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    this.mediaRecorderRemote.start(10);
    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    this.mediaRecorderRemote.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveVideo();
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: videoType });
    const blobRemote = new Blob(this.chunksRemote, { type: videoType });
    // generate video url from blob
    const videoURL = window.URL.createObjectURL(blob);
    const videoURLRemote = window.URL.createObjectURL(blobRemote);
    // append videoURL to list of saved videos for rendering
    const videos = this.state.videos.concat([videoURL]);
    const videos_remote = this.state.videos.concat([videoURLRemote]);
    this.setState({ videos });
    this.setState({ videos_remote });
  }

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter((v) => v !== videoURL);
    this.setState({ videos });
  }

  sendToPeer = (messageType, payload, idtocal, yourid) => {
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload,
      idtocal,
      yourid,
    });
  };

  createOffer = () => {
    console.log("offer");
    if (this.state.id_to_call) {
      this.pc.createOffer({ offerToReceiveVideo: 1 }).then(
        (sdp) => {
          // console.log(JSON.stringify(sdp));
          this.pc.setLocalDescription(sdp);
          this.sendToPeer(
            "offerOrAnswer",
            sdp,
            this.state.id_to_call,
            this.state.your_id
          );
        },
        (e) => {}
      );
    }
  };

  // setRemoteDescription = () => {
  //   const desc = JSON.parse(this.textref.value);
  //   this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  // };

  // Người kia sẽ thiết lập mô tả từ xa (remote decription)
  // của họ cho đối tượng Offer mà bạn đã gửi cho họ bằng cách
  // gọi pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)).
  // Người nhận sẽ tạo một đối tượng Answer bằng cách gọi đến pc.createAnswer()
  createAnswer = () => {
    console.log("Answer");
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then(
      (sdp) => {
        this.pc.setLocalDescription(sdp);
        this.sendToPeer(
          "offerOrAnswer",
          sdp,
          this.state.answer_id,
          this.state.your_id
        );
      },
      (e) => {}
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
          muted
        ></video>
        <video
          style={{ width: 240, height: 240, backgroundColor: "Black" }}
          ref={this.remoteVideoRef}
          autoPlay
        ></video>
        <br />
        <input
          onChange={(e) => this.setState({ id_to_call: e.target.value })}
        />
        <button onClick={this.createOffer}>Offer</button>
        <br />
        <button onClick={this.createAnswer}>answer</button>
        <br></br>
        <textarea
          ref={(ref) => {
            this.textref = ref;
          }}
        />
        {this.state.your_id}
        {/* <br />
        <button onClick={this.setRemoteDescription}>Set remote Desc</button>
        <button onClick={this.addCandidate}>Add candidate</button> */}
        {!this.state.recording && (
          <button onClick={(e) => this.startRecording(e)}>Record</button>
        )}
        {this.state.recording && (
          <button onClick={(e) => this.stopRecording(e)}>Stop</button>
        )}
        <h3>Recorded videos:</h3>
        {this.state.videos.map((videoURL, i) => (
          <div key={`video_${i}`}>
            <video style={{ width: 200 }} src={videoURL} autoPlay loop />
            <div>
              <button onClick={() => this.deleteVideo(videoURL)}>Delete</button>
              <a href={videoURL}>Download</a>
            </div>
          </div>
        ))}
        {this.state.videos_remote.map((videoURL, i) => (
          <div key={`video_${i}`}>
            <video style={{ width: 200 }} src={videoURL} autoPlay loop />
            <div>
              <button onClick={() => this.deleteVideo(videoURL)}>Delete</button>
              <a href={videoURL}>Download</a>
            </div>
          </div>
        ))}
        {/* <Recording /> */}
      </div>
    );
  }
}

export default App;
