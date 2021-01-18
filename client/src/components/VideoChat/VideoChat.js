import React, { useEffect, useRef } from 'react';
import './VideoChat.css'

function VideoChat(props) {
    const localVideoRef = useRef();

    useEffect(()=>{
        const constrains = {video: true};
        const success = (stream) => {
            localVideoRef.current.srcObject = stream
        }
        const failure = (e) => {
            console.log('getUserMedia error; ', e);
        }
    
        navigator.mediaDevices.getUserMedia(constrains)
            .then( success )
            .catch( failure )
    },[])
    
    return (
            <video className='localVideo' ref={localVideoRef} autoPlay></video>
    );
}

export default VideoChat;