import { NavBar } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import React from 'react';
import { ContainerCard } from 'src/components/common/ContainerCard';
import styled from 'styled-components';
import 'firebase/auth';
import { useUser } from 'src/view/lib/useUser';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { rootPath } from 'src/view/route/pagePath';
import { BottomNavigation } from 'src/components/navbar/bottomNavigation/BottomNavigation';

const CreateTopicPage = () => {
  const { user } = useUser({ returnTo: rootPath.topicPath.create });

  if (!user) {
    return <LoadDialog message="ログイン状況を確認しています。" />;
  }

  return (
    <>
      <NavBar />
      <Body>
        <ContainerCard>
          <EditTopic />
        </ContainerCard>
      </Body>
      <BottomNavigation currentLocation="create" />
    </>
  );
};

const Body = styled.div`
  box-sizing: border-box;
  background-color: #aee1e1;
  width: 100%;
  padding-top: 16px;
`;

export default CreateTopicPage;
