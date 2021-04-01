import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { useDispatch } from 'react-redux';
import { logout } from 'src/data/redux/user/slice';
import { LoadDialog } from 'src/components/common/LoadDialog';
import Head from 'next/head';

const LogoutPage = () => {
  const router = useRouter();
  const dispatcher = useDispatch();

  useEffect(() => {
    firebase.auth().signOut().then();
    dispatcher(logout({}));
    router.push(rootPath.index).then();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle.logout}</title>
      </Head>
      <LoadDialog message="ログアウト中..." />
    </>
  );
};

export default LogoutPage;
