import React from 'react';
import { Container } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';

const SelUsr = ({ usr, delUsr }) => {
    return (
        <>
            <div className="d-inline-block m-1">
                <Container
                    style={{
                        borderRadius: "6px",
                        backgroundColor: "rgba(3, 40, 48, 1)",
                    }}>
                    {usr.username} &nbsp;
                    <CloseButton onClick={delUsr} />
                </Container>
            </div>

        </>

    )
}

export default SelUsr;