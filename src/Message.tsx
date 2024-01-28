import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Message(){


    return (
        <div className="mb-3 p-3 border rounded-3xl h-auto w-auto flex flex-row space-x-3">
            <Avatar className="h-14 w-13">
                <AvatarImage src="https://w.forfun.com/fetch/86/86c9c16ba421f37acc0ca711b96715ee.jpeg" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className=" h-auto w-full flex flex-col">
                <div className="flex flex-row space-x-3">
                    <div className="font-bold">name</div>
                    <div>date</div>
                </div>
                <div className="text-wrap h-full w-full text-start">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Est cum laboriosam cupiditate, molestiae, amet maxime, vitae officiis earum dolores laborum quisquam corrupti tempore porro nemo sed molestias? Qui, minima eaque.
                </div>
            </div>
        </div>
    )


}