import { NavBar } from 'src/components/navbar/NavBar';
import { EditTopic } from 'src/components/topic/edit/EditTopic';
import React, { useEffect } from 'react';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { UserService } from 'src/domain/user/service/userService';
import { setUserId } from 'src/data/redux/user/slice';

// tslint:disable-next-line:variable-name
const CreateTopicPage = () => {
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(setUserId(new UserService().getCurrentUserId().value)); // TODO: remove this
  },        []);

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
