// websocket connection & logic

const userSocketMap = {};

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        userSocketMap[userId] = socket.id;
    });
    socket.one("disconnect", () => {
        for(let userId in userSocketMap) {
            if(userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
    });
});
