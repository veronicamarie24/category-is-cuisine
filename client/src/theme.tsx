import { PaletteColor, PaletteColorOptions, createTheme } from '@mui/material/styles';

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customBackground: PaletteColor;
  }
  interface PaletteOptions {
    customBackground: PaletteColorOptions;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      light: '#C5CBE3',
      main: '#4056A1',
      dark: '#2a3b7f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#daae2c',
      main: '#D79922',
      dark: '#d17211',
      contrastText: '#000',
    },
    customBackground: {
      main: '#EFE2BA',
      light: '#f8f4e4'
    }
  },
});