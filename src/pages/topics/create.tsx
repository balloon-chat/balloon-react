import { NavBar } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import React, { useEffect } from 'react';
import { ContainerCard } from 'src/components/common/ContainerCard';
import styled from 'styled-components';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { editTopic, finishEditTopic } from 'src/data/redux/topic/slice';
import { EditTopicModes } from 'src/data/redux/topic/state';
import { useDispatch } from 'react-redux';

type Props = {
  isLoggedIn: boolean,
}

const CreateTopicPage = ({ isLoggedIn }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  if (!isLoggedIn) {
    router.replace({
      pathname: rootPath.login,
      query: { return_to: `${rootPath.fullPath(rootPath.topicPath.create)}` },
    }).then();
    return (<></>);
  }

  useEffect(() => {
    dispatcher(editTopic({ mode: EditTopicModes.CREATE, topic: null }));

    return () => {
      dispatcher(finishEditTopic());
    };
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle.topics.create}</title>
      </Head>
      <NavBar />
      <Body>
        <ContainerCard>
          <EditTopic topic={null} />
        </ContainerCard>
      </Body>
      <BottomNavigation />
    </>
  );
};

const Body = styled.div`
  box-sizing: border-box;
  background-color: #aee1e1;
  width: 100%;
  padding-top: 16px;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new AuthService();
  try {
    const userInfo = await service.getUserInfo(context.req.headers.cookie);
    return {
      props: {
        isLoggedIn: userInfo.loginId !== undefined,
      },
    };
  } catch (e) {
    return {
      props: {
        isLoggedIn: false,
      },
    };
  }
};

export default CreateTopicPage;
