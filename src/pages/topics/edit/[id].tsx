import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { AuthService } from 'src/domain/auth/service/AuthService';
import Head from 'next/head';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { NavBar } from 'src/components/navbar/NavBar';
import { ContainerCard } from 'src/components/common/ContainerCard';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ErrorPage } from 'src/components/common/ErrorPage';
import { editTopic, finishEditTopic } from 'src/data/redux/topic/slice';
import { useDispatch } from 'react-redux';
import { EditTopicModes } from 'src/data/redux/topic/state';
import { requireLogin } from 'src/view/lib/requireLogin';

type Props = {
  topic: TopicEntity | null,
  isEditable: boolean,
}

export const EditTopicPage = ({ topic, isEditable }: Props) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    if (topic) dispatcher(editTopic({ mode: EditTopicModes.UPDATE, topic }));

    return () => {
      dispatcher(finishEditTopic());
    };
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle.topics.edit}</title>
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
      <BottomNavigation />
    </>
  );
};

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

  // クエリの検証
  const { id } = context.query;
  if (typeof id !== 'string') return emptyResult;

  // 話題の有無を調べる
  const topicService = new TopicService();
  const topic = await topicService.fetchTopicData(id);
  if (!topic) return emptyResult;

  // ログインしていなければ、ログインページへリダイレクト
  const redirectParams = await requireLogin(context, rootPath.topicPath.edit(id));
  if (redirectParams) return redirectParams;

  // 現在のユーザーが作成者であるかの検証
  const authService = new AuthService();
  const result = await authService.getUserProfile(context.req.headers.cookie);

  if (!result) return emptyResult;
  const isAuthor = topic.createdBy.id.value === result.id;

  return {
    props: {
      topic: TopicEntityFactory.create(topic),
      isEditable: isAuthor,
    },
  };
};

export default EditTopicPage;
