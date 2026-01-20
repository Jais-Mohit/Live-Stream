import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from './provider/SocketProvider';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate()
    const socket = useSocket();

    const handelSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        socket.emit('room:join', { email, roomId });
    };

    const handelJoinRoom = useCallback((data) => {
        const { email, roomId } = data;
        console.log(email, roomId);
        navigate(`/room/${roomId}`)


    }, [])

    useEffect(() => {
        socket.on("room:join", handelJoinRoom);
        return () => {
            socket.off("room:join", handelJoinRoom)
        }
    }, [socket]);

    return (
        <div>
            <form onSubmit={handelSubmit} >
                <input type="email"
                    placeholder='Enter Your Email'
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br /> <br />
                <input type="text"
                    placeholder='Enter Your Room Id'
                    id='room-id'
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId}
                /> <br /> <br />
                <button>join</button>
            </form>

        </div>
    )
}

export default Lobby