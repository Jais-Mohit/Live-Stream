import { useEffect } from "react";
import { Room } from "livekit-client";
import { useSocket } from "../provider/SocketProvider";
export default function Host() {
    const socket = useSocket();

    useEffect(() => {
        let room;

        async function startLive() {
            const roomId = "room1"; // dynamic bana sakte ho
            const name = "host_" + Math.floor(Math.random() * 1000);

            const res = await fetch(`http://192.168.0.156:5000/token?room=${roomId}&name=${name}&isHost=true`);
            const data = await res.json();

            room = new Room();
            await room.connect("wss://test-ljgovfi9.livekit.cloud", data.token);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            stream.getTracks().forEach((t) => room.localParticipant.publishTrack(t));

            socket.emit("host-live", { roomId, hostName: name });
        }

        startLive();

        return () => {
            socket.emit("end-live");
            if (room) room.disconnect();
        };
    }, []);

    return <h2>🔴 You are Live</h2>;
}
