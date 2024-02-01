import json
import logging
import time
from uuid import uuid4
import redis.asyncio as redis

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from drive_api import router as drive_router


app = FastAPI()
app.include_router(drive_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


redis_client = redis.Redis(host="redis")


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
        await websocket.send_json({
            "messages": [{
                "message_text": message,
                "is_notification": True,
            }]
        })

    async def broadcast_notification(self, message: str, exclude: str):
        for user_id in self.active_connections.keys():
            if user_id != exclude:
                await self.active_connections[user_id].send_json({
                    "messages": [{
                        "message_text": message,
                        "is_notification": True,
                    }]
                })
                

    async def send_personal_messages(self, messages: list[dict], websocket: WebSocket):
        await websocket.send_json({"messages": messages})

    async def broadcast_message(
        self,
        from_id: int,
        message_text: str,
        attachments: list,
    ):
        sended_at = int(time.time())
        message = {
            "from_id": from_id,
            "message_text": message_text,
            "time": sended_at,
            "attachments": attachments,
            "is_notification": False,
        }
        for user_id in self.active_connections.keys():
            await self.send_personal_messages(
                messages=[message],
                websocket=self.active_connections[user_id],
            )

        await redis_client.rpush("cached_messages", json.dumps(message))


manager = ConnectionManager()


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    # accept user web socket
    user_id = await manager.connect(websocket)

    all_messages = await redis_client.lrange("cached_messages", 0, -1)
    cached_messages = [json.loads(message) for message in all_messages]

    await manager.send_personal_messages(
        messages=cached_messages,
        websocket=websocket,
    )

    await manager.send_personal_notification(f"Welcome! Your id: {user_id}", websocket)

    await manager.broadcast_notification(f"User {user_id} join the chat", user_id)

    try:
        while True:
            message: dict = await websocket.receive_json()

            await manager.broadcast_message(
                from_id=user_id,
                message_text=message["message_text"],
                attachments=message.get("attachments", []),
            )

    except WebSocketDisconnect:
        await manager.disconnect(user_id)

        await manager.broadcast_notification(f"User {user_id} left the chat", user_id)
