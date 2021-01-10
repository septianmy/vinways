import React from 'react'
import { Music } from '../../../assets'

const Tagline = () => {
    return (
        <div>
            <div className="ilustration white">Listening is</div>
            <div className="ilustration green">
                <img className="music-image" src={Music} alt="Listening is Everything"></img>
                <div className="everything">Everything</div>
            </div>
            <p className="tagline">pay and access millions of songs</p>
        </div>
    )
}

export default Tagline
