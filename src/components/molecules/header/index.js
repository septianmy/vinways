import { Logo } from "../../../assets";
import {Link} from 'react-router-dom';
import {ProfileMenu} from '../../atoms';
import './header.scss';

const Header = () => {
    return (
        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col">
                    <Link to="/"><img src={Logo} alt="Logo" className="align-self-center"></img></Link>
                    </div>
                    <ProfileMenu/>
                </div>
                
            </div>
        </div>
    )
}

export default Header
