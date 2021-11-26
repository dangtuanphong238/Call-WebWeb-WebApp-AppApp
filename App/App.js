
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, StyleSheet, Alert, TextInput, Button, Text, TouchableOpacity, Image } from 'react-native';
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from 'react-native-webrtc';

// export default function App() {
//   const [stream, setStream] = useState(null);
//   const start = async () => {
//     console.log('start');
//     if (!stream) {
//       let s;
//       try {
//         s = await mediaDevices.getUserMedia({ video: true });
//         setStream(s);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };
//   const stop = () => {
//     console.log('stop');
//     if (stream) {
//       setStream(null);
//     }
//   };

//   useEffect(() => {
//     // start()
//   });

//   return (
//     <View style={styles.container}>
//       {/* TOP */}
//       <View style={{ flexDirection: 'row', alignSelf:'flex-end', marginHorizontal:14 }}>
//         <TouchableOpacity style={{marginHorizontal:14}}>
//           <Image
//             source={require('./src/images/microphone.png')}
//             style={styles.logo}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={{marginHorizontal:14}} onPress={() => !stream ? start() : stop()}>
//           <Image source={require('./src/images/video-camera.png')}
//             style={styles.logo}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.viewTop}>
//         <View style={[styles.videos, styles.localVideos]}>
//           <Text>Your Video</Text>
//           {stream &&
//             <RTCView
//               //  streamURL={localStream.toURL()} 
//               streamURL={stream.toURL()}
//               style={styles.localVideo} />}
//         </View>
//         <View style={[styles.videos, styles.remoteVideos]}>
//           <Text>Friends Video</Text>
//           <RTCView
//             // streamURL={remoteStream.toURL()}
//             style={styles.remoteVideo}
//           />
//         </View>
//       </View>

//       {/* BOTTOM */}
//       <View style={styles.viewBottom}>
//         <View style={styles.viewBottomLeft}>
//           <Text>Thông tin người dùng</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={"Name"}
//           // onChangeText={onChangeText}
//           // value={text}
//           />
//           <TouchableOpacity
//             style={styles.button}
//           // onPress={onPress}
//           >
//             <Text>Copy mã ID</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.viewBottomLeft}>
//           <Text>Tạo cuộc gọi</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={"ID to call"}
//           // onChangeText={onChangeText}
//           // value={text}
//           />
//           <TouchableOpacity
//             style={styles.button}
//           // onPress={onPress}
//           >
//             <Text>Gọi</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginVertical:5
//   },
//   viewTop: {
//     flex: 1,
//     marginHorizontal: 12
//   },
//   viewBottom: {
//     height: "auto",
//     backgroundColor: '#fff',
//     margin: 12,
//     padding: 12,
//     flexDirection: 'row',
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     padding: 10,
//     marginVertical: 12,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: "#3F51B5",
//     padding: 10,
//   },
//   viewBottomLeft:
//   {
//     flex: 1,
//     flexDirection: 'column',
//     marginHorizontal: 5
//   },
//   videos: {
//     width: '100%',
//     flex: 1,
//     position: 'relative',
//     overflow: 'hidden',

//     borderRadius: 6,
//   },
//   localVideos: {
//     height: 100,
//     marginBottom: 10,
//   },
//   remoteVideos: {
//     height: 400,
//   },
//   localVideo: {
//     backgroundColor: '#f2f2f2',
//     height: '100%',
//     width: '100%',
//   },
//   remoteVideo: {
//     backgroundColor: '#f2f2f2',
//     height: '100%',
//     width: '100%',
//   },
//   logo: {
//     width: 32,
//     height: 32,
//   },
// });




// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { View, StyleSheet, Alert, TextInput, Button, Text, TouchableOpacity, Image } from 'react-native';
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from 'react-native-webrtc';
// window.navigator.userAgent = 'react-native'
// import io from 'socket.io-client/dist/socket.io.js'
// export const socket = io('http://192.168.1.3:5000', {
//   transports: ['websocket'],
//   jsonp: false,
// });
// // const socket = io("http://192.168.1.3:5000/"); 
// import Peer from 'react-native-peerjs'

// export default function App() {
//   const [me, setMe] = useState("");
//   const [stream, setStream] = useState();
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [idToCall, setIdToCall] = useState("");
//   const [callEnded, setCallEnded] = useState(false);
//   const [calling, setCalling] = useState(false);
//   const [name, setName] = useState("");
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();
//   const peerRef = useRef();

//   useEffect(() => {
//     socket.connect()

//     console.log("Socket", socket.connected)
//     socket.on('connect', () => console.log('connected'))

//     mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         myVideo.current.srcObject = stream;
//         window.localStream = stream;
//       });
//     socket.on("me", (id) => {
//       setMe(id);
//     });

//     socket.on("callUser", (data) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });

//     socket.on("callEnded", (id) => {
//       setMe(id);
//       setReceivingCall(false);
//       setCaller("");
//       setCallAccepted(false);
//       // peerRef.current.destroy();
//       window.location.reload();
//     });
//   }, []);

//   const callUser = (id) => {
//     if (name && idToCall) {
//       console.log("CALL")

//       setCalling(true);
//       // const peer = new Peer({
//       //   initiator: true,
//       //   trickle: false,
//       //   config: {
//       //     iceServers: [
//       //       {
//       //         urls: "stun:numb.viagenie.ca",
//       //         username: "sultan1640@gmail.com",
//       //         credential: "98376683",
//       //       },
//       //       {
//       //         urls: "turn:numb.viagenie.ca",
//       //         username: "sultan1640@gmail.com",
//       //         credential: "98376683",
//       //       },
//       //     ],
//       //   },
//       //   stream: stream,
//       // });

//       const peer = new Peer(undefined, {
//         host: '192.168.1.3',
//         path: '/',
//         secure: true,
//         port: 5000,
//         config: {
//           iceServers: [
//             {
//               urls: "stun:numb.viagenie.ca",
//               username: "sultan1640@gmail.com",
//               credential: "98376683",
//             },
//             {
//               urls: "turn:numb.viagenie.ca",
//               username: "sultan1640@gmail.com",
//               credential: "98376683",
//             },
//           ],
//         },
//       });

//       peer.on("signal", (data) => {
//         alert("Halo")
//         socket.emit("callUser", {
//           userToCall: id,
//           signalData: data,
//           from: me,
//           name: name,
//         });
//       });
//       peer.on("stream", (stream) => {
//         userVideo.current.srcObject = stream;
//       });
//       socket.on("callAccepted", (signal) => {
//         setCallAccepted(true);
//         setCalling(false);
//         peer.signal(signal);
//       });

//       connectionRef.current = peer;
//     } else {
//       alert("Vui lòng nhập tên và ID");
//     }
//   };

//   const start = async () => {
//     console.log('start');
//     if (!stream) {
//       let s;
//       try {
//         s = await mediaDevices.getUserMedia({ video: true });
//         setStream(s);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };
//   const stop = () => {
//     console.log('stop');
//     if (stream) {
//       setStream(null);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* TOP */}
//       <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginHorizontal: 14 }}>
//         <TouchableOpacity style={{ marginHorizontal: 14 }}>
//           <Image
//             source={require('./src/images/microphone.png')}
//             style={styles.logo}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={{ marginHorizontal: 14 }} onPress={() => !stream ? start() : stop()}>
//           <Image source={require('./src/images/video-camera.png')}
//             style={styles.logo}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.viewTop}>
//         <View style={[styles.videos, styles.localVideos]}>
//           <Text>Your Video</Text>
//           {stream &&
//             <RTCView
//               //  streamURL={localStream.toURL()} 
//               streamURL={stream.toURL()}
//               style={styles.localVideo} />}
//         </View>
//         <View style={[styles.videos, styles.remoteVideos]}>
//           <Text>Friends Video</Text>
//           <RTCView
//             // streamURL={remoteStream.toURL()}
//             style={styles.remoteVideo}
//           />
//         </View>
//       </View>

//       {/* BOTTOM */}
//       <View style={styles.viewBottom}>
//         <View style={styles.viewBottomLeft}>
//           <Text>Thông tin người dùng</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={"Name"}
//             onChangeText={(e) => setName(e)}
//             value={name}
//           />
//           <TouchableOpacity
//             style={styles.button}
//           // onPress={onPress}
//           >
//             <Text>Copy mã ID</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.viewBottomLeft}>
//           <Text>Tạo cuộc gọi</Text>
//           <TextInput
//             style={styles.input}
//             placeholder={"ID to call"}
//             onChangeText={(e) => setIdToCall(e)}

//             // onChangeText={onChangeText}
//             value={idToCall}
//           />
//           <TouchableOpacity
//             style={styles.button}
//             // onPress={onPress}
//             onPress={() => callUser(idToCall)}

//           >
//             <Text>Gọi</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginVertical: 5
//   },
//   viewTop: {
//     flex: 1,
//     marginHorizontal: 12
//   },
//   viewBottom: {
//     height: "auto",
//     backgroundColor: '#fff',
//     margin: 12,
//     padding: 12,
//     flexDirection: 'row',
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     padding: 10,
//     marginVertical: 12,
//   },
//   button: {
//     alignItems: "center",
//     backgroundColor: "#3F51B5",
//     padding: 10,
//   },
//   viewBottomLeft:
//   {
//     flex: 1,
//     flexDirection: 'column',
//     marginHorizontal: 5
//   },
//   videos: {
//     width: '100%',
//     flex: 1,
//     position: 'relative',
//     overflow: 'hidden',

//     borderRadius: 6,
//   },
//   localVideos: {
//     height: 100,
//     marginBottom: 10,
//   },
//   remoteVideos: {
//     height: 400,
//   },
//   localVideo: {
//     backgroundColor: '#f2f2f2',
//     height: '100%',
//     width: '100%',
//   },
//   remoteVideo: {
//     backgroundColor: '#f2f2f2',
//     height: '100%',
//     width: '100%',
//   },
//   logo: {
//     width: 32,
//     height: 32,
//   },
// });



/* eslint-disable prettier/prettier */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

import io from 'socket.io-client/dist/socket.io.js';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from "@react-native-community/cameraroll";

const dimensions = Dimensions.get('window');
const baseUrl = Platform.OS === 'android' ? 'http://192.168.1.6:8080' : 'http://localhost:8080';
// const baseUrl = Platform.OS === 'android' ? 'https://44fd-2001-ee0-450f-fe60-a0a8-186d-6838-da62.ngrok.io' : 'http://localhost';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //STREAM:
      localStream: null,
      remoteStream: null,

      //ID:
      my_id: "",
      id_to_call: "",
      answer_id: "",

      //Record:
      urlVideoRecord: null,
    };

    //SOCKET:
    this.sdp;
    this.socket = null;
    this.candidates = [];
  }

  componentDidMount = () => {
    this.socketConnect()
  };

  socketConnect = () => {
    /* SOCKET CONNECTION */
    this.socket = io(
      `${baseUrl}/webrtcPeer`,
      {
        path: '/webrtc',
        query: {},
      },
    );

    this.socket.on('connection-success', success => {
      // console.log("#connection-success ", success.success)
      this.setState({ my_id: success.success });
    });

    this.socket.on('offerOrAnswer', (sdp, id) => {
      // console.log("#offerOrAnswer ", `[sdp: ${sdp}, id: ${id}]`);
      this.sdp = JSON.stringify(sdp);
      this.setState({ answer_id: id });
      // set sdp as remote description
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    this.socket.on('candidate', candidate => {
      // console.log("#candidate ", candidate);
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    /*PEER CONNECTION */
    const pc_config = {
      iceServers: [
        // {
        //   urls: 'stun:stun.l.google.com:19302',
        // },
        {
          urls: 'stun:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683',
        },
      ],
    };

    this.pc = new RTCPeerConnection(pc_config);

    this.pc.onicecandidate = e => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      if (e.candidate) {
        this.sendToPeer(
          'candidate',
          e.candidate,
          this.state.answer_id,
          this.state.my_id
        );
      }
    };

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = e => {
      console.log(e);
    };

    this.pc.onaddstream = e => {
      this.setState({
        remoteStream: e.stream,
      });
    };

    const success = stream => {
      // console.log("#getUserMedia Success: ", stream);
      this.setState({
        localStream: stream,
      });
      this.pc.addStream(stream);
    };

    const failure = error => {
      console.log('#getUserMedia Error: ', error);
    };

    /* MEDIA */
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      // console.log("#SourceInfos: ", sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? 'user' : 'environment',
          optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
        },
      };

      mediaDevices.getUserMedia(constraints).then(success).catch(failure);
    });
  }

  sendToPeer = (messageType, payload, idtocal, yourid) => {
    // console.log("#Send To Peer")
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload,
      idtocal,
      yourid,
    });
  };

  createOffer = () => {
    console.log('#Create Offer', this.state.id_to_call);
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    if (this.state.id_to_call) {
      this.pc.createOffer({ offerToReceiveVideo: 1 }).then(sdp => {
        // console.log(JSON.stringify(sdp))

        // set offer sdp as local description
        this.pc.setLocalDescription(sdp);

        this.sendToPeer(
          'offerOrAnswer',
          sdp,
          this.state.id_to_call,
          this.state.my_id
        );
      },
        (e) => { }
      );
    }
  };

  createAnswer = () => {
    console.log('Answer');
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then(sdp => {
      // console.log(JSON.stringify(sdp))

      // set answer sdp as local description
      this.pc.setLocalDescription(sdp);

      this.sendToPeer(
        'offerOrAnswer',
        sdp,
        this.state.answer_id,
        this.state.my_id
      );
    });
  };

  recordVideo = async () => {
    console.log("#Record Video");
    RecordScreen.startRecording().catch((error) => console.error(error));
  }

  stopRecord = async () => {
    console.log("#Stop Record Video");
    const res = await RecordScreen.stopRecording().catch((error) =>
      console.warn(error)
    );
    if (res) {
      const url = res.result.outputURL;
      this.saveRecordScreen(url)
    }
  }
  
  saveRecordScreen = async (videoUrl) => {
    console.log("#Save Record Video");
    try {
      await CameraRoll.save(videoUrl, { type: 'video' })
      console.log("Saved video")
    } catch (error) {
      console.log("Error when save video: ", error)
    }
  }

  setRemoteDescription = () => {
    // retrieve and parse the SDP copied from the remote peer
    const desc = JSON.parse(this.sdp);

    // set sdp as remote description
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addCandidate = () => {
    // retrieve and parse the Candidate copied from the remote peer
    // add the candidate to the peer connection
    // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

    this.candidates.forEach(candidate => {
      console.log(JSON.stringify(candidate));
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  renderButton = (onPress, text) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <Text style={{ ...styles.textContent }}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderRTCView = (stream, text, switchCamera) => {
    const { localStream } = this.state
    return (
      <View>
        {switchCamera ?
          <TouchableOpacity
            onPress={() => localStream._tracks[1]._switchCamera()}
            style={{ flex: 1, backgroundColor: 'white', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{text}</Text>
            <RTCView
              key={2}
              mirror={true}
              style={{ ...styles.rtcViewRemote }}
              objectFit="contain"
              streamURL={stream && stream.toURL()}
            />
          </TouchableOpacity> :
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{text}</Text>
            <RTCView
              key={2}
              mirror={true}
              style={{ ...styles.rtcViewRemote }}
              objectFit="contain"
              streamURL={stream && stream.toURL()}
            />
          </View>}
      </View>
    )
  }

  render() {
    const { localStream, remoteStream } = this.state;
    const localVideo = localStream && (this.renderRTCView(localStream, 'Local Stream', true))
    const remoteVideo = remoteStream && (this.renderRTCView(remoteStream, 'Remote Stream', false))

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ margin: 10 }}>
          <Text>My ID: {this.state.my_id}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e) => this.setState({ id_to_call: e })}
            placeholder={"Input Remote ID"}
          />
        </View>

        <View style={{ ...styles.buttonsContainer }}>
          {this.renderButton(this.createOffer, 'Call')}
          {this.renderButton(this.createAnswer, 'Answer')}
          {this.renderButton(this.recordVideo, 'Record')}
          {this.renderButton(this.stopRecord, 'Stop')}
        </View>

        <View style={{ ...styles.videosContainer, backgroundColor: 'white' }}>
          <ScrollView style={{ ...styles.scrollView }}>
            {remoteVideo}
            {localVideo}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 5
  },
  button: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  textContent: {
    fontFamily: 'Avenir',
    fontSize: 20,
    textAlign: 'center',
  },
  videosContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rtcView: {
    width: 100, //dimensions.width,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'teal',
    padding: 15,
  },
  rtcViewRemote: {
    width: dimensions.width,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginTop: 10
  },
});

export default App;
