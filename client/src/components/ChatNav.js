import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import Search from './chatComponents/Search';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { Modal, Card } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './chat.css'


function ChatNav() {
  const [show, setShow] = useState(false);
  const sidebarClose = () => setShow(false);
  const sidebarShow = () => setShow(true);

  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Search for users
    </Tooltip>
  );
  const { logoutUser, user } = useContext(AuthContext);
  const userPhoto = 'https://plus.unsplash.com/premium_photo-1677606179419-3a8719a19dea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-2">
          <Container fluid>

            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 300 }}
              overlay={renderTooltip}
            >
              <Button variant="outline-secondary" onClick={sidebarShow}>
                <i class="bi bi-search"></i> Search
              </Button>
            </OverlayTrigger>

            <Navbar.Brand href="#"><i class="bi bi-alexa">&nbsp;</i><b>Meta Chat</b></Navbar.Brand>


            <Modal show={showPopup} onHide={handleClosePopup} centered>
              <Modal.Body>
                <Card>
                  <Card.Body>
                    <Container className='text'>
                      <center>
                        <Card.Img variant="top" src={userPhoto} className="user-photo mb-2 rounded-image" />
                      </center>
                    </Container>

                    <br />
                    <Container>
                      <Card.Text className="text-center">
                        {user.username}
                        <br />
                        {user.email}
                      </Card.Text>
                      <center>
                        <Button onClick={() => logoutUser()} to="/login" variant="outline-danger" className="mx-2" >
                          Logout
                        </Button>
                        <Button variant="outline-primary" onClick={handleClosePopup}>
                          Band ker bsdk
                        </Button>
                      </center>
                    </Container>

                  </Card.Body>
                </Card>
              </Modal.Body>
            </Modal>


            <Button variant="outline-secondary" onClick={handleShowPopup}>
              <img
                alt="logo"
                width="30"
                height="30"
                className="round-image"
                src="https://plus.unsplash.com/premium_photo-1677606179419-3a8719a19dea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=300"
              />
              &nbsp;
              {user.username}
            </Button>

            <Offcanvas show={show} onHide={sidebarClose}>
              {/* <Offcanvas.Header closeButton>
                
              </Offcanvas.Header> */}
              <Offcanvas.Body closeButton>
                <div><Search
                  sidebarCloseFun={() => sidebarClose()}
                /></div>

              </Offcanvas.Body>
            </Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default ChatNav;