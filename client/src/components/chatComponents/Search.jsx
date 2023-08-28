import React from 'react'
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

// import Tooltip from 'react-bootstrap/Tooltip';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';
import './search.css';
import { AuthContext } from '../../context/AuthContext';
import ChatLoading from './ChatLoading';
import UserList from '../userBox/UserList';
import { ChatState } from '../../context/chatContext';

const Search = ({ sidebarCloseFun }) => {
  const { user } = useContext(AuthContext);
  const { setSelectedChat, chats, setChats } = ChatState();

  const [search, setSearch] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const [show, setShow] = useState(false);
  const toastClose = () => setShow(false);
  const [eshow, setEshow] = useState(false);
  const etoastClose = () => setEshow(false);
  const [seshow, setSeshow] = useState(false);
  const setoastClose = () => setSeshow(false);

  const handleSearch = async () => {
    if (!search) {
      setShow(true);
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await axios.get(`
      /api/users/allusers?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
      // console.log(searchResult);
    } catch (error) {
      setEshow(true);
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type" : "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat/access_chat", {userId} , config);
      // console.log(data);
      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      sidebarCloseFun();
    } catch (error) {
      setSeshow(true);
    } 
  }


  return (
    <div d="flex">
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Username or Email"
          className="me-2 ms-0"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-success" onClick={handleSearch}>Search</Button>
      </Form>

      {loadingChat && <center><Spinner animation="border" className='mt-3' /></center> }

      <div className='mt-2'>
        {loading ? (
          <ChatLoading/>
        ) : (
          searchResult?.map(useritem => (
            <UserList
              useritem={useritem}
              key={useritem._id}
              userFunction={() => accessChat(useritem._id)}
            />
          ))
        )}
      </div>

      <Modal show={show} onHide={toastClose} centered className="modal-dialog modal-danger">
        <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
          <span>Please type something !</span>
          <CloseButton onClick={toastClose} />
        </Container>
      </Modal>

      <Modal show={eshow} onHide={etoastClose} centered className="modal-dialog modal-danger">
        <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
          <span>An error has occured!</span>
          <CloseButton onClick={etoastClose} />
        </Container>
      </Modal>

      <Modal show={seshow} onHide={setoastClose} centered className="modal-dialog modal-danger">
        <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
          <span>An error has occured!</span>
          <CloseButton onClick={setoastClose} />
        </Container>
      </Modal>

    </div>
  )
}

export default Search;