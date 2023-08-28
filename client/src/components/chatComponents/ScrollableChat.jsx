import React from 'react';
import { useRef, useEffect } from 'react';
import ScrollableFeed from "react-scrollable-feed"
import { isDiffSender } from "../../config/ChatLogics";
import { ChatState } from '../../context/chatContext';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the latest message when new message is added
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  return (
    <ScrollableFeed>
      <div ref={chatContainerRef}>
        {messages && messages.map((m, i) => (
          <>
            {isDiffSender(messages, m, i, user._id) &&
              <div className="font-italic mx-2 mt-3" style={{ fontSize: "15px", color: "rgba(255, 218, 106, 0.7)" }}>{m.sender.username}</div>
            }
            <div key={m._id} className={`d-flex justify-content-${m.sender._id === user._id ? "end" : "start"}`}>

              <div className="mb-2 border" style={{
                color: `${m.sender._id === user._id ? "#75b798" : "#6edff6"}`,
                backgroundColor: "#272b2f",
                borderRadius: "15px",
                padding: "5px 9px",
                maxWidth: "75%",
                wordWrap: "break-word"
              }}>
                {m.content}
              </div>
            </div>
          </>
        ))}
      </div>
    </ScrollableFeed>
  )
}

export default ScrollableChat;