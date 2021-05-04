import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'src/data/redux/store';
import { initializeFirebase } from 'src/data/firebase';
import { AuthProvider } from 'src/components/login/AuthProvider';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <style jsx global>
      {`
        html {
          font-family: Helvetica, Hiragino Kaku Gothic Pro, Segoe UI, Yu Gothic, Meiryo, MS PGothic, sans-serif;
        }

        button {
          border-style: none;
          background-color: transparent;
          font-size: inherit;
        }

        button:focus {
          outline: none;
        }

        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          min-width: 370px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        a:hover {
          cursor: pointer;
        }

        body {
          color: #323232;
        }

        ol,
        ul {
          list-style: none;
        }
      `}
    </style>
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  </>
);

// initialize app before render
initializeFirebase();

export default App;
