const Room = require('../models/roomModel');
const AppError = require('../utils/appError');

//Generate random ID on the basis of given length
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//This route is used to create room record
exports.create= async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const roomID= generateRandomString(6)
        await Room.create({ roomID , userCount: 1, userIds: [userId] });
        const data= {
            roomID
        }
        res.status(201).json({
            status: 'success',
            data: data,
        });
    } catch (error) {
        //we can also re-create the room code if already exists
        if(error.code===11000){
            return next(new AppError('Please try again', 400, 'ERR_DUPLICATE_ROOM'))
        }
        next(error)
    }
}

//This route is used to join the room by increasing the user count
exports.join= async (req, res, next) => {
    try {
        const roomID = req.body.roomID;
        const userId = req.body.userId;
        const room = await Room.findOne({ roomID })

        if(room){
            if(room.userCount < 2){
                if(room.userIds.includes(userId)){
                    return res.status(200).json({
                        status: 'success',
                        data: { roomID }
                    });
                }
                room.userCount++;
                room.userIds.push(userId);
                const result= await room.save();

                const data= {
                    roomID: result.roomID
                }
                res.status(200).json({
                    status: 'success',
                    data: data,
                });
            }else{
                return next(new AppError('This room is full can\'t join', 400, 'ERR_FULL_ROOM'));
            }
        }else{
            return next(new AppError('Invalid room ID', 400, 'ERR_INVALID_ROOM'))
        }   
    } catch (error) {
        next(error);
    }
}
