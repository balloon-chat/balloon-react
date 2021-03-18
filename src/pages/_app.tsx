import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'src/data/redux/store';
import { initializeFirebase } from 'src/data/firebase';
import { AuthProvider } from 'src/components/login/AuthProvider';

// tslint:disable-next-line:variable-name
const App = ({ Component, pageProps }: AppProps) => {
  return (<>
    <style jsx global>{`
      html, body, #__next {
        height: 100%;
        margin: 0;
        padding: 0;
        min-width: 370px;
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }

      a:hover {
        cursor: pointer;
      }

      body {
        color: #323232;
      }

      ol, ul {
        list-style: none;
      }
    `}</style>
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  </>);
};

// initialize app before render
initializeFirebase();

export default App;
