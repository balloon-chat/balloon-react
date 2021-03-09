import { NavBarSmall } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/EditTopic';
import React, { CSSProperties } from 'react';
import { ContainerCard } from 'src/components/topic/ContainerCard';

// tslint:disable-next-line:variable-name
const CreateTopicPage = () => {
  return (<div>
    <NavBarSmall/>
    <div style={body}>
      <ContainerCard>
        <EditTopic/>
      </ContainerCard>
    </div>
  </div>);
};

const body: CSSProperties = {
  boxSizing: 'border-box',
  backgroundColor: '#AEE1E1',
  width: '100%',
  paddingTop: 16,
} as const;

export default CreateTopicPage;
