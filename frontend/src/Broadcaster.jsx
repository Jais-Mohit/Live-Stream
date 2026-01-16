import React from 'react'
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";



const Broadcaster = () => {
    const socket = io.connect("http://localhost:5000");

    const videoRef = useRef();
    const peers = useRef({}); // Saare viewers ka track rakhne ke liye

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            videoRef.current.srcObject = stream;
            socket.emit("broadcaster");

            // Jab koi naya viewer join kare
            socket.on("viewer", (viewerId) => {
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream, // Viewer ko apni stream bhejo
                });

                peer.on("signal", (data) => {
                    socket.emit("offer", viewerId, data);
                });

                socket.on("answer", (id, data) => {
                    if (id === viewerId) peer.signal(data);
                });

                peers.current[viewerId] = peer;
            });
        });
    }, []);
    return (
        <div><video ref={videoRef} autoPlay muted style={{ width: "500px" }} /></div>
    )
}

export default Broadcaster