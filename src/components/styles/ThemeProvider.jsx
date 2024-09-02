import React from 'react';
import { createTheme, ThemeProvider as ThemeProviderMui } from '@mui/material';

const palette = {
  primary: {
    main: 'rgb(1, 212, 207)',
  },
  secondary: {
    main: 'rgb(255, 107, 107)',
  },
};

const ThemeProvider = ({ children }) => {
  return (
    <ThemeProviderMui
      theme={createTheme({
        palette: {
          ...palette,
        },
        typography: {
          fontFamily: 'Poppins, sans-serif',
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: 'transparent',
                padding: '1rem 0',
              },
            },
            defaultProps: {
              elevation: 0,
            },
          },
          MuiButtonBase: {
            defaultProps: {
              disableRipple: true,
              disableTouchRipple: true,
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                borderRadius: '2rem',
                padding: '0.5rem 2rem',
                fontWeight: '500',
                textTransform: 'none',
                fontSize: '1rem',
              },
              outlined: {
                borderColor: palette.secondary.main,
                color: palette.secondary.main,
              },
            },
          },
        },
      })}
    >
      {children}
    </ThemeProviderMui>
  );
};

export default ThemeProvider;
