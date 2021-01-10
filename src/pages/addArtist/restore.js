import React, {useEffect, useState} from 'react';
import {Header, DataArtists} from '../../components';
import {API} from '../../config/api';
import Table from 'react-bootstrap/Table';
const RestoreArtist = () => {
    const [restoreArtists, setRestoreArtists] = useState([]);

    const fetchRestoreArtists = async () => {
        try {
            const response = await API("/restore-artists");
            setRestoreArtists(response.data.data.artists);
        }catch (error) {
            console.log(error);
        }
    }
    const handleRestore = async (idRestore) => {
        try {
            const response = await API.post(`/artist/${idRestore}`);
            fetchRestoreArtists();
        } catch(error) {
            console.log(error)
        }
    }
    useEffect(()=> {
        fetchRestoreArtists();
    },[])
    
    return (
        <div className="addmusic">
            <Header/>
        <div className="container mt-3">
                <div className="row">
                    <div className="page-title">List of Deleted Artist</div>
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
                            page = "restore"
                            handleRestore = {handleRestore}
                        />
                    ))}
                    </tbody>
                    </Table>
                </div>
        </div>
        </div>
    )
};

export default RestoreArtist