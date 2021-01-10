import ReactJkMusicPlayer from 'react-jinke-music-player';
import {useContext} from 'react';
import {AppContext} from '../../../context/appContext';
import 'react-jinke-music-player/assets/index.css';

const MusicPlayer = ({ musics, setPlayIndex, playIndex }) => {
    const [state, dispatch] = useContext(AppContext);
    const playlist = musics.map((music) => ({
        name: music.title,
        singer: music.artists.name,
        cover: `http://localhost:5001/${music.thumbnail}`,
        musicSrc: `http://localhost:5001/${music.attachment}`
    }));

    return (
        <ReactJkMusicPlayer 
            mode="full"
            audioLists={playlist}
            autoPlay={false}
            remove={false}
            showDownload={false}
            toggleMode={false}
            showThemeSwitch={false}
            glassBg={true}
            playIndex={playIndex}
            onAudioPlay={(audioInfo) => {
                if(playIndex === audioInfo.playIndex){ return;}
                setPlayIndex(audioInfo.playIndex);
            }}
        />
    )
}

export default MusicPlayer
