import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import photo from "./assets/walrus.jpg"

export default function Message({ message_text, sender_id, time }){

    return (
        <div className="bg-slate-800 text-slate-400 mb-3 p-3 border rounded-3xl h-auto w-auto flex flex-row space-x-3">
            <Avatar className="h-12 w-12">
                <AvatarImage src={photo} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className=" h-auto w-full flex flex-col">
                <div className="text-white flex flex-row space-x-3">
                    <div className="font-bold">{ sender_id }</div>
                    <div>{ new Date(Number(time * 1000)).toLocaleString() }</div>
                </div>
                <div className="h-full w-full whitespace-pre-wrap text-start">
                    { message_text }
                </div>
            </div>
        </div>
    )
}