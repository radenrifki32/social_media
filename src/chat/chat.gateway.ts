import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';

interface ChatImplGateway {
  handleEvent( message : string , client : Socket) : Promise<any>
}
@WebSocketGateway({cors : {
  origin : ["http://localhost:3000"]
}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect ,ChatImplGateway ,OnModuleInit{
  @WebSocketServer()
server: Server;
constructor(private chatService : ChatService){}
handleConnection(client: Socket, ...args: any[]) {
}
onModuleInit() {
  this.server.on("connection",(socket :Socket)=>{
    console.log(socket.id)
    console.log("connected")
  })
}
handleDisconnect(client: Socket) {
}

@SubscribeMessage("chat")
async handleEvent(@MessageBody() message : any, @ConnectedSocket() client : Socket) :Promise<any>  {
  console.log("connect",message)
  const user = await this.chatService.getUserWebSocket(client)
  this.server.emit("chat",{
    message : message,
    user : user.username
  })
}
}
