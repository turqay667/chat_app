import { createContext, useState } from "react";
export const ThemeContext=createContext('light')
const ThemeProvider=(props)=>{
const [theme,setTheme]=useState('light');
const handleTheme=()=>{
const newTheme=theme==='light' ? 'dark' : 'light';
setTheme(newTheme)
}
return(

        <ThemeContext.Provider value={{theme, handleTheme}}>
            {props.children}
            </ThemeContext.Provider>
    
)
}
export default ThemeProvider;