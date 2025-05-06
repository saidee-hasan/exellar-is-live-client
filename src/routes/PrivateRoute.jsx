import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../pages/Loading';

const PrivateRoute = ({children}) => {
    const location = useLocation()
    const{loading,user} = useContext(AuthContext);
    if(loading){
        return <Loading/>
    }
    if(!user){
       return <Navigate state={location.pathname}to='/auth/login' replace />
    }
    return children
};

export default PrivateRoute;