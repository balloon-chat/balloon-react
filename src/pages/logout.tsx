import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { useDispatch } from 'react-redux';
import { LoadDialog } from 'src/components/common/LoadDialog';
import Head from 'next/head';
import { logout } from 'src/data/redux/user/action';
import { useUserSelector } from 'src/data/redux/user/selector';
import styled from 'styled-components';
import { Button } from 'src/components/common/Button';
import { Dialog } from 'src/components/common/Dialog';
import { resetUserState } from 'src/data/redux/user/slice';
import { LoginStates } from 'src/data/redux/user/state';

const LogoutPage = () => {
  const router = useRouter();
  const dispatcher = useDispatch();
  const { loginState } = useUserSelector();

  useEffect(() => {
    dispatcher(logout());
  }, []);

  useEffect(() => {
    if (loginState === LoginStates.NOT_LOGGED_IN) router.push(rootPath.index).then();
  }, [loginState]);

  const resetLoginState = () => {
    dispatcher(resetUserState());
  };

  return (
    <>
      <Head>
        <title>{pageTitle.logout}</title>
      </Head>
      {
        loginState === LoginStates.LOGGED_IN && <LoadDialog message="ログアウト中..." />
      }
      {
        loginState === LoginStates.LOGOUT_ERROR && (
        <Dialog onClose={resetLoginState}>
          <ErrorDialogContainer>
            <div>ログアウト中にエラーが発生しました。</div>
            <Button onClick={resetLoginState}>閉じる</Button>
          </ErrorDialogContainer>
        </Dialog>
        )
      }
    </>
  );
};

const ErrorDialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  & ${Button} {
    margin-top: 32px;
  }
`;

export default LogoutPage;
