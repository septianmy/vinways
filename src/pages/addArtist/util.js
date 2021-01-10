import React, { useEffect, useState } from 'react';
import {Header, DataArtists} from '../../components';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { API} from '../../config/api';

const RestoreArtist = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [restoreArtists, setRestoreArtists ] = useState([]);
    const fetchRestoreArtists = async () => {
        try {
            const response = await API("/restore-artists");
            setRestoreArtists(response.data.data.artists);
        } catch (error) {
            console.log(error);
        }
    }
    const handleRestore = async (idRestore) => {
        try {
            const response = await API.post(`/artist/${idRestore}`);
            setModalShow(true);
            fetchRestoreArtists();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchRestoreArtists();
    },[])

    function RestoreSuccessModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <Link to="/addartist">
            <p>
                Artist Succesfully Restored
            </p>
            </Link>
            </Modal.Body>
          </Modal>
        );
      };

    return (
        <div className="addmusic">
            <Header/>
            <div className="container mt-3">
                <div className="row">
                        <div className="page-title">Restore Artist</div>
                        <Table striped  hover>
                        <thead>
                            <tr>
                            <th>No</th>
                            <th colspan="2" className="text-center">Name</th>
                            <th className="text-center">Old</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Start a Career</th>
                            <th className="d-flex justify-content-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restoreArtists.map((artist, number) =>(
                            <DataArtists 
                                artist = {artist}
                                number = {number}
                                page = "Restore"
                                handleRestore = {handleRestore}
                            />
                            ))}
                        </tbody>
                        </Table>
                </div>
            </div>
            <RestoreSuccessModal show={modalShow} onHide={() => setModalShow(false)}/>
        </div>
    )
};

export default RestoreArtist