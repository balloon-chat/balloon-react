// tslint:disable-next-line:variable-name
import React from 'react';
import { Chat } from 'src/components/chat/Chat';
import { MessageField } from 'src/components/chat/MessageField';
import { UserService } from 'src/domain/user/service/userService';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { TopicNotFound } from 'src/components/topic/TopicNotFound';
import Head from 'next/head';
import { topicPath } from 'src/pages/pagePath';
import { GetServerSideProps } from 'next';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import styled from 'styled-components';

type Props = {
  topic: TopicEntity | null,
};

// tslint:disable-next-line:variable-name
const TopicPage = ({ topic }: Props) => {

  return (<Container>
    <NavBarSmall/>
    {topic && (<>
          <Head>
            <title>{topicPath.title(topic.title)}</title>
          </Head>
          <Chat/>
          <MessageField/>
        </>
    )}
    {!topic && (<TopicNotFound/>)}
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  height: 100%;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  new UserService().getCurrentUserId(); // TODO: remove this

  const { id } = context.query;
  if (typeof id !== 'string') return { props: { topic: null } };

  const service = new TopicService();
  const data = await service.fetchTopic(id);
  if (!data) return { props: { topic: null } };

  const topic = TopicEntityFactory.create(data);
  return {
    props: {
      topic,
    },
  };
};

export default TopicPage;
