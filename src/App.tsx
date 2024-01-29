import './App.css'
import { Button } from "@/components/ui/button";
import { ScrollArea  } from "@/components/ui/scroll-area.tsx";
import iconSend from "./assets/icon-send.png";
import { Textarea, TextareaProps } from './components/ui/textarea';
import Message from './Message';
import { useState } from 'react';
import Notification from './Notification';


const socket = new WebSocket("ws://127.0.0.1:8000/ws/");
// const user_id: str

socket.onopen = () => {
    console.log("WebSocket connection opened");
};

function App() {
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    socket.onmessage = (event) => {
        const new_message = JSON.parse(event.data);
        
        new_message.key = messages.length + 1;
        setMessages([...messages, new_message]);
    };

    function handleEnterKeyDown(e) {
        if (e.code === "Enter") {
            e.preventDefault();
            setMessageText("");
            sendMessage();
        }
    }
    
    function sendMessage(){
        if (messageText.trim().length === 0){
            return;
        }
        socket.send(JSON.stringify({ "message_text": messageText.trim() }));
     
        setMessageText("");
    }

    return (
        <>
            <div className='flex justify-center text-center h-full bg-slate-900 '>
                <div className='text-center flex flex-col p-5 h-full w-full max-w-screen-md'>
                    <ScrollArea className='p-5 mb-3 flex-grow border rounded-md'>
                        {/* <Message /> */}
                        {messages.map((message) => (
                            message.message_text ? <Message 
                            key={message.key}
                            message_text={message.message_text}
                            sender_id={message.from_id}
                            time={message.sended_at} 
                            /> 
                            :  <Notification
                                notification_text={ message.notification_text }
                                />
                            ))}
                    </ScrollArea>
                    <div className='flex flex-row max-h-36 justify-end space-x-3'>
                        <Textarea value={ messageText } className='max-h-36' placeholder='Write a message...' onKeyDown={handleEnterKeyDown} onChange={(e) => { setMessageText(e.target.value) }}/>
                        <Button  size='icon' onClick={ sendMessage }>
                            <img width="24" height="24" src={iconSend} alt="filled-sent" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
