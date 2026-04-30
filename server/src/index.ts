import express, { type Express } from "express";
import {Server as SocketIOServer } from 'socket.io';
import { createServer, type Server as HttpServer } from "node:http";
import cors from 'cors';

class Server {
  private app: Express;
  private port: number;
  private httpServer: HttpServer;
  private io: SocketIOServer

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.httpServer = createServer(this.app);

    this.app.use(cors({
      origin: 'http://localhost:5173'
    }));
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
      }
    });
    this.setRoutes();
    this.setSocket();
  }

  private setRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello World!");
      console.log("Response sent");
    });

    this.app.get("/helloThere", (req, res) => {
      res.send({"ref": "General Kenobi"});
    });
  }

  private setSocket(): void {
    this.io.on("connection", (socket) => {
      console.log('User connected');

      socket.on('disconnect', () => {
          console.log('User disconnected');
      });
    });
  }

  listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Start server on port ${this.port}`);
    });
  }
}

const server = new Server(3000);
server.listen();
