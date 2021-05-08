import { pageTitle, rootPath } from 'src/view/route/pagePath';
import Head from 'next/head';
import React from 'react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { NavBar } from 'src/components/navbar/NavBar';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import styled from 'styled-components';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';
import { EditProfile } from 'src/components/profile/EditProfile';

type Props = {
  loginId: string | null,
  user: UserEntity|null,
};

const ProfileSettingPage = ({ loginId, user }: Props) => {
  const router = useRouter();

  if (!loginId || !user) {
    router.replace({
      path: rootPath.login,
      query: {
        return_to: rootPath.settings.profile,
      },
    }).then();
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{pageTitle.settings.profile}</title>
      </Head>
      <NavBar />
      <Wrapper>
        <h1>プロフィールを編集</h1>
        <EditProfile user={user} loginId={loginId} />
      </Wrapper>
      <BottomNavigation />
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 32px;
  max-width: 750px;
  height: 100%;
  
  & > h1 {
    margin-bottom: 32px;
  }
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const emptyResult: GetServerSidePropsResult<Props> = {
    props: { loginId: null, user: null },
  };
  const authService = new AuthService();
  const { loginId } = await authService.getUserInfo(context.req.headers.cookie);
  if (!loginId) return emptyResult;

  const userService = new UserService();
  const user = await userService.getUserByLoginId(loginId);
  if (!user) return emptyResult;

  return {
    props: {
      loginId,
      user,
    },
  };
};

export default ProfileSettingPage;
