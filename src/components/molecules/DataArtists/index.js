import ArtistActionDropDown from '../../atoms/artistActionDropDown';
import {Button} from 'react-bootstrap';
import { Port} from '../../../config/api';

const DataArtists = ({artist, number, fetchArtists, handleUpdate, page, handleRestore}) => {
    let numbering = number + 1;
    return (
        <>
             <tr>
                <td className="align-middle">{numbering}</td>
                <td width="8%">
                    <img 
                        src={`${Port}/${artist.thumbnail}`}
                        alt={artist.name}
                        className="img-fluid"
                        style={{
                            height:"75px",
                            objectFit: "cover",
                        }}
                    />
                    </td>
                    <td className="align-middle">{artist.name}</td>
                    <td className="align-middle text-center">{artist.old}</td>
                    <td className="align-middle text-center">{artist.category}</td>
                    <td className="align-middle text-center">{artist.startCareer}</td>
                    <td className="align-middle text-center"> {
                        page === "restore" ? <Button className="btn-danger" onClick={()=>handleRestore(artist.id)}>Restore Artist</Button>
                        : 
                        <ArtistActionDropDown 
                        id = {artist.id}
                        artistName = {artist.name}
                        fetchArtists = {fetchArtists}
                        handleUpdate = {handleUpdate}
                        />
                    }
                    </td>
            </tr>
        </>
    )
}

export default DataArtists