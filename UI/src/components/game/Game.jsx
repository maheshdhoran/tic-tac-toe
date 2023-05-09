import { UserContext } from "../../utility/UserContext";
import { Navigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Fade } from 'react-reveal'
import Board from "./Board"
import { Socket } from "../../utility/socket";

const socket= Socket;
const Game= ()=>{
    const [user] = useContext(UserContext);
    const [gameStarted, setGameStarted] = useState(false);
    const { roomID } = useParams();

    useEffect(()=>{
        socket.emit('join' , roomID );
        socket.on('gameStarted' , ()=>{
            setGameStarted(true);
        });
    },[])

    if(!user){
        return <Navigate to="/"/>
    }

    return (
        <Fade>
            {gameStarted ? (
                <Fade>
                    <Board socket={socket}/>
                </Fade>
            ) : (
                <>
                    <div className="text-center text-gray-100 md:text-2xl text-xl mt-32 font-extrabold font-mono">
                        To start the game, please provide your friend with the room ID- <span className="text-red-800">{roomID}</span>
                    </div>
                    <div className="text-center text-gray-100 md:text-2xl text-xl mt-14 font-extrabold font-mono">
                        Waiting for your friend...
                    </div>
                </>                
            )}
        </Fade>
    )
}

export default Game