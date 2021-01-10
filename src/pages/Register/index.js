import React from 'react';
import {useContext, useState } from 'react';
import {AppContext} from "../../context/appContext";
import {Link, useHistory} from 'react-router-dom';
import { Input, Button, Tagline, Headerauth} from '../../components';
import Modal from 'react-bootstrap/Modal';
import {API, setAuthToken} from '../../config/api';

const Register = () => {
    const [state, dispatch] = useContext(AppContext);
    const [modalShow, setModalShow] = React.useState(false);
    const [inputModalShow, setInputModalShow] = React.useState(false);
    const [loginModalShow, setLoginModalShow] = React.useState(false);
    const router = useHistory();
    const [formData, setFormData ] = useState({
        email: "",
        password: "",
        fullName: "",
    });
    const { email, password, fullName } = formData;
    const [inputMessage, setInputMessage] = useState('');

    function ToLogin(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <Link to="/login">
            <p>
                Congratulations your account has been registered. Click here to Login !
            </p>
            </Link>
            </Modal.Body>
          </Modal>
        );
      };

    function DuplicateEmail(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>Sorry, username or email is already used. Please use another email.</p>
            </Modal.Body>
          </Modal>
        );
      };
    
    function InputValidation(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            {
                inputMessage.message !== undefined ?
                inputMessage.message.map((message) => (
                    <p>{message}</p>
                )) :
                <></>
            } 
            </Modal.Body>
          </Modal>
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const body = JSON.stringify({email,password,fullName});
            const config = {
                headers: {
                    "Content-Type":"application/json",
                },
            }; 
            const response = await API.post("/register", body, config);
            setLoginModalShow(true);
        } catch (error) {
            if(error.response.status === 401){
                setModalShow(true);
            }
            else if(error.response.status === 400){
                setInputModalShow(true);
                setInputMessage(error.response.data.error);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value });
    };

    return (
        <div className="container">
            <div className="authentication">
                <Headerauth/>
                <div className="main-page">
                    <div className="left">
                        <Tagline />
                        <Link to="/login"><Button title="Login"/></Link>
                    </div>
                    <div className="right">
                        <div className="section-title green">Register</div>
                        <form onSubmit={(e) => handleRegister(e)}>
                        <Input placeholder="Email" value={email} name="email" onChange={(e) => handleChange(e)}/>
                        <Input type="Password" placeholder="Password" value={password} name="password" onChange={(e) => handleChange(e)}/>
                        <Input placeholder="Full Name" value={fullName} name="fullName" onChange={(e) => handleChange(e)}/>
                        <Button title="Register"/>
                        </form>
                    </div>
                </div>
            </div>
            <DuplicateEmail
            show={modalShow}
            onHide={() => setModalShow(false)}
            />
            <InputValidation
            show={inputModalShow}
            onHide={() => setInputModalShow(false)}
            />
             <ToLogin
            show={loginModalShow}
            onHide={() => setLoginModalShow(false)}
            />
        </div>
    )
}

export default Register
