import React, { createContext, useContext, useEffect, useState } from "react";


const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("User"));
    setUser(userInfo);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatContextProvider;

