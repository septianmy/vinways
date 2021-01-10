import React, {useState} from 'react';
import { Dropdown } from "react-bootstrap";
import {Button} from "../../../components";
import Modal from 'react-bootstrap/Modal';
import {PayDropDownIcon, ActionArrow} from "../../../assets";
import {API} from "../../../config/api";

const MusicActionDropDown = ({id, artistName, fetchArtists, handleUpdate}) => {
    const [modalShow, setModalShow] = React.useState(false);
    var [totals, setTotals] = useState([]);
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
        <img src={ActionArrow}></img>
        </a>
      ));

    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
          const [value, setValue] = useState('');
      
          return (
            <div
              ref={ref}
              className={className}
              aria-labelledby={labeledBy}
            >
            <img src={PayDropDownIcon} className="dropdownmenu-arrow"></img>
              <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                  (child) =>
                    !value || child.props.children.toLowerCase().startsWith(value),
                )}
              </ul>
            </div>
          );
        },
      );


    function DeleteModal (props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>
              Are you sure to delete Artist "{artistName}" with {totals} songs ?
            </p>
            <div className="row d-flex justify-content-center">
              <div className="col-3"><Button title="Yes" onClick={()=> handleSubmitDelete(id)}/></div>
              <div className="col-3"><Button title="No" onClick={()=> setModalShow(false)}/></div>
            </div>
            </Modal.Body>
          </Modal>
        );
    };

    const handleSubmitDelete = async (id) => {
      try {
        if(totals === 0 ){
          const response = await API.delete(`/artist/${id}`);
        }
        else {
          const response = await API.delete(`/delete-music-artist/${id}`);
          const responseArtist = await API.delete(`/artist/${id}`);
        }
        setModalShow(false);
        fetchArtists();
      } catch (error) {
        console.log(error);
      }
    }

    const handleDelete = async (id) => {
        try {
            const response = await API(`/check-music-artist/${id}`);
            setTotals(totals = response.data.data.totalMusic);
            setModalShow(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="d-flex justify-content-center profile-menu">
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"></Dropdown.Toggle>
                <Dropdown.Menu className="payment-dropdown dropdown-menu-right" as={CustomMenu}>
                    <Dropdown.Item eventKey="1" className="d-flex justify-content-center approve"onClick={()=> handleUpdate(id)}>Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="2" className="d-flex justify-content-center cancel" onClick={()=> handleDelete(id)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <DeleteModal show={modalShow} onHide={() => setModalShow(false)}/>
        </div>
    )
}

export default MusicActionDropDown;
