import React, { useEffect } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import { ScrollableTopicList } from 'src/components/topic/TopicList';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { TopicContainer } from 'src/components/topic/TopicContainer';
import { pageTitle } from 'src/view/route/pagePath';
import Head from 'next/head';

type Props = {
  pickup?: TopicEntity | null;
  topics: TopicEntity[];
};

const TopicIndexPage: React.FC<Props> = ({ topics, pickup }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(setTopics({ topics }));
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle.topics.index}</title>
      </Head>
      <NavBar />
      <TopicContainer>
        <Container>
          <ScrollableTopicList pickup={pickup} />
        </Container>
      </TopicContainer>
      <BottomNavigation currentLocation="join" />
    </>
  );
};

const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const service = new TopicService();
  const topics = await service.fetchTopics(50);

  const entities = topics
    .map((topic) => TopicEntityFactory.create(topic))
    .map((entity, index) => {
      if (index !== 0) return entity;
      // 最初の話題にのみ、ラベルを付ける
      return {
        ...entity,
        label: {
          title: 'Pickup!',
          color: '#78C4D4',
        },
      } as const;
    });

  return {
    props: {
      pickup: entities.length > 0 ? entities[0] : null,
      topics: entities.length > 1 ? entities.slice(1, entities.length) : [],
    },
  };
};

export default TopicIndexPage;
