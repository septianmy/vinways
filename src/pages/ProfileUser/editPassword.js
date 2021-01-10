import React, {useState, useContext} from 'react';
import {AppContext} from '../../context/appContext';
import {Header, Input, Button,} from '../../components';
import {Link, useHistory} from 'react-router-dom';
import { API } from "../../config/api";
import Modal from 'react-bootstrap/Modal';

const EditPassword = () => {
    const [modalPasswordShow, setModalPasswordShow] = React.useState(false);
    const [inputModalShow, setInputModalShow] = React.useState(false);
    const [modalPasswordChangedShow, setModalPasswordChangedShow] = React.useState(false);
    const [state] = useContext(AppContext);
    const router = useHistory();
    const { user } = state;
    const [formData, setFormData] = useState({
        id : user.id,
        oldpassword : "",
        newpassword : "",
        retypepassword : ""
    });
    var [messageError, setMessageError] = useState([]);
    const [passwordError, setPasswordError] = useState([]);
    const {id, oldpassword, newpassword, retypepassword} = formData;

    function PasswordError2(props) {
        const listMessage = messageError;
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
                <p>
            {Object.keys(listMessage).map((item, i) => (
                listMessage[item].[0]
            ))}
            </p>
            <p>
            {Object.keys(listMessage).map((item, i) => (
                listMessage[item].[1]
            ))}
            </p>
            <p>
            {Object.keys(listMessage).map((item, i) => (
                listMessage[item].[2]
            ))}
            </p>
            </Modal.Body>
          </Modal>
        );
      };

    function PasswordError(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>{passwordError}</p>
            </Modal.Body>
          </Modal>
        );
      };
    
      function PasswordChanged(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <Link to="/logout"><p>{passwordError}</p></Link>
            </Modal.Body>
          </Modal>
        );
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = JSON.stringify({oldpassword,newpassword,retypepassword});
            const config = {
                headers: {
                    "Content-Type":"application/json",
                },
            };
            const response = await API.put(`/change-password/${id}`, body, config);
            setModalPasswordChangedShow(true);
            setPasswordError(response.data.message);
        } catch (error) {
            if(error.response.status === 401)
            {
                setModalPasswordShow(true);
                setPasswordError(error.response.data.error.message);
            }
            else if(error.response.status === 400)
            {
                setInputModalShow(true);
                setMessageError(messageError = error.response.data.error);
            }
            else {
                console.log(error);
            }
            console.log(error);
            
        }
    };

    const handleChange = (e) => {
        const updateForm = {...formData};
        updateForm[e.target.name] = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setFormData(updateForm);
    };

    return (
        <div className="profile-user">
            <Header/>
            <div className="container mt-3">
                <form onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                    <div className="page-title">Change Password</div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input 
                            className="form-control" 
                            placeholder="Old Password"
                            onChange={(e)=>handleChange(e)}
                            name="oldpassword"
                            type="password"
                            value={oldpassword}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input 
                            className="form-control" 
                            placeholder="New Password"
                            onChange={(e)=>handleChange(e)}
                            name="newpassword"
                            type="password"
                            value={newpassword}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input 
                            className="form-control" 
                            placeholder="Retype New Password"
                            onChange={(e)=>handleChange(e)}
                            name="retypepassword"
                            type="password"
                            value={retypepassword}
                        />
                    </div>
                </div>
                <div className="row mt-4 d-flex justify-content-center">
                    <div className="col-3"><Button type="submit" title="Change Password"/></div>
                    <div className="col-3"><Link to="/profile"><Button title="Cancel"/></Link></div>
                </div>
                </form>
            </div>
            <PasswordError2
            show={inputModalShow}
            onHide={() => setInputModalShow(false)}
            />
            <PasswordError
            show={modalPasswordShow}
            onHide={() => setModalPasswordShow(false)}
            />
            <PasswordChanged
            show={modalPasswordChangedShow}
            onHide={() => setModalPasswordChangedShow(false)}
            />
        </div>
    )
}

export default EditPassword

