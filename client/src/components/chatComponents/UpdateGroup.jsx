import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, CloseButton, Form } from 'react-bootstrap';
import { ChatState } from '../../context/chatContext';
import axios from 'axios';
import UserList from '../userBox/UserList';
import SelUsr from './SelUsr';

const UpdateGroup = ({ fetchAgain, setFetchAgain }) => {
    const [groupName, setGroupName] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [searchkey, setSearchkey] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();

    const [error1show, setError1show] = useState(false);
    const errortoast1Close = () => setError1show(false);

    const [error2show, setError2show] = useState(false);
    const errortoast2Close = () => setError2show(false);

    const [error3show, setError3show] = useState(false);
    const errortoast3Close = () => setError3show(false);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setGroupName("");
        setSearchkey("");
        setSelectedUser();
        setSearchResult([]);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const updateUserList = async (useritem) => {
        if (selectedChat.users.find((u) => u._id === useritem._id)) {
            setError2show(true);
            return;
        }
        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("/api/chat/add_member", {
                chatId: selectedChat._id,
                userId: useritem._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            setError1show(true);
            setRenameLoading(false);
        }
    };
    const removeUsr = async (usr) => {
        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("/api/chat/remove_member",{
                chatId: selectedChat._id,
                userId: usr._id,
            }, config);

            usr._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setSelectedUser();
        } catch (error) {
            setError1show(true);
            setRenameLoading(false);
        }
    };
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
    const handleRename = async () => {
        if (!groupName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("/api/chat/rename_group", {
                chatId: selectedChat._id,
                chatName: groupName,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            handleClose();
        } catch (error) {
            setError1show(true);
            setRenameLoading(false);
        }
    };
    const deleteUsr = () => {
        setSelectedUser();
    };
    const rmvUsr = (usr1) => {
        setSelectedUser(usr1);
    };
    const handleLeave = () => {

    };
    // console.log(selectedChat);
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
                    <span>User is Already added!</span>
                    <CloseButton onClick={errortoast2Close} />
                </Container>
            </Modal>
            <Modal show={error3show} onHide={errortoast3Close} centered className="modal-dialog modal-danger">
                <Container fluid className='m-2 d-flex justify-content-between align-items-center' >
                    <span>Missing users or Group name!</span>
                    <CloseButton onClick={errortoast3Close} />
                </Container>
            </Modal>
            {selectedChat.groupAdmin._id === user._id && <i class="bi bi-box-fill" style={{ fontSize: "1.5rem", cursor: "pointer" }} onClick={handleShow}></i>}
            {selectedChat.groupAdmin._id !== user._id && <Button variant="outline-danger btn btn-sm" onClick={() => removeUsr(user)}>Leave</Button>}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className='text-center'>{selectedChat.chatName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedChat.users.map(usr1 => (
                        <SelUsr
                            key={usr1._id}
                            usr={usr1}
                            delUsr={() => rmvUsr(usr1)}
                        />
                    ))}
                    <Form>
                        <div class="mb-1">
                            <label class="form-label">Rename Group</label>
                            <input type="text" class="form-control" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </div>
                        <div class="mb-1">
                            <label class="form-label">Add Users</label>
                            <input onChange={(e) => handleSearch(e.target.value)} value={searchkey} type="search" class="form-control" aria-label="Search" />
                        </div>
                    </Form>


                    <div className='m-1'>
                        {renameLoading && <div>Updating.....</div>}
                        {selectedUser &&
                            <SelUsr
                                usr={selectedUser}
                                delUsr={deleteUsr}
                            />
                        }
                        {loading ? <div>loading.....</div> : (
                            searchResult?.slice(0, 4).map(useritem => (
                                <UserList
                                    useritem={useritem}
                                    key={useritem._id}
                                    userFunction={() => updateUserList(useritem)}
                                />
                            ))
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outline-primary" onClick={handleRename}>Update</Button>
                    <Button variant="outline-danger" onClick={() => removeUsr(selectedUser)}>Remove</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateGroup;