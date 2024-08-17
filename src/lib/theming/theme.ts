import { grey } from '@mui/material/colors';
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const dividerColor = "rgba(180, 248, 176, 0.16)"

const darkTheme:ThemeOptions = {
    palette:{
        mode:"dark",
        primary:{
            main:"#70f071",
            light: '#b4f8b0',
            dark: '#00af37',
            contrastText: '#000',
        },
        divider: dividerColor
}}

const lightTheme:ThemeOptions = {
    palette:{
        mode:"light",
        primary:{
            main:"#70f071",
            light: '#b4f8b0',
            dark: '#00af37',
            contrastText: '#000',
        },
        background: {
            default: '#f5f5f5',
            paper: '#fafafa',
        },
        divider: grey[500]
}}

const useTheme = () => {
    const themes = {
        "light": lightTheme,
        "dark": darkTheme
    }

    const [theme, setTheme] = useState<Theme>(createTheme(themes.dark))
    const mode = theme.palette.mode
    const switchTheme = () => {
        const newModeLPaletteMode = mode === 'dark' ? 'light' : 'dark'
        setTheme(createTheme(themes[newModeLPaletteMode]))
    }
    useEffect(()=>{
    }, [theme])
    return {theme, switchTheme}
}

export {useTheme};