import React, { useEffect } from 'react';
import Home from '../pages/Home';


const MainLayout = () => {
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.documentElement.classList.add(theme); // Add saved theme class
        }
      }, []);
    return (
    <>
        <Home></Home>
    </>
    );
};

export default MainLayout;