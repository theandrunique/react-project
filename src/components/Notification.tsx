interface NotificationProps {
    notification_text: string;
}

export default function Notification ({ notification_text } : NotificationProps){
    return(
        <>
            <div className="text-center text-slate-500">
                {notification_text}
            </div>
        </>
    )

}