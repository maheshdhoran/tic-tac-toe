const Room = require('../models/roomModel');

module.exports = (io, socket) => {
    //Joining room event handler
    socket.on('join', async(roomID) => {
        try {
            socket.join(roomID)
            const room= await Room.findOne({ roomID });
            if(room && room.userCount===2){
                io.to(roomID).emit('gameStarted');
            }
        } catch (error) {
            console.log(error.message)
        }
    })
    
    //Game action event handler
    socket.on('action', async(squareAction) => {
        try {
            io.to(squareAction.roomID).emit('action' , squareAction );
        } catch (error) {
            console.log(error.message)
        }
    })

    //Re-match event handler
    socket.on('restartGame', async(roomID)=>{
        try {
            io.to(roomID).emit('restartGame');
        } catch (error) {
            console.log(error.message)   
        }
    })
}