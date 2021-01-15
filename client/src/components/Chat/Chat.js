import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';


var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

let socket;

function Chat({location}) {
    const [name, setName] = useState();
    const [room, setRoom] = useState();
    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, connectionOptions);

        setRoom(room);
        setName(name);

        console.log(socket);
    })
    return (
        <h1>
           Chat 
        </h1>
    );
}

export default Chat;