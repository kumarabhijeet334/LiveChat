import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, CloseButton, Form } from 'react-bootstrap';
import { ChatState } from '../../context/chatContext';
import axios from 'axios';
import UserList from '../userBox/UserList';
import SelUsr from './SelUsr';

const GroupChatModal = ({ children }) => {
    const [groupName, setGroupName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchkey, setSearchkey] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats, setSelectedChat } = ChatState();

    const [error1show, setError1show] = useState(false);
    const errortoast1Close = () => setError1show(false);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setGroupName("");
        setSearchkey("");
        setSelectedUsers([]);
        setSearchResult([]);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const [error2show, setError2show] = useState(false);
    const errortoast2Close = () => setError2show(false);

    const [error3show, setError3show] = useState(false);
    const errortoast3Close = () => setError3show(false);

    const handleSearch = async (query) => {
        setSearchkey(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/users/allusers?search=${searchkey}`, config);
            setLoading(false);
            setSearchResult(data);
            
        } catch (error) {
            setError1show(true);
        }
    };
    const handleSubmit = async () => { 
        if(!groupName || !selectedUsers) {
            setError3show(true);
        }
        try {
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("/api/chat/create_group", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((usr)=>usr._id)),
            }, config);
            // console.log(data);
            setChats([data,...chats]);
            setSelectedChat(data);
            handleClose();
        } catch (error) {
            setError1show(true);
        }
    };
    const handleuser = (useritem) => {
        if (selectedUsers.includes(useritem)){
            setError2show(true);
            return;
        }
        setSelectedUsers([...selectedUsers, useritem]);
    };
    const deleteUsr = (usr)=> {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== usr._id));
    };

    return (
        <>
            <Modal show={error1show} onHide={errortoast1Close} className="modal-dialog modal-danger">
                <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
                    <span>Something went wrong!</span>
                    <CloseButton onClick={errortoast1Close} />
                </Container>
            </Modal>
            <Modal show={error2show} onHide={errortoast2Close} centered className="modal-dialog modal-danger">
                <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
                    <span>User Already Added!</span>
                    <CloseButton onClick={errortoast2Close} />
                </Container>
            </Modal>
            <Modal show={error3show} onHide={errortoast3Close} centered className="modal-dialog modal-danger">
                <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
                    <span>Missing users or Group name!</span>
                    <CloseButton onClick={errortoast3Close} />
                </Container>
            </Modal>
            <span onClick={handleShow}>{children}</span>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div class="mb-1">
                            <label class="form-label" aria-required>Group Name</label>
                            <input type="text" class="form-control" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>
                        </div>
                        <div class="mb-1">
                            <label class="form-label">Users</label>
                            <input onChange={(e) => handleSearch(e.target.value)} value={searchkey} type="search" class="form-control" aria-label="Search" />
                        </div>
                    </Form>
                    {selectedUsers.map(usr => (
                        <SelUsr 
                        key={usr._id}
                        usr={usr}
                        delUsr={()=>deleteUsr(usr)} 
                        />
                    ))}
                    <div className='m-1'>
                        {loading ? <div>loading.....</div> : (
                            searchResult?.slice(0, 4).map(useritem => (
                                <UserList
                                    useritem={useritem}
                                    key={useritem._id}
                                    userFunction={() => handleuser(useritem)}
                                />
                            ))
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outline-primary" onClick={handleSubmit}>Create</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default GroupChatModal;