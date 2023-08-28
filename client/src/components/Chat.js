import './chat.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useState } from 'react';
// import { Button, Col, Container, Row } from 'react-bootstrap';

import { AuthContext } from '../context/AuthContext';
// import SideBar from './chatComponents/SideBar';
import ChatNav from './ChatNav';
import UserChats from './chatComponents/UserChats';
import ChatArea from './chatComponents/ChatArea';
import GroupChatModal from './chatComponents/GroupChatModal';
import { ChatState } from '../context/chatContext';
import { getSender } from '../config/ChatLogics';
import UpdateGroup from './chatComponents/UpdateGroup';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const { selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
      <div style={{ width: "100%" }} >
        {user && <ChatNav />}
        <div class="container-fluid">
          <div class="row" style={{ height: "88vh" }}>

            <div class="col-md-3 d-none d-md-block" style={{ height: "100%", paddingLeft: "10px", paddingRight: "7px" }}>
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center text-capitalize">
                  {user.username}'s Chats
                  <GroupChatModal>
                    <button class="btn btn-sm btn-secondary ml-auto"><i class="bi bi-plus-circle"></i> New Group</button>
                  </GroupChatModal>

                </div>
                <div className='my-1 mx-2 overflow-auto scrollable-area'>
                  {user && <UserChats fetchAgain={fetchAgain} />}

                </div>
              </div>
            </div>


            <div class="col-md-9" style={{ height: "100%", paddingRight: "10px", paddingLeft: "6px" }}>
              <div class="card h-100">
                <div class="card-header text-capitalize" style={{ height: "56px", backgroundColor: "rgba(39, 43, 47, 1)" }}>
                  {selectedChat ? (!selectedChat.isGroupChat ?
                    <div className='text-center'><b>{getSender(user, selectedChat.users)}</b></div> :
                    <div className="row"><div className='col-11 text-center'><b>{selectedChat.chatName}</b></div><div className="col-1" style={{ height: "56px" }}><UpdateGroup
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    
                    /></div></div>)
                    : <div className='text-center'>Chatting Arena</div>}

                </div>
                <div class="card-body scrollable-area">
                  {user && <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                  
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


    </>

  );
}
