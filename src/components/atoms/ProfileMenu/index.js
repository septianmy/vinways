import React, {useState,useContext} from 'react';
import {AppContext} from "../../../context/appContext";
import { PayIcon, LogoutIcon, CallOut, AddMusic, AddArtist, UserDefaultPict} from "../../../assets";
import {Port} from '../../../config/api'
import {useHistory} from 'react-router-dom';
import { Dropdown } from "react-bootstrap";

import './profilemenu.scss';

const ProfileMenu = () => {
    const [state, dispatch] = useContext(AppContext);
    const {role, profilePicture} = state.user
    const router = useHistory();
    const toAddMusic =() => {
      router.push("/addmusic");
    }

    const toAddArtist =() => {
      router.push("/addartist");
    }

    const toPay =() => {
        router.push("/makepayment");
    }

    const toProfile =() => {
      router.push("/profile");
    }

    const toTransaction =() => {
      router.push("/transactions");
    }
    
    const handleLogout = () => {
        // dispatch({
        //     type: "LOGOUT",
        // });
        router.push("/logout");
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
            {
            profilePicture ? <img src={`${Port}/${profilePicture}`} alt="profile" className="img-profile"></img> :
            <img src={UserDefaultPict} alt="profile" className="img-profile"></img>
          }
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
            <img src={CallOut} className="dropdownmenu-arrow"></img>
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

    return (
        <div className="col d-flex justify-content-end profile-menu">
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"></Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-right" as={CustomMenu}>
                {
                  role === 0 ? 
                  <>
                    <Dropdown.Item eventKey="1" onClick={toAddMusic}><img src={AddMusic} className="dropdown-icon"></img>Music</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={toAddArtist}><img src={AddArtist} className="dropdown-icon"></img>Artist</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick={toTransaction}><img src={PayIcon} className="dropdown-icon"></img>Transactions</Dropdown.Item>
                  </>  
                  :
                  <>
                    <Dropdown.Item eventKey="4" onClick={toProfile}><img src={AddArtist} className="dropdown-icon"></img>Profile</Dropdown.Item>
                    <Dropdown.Item eventKey="5" onClick={toPay}><img src={PayIcon} className="dropdown-icon"></img>Pay</Dropdown.Item>
                  </> 
                }
                <Dropdown.Divider />
                <Dropdown.Item eventKey="6" onClick={handleLogout}><img src={LogoutIcon} className="dropdown-icon"></img>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default ProfileMenu
