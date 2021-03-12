import React from 'react';
import { TopicList, TopicListProps } from 'src/components/topic/TopicList';
import { NavBarLarge } from 'src/components/navbar/NavBar';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { TopicContainer } from 'src/pages/topics';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntityFactory } from 'src/view/types/topic';

// tslint:disable-next-line:variable-name
const IndexPage: React.FC<TopicListProps> = (props) => {
  return (<>
    <NavBarLarge/>
    <TopicContainer>
      <ContainerCard>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>ホットな話題</div>
        </Title>
        <Container>
          <TopicList topics={props.topics} pickup={props.pickup}/>
        </Container>
      </ContainerCard>
    </TopicContainer>
  </>);
};

// tslint:disable-next-line:variable-name
const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const Title = styled.div`
  align-items: center;
  display: flex;
  font-weight: bold;
  font-size: 24px;
  margin: 32px auto;
  text-align: center;
  justify-content: center;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const TitleImage = styled.img`
  margin-right: 32px;
  height: 80px;
`;

export const getServerSideProps: GetServerSideProps<TopicListProps> = async () => {
  const service = new TopicService();
  const data = await service.fetchTopics(50);
  const entities = data
      .map(topic => TopicEntityFactory.create(topic))
      .map((entity, index) => {
        if (index > 2) return entity;

        // 上位3つの話題にラベルを付ける
        const labelColors = ['#FFBE0F', '#78C4D4', '#CC561E'];
        return {
          ...entity,
          label: {
            title: `No.${index + 1}`,
            color: labelColors[index],
          },
        } as const;
      });

  const pickup = entities.length > 0 ? entities[0] : null;
  const topics = entities.length > 1 ? entities.slice(1, entities.length) : [];

  return {
    props: {
      pickup,
      topics,
    },
  };
};

export default IndexPage;
