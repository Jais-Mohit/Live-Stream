// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoLive from './GoLive';
import Watch from './Watch';

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoLive />} />
        <Route path="/watch" element={<Watch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App




// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";

// const socket = io.connect("http://localhost:5000");

// function App() {
//     const [me, setMe] = useState("");
//     const [stream, setStream] = useState();
//     const [receivingCall, setReceivingCall] = useState(false);
//     const [caller, setCaller] = useState("");
//     const [callerSignal, setCallerSignal] = useState();
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [idToCall, setIdToCall] = useState("");
//     const [name, setName] = useState("");

//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//     useEffect(() => {
//         // 1. Apna Camera/Mic Access karein
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((stream) => {
//                 setStream(stream);
//                 if (myVideo.current) {
//                     myVideo.current.srcObject = stream;
//                 }
//             });

//         // 2. Socket ID save karein
//         socket.on("me", (id) => setMe(id));

//         // 3. Incoming Call handle karein
//         socket.on("callUser", (data) => {
//             setReceivingCall(true);
//             setCaller(data.from);
//             setCallerSignal(data.signal);
//         });
//     }, []);

//     // --- Call Karne ka Logic ---
//     const callUser = (id) => {
//         const peer = new Peer({
//             initiator: true, // Hum call start kar rahe hain
//             trickle: false,
//             stream: stream
//         });

//         peer.on("signal", (data) => {
//             socket.emit("callUser", {
//                 userToCall: id,
//                 signalData: data,
//                 from: me,
//                 name: name
//             });
//         });

//         peer.on("stream", (stream) => {
//             if (userVideo.current) {
//                 userVideo.current.srcObject = stream;
//             }
//         });

//         socket.on("callAccepted", (signal) => {
//             setCallAccepted(true);
//             peer.signal(signal);
//         });

//         connectionRef.current = peer;
//     };

//     // --- Call Accept Karne ka Logic ---
//     const answerCall = () => {
//         setCallAccepted(true);
//         const peer = new Peer({
//             initiator: false, // Hum call receive kar rahe hain
//             trickle: false,
//             stream: stream
//         });

//         peer.on("signal", (data) => {
//             socket.emit("answerCall", { signal: data, to: caller });
//         });

//         peer.on("stream", (stream) => {
//             userVideo.current.srcObject = stream;
//         });

//         peer.signal(callerSignal);
//         connectionRef.current = peer;
//     };

//     return (
//         <div style={{ textAlign: "center" }}>
//             <h1>WebRTC Video Call</h1>

//             {/* Video Players */}
//             <div className="video-container">
//                 {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
//                 {callAccepted && <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />}
//             </div>

//             {/* My ID Display */}
//             <p>My ID: {me}</p>

//             {/* Call Controls */}
//             <div>
//                 <input
//                     type="text"
//                     placeholder="ID to call"
//                     value={idToCall}
//                     onChange={(e) => setIdToCall(e.target.value)}
//                 />
//                 <button onClick={() => callUser(idToCall)}>Call</button>
//             </div>

//             {/* Incoming Call Notification */}
//             {receivingCall && !callAccepted ? (
//                 <div>
//                     <h1>Someone is calling...</h1>
//                     <button onClick={answerCall}>Answer</button>
//                 </div>
//             ) : null}
//         </div>
//     );
// }

// export default App;


