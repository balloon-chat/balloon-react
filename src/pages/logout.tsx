import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';
import { rootPath } from 'src/view/route/pagePath';
import { useDispatch } from 'react-redux';
import { setUserId } from 'src/data/redux/user/slice';
import { LoadDialog } from 'src/components/common/LoadDialog';

// tslint:disable-next-line:variable-name
const LogoutPage = () => {
  const router = useRouter();
  const dispatcher = useDispatch();

  useEffect(() => {
    firebase.auth().signOut().then();
    dispatcher(setUserId(null));
    router.push(rootPath.index).then();
  },        []);

  return (<LoadDialog message={'ログアウト中...'}/>);
};

export default LogoutPage;
