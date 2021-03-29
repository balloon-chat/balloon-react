import React, { useEffect, useState } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import styled from 'styled-components';
import { TopicContainer } from 'src/pages/topics';
import { ContainerCard } from 'src/components/topic/ContainerCard';
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

type Props = {
  user: UserEntity | null
  createdByUser: TopicEntity[]
}

const ProfilePage = ({ createdByUser, user }: Props) => {
  const { id } = useRouter().query;
  const { uid } = useUserSelector();

  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    setIsCurrentUser(uid === id);
  }, [id]);

  return (
    <>
      <NavBar />
      <TopicContainer>
        <ContainerCard>
          <Container>
            {
              user && <UserProfile {...user} />
            }
            <TopicListContainer>
              <CreatedTopicsTitle>作成した話題</CreatedTopicsTitle>
              {
                createdByUser.length !== 0
                  ? <NoCreatedTopic isCurrentUser={isCurrentUser} />
                  : <TopicList topics={createdByUser} />
              }
            </TopicListContainer>
          </Container>
        </ContainerCard>
      </TopicContainer>
      <BottomNavigation currentLocation="my-profile" />
    </>
  );
};

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
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
  const emptyResult = { props: { user: null, createdByUser: [] } };

  const { id } = context.query;
  if (typeof id !== 'string') return emptyResult;

  const userService = new UserService();
  const user = await userService.getUser(id);
  if (!user) return emptyResult;

  const topicService = new TopicService();
  const topics = await topicService.fetchTopicsCreatedBy(id);
  return {
    props: {
      user,
      createdByUser: topics.map((topic) => TopicEntityFactory.create(topic)),
    },
  } as const;
};

export default ProfilePage;
