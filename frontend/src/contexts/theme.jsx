import React, { useContext } from 'react';

export const themeContext = React.createContext({
    theme:'black',
    changeThemeLight: ()=>{},
    changeThemeDark: ()=>{},
})

export const themeProvider = themeContext.Provider;

export const useTheme = ()=> useContext(themeContext)
