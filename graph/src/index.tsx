import ReactDOM from 'react-dom/client';
import App from './App';

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { LIGHT_THEME } from '@admiral-ds/react-ui';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StyledThemeProvider theme={LIGHT_THEME}>
    <App />
  </StyledThemeProvider>
);

