import React from 'react';
import { Button } from 'react-bootstrap';
import './userlist.css';

const UserList = ({ useritem, userFunction }) => {
    return (
    <Button onClick={userFunction} className='my-1 useritem' variant="outline-secondary">
        <div className='userlistFont1 text-start'>{useritem.username}</div>
        <div className='userlistFont2 text-start'><b>Email : </b> {useritem.email}</div>
    </Button>
  )
}

export default UserList