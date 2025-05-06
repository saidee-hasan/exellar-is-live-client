import {
  createUserWithEmailAndPassword,
 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth/cordova";


import React, { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase.init";
import useAxiosPublic from "../hooks/useAxiosPublic";
export const AuthContext = createContext(null);


function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);
const axiosPublic = useAxiosPublic();
  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password);
  
  };
  const loginUser = async (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password);
  };
 




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    
        console.log("Currently logged in User:", currentUser);
        setUser(currentUser)
     setLoading(false)


     if(currentUser){
      // get token store  client
      const userInfo = {email : currentUser.email}
      axiosPublic.post('/jwt',userInfo)
      .then(res=>{
        if(res.data.token){
          localStorage.setItem('access-Token',res.data.token)
        }
      })
      
      
            }else{
              //  TODp :Remove Token (if token strod cliend side )
      
              localStorage.removeItem('access-Token')
            }
     
    });

    // Cleanup function to unsubscribe from the listener

    return () => {
      unsubscribe();
    };
  }, [auth]);
const signOutUser = ()=>{
  setLoading(true)
  return signOut(auth)
}

  const authInfo = {
    createUser,
    loginUser,
    user,
    signOutUser,
    loading
   
  
  };
  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
}

export default AuthProvider;
