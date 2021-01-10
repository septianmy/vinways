import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import PrivateAdminRoute from '../PrivateAdminRoute';
import { Login, 
    Logout, Register, Home, 
    MakePayment, Transactions, AddMusicPage, AddArtistPage, 
    ProfileUser, EditProfile, EditPassword, RestoreArtist} from '../../pages';
import {useEffect, useContext } from 'react';
import {API, setAuthToken} from "../../config/api";
import { AppContext } from '../../context/appContext';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const Routes = () => {
    const [state,dispatch] = useContext(AppContext);

    const checkPayment = async (userId) => {
        try {
            const response = await API(`/check-transaction/${userId}`);
            if (response.status === 500){
                console.log("Server Error")
            }
            if(response.data.data.transactions.length !== 0) {
                dispatch({
                    type: "PAYMENT",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadUser = async () => {
        try {
        const response = await API("/check-auth");
        if(response.status === 401){
            return dispatch({
            type: "AUTH_ERROR",
            });
        }
        dispatch({
            type: "USER_LOADED",
            payload: response.data.data, 
        });
        
        const userId = response.data.data.id;
        checkPayment(userId);
        } catch (error) {
        dispatch({
            type: "AUTH_ERROR",
        });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login}></Route>
                    <PrivateRoute path="/logout" component={Logout}/>
                    <Route exact path="/register" component={Register}></Route>
                    <PrivateRoute path="/makepayment" component={MakePayment}/>
                    <PrivateRoute path="/profile" component={ProfileUser}/>
                    <PrivateRoute path="/editprofile" component={EditProfile}/>
                    <PrivateRoute path="/editpassword" component={EditPassword}/>
                    <PrivateAdminRoute path="/transactions" component={Transactions}/>
                    <PrivateAdminRoute path="/addmusic" component={AddMusicPage}/>
                    <PrivateAdminRoute path="/addartist" component={AddArtistPage}/>
                    <PrivateAdminRoute path="/restore-artists" component={RestoreArtist}/>
                    <PrivateRoute path="/" component={Home}/>
                </Switch>
            </Router>
    )
}

export default Routes
