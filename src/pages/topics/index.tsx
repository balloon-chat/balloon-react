import React, { useEffect } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import { TopicList } from 'src/components/topic/TopicList';
import styled from 'styled-components';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';

type Props = {
  pickup?: TopicEntity | null,
  topics: TopicEntity[];
};

// tslint:disable-next-line:variable-name
const TopicIndexPage: React.FC<Props> = ({ topics, pickup }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(setTopics({ topics }));
  },        []);

  return (<>
    <NavBar/>
    <TopicContainer>
      <ContainerCard>
        <Container>
          <TopicList pickup={pickup}/>
        </Container>
      </ContainerCard>
    </TopicContainer>
  </>);
};

// tslint:disable-next-line:variable-name
export const TopicContainer = styled.div`
  box-sizing: border-box;
  background-color: #AEE1E1;
  width: 100%;
  padding: 32px 16px;

  @media (max-width: 850px) {
    padding: 16px 0;
  }
`;

// tslint:disable-next-line:variable-name
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
      .map(topic => TopicEntityFactory.create(topic))
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
