import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from 'src/data/redux/store';
import { initializeFirebase } from 'src/data/firebase';

// tslint:disable-next-line:variable-name
const App = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    initializeFirebase();
  },        []);

  return (<>
    <style jsx global>{`
      html, body, #__next {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    `}</style>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>);
};

export default App;
