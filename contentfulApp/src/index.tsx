import { GlobalStyles } from '@contentful/f36-components';
import { SDKProvider } from '@contentful/react-apps-toolkit';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'contentful-auto-ui/app/css/_variables.css'
import { createRoot } from 'react-dom/client';
import App from './App';
import LocalhostWarning from './components/LocalhostWarning';
import 'contentful-auto-ui/web-comps/cui-button/cui-button';
import 'contentful-auto-ui/web-comps/cui-color-doc/cui-color-doc';

const container = document.getElementById('root')!;
const root = createRoot(container);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['cui-button']: any;
    }
  }
}

if (process.env.NODE_ENV === 'development' && window.self === window.top) {
  // You can remove this if block before deploying your app
  root.render(<LocalhostWarning />);
} else {
  root.render(
    <SDKProvider>
      <GlobalStyles />
      <App />
    </SDKProvider>
  );
}
