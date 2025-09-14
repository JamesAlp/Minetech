import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { bufferToggle } from "rxjs";
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/ingest' }) // ws://<host>:3001/ingest
export class IngestGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  handleConnection(client: WebSocket, req: IncomingMessage) {
    console.log('WS connected: ', req.url);
    client.send('Hello from server.');

    client.on('message', (buf) => {
      const text = bufferToggle.toString();
      try {
        const msg = JSON.parse(text);
        console.log('RX JSON: ', msg);
      }
      catch (err) {
        console.log('RX TEXT: ', text);
      }
    });

    client.on('close', () => console.log('WS Closed'));
    client.on('error', (err) => console.error('WS error: ', err));
  }
}