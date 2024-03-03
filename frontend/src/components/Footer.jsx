import React from 'react'
import {useTheme} from '../contexts/theme.jsx'
function Footer() {
  const {theme, changeThemeDark, changeThemeLight} = useTheme();
  return (
    <div 
    className={
      `${(theme==='black')? 'bg-gradient-to-b from-black to-white':'bg-black'}
       ${(theme==='black')?'text-black':'text-white'}
       flex flex-col justify-center items-center p-5 min-h-32 gap-2`
       }>
      <h1 className='w-fit h-fit '>Made from React</h1>
      <div className={` rounded-full border-2 w-full flex flex-row justify-center items-center ${(theme==='black')? "border-black" : "border-white"} `}>
        here will be icons 
      </div>
      </div>
  )
}

export default Footer