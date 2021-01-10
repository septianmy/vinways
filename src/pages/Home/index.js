import React, {useContext, useState, useEffect} from 'react';
import {AppContext} from '../../context/appContext';
import { API } from "../../config/api";
import {MusicCard, Header, Slider, MusicPlayer} from "../../components";

const Home = () => {
    const [musics, setMusics ] = useState([]);
    const [ playIndex, setPlayIndex ] = useState(0);
    const [state, dispatch] = useContext(AppContext); 
    
    const fetchMusics = async () => {
        try {
            const response = await API("/musics");
            if (response.status === 500){
                console.log("server error")
            }
            setMusics(response.data.data.musics)
        } catch (error) {
            console.log(error);
        }
    }
    const handlePlayer = (title) => {
        dispatch ({
            type: "PLAYER_ON",
            payload : title,
        });
    }

    useEffect(() => {
        fetchMusics();
    }, [])

    return (
        <div className="Home">
            <Header/>
            <Slider/>
            <div className="container mt-3">
                <div className="row">
                    {musics.map((musicdata, index) => (
                        <MusicCard 
                            musicdata={musicdata}
                            key={musicdata.id}
                            setPlayIndex={setPlayIndex}
                            index={index}
                            key={index}
                            playIndex={playIndex}
                            handlePlayer={handlePlayer}
                        />
                    ))}
                </div>
                {
                    state.isApproved === true ? <MusicPlayer musics={musics} playIndex={playIndex} setPlayIndex={setPlayIndex}/> : <></>
                }     
            </div>
        </div>
    )
}

export default Home
