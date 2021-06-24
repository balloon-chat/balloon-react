import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'src/data/redux/store';
import { initializeFirebase } from 'src/data/firebase';
import { AuthProvider } from 'src/components/login/AuthProvider';
import Head from 'next/head';
import { pageTitle } from 'src/view/route/pagePath';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#2d89ef" />
      <meta name="theme-color" content="#ffffff" />
      <title>{pageTitle.index}</title>
    </Head>
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

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.error = () => {};
  console.dir = () => {};
}

export default App;
