import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'src/data/redux/store';

// tslint:disable-next-line:variable-name
const App = ({ Component, pageProps }: AppProps) => {
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
