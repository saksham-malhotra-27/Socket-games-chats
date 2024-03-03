import React, { useRef, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { useTheme } from '../contexts/theme.jsx';
import { NavLink } from 'react-router-dom';
function Home() {
  const { theme, changeLightTheme, changeDarktheme } = useTheme();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      const blueBall = document.querySelector('#blue');
      const redBall = document.querySelector('#red');

      setTimeout(() => {
        blueBall.classList.add('animate-blue-ball');
        redBall.classList.add('animate-red-ball');
      }, 500);

     
      isMounted.current = true;
    }
  }, []);

 

  return (
    <>
      <Layout>
        <div className='flex flex-col items-center gap-y-10 md:gap-y-20'>
          <div className='flex flex-col items-center gap-3'>
            <h1 className='italic text-2xl md:text-4xl'>
              Hello! this is the PlayGround
            </h1>
            <div className='flex flex-row gap-5 md:gap-10'>
              <div 
                id='blue'
                className=' w-10 h-10 md:w-20 md:h-20 bg-blue-500 rounded-full'
                ></div>
              <div
                id='red' 
                className='w-10 h-10 md:w-20 md:h-20 bg-red-500 rounded-full'
                ></div>
            </div>
          </div>
          <div className='flex gap-10 sm:flex-row flex-col'>
              <NavLink to='/play#tic' className={` text-center hover:bg-green-500  bg-red-500 p-4 h-fit w-40 rounded-md ${(theme==='black')?"text-white":"text-black"}`}>
                Tic-Tac-Toe
              </NavLink>
              {/*<NavLink to='/play#ludo' className={` sm:text-center  bg-blue-500 hover:bg-green-500  p-4 h-fit w-40 rounded-md ${(theme==='black')?"text-white":"text-black"}`}>
                Ludo
  </NavLink>*/}
          </div>
          <p id='text'>
            ~ By Saksham Malhotra
          </p>
        </div>
      </Layout>
    </>
  );
}

export default Home;
