import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { UserService } from 'src/domain/user/service/userService';
import Head from 'next/head';
import { pageTitle } from 'src/view/route/pagePath';
import { NavBar } from 'src/components/navbar/NavBar';
import { NavLocations } from 'src/view/types/navigation';
import { ContainerCard } from 'src/components/common/ContainerCard';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import React from 'react';
import styled from 'styled-components';
import { ErrorPage } from 'src/components/common/ErrorPage';

type Props = {
  topic: TopicEntity | null,
  isEditable: boolean,
}

export const EditTopicPage = ({ topic, isEditable }: Props) => (
  <>
    <Head>
      <title>{pageTitle.topics.create}</title>
    </Head>
    <NavBar />
    {
        isEditable
          ? (
            <Body>
              <ContainerCard>
                <EditTopic topic={topic} />
              </ContainerCard>
            </Body>
          )
          : (
            <ErrorPage message="この話題は編集できません" detail="作成者のみが編集できます" />
          )
      }
    <BottomNavigation currentLocation={NavLocations.CREATE_TOPIC} />
  </>
);

const Body = styled.div`
  box-sizing: border-box;
  background-color: #aee1e1;
  width: 100%;
  padding-top: 16px;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const emptyResult: GetServerSidePropsResult<Props> = {
    props: {
      topic: null,
      isEditable: false,
    },
  };

  const { id } = context.query;
  if (typeof id !== 'string') {
    return emptyResult;
  }
  const topicService = new TopicService();
  const topic = await topicService.fetchTopic(id);
  if (!topic) return emptyResult;

  const authService = new AuthService();
  const { loginId } = await authService.getUserInfo(context.req.headers.cookie);
  if (!loginId) return emptyResult;

  const userService = new UserService();
  const user = userService.getUserByLoginId(loginId);
  if (!user) return emptyResult;

  return {
    props: {
      topic: TopicEntityFactory.create(topic),
      isEditable: true, // ユーザーが話題の作成者だったときのみ、編集可能
    },
  };
};

export default EditTopicPage;
