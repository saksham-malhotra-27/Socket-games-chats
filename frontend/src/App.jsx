import './App.css';
import React, { lazy, Suspense, useRef , useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Fall from './components/Fall.jsx';
import { themeProvider as ThemeProvider } from './contexts/theme.jsx';
const Home = lazy(()=>import ('./pages/Home.jsx'))
const About = lazy(()=>import('./pages/About.jsx'))
const Play = lazy(()=>import('./pages/Play.jsx'))


export default function App() {
  const [theme, setTheme] = useState('white')
  const changeThemeLight = ()=>{setTheme('white')}
  const changeThemeDark = ()=>{setTheme('black')}
  
  return (
    <ThemeProvider value={{theme, changeThemeLight, changeThemeDark}}>
    <BrowserRouter>
      <Suspense fallback={<Fall/>}>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/play'  element={<Play/>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
    </ThemeProvider>
  );
}
