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
import { GetServerSideProps } from 'next';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { ErrorDialog } from 'src/components/common/ErrorDialog';
import { NavBar } from 'src/components/navbar/NavBar';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { NavLocations } from 'src/view/types/navigation';

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
          <ErrorDialog
            message="ログイン中にエラーが発生しました。"
            onClose={resetLoginPageState}
          />
        )
      }
      <Wrapper>
        <NavBar currentLocation={NavLocations.LOGIN} />
        <Container>
          <LoginDialog />
        </Container>
        <BottomNavigation currentLocation={NavLocations.LOGIN} />
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new AuthService();
  const result = await service.getOauthResult(context.req.headers.cookie);
  return { props: result };
};

export default LoginPage;
