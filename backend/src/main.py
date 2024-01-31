import time
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.datastructures import State
import uvicorn

app = FastAPI()


def generate_random_id():
    return str(uuid4().hex)


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket) -> str:
        await websocket.accept()
        client_id = generate_random_id()
        # await websocket.send_json({
        #     "client_id": client_id,
        #     "online": len(self.active_connections),
        # })
        self.active_connections[client_id] = websocket

        return client_id

    async def disconnect(self, client_id: str):
        self.active_connections.pop(client_id)

    async def send_personal_notification(self, message: str, websocket: WebSocket):
        await websocket.send_json({"notification_text": message})

    async def broadcast_notification(self, message: str, exclude: str):
        for user_id in self.active_connections.keys():
            if user_id != exclude:
                await self.active_connections[user_id].send_json(
                    {"notification_text": message}
                )

    async def broadcast_message(self, from_id: int, message_text: str):
        sended_at = int(time.time())

        for user_id in self.active_connections.keys():
            await self.active_connections[user_id].send_json(
                {
                    "from_id": from_id,
                    "message_text": message_text,
                    "sended_at": sended_at,
                }
            )


manager = ConnectionManager()


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    # accept user web socket
    user_id = await manager.connect(websocket)

    await manager.send_personal_notification(f"Welcome! Your id: {user_id}", websocket)
    await manager.broadcast_notification(f"User {user_id} join the chat", user_id)

    try:
        while True:
            message = await websocket.receive_json()

            await manager.broadcast_message(
                from_id=user_id,
                message_text=message["message_text"],
            )

    except WebSocketDisconnect:
        await manager.disconnect(user_id)

        await manager.broadcast_notification(f"User {user_id} left the chat", user_id)
