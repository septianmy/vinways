import {Route, Redirect} from 'react-router-dom';
import {useContext} from 'react';
import {AppContext} from "../../context/appContext";

const PrivateAdminRoute = ({component: Component, ...rest}) => {
    const [state] = useContext(AppContext);
    const { isLogin, isLoading, user } = state;

    return (
        <Route 
            {...rest}
            render={(props) =>
                isLoading ? ( <h1>Loading ...</h1> ) :
                isLogin && user.role === 0 ? ( <Component {...props} /> ) : 
                isLogin && user.role !== 0 ? ( <Redirect to="/"/>) : 
                ( <Redirect to="/login"/> )
            }
        />
    );
};

export default PrivateAdminRoute;