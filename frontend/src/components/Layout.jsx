import React, { lazy, Suspense, useRef } from 'react'
import Nav from './Nav.jsx'
import {useTheme} from '../contexts/theme.jsx'

const Footer = lazy(()=>import('./Footer.jsx'))
function Layout({children}) {
  const {theme, changeThemeDark, changeThemeLight} = useTheme();
  return (
  <>
    <div className={`h-auto min-h-screen flex flex-col gap-y-10 ${(theme==='black')? 'bg-black':'bg-white'}  `}>
    <Nav/>
    <div className='flex flex-col justify-center items-center'>
    <main className={`w-full flex justify-center items-center min-h-screen ${(theme==='black')?'text-white':'text-black'}`}>{children}</main>
    <Suspense fallback={<div>Loading...</div>} >
    <footer className='w-full  '>
      <Footer/>
    </footer>
    </Suspense> 
    </div>
    </div>
    
  </>
   )
}

export default Layout