import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '@repo/db';
import Redis from 'ioredis';
import * as Y from 'yjs';

dotenv.config({ path: '../../.env' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

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

import { auth } from './auth';

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const roomId = url.pathname.slice(1); // Assuming /roomId
  
  if (!roomId) {
    ws.close();
    return;
  }

  // Authenticate user
  const session = await auth.api.getSession({
    headers: req.headers as unknown as HeadersInit,
  });

  if (!session) {
    console.log(`Unauthenticated connection attempt to room ${roomId}`);
    ws.close(1008, 'Unauthorized'); // 1008: Policy Violation
    return;
  }

  console.log(`User ${session.user.email} connected to room ${roomId}`);

  // Check if room exists in DB
  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
        // For development/demo, we might want to auto-create rooms or just fail
        // ws.close(); return; 
        console.log(`Room ${roomId} not found in DB, proceeding as ephemeral or auto-creating if needed.`);
    }
  } catch (e) {
    console.error("DB Error checking room:", e);
  }

  // Subscribe to room channel
  if (!docs.has(roomId)) {
    const doc = new Y.Doc();
    docs.set(roomId, doc);
    
    // Load snapshot from DB
    try {
        const dbDoc = await prisma.document.findFirst({
        where: { roomId },
        orderBy: { createdAt: 'desc' }
        });

        if (dbDoc && dbDoc.ySnapshot) {
        Y.applyUpdate(doc, dbDoc.ySnapshot);
        }
    } catch (e) {
        console.error("Error loading snapshot:", e);
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
    
    try {
        // Find the room first
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) return;

        // Find existing document or create new one
        // In this schema, a Room has many Documents. We probably want a "main" document for the whiteboard.
        // For simplicity, let's assume one main document per room or find the latest one.
        
        const existingDoc = await prisma.document.findFirst({
            where: { roomId },
            orderBy: { createdAt: 'desc' }
        });

        if (existingDoc) {
            await prisma.document.update({
                where: { id: existingDoc.id },
                data: { 
                    ySnapshot: Buffer.from(snapshot),
                    updatedAt: new Date()
                }
            });
        } else {
            // Create a new document if none exists
             await prisma.document.create({
                data: {
                    roomId,
                    title: "Whiteboard",
                    createdById: room.ownerId, // Use room owner as creator
                    ySnapshot: Buffer.from(snapshot)
                }
            });
        }
        console.log(`Snapshot saved for room ${roomId}`);
    } catch (err) {
        console.error("Error saving snapshot:", err);
    }
  }, 5000));
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
