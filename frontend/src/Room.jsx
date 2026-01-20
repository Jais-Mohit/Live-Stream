import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from './provider/SocketProvider'
import pree from './service/pree';

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemotId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStreem, setRemoteStreem] = useState(null);
    const myVideoRef = useRef(null);

    const handleUserJoined = ({ email, id }) => {
        console.log(`email ${email} joined room id ${id}`);
        setRemotId(id)
    };
    const handleIncommingCall = async ({ form, offer }) => {
        setRemotId(form)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setMyStream(stream)
        const ans = await pree.getAnswer(offer);
        socket.emit("coll:accepted", { to: form, ans })
    };
    const handleCollAccepted = async ({ form, ans }) => {
        pree.setLocalDescription(ans);
        for (const track of myStream.getTracks()) {
            pree.peer.addTrack(track, myStream)
        }

    };

    useEffect(() => {
        pree.peer.addEventListener("track", async (ev) => {
            const remoteStreem = ev.streams;
            setRemoteStreem(remoteStreem);
        })
    }, [])


    useEffect(() => {
        socket.on("user:joined", handleUserJoined)
        socket.on("incomming:call", handleIncommingCall)
        socket.on("coll:accepted", handleCollAccepted)
        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off("incomming:call", handleIncommingCall)
            socket.off("coll:accepted", handleCollAccepted)
        }
    }, [socket]);

    const handelCallUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        const offer = await pree.getOffer();
        socket.emit("user:coll", { to: remoteSocketId, offer })
        setMyStream(stream)
    }

    // 👉 yaha stream ko video tag me attach kar rahe
    useEffect(() => {
        if (myVideoRef.current && myStream) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    console.log("remoteStreem", remoteStreem);


    return (
        <div>
            <h1>Room</h1>
            <h2>{remoteSocketId ? "Connected" : "No One connected"}</h2>

            {remoteSocketId && <button onClick={handelCallUser}>Call</button>}

            {myStream && (
                <video
                    ref={myVideoRef}
                    autoPlay
                    muted
                    style={{ width: "300px", border: "1px solid black" }}
                />
            )}
        </div>
    )
}

export default Room;
















// import React, { useEffect, useRef, useState } from 'react'
// import { useSocket } from './provider/SocketProvider'
// import pree from './service/pree';

// const Room = () => {
//     const socket = useSocket();

//     const [remoteSocketId, setRemoteSocketId] = useState(null);
//     const [myStream, setMyStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);

//     const myVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     // ================= SOCKET EVENTS =================

//     const handleUserJoined = ({ email, id }) => {
//         console.log(`email ${email} joined room id ${id}`);
//         setRemoteSocketId(id);
//     };

//     const handleIncomingCall = async ({ from, offer }) => {
//         setRemoteSocketId(from);

//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true
//         });
//         setMyStream(stream);

//         // 👉 add tracks before answer
//         stream.getTracks().forEach(track => {
//             pree.peer.addTrack(track, stream);
//         });

//         const ans = await pree.getAnswer(offer);
//         socket.emit("call:accepted", { to: from, ans });
//     };

//     const handleCallAccepted = async ({ from, ans }) => {
//         await pree.setLocalDescription(ans);

//         myStream.getTracks().forEach(track => {
//             pree.peer.addTrack(track, myStream);
//         });
//     };

//     // ================= WEBRTC TRACK =================

//     useEffect(() => {
//         pree.peer.addEventListener("track", (ev) => {
//             const stream = ev.streams[0];
//             setRemoteStream(stream);
//         });
//     }, []);

//     // ================= SOCKET LISTENERS =================

//     useEffect(() => {
//         socket.on("user:joined", handleUserJoined);
//         socket.on("incoming:call", handleIncomingCall);
//         socket.on("call:accepted", handleCallAccepted);

//         return () => {
//             socket.off("user:joined", handleUserJoined);
//             socket.off("incoming:call", handleIncomingCall);
//             socket.off("call:accepted", handleCallAccepted);
//         };
//     }, [socket, myStream]);

//     // ================= CALL USER =================

//     const handleCallUser = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true
//         });
//         setMyStream(stream);

//         stream.getTracks().forEach(track => {
//             pree.peer.addTrack(track, stream);
//         });

//         const offer = await pree.getOffer();
//         socket.emit("user:call", { to: remoteSocketId, offer });
//     };

//     // ================= VIDEO ATTACH =================

//     useEffect(() => {
//         if (myVideoRef.current && myStream) {
//             myVideoRef.current.srcObject = myStream;
//         }
//     }, [myStream]);

//     useEffect(() => {
//         if (remoteVideoRef.current && remoteStream) {
//             remoteVideoRef.current.srcObject = remoteStream;
//         }
//     }, [remoteStream]);

//     // ================= UI =================

//     return (
//         <div>
//             <h1>Room</h1>
//             <h2>{remoteSocketId ? "Connected" : "No One connected"}</h2>

//             {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

//             <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//                 {myStream && (
//                     <video
//                         ref={myVideoRef}
//                         autoPlay
//                         muted
//                         style={{ width: "300px", border: "1px solid black" }}
//                     />
//                 )}

//                 {remoteStream && (
//                     <video
//                         ref={remoteVideoRef}
//                         autoPlay
//                         style={{ width: "300px", border: "1px solid red" }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Room;
