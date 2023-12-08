import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

interface RoomMap {
    [roomName: string]: Set<string>;
}

interface IceCandidateMessage {
    candidate: RTCIceCandidateInit;
    roomName: string;
}

interface OfferMessage {
    offer: RTCSessionDescriptionInit;
    roomName: string;
}

interface AnswerMessage {
    answer: RTCSessionDescriptionInit;
    roomName: string;
}

const io = new Server();

const SocketHandler = (req: Request, res: Response) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('join', (roomName: string) => {
            const { rooms } = io.sockets.adapter;

            const room = rooms.get(roomName);

            if (!room) {
                socket.join(roomName);
                socket.emit('created');
            } else if (room.size === 1) {
                socket.join(roomName);
                socket.emit('joined');
            } else {
                socket.emit('full');
            }
            console.log(rooms);
        });

        socket.on('ready', (roomName: string) => {
            socket.broadcast.to(roomName).emit('ready');
        });

        socket.on('ice-candidate', (message: IceCandidateMessage) => {
            console.log(message.candidate);
            socket.broadcast.to(message.roomName).emit('ice-candidate', message.candidate);
        });

        socket.on('offer', (message: OfferMessage) => {
            socket.broadcast.to(message.roomName).emit('offer', message.offer);
        });

        socket.on('answer', (message: AnswerMessage) => {
            socket.broadcast.to(message.roomName).emit('answer', message.answer);
        });

        socket.on('leave', (roomName: string) => {
            socket.leave(roomName);
            socket.broadcast.to(roomName).emit('leave');
        });
    });

    return res.end();
};

export default SocketHandler;
