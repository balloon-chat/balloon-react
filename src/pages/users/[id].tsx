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
import { pageTitle } from 'src/view/route/pagePath';
import Head from 'next/head';
import { AuthService } from 'src/domain/auth/service/AuthService';

type Props = {
  user: UserEntity | null
  createdByUser: TopicEntity[]
}

const ProfilePage = ({
  createdByUser,
  user,
}: Props) => {
  const { id } = useRouter().query;
  const { uid } = useUserSelector();

  // 本人のページ
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    setIsCurrentUser(uid === id);
  }, [id]);

  return (
    <>
      <Head>
        <title>{pageTitle.users.profile(user?.name ?? '')}</title>
      </Head>
      <NavBar />
      {user && (
        <UserProfileContainer>
          <UserProfile {...user} />
        </UserProfileContainer>
      )}
      <Container>
        <InnerBody>
          <TopicListContainer>
            <CreatedTopicsTitle>
              {user?.name ? `${user.name} が作成した話題` : '作成した話題'}
            </CreatedTopicsTitle>
            {
              createdByUser.length === 0
                ? <NoCreatedTopic isCurrentUser={isCurrentUser} />
                : <TopicList topics={createdByUser} />
            }
          </TopicListContainer>
        </InnerBody>
      </Container>
      <BottomNavigation currentLocation="my-profile" />
    </>
  );
};

const UserProfileContainer = styled.div`
  background-color: white;
  margin: 32px auto;
  max-width: 1050px;
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const emptyResult = {
    props: {
      user: null,
      createdByUser: [],
    },
  };

  const { id } = context.query;
  if (typeof id !== 'string') return emptyResult;

  const userService = new UserService();
  const user = await userService.getUser(id);
  if (!user) return emptyResult;

  let loginId: string|undefined;
  try {
    const authService = new AuthService();
    const result = await authService.getUserInfo(context.req.headers.cookie);
    loginId = result.loginId;
  } catch (e) {
    console.error(e);
  }

  const topicService = new TopicService();
  const topics = await topicService.fetchTopicsCreatedBy(id, loginId);
  return {
    props: {
      user,
      createdByUser: topics.map((topic) => TopicEntityFactory.create(topic)),
    },
  } as const;
};

export default ProfilePage;
