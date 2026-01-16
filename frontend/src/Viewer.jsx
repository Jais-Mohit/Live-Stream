import React from 'react'
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io.connect("http://localhost:5000");


const Viewer = () => {
    const videoRef = useRef();
    const peerRef = useRef();

    useEffect(() => {
        socket.emit("viewer");

        socket.on("offer", (broadcasterId, data) => {
            const peer = new Peer({
                initiator: false,
                trickle: false,
            });

            peer.on("signal", (signalData) => {
                socket.emit("answer", broadcasterId, signalData);
            });

            peer.on("stream", (stream) => {
                // Broadcaster ki stream receive hui
                videoRef.current.srcObject = stream;
            });

            peer.signal(data);
            peerRef.current = peer;
        });
    }, []);


    return (
        <div><video ref={videoRef} autoPlay style={{ width: "500px" }} /></div>
    )
}

export default Viewer