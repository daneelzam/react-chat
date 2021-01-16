import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import './Chat.css'
import Input from '../Input/Input';


var connectionOptions =  { // TODO поменять на чтото более симпотичное, как минимум на let
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

let socket;

function Chat({location}) {
    const [name, setName] = useState();
    const [room, setRoom] = useState();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, connectionOptions);

        setRoom(room);
        setName(name);

        socket.emit('join', {name, room}, () => {});

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message])
        })
    }, [messages])

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(messages)
    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default Chat;