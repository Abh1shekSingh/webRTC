const { Server } = require('socket.io');

const io = new Server(8000, {
    cors:true
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on('connection', socket => {
    console.log(`Socket Connected`,socket.id);
    socket.on('join-room', (data) => {
        const {email, roomCode} = data;
        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmailMap.set(socket.id, email);
        io.to(roomCode).emit('user-joined', { email, id: socket.id});
        socket.join(roomCode);
        io.to(socket.id).emit('join-room', data);
    });

    socket.on('call-user', ({to, offer}) => {
        io.to(to).emit('incoming-call', {from: socket.id, offer});
    });

    socket.on('accepted-call', ({to, ans}) => {
        io.to(to).emit('accepted-call', {from: socket.id, ans});
    });

    socket.on('peer-negotiated-needed', ({to, offer}) => {
        io.to(to).emit('peer-negotiated-needed', {from: socket.id, offer});
    });

    socket.on('peer-nego-done', ({to, ans}) => {
        io.to(to).emit('peer-nego-final', {from: socket.id, ans});
    });
});