import React from 'react';
import {useContext, useState } from 'react';
import {AppContext} from "../../context/appContext";
import {Link, useHistory} from 'react-router-dom';
import {API, setAuthToken} from '../../config/api';
import { Input, Button, Tagline, Headerauth} from '../../components';
import Modal from 'react-bootstrap/Modal';
import './login.scss';

const Login = () => {
    const [state, dispatch] = useContext(AppContext);
    const [modalShow, setModalShow] = React.useState(false);
    const router = useHistory();
    const [formData, setFormData ] = useState({
        email: "haris@gmail.com",
        password: "haris1",
    });

    const { email, password } = formData;

    function LoginWarning(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>
                Sorry, we couldn't find an account with that username or you filled wrong password.
            </p>
            </Modal.Body>
          </Modal>
        );
      };
    
    const checkPayment = async (userId) => {
        try {
            const response = await API(`/check-transaction/${userId}`);
            if (response.status === 500){
                console.log("Server Error")
            }
            if(response.data.data.transactions.length !== 0) {
                dispatch({
                    type: "PAYMENT",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const body = JSON.stringify({email,password});
            const config = {
                headers: {
                    "Content-Type":"application/json",
                },
            }; 
            const response = await API.post("/login", body, config);
            dispatch({
                type: "LOGIN",
                payload: response.data.data.channel,
            });
            setAuthToken(response.data.data.channel.token);
            const userId = response.data.data.channel.id;
            checkPayment(userId);
            router.push("/");
        } catch (error) {
            setModalShow(true)
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
                        <Link to="/register"><Button title="Register"/></Link>
                    </div>
                    <div className="right">
                        <div className="section-title green">Login</div>
                        <form onSubmit={(e) => handleLogin(e)}>
                        <Input placeholder="Username" value={email} name="email" onChange={(e) => handleChange(e)}/>
                        <Input type="Password" placeholder="Password" value={password} name="password" onChange={(e) => handleChange(e)}/>
                        <Button title="Login" type="submit"/>
                        </form>
                    </div>
                </div>
            </div>
            <LoginWarning
            show={modalShow}
            onHide={() => setModalShow(false)}
            />
        </div>
    )
}

export default Login
