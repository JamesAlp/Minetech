// ingest.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/cc-ingest' }) // move to a CC-specific path
export class IngestGateway {
  @WebSocketServer() server!: Server;

  handleConnection(client: WebSocket, req: IncomingMessage) {
    const ip = req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    console.log('WS connected:', req.url, 'from', ip, 'UA:', ua);

    client.on('message', (buf) => {
      const text = buf.toString();
      try {
        const msg = JSON.parse(text);
        console.log('RX JSON:', msg);
        // TODO: broadcast/persist later
      } catch {
        console.warn('RX non-JSON, closing. First 80 chars:', text.slice(0, 80));
        client.close(1003, 'JSON required'); // Bad message type
      }
    });

    client.on('close', (code, reason) =>
      console.log('WS closed', code, reason.toString())
    );
    client.on('error', (e) => console.error('WS error:', e));
  }
}
