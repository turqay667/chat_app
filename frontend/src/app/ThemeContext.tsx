"use client"
import { createContext, ReactNode, useState } from "react";
type Theme ='light' | 'dark'
export type ThemeContextType={
theme:Theme,
handleTheme:()=>void
}

export const ThemeContext=createContext<ThemeContextType>({
    theme: 'light',
    handleTheme: () =>{}
})
type ThemeProps={
children?:ReactNode
}
const ThemeProvider=({children}:ThemeProps)=>{
const [theme,setTheme]=useState<Theme>('light');
const handleTheme=()=>{
const newTheme=theme==='light' ? 'dark' : 'light';
setTheme(newTheme)
}
return(
        <ThemeContext.Provider value={{theme, handleTheme}}>
            {children}
        </ThemeContext.Provider>    
        )
}
export default ThemeProvider;