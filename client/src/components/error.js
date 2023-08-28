import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AuthContext } from '../context/AuthContext';

function Error() {
  const { registerError, loginError } = useContext(AuthContext);
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);


  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Error !</Modal.Title>
        </Modal.Header>
        <Modal.Body className=''>
           <p>{loginError?.message}</p>
           <p>{registerError?.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleClose}>Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Error;