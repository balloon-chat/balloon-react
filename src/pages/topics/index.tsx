import React from 'react';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { TopicList, TopicListProps } from 'src/components/topic/TopicList';
import { UserService } from 'src/domain/user/service/userService';
import styled from 'styled-components';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntityFactory } from 'src/view/types/topic';

// tslint:disable-next-line:variable-name
const TopicIndexPage: React.FC<TopicListProps> = (props) => {
  return (<>
    <NavBarSmall/>
    <TopicContainer>
      <ContainerCard>
        <Container>
          <TopicList pickup={props.pickup} topics={props.topics}/>
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

export const getServerSideProps: GetServerSideProps<TopicListProps> = async () => {
  // TODO: remove this
  new UserService().getCurrentUserId();

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
      pickup: entities.length > 1 ? entities[0] : null,
      topics: entities.length > 1 ? entities.slice(1, entities.length) : [],
    },
  };
};

export default TopicIndexPage;
