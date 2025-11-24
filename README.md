# Excalidraw Clone

A collaborative whiteboard application built with Next.js, WebSocket, Yjs, Redis, and Prisma.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query
- **Real-time**: Yjs, y-websocket, Redis Pub/Sub
- **Backend**: Node.js WebSocket Server
- **Database**: PostgreSQL, Prisma
- **Infrastructure**: Docker Compose

## Getting Started

1.  **Environment Setup**
    Copy `.env.example` to `.env` (already done).

2.  **Start Infrastructure**

    ```bash
    docker-compose up -d
    ```

3.  **Install Dependencies**

    ```bash
    npm install
    ```

4.  **Database Setup**

    ```bash
    npm run db:migrate
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Architecture

- `apps/web`: Next.js frontend application.
- `apps/server`: WebSocket server for real-time collaboration.
- `packages/db`: Prisma client and database schema.
- `packages/config`: Shared configurations.

## Features

- Real-time collaborative drawing.
- Room management.
- Persistence via PostgreSQL.
- Scalable WebSocket architecture with Redis.
