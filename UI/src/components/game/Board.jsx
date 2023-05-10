import { UserContext } from "../../utility/UserContext";
import { useContext, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-reveal";

const Board = ({ socket }) => {
  const [user] = useContext(UserContext);
  const { roomID } = useParams();
  const [squares, setSquares] = useState(Array(9).fill(null));
  const Player = useRef("");
  const Chance = useRef(true);
  const isX = useRef(true);

  const winner = () => {
    //check rows
    for (let i = 0; i <= 6; i = i + 3) {
      if (squares[i] === squares[i + 1] && squares[i] === squares[i + 2]) {
        if (squares[i]) {
          return squares[i];
        }
      }
    }
    //check columns
    for (let i = 0; i < 3; i++) {
      if (squares[i] === squares[i + 3] && squares[i] === squares[i + 6]) {
        if (squares[i]) {
          return squares[i];
        }
      }
    }
    //check diagonals
    if (squares[0] === squares[4] && squares[0] === squares[8]) {
      if (squares[0]) {
        return squares[0];
      }
    }
    if (squares[2] === squares[4] && squares[2] === squares[6]) {
      if (squares[2]) {
        return squares[2];
      }
    }

    //check for draw
    const draw= squares.every((val)=>{
      return val!=null;
    })
    if(draw){
      return "draw";
    }

    return null;
  };
  const state = winner();

  useEffect(() => {
    socket.on("action", (squareAction) => {
      squares[squareAction.id] = isX.current ? "X" : "O";
      isX.current = !isX.current;
      Player.current = squareAction.userId;
      if (squareAction.userId != user.id) {
        Chance.current = true;
      }
      setSquares([...squares]);
    });

    socket.on("restartGame", () => {
      isX.current = true;
      Chance.current = true;
      Player.current = "";
      setSquares([...squares.fill(null)]);
    });
  }, []);

  const squareClick = (id) => {
    if (squares[id] || !Chance.current || winner()) {
      return;
    }
    const squareAction = {
      id,
      name: user.name,
      userId: user.id,
      roomID,
    };
    socket.emit("action", squareAction);
    Chance.current = !Chance.current;
  };

  const playAgain = () => {
    socket.emit("restartGame", roomID);
  };

  return (
    <>
      {state ? (
        <div className="text-center text-gray-100 md:text-2xl text-xl mt-24 font-extrabold font-mono">
          {state==="draw" ? "The game ends in a draw. No one wins 😉" : Player.current === user.id
            ? "You Won 🎉"
            : "Better luck next time 🙂"}
        </div>
      ) : (
        <div className="text-center text-gray-100 md:text-2xl text-xl mt-24 font-extrabold font-mono">
          GAME STARTED
        </div>
      )}

      <div className="grid grid-rows-3 md:w-96 text-6xl w-80 h-72 md:mt-14 mt-16 text-white mx-auto md:h-80">
        <div className="grid grid-cols-3 border-b-2 border-red-800">
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(0)}
            >
              {squares[0] ? squares[0] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(1)}
            >
              {squares[1] ? squares[1] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center"
              onClick={() => squareClick(2)}
            >
              {squares[2] ? squares[2] : ""}
            </div>
          </Fade>
        </div>
        <div className="grid grid-cols-3 border-b-2 border-red-800">
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(3)}
            >
              {squares[3] ? squares[3] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(4)}
            >
              {squares[4] ? squares[4] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center"
              onClick={() => squareClick(5)}
            >
              {squares[5] ? squares[5] : ""}
            </div>
          </Fade>
        </div>
        <div className="grid grid-cols-3">
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(6)}
            >
              {squares[6] ? squares[6] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center border-r-2 border-red-800"
              onClick={() => squareClick(7)}
            >
              {squares[7] ? squares[7] : ""}
            </div>
          </Fade>
          <Fade>
            <div
              className="flex items-center justify-center"
              onClick={() => squareClick(8)}
            >
              {squares[8] ? squares[8] : ""}
            </div>
          </Fade>
        </div>
      </div>

      {state && (
        <Fade>
          <button
            className="grid mx-auto mt-10 hover:border-solid text-white font-extrabold border-dashed text-center p-3 px-7 tracking-wide md:text-2xl border-red-800 border border-2"
            onClick={playAgain}
          >
            Play Again
          </button>
        </Fade>
      )}
    </>
  );
};

export default Board;
