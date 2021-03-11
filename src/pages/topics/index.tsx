import React from 'react';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { TopicList, TopicListProps } from 'src/components/topic/TopicList';
import { UserService } from 'src/domain/user/service/userService';
import styled from 'styled-components';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { GetServerSideProps } from 'next';
import { RoomService } from 'src/domain/room/service/RoomService';
import { RoomEntityFactory } from 'src/view/types/room';

// tslint:disable-next-line:variable-name
const RoomIndexPage: React.FC<TopicListProps> = (props) => {
  return (<>
    <NavBarSmall/>
    <TopicContainer>
      <ContainerCard>
        <Container>
          <TopicList pickup={props.pickup} topics={props.topics}/>
        </Container>
      </ContainerCard>
    </TopicContainer>
  </>);
};

// tslint:disable-next-line:variable-name
export const TopicContainer = styled.div`
  box-sizing: border-box;
  background-color: #AEE1E1;
  width: 100%;
  padding: 32px 16px;

  @media (max-width: 850px) {
    padding: 16px 0;
  }
`;

// tslint:disable-next-line:variable-name
const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps<TopicListProps> = async () => {
  // TODO: remove this
  new UserService().getCurrentUserId();

  const service = new RoomService();
  const rooms = await service.fetchRooms(50);
  const entities = rooms.map((room) => RoomEntityFactory.create(room));

  return {
    props: {
      pickup: entities.length > 1 ? entities[0] : null,
      topics: entities.length > 1 ? entities.slice(1, entities.length) : [],
    },
  };
};

export default RoomIndexPage;
