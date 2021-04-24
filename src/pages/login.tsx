import React, { useEffect } from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';
import { login, logout } from 'src/data/redux/user/action';
import { isInnerPath, pageTitle, rootPath } from 'src/view/route/pagePath';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { LoginStates } from 'src/data/redux/user/state';
import Head from 'next/head';
import { Dialog } from 'src/components/common/Dialog';
import { Button } from 'src/components/common/Button';
import { GetServerSideProps } from 'next';
import { AuthService } from 'src/domain/auth/service/AuthService';

type Props = {
  accessToken: string | null,
  newUser: boolean | null,
  authorized: boolean,
}

const LoginPage = ({ accessToken, authorized, newUser }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;
  const { loginState } = useUserSelector();

  useEffect(() => {
    if (authorized && accessToken && newUser) {
      router.push(rootPath.signIn).then();
    } else if (accessToken) {
      loginFirebase().then();
    }
  }, []);

  const loginFirebase = async () => {
    if (!accessToken) return;

    dispatcher(login({ accessToken }));

    if (return_to && typeof return_to === 'string' && isInnerPath(return_to)) {
      await router.push(return_to);
    } else {
      await router.push(rootPath.index);
    }
  };

  const resetLoginPageState = () => {
    dispatcher(logout());
  };

  return (
    <>
      <Head>
        <title>{pageTitle.login}</title>
      </Head>
      {
        loginState === LoginStates.FINDING && (
          <LoadDialog message="ユーザー情報を確認しています。" />
        )
      }
      {
        loginState === LoginStates.CREATING && (
          <LoadDialog message="ユーザー情報を登録しています。" />
        )
      }
      {
        loginState === LoginStates.LOGIN_ERROR && (
          <Dialog onClose={resetLoginPageState}>
            <ErrorDialogContainer>
              <div>ログイン中にエラーが発生しました。</div>
              <Button onClick={resetLoginPageState}>閉じる</Button>
            </ErrorDialogContainer>
          </Dialog>
        )
      }
      <Container>
        <LoginDialog />
      </Container>
    </>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: #aee1e1;
  display: flex;
  height: 100%;
  justify-content: center;
`;

const ErrorDialogContainer = styled.div`
  display: flex;
  flex-direction: column;

  & ${Button} {
    margin-top: 32px;
  }
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new AuthService();
  try {
    const result = await service.getOauthResult(context.req.headers.cookie);
    return { props: result };
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      accessToken: null,
      newUser: null,
      authorized: false,
    },
  };
};

export default LoginPage;
