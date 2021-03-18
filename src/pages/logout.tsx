import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';
import { rootPath } from 'src/pages/pagePath';
import { useDispatch } from 'react-redux';
import { setUserId } from 'src/data/redux/user/slice';

// tslint:disable-next-line:variable-name
const LogoutPage = () => {
  const router = useRouter();
  const dispatcher = useDispatch();

  useEffect(() => {
    firebase.auth().signOut().then();
    dispatcher(setUserId(null));
    router.push(rootPath.index).then();
  },        []);

  return (<></>);
};

export default LogoutPage;
