import React, { useEffect, useState } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import styled from 'styled-components';
import { UserProfile } from 'src/components/profile/UserProfile';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { GetServerSideProps } from 'next';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicList } from 'src/components/topic/TopicList';
import { NoCreatedTopic } from 'src/components/profile/NoCreatedTopic';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';
import { UserService } from 'src/domain/user/service/userService';
import { UserEntity } from 'src/view/types/user';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import Head from 'next/head';
import { AuthService, AuthStates } from 'src/domain/auth/service/AuthService';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from 'src/data/redux/user/action';

type Props = {
  user: UserEntity | null
  userTopics: TopicEntity[],
  loginRequired: boolean,
}

const ProfilePage = ({
  userTopics,
  user,
  loginRequired,
}: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { id } = useRouter().query;
  const { uid } = useUserSelector();

  // 本人のページ
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    setIsCurrentUser(uid === id);
  }, [uid, id]);

  if (loginRequired) {
    router.push(rootPath.login, {
      query: { return_to: router.asPath },
    }).then();
    return <></>;
  }

  const logout = async () => {
    router.push(rootPath.index).then();
    dispatcher(logoutAction({}));
  };

  return (
    <>
      <Head>
        <title>{pageTitle.users.profile(user?.name ?? '')}</title>
      </Head>
      <NavBar>
        {user && (
          <UserProfileContainer>
            <UserProfile {...user} />
            {
              isCurrentUser && (
                <UserActionContainer>
                  <li>
                    <button type="button" onClick={() => logout()}>ログアウト</button>
                  </li>
                  <li>
                    <button type="button" onClick={() => router.push(rootPath.settings.profile)}>
                      プロフィール編集
                    </button>
                  </li>
                </UserActionContainer>
              )
            }
          </UserProfileContainer>
        )}
      </NavBar>
      <Container>
        <InnerBody>
          <TopicListContainer>
            <CreatedTopicsTitle>
              {user?.name ? `${user.name} が作成した話題` : '作成した話題'}
            </CreatedTopicsTitle>
            {
              userTopics.length === 0
                ? <NoCreatedTopic isCurrentUser={isCurrentUser} />
                : <TopicList topics={userTopics} />
            }
          </TopicListContainer>
        </InnerBody>
      </Container>
      <BottomNavigation />
    </>
  );
};

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 32px 16px;
`;

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  background-color: #caeaeb;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
  min-height: 100%;
`;

const InnerBody = styled.div`
  margin: 32px auto;
  max-width: 1050px;
  width: 100%;
`;

const CreatedTopicsTitle = styled.h2`
  margin: 16px 0 32px;
`;

const TopicListContainer = styled.div`
  box-sizing: border-box;
  margin-top: 16px;
  width: 100%;
`;

const UserActionContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;

  & > li {
    cursor: pointer;
    margin-top: 8px;
  }

  & > li:first-child {
    margin-top: 0;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    flex-direction: row;
    justify-content: center;
    & > li {
      margin: 0 8px;
    }
  }
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const emptyResult = {
    props: {
      user: null,
      userTopics: [],
      loginRequired: false,
    },
  };

  const { id } = context.query;
  if (typeof id !== 'string') return emptyResult;

  const userService = new UserService();
  const user = await userService.getUser(id);
  if (!user) return emptyResult;

  const authService = new AuthService();
  const result = await authService.getUserInfo(context.req.headers.cookie);
  const {
    loginId,
    state,
  } = result;
  if (state === AuthStates.TIMEOUT) {
    return {
      props: {
        user: null,
        userTopics: [],
        loginRequired: true,
      },
    };
  }

  const topicService = new TopicService();
  const topics = await topicService.fetchTopicsCreatedBy(id, loginId);
  return {
    props: {
      user,
      userTopics: topics.map((topic) => TopicEntityFactory.create(topic)),
      loginRequired: false,
    },
  } as const;
};

export default ProfilePage;
