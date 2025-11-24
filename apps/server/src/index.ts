import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import * as Y from 'yjs';

dotenv.config({ path: '../../.env' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const subRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

// Map to store Y.Docs in memory
const docs = new Map<string, Y.Doc>();

// Subscribe to Redis updates
subRedis.on('message', (channel, message) => {
  if (channel.startsWith('yjs:room:')) {
    const roomId = channel.split(':')[2];
    const update = Buffer.from(message, 'base64');
    const doc = docs.get(roomId);
    if (doc) {
      Y.applyUpdate(doc, update);
    }
  }
});

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const roomId = url.pathname.slice(1); // Assuming /roomId
  
  if (!roomId) {
    ws.close();
    return;
  }

  // Basic Auth Check
  // In a real app, verify the token with BetterAuth's secret or session store
  // For now, we allow connections but log the attempt.
  // const token = url.searchParams.get('token');
  // if (!token) { 
  //   console.log("WS Connection missing token");
  //   // ws.close(); return; // Uncomment to enforce auth
  // }
  
  // Check if room exists in DB (optional, but good for validity)
  // const room = await prisma.room.findUnique({ where: { id: roomId } });
  // if (!room) { ws.close(); return; }

  // Subscribe to room channel
  if (!docs.has(roomId)) {
    const doc = new Y.Doc();
    docs.set(roomId, doc);
    
    // Load snapshot from DB
    const dbDoc = await prisma.document.findFirst({
      where: { roomId },
      orderBy: { createdAt: 'desc' }
    });

    if (dbDoc && dbDoc.ySnapshot) {
      Y.applyUpdate(doc, dbDoc.ySnapshot);
    }

    doc.on('update', (update) => {
      // Publish to Redis
      redis.publish(`yjs:room:${roomId}`, Buffer.from(update).toString('base64'));
      
      // Persist to DB (debounced)
      saveSnapshot(roomId, doc);
    });
    
    subRedis.subscribe(`yjs:room:${roomId}`);
  }

  setupWSConnection(ws, req, { docName: roomId });
});

let saveTimeouts = new Map<string, NodeJS.Timeout>();

function saveSnapshot(roomId: string, doc: Y.Doc) {
  if (saveTimeouts.has(roomId)) {
    clearTimeout(saveTimeouts.get(roomId));
  }

  saveTimeouts.set(roomId, setTimeout(async () => {
    const snapshot = Y.encodeStateAsUpdate(doc);
    // Find or create document
    // For simplicity, we assume the room exists.
    // We need to find the document associated with the room or create one.
    // This logic needs to be robust.
    
    // For now, let's just log
    console.log(`Saving snapshot for room ${roomId}`);
    
    // TODO: Actual DB save
    /*
    await prisma.document.upsert({
        where: { id: ... }, // We need a way to identify the document uniquely or just use roomId to find it
        update: { ySnapshot: Buffer.from(snapshot) },
        create: { ... }
    })
    */
  }, 5000));
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
