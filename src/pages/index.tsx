import React, { useEffect } from 'react';
import { TopicList } from 'src/components/topic/TopicList';
import { NavBarHome } from 'src/components/navbar/NavBar';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
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
          <SectionImageContainer>
            <Image src={imagePath.character.yellow} height={64} width={64} objectFit="contain" objectPosition="center left" />
          </SectionImageContainer>
          <div>ワダイな話題</div>
        </SectionTitle>
        <Container>
          <TopicList topics={pickup.topics} pickup={pickup.main} />
        </Container>
      </TopicContainer>
      <TopicContainer color="#E5F6FB">
        <SectionTitle>
          <SectionImageContainer>
            <Image src={imagePath.character.pink} height={64} width={64} objectFit="contain" objectPosition="center left" />
          </SectionImageContainer>
          <div>最新の話題</div>
        </SectionTitle>
        <Container>
          <TopicList topics={newest} />
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
  flex-direction: column;
  margin: 32px 0;
  text-align: center;
  justify-content: center;
  width: 100%;
  
  & > div:last-child {
    margin-top: 16px;
  }
`;

const SectionImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 50%;
`;

const ShowMoreButton = styled(Button)`
  width: 100%;
  padding: 16px;
  margin: 0 auto 64px auto;
  max-width: 500px;
`;

export const getStaticProps: GetStaticProps<Props> = async () => {
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

  const newest = await service.fetchTopics(6);

  return {
    props: {
      pickup: {
        main: pickup.length > 1 ? pickup[0] : null,
        topics: pickup.length > 1 ? pickup.slice(1, 5) : [],
      },
      newest,
    },
    revalidate: 1,
  } as const;
};

export default IndexPage;
