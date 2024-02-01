import React, { useState } from "react"
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import iconSend from "../assets/icon-send.png";


export interface MessageInputProps {
    sendMessage: (message_text: string, files: File[]) => void
}


export default function MessageInput({ sendMessage }: MessageInputProps) {
    const [drag, setDrag] = useState<boolean>(false);

    const [messageInputText, setMessageInputText] = useState<string>("");

    const [files, setFiles] = useState<File[]>([]);

    function checkInputBeforeSend() {
        if (messageInputText.trim().length === 0 && files.length === 0){
            return;
        }
        
        sendMessage(messageInputText, files);
        setMessageInputText("");
        setFiles([]);
    }

    function handleEnterKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.code === "Enter") {
            e.preventDefault();
            checkInputBeforeSend();
        }
    }

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setDrag(true);
    }

    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setDrag(false);
    }

    function onDropHandler(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setFiles([...files, ...e.dataTransfer.files]);
        setDrag(false);
    }

    function removeFile(indexToRemove: number){
        setFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove);
            return updatedFiles;
          });
    }

    return (
        <>
            {
                drag ? 
                <div className='justify-end, border-4 text-fuchsia-300 h-36 rounded-md' 
                    onDragStart={ (e) => { dragStartHandler(e) } }
                    onDragLeave={ (e) => { dragLeaveHandler(e) } }
                    onDragOver={ (e) => { dragStartHandler(e) } }
                    onDrop={ (e) => { onDropHandler(e) } }
                >
                    Drop here
                </div> : 

                <div className='flex flex-row max-h-36 justify-end space-x-3'
                    onDragStart={ (e) => { dragStartHandler(e) } }
                    onDragLeave={ (e) => { dragLeaveHandler(e) } }
                    onDragOver={ (e) => { dragStartHandler(e) } }
                >
                    <Textarea 
                        value={ messageInputText } 
                        className='max-h-36' 
                        placeholder='Write a message...' 
                        onKeyDown={ (e) =>  handleEnterKeyDown(e)} 
                        onChange={(e) => { setMessageInputText(e.target.value) }}
                    />

                    <Button  size='icon' onClick={ () => checkInputBeforeSend() }>
                        <img width="24" height="24" src={iconSend} alt="filled-sent" />
                    </Button>
                </div>
            }
            {
                files.length !== 0 && 
                <div className='flex flex-row space-x-3 text-slate-500 m-5'>
                    {
                        files.map((file, index) => (
                            <div key={index}>
                                {file.name}
                                <Button 
                                    className='text-slate-500 font-bold' 
                                    value="del" 
                                    onClick={ () => { removeFile(index) } }
                                >
                                    del
                                </Button>
                            </div>
                        ))
                    }
                </div>
            }
        </>
    )
}