import { UserContext } from "./../utility/UserContext";
import { useState, useContext } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { Fade } from 'react-reveal'
import { serverURL } from "../utility/constants";

const Home = () => {
  const [user, setUser] = useContext(UserContext);
  const [name, setName] = useState ("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (room.trim().length === 0) {
      toast.error("Please enter valid room ID",{
        autoClose: 2000,
      });
      return;
    }
    fetch(`http://${serverURL}/api/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({roomID: room, userId: user.id})
      })
        .then(response => response.json())
        .then(data => {
            if(data.status==="success"){
                navigate(`/game/${data.data.roomID}`)
            }else{
                toast.error(data.message,{
                    autoClose: 2000,
                });
            }
        })
        .catch(error => {
            console.log(error)
        });
  };

  const createRoom = () => {
    fetch(`http://${serverURL}/api/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: user.id})
      })
        .then(response => response.json())
        .then(data => {
          if(data.status==="success"){
            navigate(`/game/${data.data.roomID}`)
          }else{
            toast.error(data.message,{
                autoClose: 2000,
            });
          }
        })
        .catch(error => {
            console.log(error)
        });
  };

  const registerUser = () => {
    if (name.trim().length === 0) {
      toast.error("Please enter valid name",{
        autoClose: 2000,
      });
      return;
    }
    const createUser = {
      id: nanoid(6),
      name,
    };

    Cookies.set("user", JSON.stringify(createUser), { expires: 7});
    setUser(createUser);
  };
  
  return (
    <Fade>
      <ToastContainer />
      {user ? (
        <Fade>
          <div className="text-center text-gray-100 text-3xl mt-14 font-extrabold font-mono">
            Hello {user.name}👋🏻
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 md:w-1/2 w-3/4 mx-auto md:mt-24 mt-20 h-5">
            <input
              className="md:col-span-2 font-mono col-span-1 focus-within:shadow-lg focus:border-red-800 outline-none font-extrabold tracking-wider border-b-2 bg-transparent text-white p-2 md:text-4xl text-2xl mx-4"
              type="text"
              value={room}
              placeholder="Enter room ID..."
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              className="md:col-span-1 hover:border-solid text-white mt-10 md:w-full mx-auto p-3 px-9 md:my-0 font-extrabold border-dashed tracking-wide md:text-2xl border-red-800 border border-2"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
          <div className="md:mt-20 mt-36 text-2xl grid text-center text-white font-extrabold">
            OR
          </div>
          <button
            className="grid mx-auto md:mt-10 mt-8 hover:border-solid text-white font-extrabold border-dashed text-center p-3 px-7 tracking-wide md:text-2xl border-red-800 border border-2"
            onClick={createRoom}
          >
            Create Room
          </button>
        </Fade>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 md:w-1/2 w-3/4 mx-auto mt-36 h-5 md:mt-60">
          <input
            className="md:col-span-2 focus-within:shadow-lg focus:border-red-800 font-mono col-span-1 outline-none font-extrabold tracking-wider border-b-2 bg-transparent text-white p-2 md:text-4xl text-2xl mx-4"
            type="text"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="md:col-span-1 mt-14 md:mt-0 mx-auto p-3 px-9 hover:border-solid text-white font-extrabold border-dashed tracking-wide md:text-2xl border-red-800 border border-2"
            onClick={registerUser}
          >
            Enter Game
          </button>
        </div>
      )}
    </Fade>
  );
};

export default Home;
