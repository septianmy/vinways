import MusicActionDropDown from '../../atoms/musicActionDropDown';
import { Port} from '../../../config/api';
const DataMusics = ({number, music, fetchMusics, handleUpdate}) => {
    let numbering = number + 1;
    return (
        <>
        <tr>
            <td className="align-middle">{numbering}</td>
            <td width="8%">
                <img 
                    src={`${Port}/${music.thumbnail}`}
                    alt={music.title}
                    className="img-fluid"
                    style={{
                        height:"75px",
                        objectFit: "cover",
                    }}
                 />                
            </td>
            <td className="align-middle">{music.title}</td>
            <td className="align-middle">{music.artists.name}</td>
            <td className="align-middle text-center">{music.year}</td>
            <td className="align-middle"><MusicActionDropDown 
                key={music.id}
                id={music.id}
                title={music.title}
                artist={music.artists.name}
                fetchMusics={fetchMusics}
                handleUpdate={handleUpdate}
                page="music"
            /></td>
        </tr>
        </>
    )
};

export default DataMusics