import React, { useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import { useTheme } from '../contexts/theme.jsx'

function Nav() {
  const {theme, changeThemeLight, changeThemeDark} = useTheme();
  

  return (
    <nav id='navbar' className={`flex  ${(theme==='black')? 'shadow-[4px_4px_16px_white]':'shadow-[4px_4px_16px_black]'}  flex-row items-center justify-center ${(theme==='black')? 'bg-black':'bg-white'} h-10`} >
        <h3 className={`w-1/5 m-3 ${(theme==='black')?'text-white':'text-black'} `}>
            Game
        </h3>
        <NavLink className={`w-1/5 m-3 ${(theme==='black')?'text-white':'text-black'} `} to='/'>
          Home 
        </NavLink>
        <NavLink className={`w-1/5 m-3 ${(theme==='black')?'text-white':'text-black'} `} to='/about'>
          About 
        </NavLink>
        <NavLink className={`w-1/5 m-3 ${(theme==='black')?'text-white':'text-black'} `} to='/play'>
          Play
        </NavLink>
        <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" checked={theme==='black'}
        onChange={()=>{
          (theme==='black'? changeThemeLight():changeThemeDark())
        }} 
        className="sr-only peer"/>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
    </nav>
  )
}

export default Nav