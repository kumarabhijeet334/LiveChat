import React, { useEffect } from 'react'
import { ChatState } from '../../context/chatContext';
import { useState } from 'react';
import { Modal, Container, Stack, Button } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';
import axios from "axios";
import UserChatsLoading from './UserChatsLoading';
import { getSender } from '../../config/ChatLogics';
import './search.css';
import "./userChats.css"

const UserChats = ({fetchAgain}) => {
  const [errorshow, setErrorshow] = useState(false);
  const errortoastClose = () => setErrorshow(false);

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const getChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat/fetch_chats", config);
      setChats(data);
      // setSelectedChat(selectedChat);
    } catch (error) {
      setErrorshow(true);
    };
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("User")));
    getChats();
  }, [fetchAgain])


  return (
    <>
      <Modal show={errorshow} onHide={errortoastClose} centered className="modal-dialog modal-danger">
        <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
          <span>Error has occured!</span>
          <CloseButton onClick={errortoastClose} />
        </Container>
      </Modal>
      <div>
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Button onClick={() => setSelectedChat(chat)} key={chat._id} className='my-1 text-light' variant="outline-secondary" style={{ backgroundColor: selectedChat === chat ? "rgba(3, 40, 48, 1)" : '#212529' }}>
                <div className='text-capitalize'>
                  {!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : chat.chatName}
                </div>
              </Button>
            ))}
          </Stack>
        ) : (<UserChatsLoading />)}

      </div>

    </>
  )
}

export default UserChats;