import { Routes, Route, Navigate } from "react-router-dom";

import Chat from "./components/Chat.js";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext.js";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path="/chat" element={user ? <Chat/> : <Login/>}/>
        <Route path="/register" element={user ? <Chat/> : <Register/>}/>
        <Route path="/login" element={user ? <Chat/> : <Login/>}/>
        <Route path="*" element={<Navigate to="/login"/>} /> 
        {/* The above line is for redirecting user to login page if he/she hits a random route */}
      </Routes>
    </>
  );
}

export default App;
