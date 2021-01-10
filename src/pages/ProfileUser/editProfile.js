import {Header, Input, InputFile, Button,} from '../../components';
import {Link, useHistory} from 'react-router-dom';
import { API } from "../../config/api";
import React, { useState, useContext, useEffect } from 'react';
import {AppContext} from '../../context/appContext';
import Modal from 'react-bootstrap/Modal';

const EditProfile = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [state, dispatch] = useContext(AppContext);
    const router = useHistory();
    const { user } = state;
    const [profilePicture, setProfilePicture] = useState('');
    const [formData, setFormData] = useState({
        id : user.id,
        fullName : user.name,
        email : user.email
    });
    const {id, email, fullName } = formData;

    function EditProfileModalSuccess(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <Link to="/profile">
                <p>
                    Profile has been updated
                </p>
            </Link>
            </Modal.Body>
          </Modal>
        );
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formEditProfile = new FormData();
        formEditProfile.append('fullName', fullName);
        formEditProfile.append('email', email)
        if(profilePicture !== undefined) {
            formEditProfile.append('profilePicture', profilePicture);
        }

        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }; 

        try {
            const response = await API.put(`/user/${id}`, formEditProfile, config);
            dispatch({
                type: "EDITPROFILE",
                payload: response.data.data.getUserAfterUpdate,
            });
            setModalShow(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleProfilePicture = (e) => {
        setProfilePicture(e.target.files[0]);
    }
    const handleChange = (e) => {
        const updateForm = {...formData};
        updateForm[e.target.name] = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setFormData(updateForm);
    };

    return (
        <div className="profile-user">
            <Header/>
            <div className="container mt-3">
                <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="page-title">Edit Profile User</div>
                </div>
                <div className="row">
                    <div className="col-9">
                    <Input 
                        className="form-control" 
                        placeholder="Email"
                        onChange={(e)=>handleChange(e)}
                        name="email"
                        value={email}
                    />
                    </div>
                    <div className="col-3">
                    <InputFile 
                        id="file-1"
                        attach="Attach Profile Picture"
                        onChange={(e) => handleProfilePicture(e)}
                        name="profilePicture" 
                    />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input 
                            className="form-control" 
                            placeholder="Fullname"
                            onChange={(e)=>handleChange(e)}
                            name="fullName"
                            value={fullName}
                        />
                    </div>
                </div>
                <div className="row mt-4 d-flex justify-content-center">
                    <div className="col-2"><Button type="submit" title="Update Profile"/></div>
                    <div className="col-2"><Link to="/profile"><Button title="Cancel"/></Link></div>
                </div>
                </form>
                <EditProfileModalSuccess
                show={modalShow}
                onHide={() => setModalShow(false)}
                />
            </div>
        </div>
    )
}

export default EditProfile
