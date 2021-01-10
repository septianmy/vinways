import React from 'react';
import {useContext} from 'react';
import {AppContext} from '../../../context/appContext';
import './musiccard.scss';
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Port } from '../../../config/api';

const MusicCard = ({musicdata, handlePlayer, setPlayIndex, index, playIndex}) => {
    const {title, year, thumbnail} = musicdata;
    const [modalShow, setModalShow] = React.useState(false);
    const [state] = useContext(AppContext);

    function MakePayment(props) {
      return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body className="make-payment">
          <Link to="/makepayment">
          <p>
              Please make a payment to listen to the hottest songs in the world
          </p>
          </Link>
          </Modal.Body>
        </Modal>
      );
    };

    return (
        <div className="col-2">
            <a onClick={state.isApproved  ? ()=>setPlayIndex(index) : ()=> setModalShow(true)} className="play-music">
            <div className="card mb-4 card-music">
                <div className="card-body card-music-picture">
                    <img 
                        src={`${Port}/${thumbnail}`}
                        alt={title}
                        className="img-fluid"
                        style={{
                            height:"152px",
                            width:"100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
                <div className="card-footer card-music-detail">
                    <div>
                        <div className="card-text music-title">{title}</div>
                        <div className="card-text music-year">{year}</div>
                    </div>
                    <div className="card-text album">
                        {
                            musicdata.artists.name !== null ? musicdata.artists.name : <>Artist</>
                        }
                    </div>
                </div>
            </div></a>
            <MakePayment
            show={modalShow}
            onHide={() => setModalShow(false)}
            />
        </div>
    );
}

export default MusicCard
