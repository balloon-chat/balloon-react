import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';
import { rootPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    firebase.auth().signOut().then(() => {
      router.push(rootPath.index).then();
    });
  },        []);

  return (<></>);
};

export default LogoutPage;
