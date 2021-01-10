import React, {useState} from 'react';
import { Dropdown } from "react-bootstrap";
import {Button} from "../../../components";
import Modal from 'react-bootstrap/Modal';
import {PayDropDownIcon, ActionArrow} from "../../../assets";
import {API} from "../../../config/api";

const MusicActionDropDown = ({id, title, artist, fetchMusics, handleUpdate}) => {
    const [modalShow, setModalShow] = React.useState(false);
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

    function DeleteModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body className="make-payment">
            <p>
                Are you sure to delete music "{title}" from artist "{artist}" ?
            </p>
            <div className="row d-flex justify-content-center">
              <div className="col-3"><Button title="Yes" onClick={()=> handleDelete(id)}/></div>
              <div className="col-3"><Button title="No" onClick={()=> setModalShow(false)}/></div>
            </div>
            </Modal.Body>
          </Modal>
        );
    };

    const handleDelete = async (id) => {
      try {
        const response = await API.delete(`/music/${id}`);
        setModalShow(false);
        fetchMusics();
      } catch (error) {
          console.log(error);
      }
    };

    return (
        <div className="d-flex justify-content-center profile-menu">
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"></Dropdown.Toggle>
                <Dropdown.Menu className="payment-dropdown dropdown-menu-right" as={CustomMenu}>
                    <Dropdown.Item eventKey="1" className="d-flex justify-content-center approve" onClick={()=> handleUpdate(id)}>Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="2" className="d-flex justify-content-center cancel" onClick={()=> setModalShow(true)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <DeleteModal show={modalShow} onHide={() => setModalShow(false)}/>
        </div>
    )
}

export default MusicActionDropDown;
