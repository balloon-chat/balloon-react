import React, { useEffect } from 'react';
import { ScrollableTopicList, TopicList } from 'src/components/topic/TopicList';
import { NavBarHome } from 'src/components/navbar/NavBar';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { TopicContainer } from 'src/pages/topics';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';

type Props = {
  pickup: {
    main: TopicEntity | null,
    topics: TopicEntity[],
  },
  newest: TopicEntity[],
};

// tslint:disable-next-line:variable-name
const IndexPage: React.FC<Props> = ({ pickup, newest }) => {
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(setTopics({ topics: newest }));
  },        []);

  return (<>
    <NavBarHome/>
    <TopicContainer>
      <ContainerCard>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>注目の話題</div>
        </Title>
        <Container>
          <TopicList topics={pickup.topics} pickup={pickup.main}/>
        </Container>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>最新の話題</div>
        </Title>
        <Container>
          <ScrollableTopicList/>
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const service = new TopicService();
  const recommends = await service.fetchRecommendTopics();

  if (!recommends) {
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

  const pickup = recommends.pickups
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

  const newest = (await service.fetchTopics(50))
      .map(topic => TopicEntityFactory.create(topic));

  return {
    props: {
      pickup: {
        main: pickup.length > 1 ? pickup[0] : null,
        topics: pickup.length > 1 ? pickup.slice(1, pickup.length) : [],
      },
      newest,
    },
  } as const;
};

export default IndexPage;
