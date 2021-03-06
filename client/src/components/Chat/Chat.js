import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import UsersContainer from '../UsersContainer/UsersContainer';

import './Chat.css'


var connectionOptions =  { // TODO поменять на чтото более симпотичное, как минимум на let
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

let socket;

function Chat({location}) {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://react-chat-dz.herokuapp.com/';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, connectionOptions);

        setRoom(room);
        setName(name);

        socket.emit('join', {name, room}, (error) => {
            if (error) {
                alert(error);
            }
        });

    }, [ENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message])
        });

        socket.on('roomData', ({users}) => {
            setUsers(users);
        });
    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <UsersContainer users={users}/>
        </div>
    );
}

export default Chat;