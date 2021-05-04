import React, { useEffect } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import { ScrollableTopicList } from 'src/components/topic/TopicList';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { TopicContainer } from 'src/components/topic/TopicContainer';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import Head from 'next/head';
import { InvitationCodeForm } from 'src/components/topic/invitation/InvitationCodeForm';
import { useRouter } from 'next/router';
import { NavLocations } from 'src/view/types/navigation';

type Props = {
  pickup: TopicEntity | null,
  topics: TopicEntity[],
  // 招待コードから取得した話題のID
  topicId: string | null,
};

const TopicIndexPage: React.FC<Props> = ({ topics, pickup, topicId }) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatcher(setTopics({ topics }));
  }, []);

  if (topicId) {
    router.push(rootPath.topicPath.topic(topicId)).then();
    return (<></>);
  }

  // 0063-4954

  return (
    <>
      <Head>
        <title>{pageTitle.topics.index}</title>
      </Head>
      <NavBar />
      <InvitationCodeForm />
      <TopicContainer>
        <ScrollableTopicList pickup={pickup} />
      </TopicContainer>
      <BottomNavigation currentLocation={NavLocations.FIND_TOPIC} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new TopicService();

  const { code } = context.query;
  if (typeof code === 'string') {
    const topic = await service.fetchTopicFromCode(code);
    if (topic) {
      return {
        props: {
          pickup: null,
          topics: [],
          topicId: topic.id.value,
          error: null,
        },
      };
    }
  }

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
      topicId: null,
    },
  };
};

export default TopicIndexPage;
