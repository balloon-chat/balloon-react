import { NavBar } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import React from 'react';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import styled from 'styled-components';
import 'firebase/auth';
import { useUser } from 'src/view/lib/useUser';
import { rootPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
const CreateTopicPage = () => {

  const {} = useUser({ returnTo: rootPath.topicPath.create });

  return (<>
    <NavBar/>
    <Body>
      <ContainerCard>
        <EditTopic/>
      </ContainerCard>
    </Body>
  </>);
};

// tslint:disable-next-line:variable-name
const Body = styled.div`
  box-sizing: border-box;
  background-color: #AEE1E1;
  width: 100%;
  padding-top: 16px;
`;

// tslint:disable-next-line:variable-name
export default CreateTopicPage;
