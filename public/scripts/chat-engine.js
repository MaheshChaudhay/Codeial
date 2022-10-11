class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = chatBoxId;
    this.userEmail = userEmail;
    this.socket = io.connect("http://localhost:5000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    if (this.userEmail) {
      this.connectionHandler();
    }
  }
  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      console.log("connection established using sockets..");

      self.socket.emit("join-room", {
        userEmail: self.userEmail,
        chatRoom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("a user joined..", data);
      });
    });

    $("#send-btn").click(function (e) {
      const msg = $("#message-box").val().trim();

      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          userEmail: self.userEmail,
          chatRoom: "codeial",
        });
      }
    });

    self.socket.on("message_recieved", function (data) {
      console.log(data.message);
      const newMessage = $("<li>");

      let messageType = "other-message";
      if (data.userEmail == self.userEmail) {
        messageType = "self-message";
      }

      newMessage.append(
        $("<span>", {
          html: data.message,
        })
      );

      newMessage.append(
        $("<sub>", {
          html: data.userEmail,
        })
      );
      newMessage.addClass("message");
      newMessage.addClass(messageType);
      $("#message-list").append(newMessage);
    });
  }
}
