export const ioFunction = (socket) => {
    // console.log("newConnection")

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log("User Joined Room " + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageReceived) => {
        // console.log(newMessageReceived);
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            // console.log(newMessageReceived.content);
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userData._id);
    })
}