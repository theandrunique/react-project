import './App.css'
import { Button } from "@/components/ui/button";
import { ScrollArea  } from "@/components/ui/scroll-area.tsx";
import iconSend from "./assets/icon-send.png";
import { Textarea } from './components/ui/textarea';
import Message from './Message';



function App() {
  return (
    <>
      <div className='text-center h-full'>
        <div className='text-center flex flex-col p-5 h-full'>
          <ScrollArea className='p-5 mb-3 h-full max-w-screen-lg border rounded-md'>
            <Message/>
            <Message/>
            <Message/>
          </ScrollArea>
          <div className='flex flex-row max-h-36 justify-end space-x-3 max-w-screen-lg'>
            <Textarea className='max-h-36' placeholder='Write a message...' />
            <Button className='' size='icon'>
              <img width="24" height="24" src={iconSend} alt="filled-sent"/>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
