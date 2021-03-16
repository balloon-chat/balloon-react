import React from 'react';
import { TopicList } from 'src/components/topic/TopicList';
import { NavBarLarge } from 'src/components/navbar/NavBar';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { TopicContainer } from 'src/pages/topics';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';

type Props = {
  pickup: {
    main: TopicEntity | null,
    topics: TopicEntity[],
  },
  newest: TopicEntity[],
};

// tslint:disable-next-line:variable-name
const IndexPage: React.FC<Props> = (props) => {
  return (<>
    <NavBarLarge/>
    <TopicContainer>
      <ContainerCard>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>注目の話題</div>
        </Title>
        <Container>
          <TopicList topics={props.pickup.topics} pickup={props.pickup.main}/>
        </Container>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>最新の話題</div>
        </Title>
        <Container>
          <TopicList topics={props.newest}/>
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const service = new TopicService();
  const data = await service.fetchRecommendTopics();
  if (!data) {
    return {
      props: {
        pickup: {
          main: null,
          topics: [],
        },
        newest: [],
      },
    };
  }

  const pickup = data.pickups
      .map(topic => TopicEntityFactory.create(topic))
      .map((topic, index) => {
        if (index > 2) return topic;

        // 上位3つの話題にラベルを付ける
        const labelColors = ['#FFBE0F', '#78C4D4', '#CC561E'];
        return {
          ...topic,
          label: {
            title: `No.${index + 1}`,
            color: labelColors[index],
          },
        } as const;
      });

  const newest = data.newest.map(topic => TopicEntityFactory.create(topic));

  return {
    props: {
      pickup: {
        main: pickup.length > 1 ? pickup[0] : null,
        topics: pickup.length > 1 ? pickup.slice(1, pickup.length) : [],
      },
      newest,
    },
    revalidate: 60 * 30, // 30min
  };
};

export default IndexPage;
