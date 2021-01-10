import {Route, Redirect} from 'react-router-dom';
import {useContext} from 'react';
import {AppContext} from "../../context/appContext";

const PrivateRoute = ({component: Component, ...rest}) => {
    const [state] = useContext(AppContext);
    const { isLogin, isLoading } = state;

    return (
        <Route 
            {...rest}
            render={(props) =>
                isLoading ? ( <h1>Loading ...</h1> ) :
                isLogin ? ( <Component {...props} /> ) : ( <Redirect to="/login"/> )
            }
        />
    );
};

export default PrivateRoute;