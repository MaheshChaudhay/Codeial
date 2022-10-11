module.exports.chatSocket = function (socketServer) {
  const io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    console.log("connection request recieved..", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected!");
    });

    socket.on("join-room", function (data) {
      console.log("joining chat room request recieved with data : ", data);
      socket.join(data.chatRoom);
      io.in(data.chatRoom).emit("user_joined", data);
    });

    socket.on("send_message", function (data) {
      console.log("send-message recieved", data.message);
      io.in(data.chatRoom).emit("message_recieved", data);
    });
  });
};
