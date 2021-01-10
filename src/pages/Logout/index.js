import {useEffect, useContext, useState} from 'react';
import {AppContext} from '../../context/appContext';
import { Redirect } from "react-router-dom";

const Logout = () => {
    const [state, dispatch ]= useContext(AppContext);
    const [isLogout, setIsLogout ] = useState(false);

    useEffect(() => {
        dispatch({
            type: "LOGOUT",
        });
        setIsLogout(true);
    }, []);

    return isLogout && <Redirect to="/login"/>;
}

export default Logout