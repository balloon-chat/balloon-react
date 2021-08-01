import React, { useEffect, useState } from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';
import { login } from 'src/data/redux/user/action';
import { isInnerPath, pageTitle, rootPath } from 'src/view/route/pagePath';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { LoginStates } from 'src/data/redux/user/state';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { ErrorDialog } from 'src/components/common/ErrorDialog';
import { NavBar } from 'src/components/navbar/NavBar';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';

type Props = {
  accessToken: string | null,
  newUser: boolean | null,
  authorized: boolean,
}

const LoginPage = ({ accessToken, authorized, newUser }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;

  const [dialogMessage, setDialogMessage] = useState<string|null>(null);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const { loginState } = useUserSelector();

  useEffect(() => {
    if (authorized && accessToken && newUser) {
      router.push(rootPath.signIn).then();
    } else if (accessToken) {
      loginFirebase().then();
    }
  }, []);

  useEffect(() => {
    switch (loginState) {
      case LoginStates.LOGGED_IN:
        redirect(); // ログイン完了後、元いたページへリダイレクトする。
        break;
      case LoginStates.FINDING:
        setDialogMessage('ユーザー情報を確認しています。');
        break;
      case LoginStates.CREATING:
        setDialogMessage('ユーザー情報を登録しています。');
        break;
      case LoginStates.LOGIN_ERROR:
        setErrorMessage('ログイン中にエラーが発生しました。');
        break;
      default:
        break;
    }

    return () => {
      setErrorMessage(null);
      setDialogMessage(null);
    };
  }, [loginState]);

  const redirect = () => {
    let destination = rootPath.index;
    if (typeof return_to === 'string' && isInnerPath(destination, process.env.HOST_NAME!)) destination = return_to;
    router.push(destination).then();
  };

  const loginFirebase = async () => {
    if (!accessToken) return;

    dispatcher(login({ accessToken }));

    if (
      typeof return_to === 'string'
      && return_to
      && process.env.HOST_NAME
      && isInnerPath(return_to, process.env.HOST_NAME)
    ) {
      await router.push(return_to);
    } else {
      await router.push(rootPath.index);
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitle.login}</title>
      </Head>
      {
        dialogMessage && <LoadDialog message={dialogMessage} />
      }
      {
        errorMessage && (<ErrorDialog message={errorMessage} onClose={() => router.reload()} />)
      }
      <Wrapper>
        <NavBar />
        <Container>
          <LoginDialog />
        </Container>
        <BottomNavigation />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  height: 100%;
`;

const Container = styled.div`
  align-items: center;
  background-color: #aee1e1;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, query }) => {
  const service = new AuthService();

  // すでにログインしていた場合は、元いたページへリダイレクトする。
  const profile = await service.getUserProfile(req.headers.cookie);
  if (profile !== null) {
    // return_to で遷移先を指定されていたら、その場所へ遷移する。
    let destination = rootPath.index;
    const { return_to } = query;
    if (typeof return_to === 'string' && isInnerPath(destination, process.env.HOST_NAME!)) destination = return_to;
    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  const result = await service.getOauthResult(req.headers.cookie);
  return { props: result };
};

export default LoginPage;
