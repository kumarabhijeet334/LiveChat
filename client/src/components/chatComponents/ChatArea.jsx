import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import "./userChats.css";
import { ChatState } from '../../context/chatContext';
import Spinner from 'react-bootstrap/Spinner';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import '../chat.css';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { CloseButton } from 'react-bootstrap';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/animation_llc0aaei.json";
import animationData2 from "../../animations/animation_llc1lv3o.json"

const ENDPOINT = "/";
var socket, selectedChatCompare;

const ChatArea = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, user, setSelectedChat } = ChatState();

  const [error1show, setError1show] = useState(false);
  const errortoast1Close = () => setError1show(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/msg/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setError1show(true);
    }
  };

  const sendMsg = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post("/api/msg/send", {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setError1show(true);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {

      }
      else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <div>
      <Modal show={error1show} onHide={errortoast1Close} className="modal-dialog modal-danger">
        <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
          <span>Something went wrong!</span>
          <CloseButton onClick={errortoast1Close} />
        </Container>
      </Modal>
      {selectedChat ? (<>
        {loading ? (<div className=' d-flex justify-content-center align-items-center' style={{ height: "75vh" }}><Spinner animation="grow" className='mt-1' size='xl' /></div>) :
          <div className='message' style={{marginBottom: `${isTyping ? "100px" : "30px"}`}}>
            <ScrollableChat messages={messages} />
          </div>}
        <div class="container searchbar searchbar1">
          <div class="row">
            <div class="col-12">
              {isTyping ? <center>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  
                />
              </center> : <></>}
              <form>
                <div class="input-group mb-1">
                  <input
                    type="text"
                    class="form-control rounded-2"
                    placeholder="Type your message..."
                    aria-label="Type your message..."
                    onChange={typingHandler}
                    value={newMessage}
                    required />
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary ms-2"
                      type="button"
                      onClick={sendMsg}
                    >
                      <i class="bi bi-alexa"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>) : (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
          <Lottie
            options={defaultOptions2}
            
            style={{ width: "500px" }}
          />
        </div>
      )}
    </div>
  )
}

export default ChatArea;