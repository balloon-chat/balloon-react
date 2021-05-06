import React, { useEffect } from 'react';
import { ScrollableTopicList, TopicList } from 'src/components/topic/TopicList';
import { NavBarHome } from 'src/components/navbar/NavBar';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { TopicContainer } from 'src/components/topic/TopicContainer';
import { useRouter } from 'next/router';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { Button } from 'src/components/common/Button';
import Head from 'next/head';
import Image from 'next/image';
import { imagePath } from 'src/components/constants/imagePath';

type Props = {
  pickup: {
    main: TopicEntity | null;
    topics: TopicEntity[];
  };
  newest: TopicEntity[];
};

const IndexPage: React.FC<Props> = ({
  pickup,
  newest,
}) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatcher(setTopics({ topics: newest }));
  }, []);

  const showMore = async () => {
    await router.push(rootPath.topicPath.index);
  };

  return (
    <>
      <Head>
        <title>{pageTitle.index}</title>
      </Head>
      <NavBarHome />
      <TopicContainer>
        <SectionTitle>
          <SectionImage src={imagePath.character.yellow} height={50} width={80} objectFit="contain" objectPosition="center left" />
          <div>注目の話題</div>
        </SectionTitle>
        <Container>
          <TopicList topics={pickup.topics} pickup={pickup.main} />
        </Container>
      </TopicContainer>
      <TopicContainer color="#E5F6FB">
        <SectionTitle>
          <SectionImage src={imagePath.character.green} height={50} width={80} objectFit="contain" objectPosition="center left" />
          <div>最新の話題</div>
        </SectionTitle>
        <Container>
          <ScrollableTopicList />
          <ShowMoreButton onClick={showMore}>もっと見る</ShowMoreButton>
        </Container>
      </TopicContainer>
      <BottomNavigation />
    </>
  );
};

const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
`;

const SectionTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: bold;
  font-size: 24px;
  margin: 32px 0;
  text-align: center;
  justify-content: start;
  width: 100%;
`;

const SectionImage = styled(Image)`
  height: 48px;
  margin-right: 16px;
`;

const ShowMoreButton = styled(Button)`
  box-shadow: 0 10px 40px -2px rgb(0 64 128 / 20%);
  width: 100%;
  padding: 16px;
  margin: 16px auto 128px auto;
  max-width: 500px;
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
    .map((topic) => TopicEntityFactory.create(topic))
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

  const newest = (await service.fetchTopics(50)).map((topic) => TopicEntityFactory.create(topic));

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
