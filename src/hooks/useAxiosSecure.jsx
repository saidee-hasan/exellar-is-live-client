import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { AuthContext } from "../provider/AuthProvider";

export const axiosSecure = axios.create({
  baseURL: "https://exellar.vercel.app", // Replace with your actual backend URL
});

function useAxiosSecure() {
  const navigate = useNavigate();
  const { user, signOutUser } = useContext(AuthContext);

  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-Token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (err) => {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          await signOutUser();
          navigate("/login");
        }
        return Promise.reject(err);
      }
    );

    // Cleanup function to eject interceptors when the component unmounts
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, signOutUser]);

  return axiosSecure;
}

export default useAxiosSecure;
