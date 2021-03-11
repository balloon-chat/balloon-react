import { NavBar } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/EditTopic';
import React from 'react';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
const CreateTopicPage = () => {
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

export default CreateTopicPage;
