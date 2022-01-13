export default (socket: any, users: any) => {
  socket.on("create_room", (data: any, UserRoom: any) => {
    socket.idUser = data.UserRoom;
    socket.room_id = data.RoomId;
    users.push({ Room: data.RoomId, Data: "Host", idUser: data.UserRoom });
    socket.join(data.RoomId);
  });
  socket.on("join_room", async (data: any) => {
    socket.join(data.room_id);
    socket.idUser = data.ownerId;
    socket.room_id = data.room_id;
    let index = users.findIndex((user: any) => user.idUser === socket.idUser);
    if (index == -1) {
      users.push({
        socketId: socket.id,
        username: data.username,
        RoomJoin: data.room_id,
        avatar: data.avatar,
        idUser: data.ownerId,
        peerId: data.peerId,
        camera: data.camera || true,
        audio: data.audio || true,
      });
    } else {
      users[index].socketId = socket.id;
      users[index].peerId = data.peerId;
    }
    // console.log(users);
    socket.to(data.room_id).emit("SomeOneJoin", users);

    socket.to(data.room_id).emit("newUserJoin", {
      RoomJoin: data.room_id,
      message: data.username + " Vừa Join vào room",
      userName: data.username,
      idUser: data.ownerId,
    });
  });
  socket.on("close_camera", (userClose: any) => {
    socket.to(userClose.currentRoom).emit("SomeOneCloseCamara", userClose);
  });
};
