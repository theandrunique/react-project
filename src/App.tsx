import './App.css'
import { ScrollArea  } from "@/components/ui/scroll-area.tsx";
import Message, { IMessage, IAttachment } from './components/Message';
import { useState } from 'react';
import Notification from './components/Notification';
import axios from 'axios';
import MessageInput from './components/MessageInput';


const socket = new WebSocket("ws://127.0.0.1:8000/ws/");

socket.onopen = () => {
    console.log("WebSocket connection opened");
};

function App() {
    const [messages, setMessages] = useState<IMessage[]>([]);

    socket.onmessage = (event) => {
        const new_message = JSON.parse(event.data);

        setMessages([...messages, new_message]);
        console.log(messages);
    };
    
    async function sendMessage(messageText: string, files: File[]){
        const sendedAttachments: IAttachment[] = [];
        if (files.length > 0) {
            const formData = new FormData();
            files.map((file) => {
                formData.append(`files`, file);
            })
            const response = await axios.post<IAttachment[]>("http://localhost:8000/file/uploadfile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            sendedAttachments.push(...response.data);
        }

        socket.send(JSON.stringify({
            "message_text": messageText.trim(),
            "attachments": sendedAttachments,
        }));
    }

    return (
        <>
            <div className='flex justify-center text-center h-full bg-slate-900 '>
                <div className='text-center flex flex-col p-5 h-full w-full max-w-screen-md'>
                    <ScrollArea className='p-5 mb-3 flex-grow border rounded-md'>
                        {/* <Message /> */}
                        {
                            messages.map((message, index) => (
                                message.is_notification ? 
                                <Notification notification_text={ message.message_text }/>
                                : 
                                <Message 
                                        key={index}
                                        message_text={message.message_text}
                                        from_id={message.from_id}
                                        time={message.time}
                                        attachments={message.attachments} 
                                        is_notification={false}                                
                                /> 
                            ))
                        }
                    </ScrollArea>
                    <MessageInput
                        sendMessage={ sendMessage }
                    />
                </div>
            </div>
        </>
    )
}

export default App
