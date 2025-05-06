import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { Navigate, useLocation} from 'react-router-dom';
import Loading from '../pages/Loading';

const PublicRoute = ({children}) => {
    const location = useLocation();
    const { user, loading} = useContext(AuthContext);
    if(loading){
        return <Loading/>
    }
    if(user){
        return <Navigate to={location.state?location.state:'/'} replace />;
    }
    return children
};

export default PublicRoute;