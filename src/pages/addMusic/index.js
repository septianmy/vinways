import React, { useEffect, useState } from 'react';
import {Header, Input, InputFile, Button, DataMusics} from '../../components';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import './addmusic.scss';
import { API} from '../../config/api';

const AddMusicPage = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [modalUpdateShow, setModalUpdateShow] = React.useState(false);
    const [validationModal, setValidationModal] = React.useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [musicThumbnail, setMusicThumbnail] = useState('');
    const [musicFile, setMusicFile] = useState('');
    const [musics, setMusics ] = useState([]);
    const [artists, setArtists] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        pageTitle: "Add Music",
        title:"",
        year:{
            value : null
        },
        artistId :{
            value : null
        },
    });

    const {id, pageTitle, title, year, artistId} = formData;
    const optionsYear = [];
    var i = 0;
    const maxYear = new Date().getFullYear(); 
    var indexYear = 0;
    for(i =maxYear; i >= 1945 ; i--){
        optionsYear.push({value: i, label: i, key: indexYear});
        indexYear = indexYear + 1;
    }
    const fetchMusics = async () => {
        try {
            const response = await API("/musics");
            if(response.status === 500){
                console.log("Server Error");
            }
            setMusics(response.data.data.musics);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchArtists = async () => {
        try {
            const response = await API("/artists");
            if(response.status === 500){
                console.log("Server Error");
            }
            setArtists(response.data.data.artists);
        } catch (error) {
            console.log(error);
        }
    };
    const handleReset = () => {
        setFormData({
            id: "",
            pageTitle: "Add Music",
            title:"",
            year:"",
            artistId :{
                value : null
            },
        });
        setMusicThumbnail('');
        setMusicFile('');
    };

    const handleUpdate = async (id) => {
        const response = await API(`/music/${id}`);
        const musicId = response.data.data.music.id;
        const musicTitle = response.data.data.music.title;
        const musicYear = Number(response.data.data.music.year);
        const musicArtist = Number(response.data.data.music.artistId);
        const musicArtistId = options.filter(i => i.value === musicArtist).map(filteredArtist => (filteredArtist.key));
        const musicOptYear = optionsYear.filter(i => i.value === musicYear).map(filteredArtist => (filteredArtist.key));
        setFormData({
            id: musicId,
            pageTitle: "Edit Music",
            title:musicTitle,
            year:{
                value : optionsYear[musicOptYear]
            },
            artistId :{
                value : options[musicArtistId]
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formMusic = new FormData();
        formMusic.append("title", title);
        if(year.value !== null) {
            formMusic.append("year", year.value.value);
        }
        if(artistId.value !== null) {
            formMusic.append("artistId", artistId.value.value);
        }
        formMusic.append("musicThumbnail", musicThumbnail);
        formMusic.append("musicFile", musicFile);

        const config = {
            headers: {
                "Content-type":"multipart/form-data",
            },
        };

        if(pageTitle === "Add Music"){
            try {
                const response = await API.post("/music", formMusic, config);
                setModalShow(true);
                setFormData({
                    id: "",
                    pageTitle: "Add Music",
                    title:"",
                    year:{
                        value : null
                    },
                    artistId:{
                        value : null
                    },
                });
                setMusicThumbnail('');
                setMusicFile('');
                fetchMusics();
            } catch (error) {
                if(error.response.status === 400){
                    setValidationModal(true);
                    setInputMessage(error.response.data.error);
                }
            }
        }
        else {
            try {
                const response = await API.patch(`/music/${id}`, formMusic, config);
                setModalUpdateShow(true);
                setFormData({
                    id: "",
                    pageTitle: "Add Music",
                    title:"",
                    year:{
                        value : null
                    },
                    artistId:{
                        value : null
                    },
                });
                setMusicThumbnail('');
                setMusicFile('');
                fetchMusics();
            } catch (error) {
                if(error.response.status === 400){
                    setValidationModal(true);
                    setInputMessage(error.response.data.error);
                }
            }
        }
        
    }

    useEffect(()=> {
        fetchMusics();
        fetchArtists();
    },[]);

    
    function AddSuccessModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
               <p>Music Succesfully Added</p>
            </Modal.Body>
          </Modal>
        );
      };

      function UpdatedSuccessModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
               <p>Music Succesfully Updated</p>
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
                <p>Input Error</p>
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

    const handleChange = (e) => {
        const updateForm = {...formData};
        updateForm[e.target.name] = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setFormData(updateForm);
    };

    const handleMusicThumbnail = (e) => {
        setMusicThumbnail(e.target.files[0]);
    }

    const handleMusicFile = (e) => {
        setMusicFile(e.target.files[0]);
    }

    const handleSelect = ({e,a}) => {
        const updateForm = {...formData};
        if(a.name === 'year'){
            updateForm[`${a.name}`] = { value : optionsYear[`${e.key}`],optionsYear};
        } else if(a.name === 'artistId') {
            updateForm[`${a.name}`] = { value : options[`${e.key}`],options};
        }
        setFormData(updateForm);
    };

    const options = artists.map((artist, index) => ({ value: artist.id, label: artist.name, key:index }));
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
                            placeholder="Title"
                            name="title"
                            value={title}
                            onChange={(e)=>handleChange(e)}
                        />
                    </div>
                    <div className="col-3">
                        <InputFile 
                            prop={musicThumbnail.name}
                            id="file-1"
                            attach="Attach Thumbnail" 
                            name="thumbnail" 
                            onChange={(e) => handleMusicThumbnail(e)} 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Select
                            value={year.value} 
                            options={optionsYear} 
                            placeholder="Select Year"
                            styles={selectStyle}
                            name="year"
                            onChange={(e,a) =>handleSelect({e,a})}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col ">
                        <Select
                            value = {artistId.value}
                            options={options} 
                            placeholder="Select Artist"
                            styles={selectStyle}
                            name="artistId"
                            onChange={(e,a) =>handleSelect({e,a})}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-3">
                        <InputFile
                            prop={musicFile.name} 
                            id="file-2"
                            attach="Attach Song File" 
                            name="attachment" 
                            onChange={(e) => handleMusicFile(e)}
                        />
                    </div>
                    <div className="col-6">
                        <p style={{color:"white"}}>{musicFile.name}</p>
                    </div>
                    <div className="col-3">
                        <p style={{color:"white"}}>{musicThumbnail.name}</p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                {
                    pageTitle === "Add Music" ? 
                        <><div className="col-4"><Button type="submit" title="Add Music"/></div></>
                    : 
                        <>
                        <div className="col-2"><Button type="submit" title="Update Music"/></div>
                        <div className="col-2"><Button title="Cancel" onClick={()=> handleReset()}/></div>
                        </>
                }
                </div>
                </form>
            </div>
            <div className="container mt-3">
                <div className="row">
                    <div className="page-title">List of Musics</div>
                    <Table striped  hover>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th colspan="2" className="text-center">Title</th>
                        <th className="text-center">Artist</th>
                        <th className="text-center">Year</th>
                        <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {musics.map((music, number) =>(
                            <DataMusics
                                number = {number}
                                music = {music}
                                fetchMusics = {fetchMusics}
                                handleUpdate = {handleUpdate}
                            />
                        ))}
                    </tbody>
                    </Table>
                </div>
                <AddSuccessModal show={modalShow} onHide={() => setModalShow(false)}/>
                <UpdatedSuccessModal show={modalUpdateShow} onHide={() => setModalUpdateShow(false)}/>
                <InputValidation show={validationModal} onHide={() => setValidationModal(false)}/>
            </div>
        </div>
    )
}

export default AddMusicPage
