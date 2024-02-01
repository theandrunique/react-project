import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import photo from "../assets/walrus.jpg"


export interface IAttachment {
    url: string
    filename: string
    type: string
}


export interface IMessage {
    message_text: string
    from_id: string
    time: number
    attachments: IAttachment[]
    is_notification: boolean
}



function isImage(attachment: IAttachment) {
    return attachment.type.startsWith('image/');
}


export default function Message({ message_text, from_id, time, attachments } : IMessage ){

    return (
        <div className="bg-slate-800 text-slate-400 mb-3 p-3 border rounded-3xl h-auto  flex flex-row space-x-3">
            <Avatar className="h-12 w-12">
                <AvatarImage src={photo} alt={from_id} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className=" h-auto w-full flex flex-col">
                <div className="text- flex flex-row space-x-3">
                    <div className="font-bold">{ from_id }</div>
                    <div>{ new Date(Number(time * 1000)).toLocaleString() }</div>
                </div>
                <div className="h-full w-full whitespace-pre-wrap text-start break-all">
                    { message_text }
                </div>
                {
                    attachments.length !== 0 &&
                    <div className="space-x-3">
                        {attachments.map((attach, index) => (

                            <div key={index} className="flex font-sans">
                                {isImage(attach) ? (
                                    <img src={attach.url} alt={attach.filename} />
                                ) : (
                                    <a href={attach.url} className="italic" target="_blank" rel="noopener noreferrer">
                                        {attach.filename}
                                    </a>
                                )}
                            </div>

                        ))}
                    </div>
                }
            </div>
        </div>
    )
}