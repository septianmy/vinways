import React, { useEffect, useState } from 'react';
import {Header, Input, InputFile, Button, DataArtists} from '../../components';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { API} from '../../config/api';
import Select from 'react-select';

const AddArtistPage = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [modalUpdateShow, setModalUpdateShow] = React.useState(false);
    const [validationModal, setValidationModal] = React.useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [artistThumbnail, setArtistThumbnail] = useState('');
    const [artists, setArtists ] = useState([]);
    const options = [
        {value: 'Solo', label: 'Solo', key: 0},
        {value: 'Duet', label: 'Duet', key: 1},
        {value: 'Group', label: 'Group', key: 2},
        {value: 'Band', label: 'Band', key: 3}
    ];
    const optionsOld = [];
    const optionsCareer = [];
    var i = 0;
    const maxYear = new Date().getFullYear(); 
    for(i =1; i <= 100; i++){
        var index = i-1;
        optionsOld.push({value: i, label: i, key: index});
    }
    var indexYear = 0;
    for(i =maxYear; i >= 1945 ; i--){
        optionsCareer.push({value: i, label: i, key: indexYear});
        indexYear = indexYear + 1;
    }
    const [formData, setFormData] = useState({
        id: "",
        pageTitle: "Add Artist",
        name:"",
        old: {
            value : null,
            optionsOld
        },
        startCareer: {
            value : null,
            optionsCareer
        },
        category : {
            value : null,
            options
        }
    });
    const {id, pageTitle, name, old, startCareer, category} = formData;

    function AddSuccessModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>
                Artist Succesfully Added
            </p>
            </Modal.Body>
          </Modal>
        );
      };
    
    function UpdateSuccessModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>
                Artist Successfully Updated
            </p>
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
                    inputMessage.message !== undefined &&
                    inputMessage.message.map((message) => (
                    <p>{message}</p>
                    ))
                } 
            </Modal.Body>
          </Modal>
        );
    };

    const handleReset = () => {
        setFormData({
            pageTitle: "Add Artist",
            name:"",
            old: {
                value : null,
                optionsOld
            },
            startCareer: {
                value : null,
                optionsCareer
            },
            category : {
                value : null,
                options
            }
        });
        setArtistThumbnail('');
    };

    const handleUpdate = async (id) => {
        const response = await API(`/artist/${id}`);
        const artistId = response.data.data.artist.id;
        const artistCategory = options.filter(index => index.value === response.data.data.artist.category).map(filteredKey => (filteredKey.key));
        const artistName = response.data.data.artist.name;
        const oldNumber = Number(response.data.data.artist.old);
        const careerNumber = Number(response.data.data.artist.startCareer)
        const artistOld = optionsOld.filter(i => i.value === oldNumber).map(filteredOld => (filteredOld.key));
        const artistCareer = optionsCareer.filter(i => i.value === careerNumber).map(filteredCareer => (filteredCareer.key));
        setFormData({
            id : artistId,
            pageTitle: "Edit Artist",
            name:artistName,
            old:{
                value : optionsOld[artistOld],optionsOld
            },
            startCareer:{
                value : optionsCareer[artistCareer],optionsCareer
            },
            category : {
                value : options[artistCategory],options
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formArtist = new FormData();
        formArtist.append("name", name);
        if(old.value !== null) {
            formArtist.append("old", old.value.value);
        }
        if(category.value !== null) {
            formArtist.append("category", category.value.value);
        }
        if(startCareer.value !== null) {
            formArtist.append("startCareer", startCareer.value.value);
        }
        formArtist.append("artistThumbnail", artistThumbnail);
        

        const config = {
            headers: {
                "Content-type":"multipart/form-data",
            },
        };

        if(pageTitle === "Add Artist"){
            try {
                const response = await API.post("/artist", formArtist, config);
                const newArtist = response.data.data.artist;
                setArtists([newArtist, ...artists]);
                setFormData({
                    id: "",
                    pageTitle: "Add Artist",
                    name:"",
                    old:{
                        value : null,optionsOld
                    },
                    startCareer:{
                        value : null,optionsCareer
                    },
                    category : {
                        value : null,options
                    }
                });
                setArtistThumbnail('');
                setModalShow(true);
            } catch (error) {
                if(error.response.status === 400){
                    setValidationModal(true);
                    setInputMessage(error.response.data.error);
                }
            }
        }
        else {
            try {
                const response = await API.patch(`/artist/${id}`, formArtist, config);
                setModalUpdateShow(true);
                setFormData({
                    id: "",
                    pageTitle: "Add Artist",
                    name:"",
                    old:{
                        value : null,optionsOld
                    },
                    startCareer:{
                        value : null,optionsCareer
                    },
                    category : {
                        value : null,options
                    }
                });
                setArtistThumbnail('');
                fetchArtists();
            } catch (error) {
                if(error.response.status === 400){
                    setValidationModal(true);
                    setInputMessage(error.response.data.error);
                }
            }
        }
        
    };
    const handleChange = (e) => {
        const updateForm = {...formData};
        updateForm[e.target.name] = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setFormData(updateForm);
    };

    const handleArtistThumbnail = (e) => {
        setArtistThumbnail(e.target.files[0]);
    }
    const handleSelect = ({e,a}) => {
        const updateSelect = {...formData};
        if(a.name === 'old'){
            updateSelect[`${a.name}`] = { value : optionsOld[`${e.key}`],optionsOld};
        } else if(a.name === 'category') {
            updateSelect[`${a.name}`] = { value : options[`${e.key}`],options};
        }
        else if(a.name === 'startCareer'){
            updateSelect[`${a.name}`] = { value : optionsCareer[`${e.key}`],optionsCareer};
        }
        setFormData(updateSelect);
    }

    const fetchArtists = async () => {
        try {
            const response = await API("/artists");
            setArtists(response.data.data.artists);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchArtists();
    },[])

    const dot = (color = '#ccc') => ({
        alignItems: 'center',
        display: 'flex',
      
        ':before': {
          backgroundColor: color,
          borderRadius: 10,
          content: '" "',
          display: 'block',
          marginRight: 8,
          height: 10,
          width: 10,
        },
      });
    const selectStyle = {
        control: styles => ({...styles, backgroundColor: 'rgba(210, 210, 210, 0.25)', color: 'white'}),
        option : (styles, {isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isDisabled
                  ? null
                  : isSelected
                  ? '#03F387'
                  : isFocused
                  ? '#03F387'
                  : null,
                color: isDisabled
                  ? 'white'
                  : isFocused
                  ? '#00031F'
                  : isSelected
                  ? '#00031F'
                  : '#03F387',
                
          
                ':active': {
                  ...styles[':active'],
                  backgroundColor: !isDisabled && (isSelected ? 'green' : '#03F387'),
                },
              };
        },
        menu : styles => ({...styles, backgroundColor: '#00031F', border: '1px solid white'}),
        input: styles => ({ ...styles, ...dot() }),
        placeholder: styles => ({ ...styles, ...dot() }),
        singleValue: styles => ({ ...styles, ...dot('#03F387'), color: 'white'}),
    }
    
    return (
        <div className="addmusic">
            <Header/>
            <div className="container mt-3">
                <form onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                    <div className="page-title">{pageTitle}</div>
                </div>
                <div className="row">
                    <div className="col-9">
                    <Input 
                        className="form-control" 
                        placeholder="Name"
                        onChange={(e)=>handleChange(e)}
                        name="name"
                        value={name}
                    />
                    </div>
                    <div className="col-3">
                    <InputFile 
                        prop={artistThumbnail.name}
                        id="file-1"
                        attach="Attach Thumbnail"
                        onChange={(e) => handleArtistThumbnail(e)}
                        name="thumbnail" 
                    />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Select
                            value={old.value}
                            options={old.optionsOld} 
                            placeholder="Old"
                            styles={selectStyle}
                            name="old"
                            onChange={(e,a) =>handleSelect({e,a})}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <Select 
                            value={category.value}
                            options={category.options} 
                            placeholder="Select Category"
                            styles={selectStyle}
                            name="category"
                            onChange={(e,a) =>handleSelect({e,a})}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <Select
                            value={startCareer.value} 
                            options={startCareer.optionsCareer} 
                            placeholder="Start a Career"
                            styles={selectStyle}
                            name="startCareer"
                            onChange={(e,a) =>handleSelect({e,a})}
                        />
                    </div>
                </div>
                <div className="row mt-4 d-flex justify-content-center">
                        {
                            pageTitle === "Add Artist" ? 
                                <>
                                    <div className="col-2"><Button type="submit" title="Add Artist"/></div>
                                    <div className="col-2"><Link to="/restore-artists"><Button title="Restore Artist"/></Link></div>
                                </>
                                : 
                                <>
                                <div className="col-2"><Button type="submit" title="Update Artist"/></div>
                                <div className="col-2"><Button title="Cancel" onClick={()=> handleReset()}/></div>
                                </>
                        }
                </div>
                </form>
            </div>
            <div className="container mt-3">
                <div className="row">
                    <div className="page-title">List of Artist</div>
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
                    {artists.map((artist, number) =>(
                        <DataArtists 
                            artist = {artist}
                            number = {number}
                            fetchArtists = {fetchArtists}
                            handleUpdate = {handleUpdate}
                        />
                    ))}
                    
                    </tbody>
                    </Table>
                </div>
                <AddSuccessModal show={modalShow} onHide={() => setModalShow(false)}/>
                <UpdateSuccessModal show={modalUpdateShow} onHide={() => setModalUpdateShow(false)}/>
                <InputValidation show={validationModal} onHide={() => setValidationModal(false)}/>
            </div>
        </div>
    )
}

export default AddArtistPage
