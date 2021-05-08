import React, { useEffect } from 'react';
import { NavBar } from 'src/components/navbar/NavBar';
import { ScrollableTopicList } from 'src/components/topic/TopicList';
import { GetServerSideProps } from 'next';
import { TopicService } from 'src/domain/topic/service/topicService';
import { TopicEntity } from 'src/view/types/topic';
import { useDispatch } from 'react-redux';
import { setTopics } from 'src/data/redux/topic/slice';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import { TopicContainer } from 'src/components/topic/TopicContainer';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import Head from 'next/head';
import { InvitationCodeForm } from 'src/components/topic/invitation/InvitationCodeForm';
import { useRouter } from 'next/router';
import { topicStates } from 'src/data/redux/topic/state';
import { ErrorPage } from 'src/components/common/ErrorPage';

type Props = {
  pickup: TopicEntity | null,
  topics: TopicEntity[],
  // 招待コードから取得した話題のID
  topicId: string | null,
  error: string | null,
};

const TopicIndexPage: React.FC<Props> = ({ topics, pickup, topicId, error }) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatcher(setTopics({ topics }));
  }, []);

  if (topicId) {
    router.replace(rootPath.topicPath.topic(topicId)).then();
    return (<></>);
  }

  return (
    <>
      <Head>
        <title>{pageTitle.topics.index}</title>
      </Head>
      <NavBar />
      {
        error
          ? (
            <ErrorPage message="招待コードに対応する話題が見つかりませんでした。" />
          )
          : (
            <>
              <InvitationCodeForm />
              <TopicContainer>
                <ScrollableTopicList pickup={pickup} />
              </TopicContainer>
            </>
          )
      }
      <BottomNavigation />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new TopicService();

  const { code } = context.query;
  if (typeof code === 'string') {
    const topic = await service.fetchTopicFromCode(code);
    return {
      props: {
        pickup: null,
        topics: [],
        topicId: topic?.id.value ?? null,
        error: topic ? null : topicStates.CANNOT_FIND_BY_CODE,
      },
    };
  }

  const topics = await service.fetchTopics(50);

  const entities = topics
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
      error: null,
    },
  };
};

export default TopicIndexPage;
