import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    // Padrões do Material-UI v4 que o layout assume.
    MuiFormControl: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          bottom: -18,
          position: 'absolute',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: ({ ownerState }) => ({
          fontWeight: 'bold',
          ...(ownerState.multiline && { padding: '2px 0' }),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3bd2da',
            borderWidth: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: 15,
          fontWeight: 'bold',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#6a6a6a',
          fontSize: 12,
          fontWeight: 'bold',
          '&.Mui-selected': {
            color: '#008080',
          },
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        indicatorColor: 'secondary',
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: 13,
          fontWeight: 600,
          lineHeight: '18px',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#252525',
    },
    secondary: {
      main: '#6a6a6a',
    },
    error: {
      main: '#fa403c',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 16,
  },
});

export default theme;
