import React from 'react';
import { TopicList, TopicListProps } from 'src/components/topic/TopicList';
import { NavBar } from 'src/components/navbar/NavBar';
import { ContainerCard } from 'src/components/topic/ContainerCard';
import { TopicContainer } from 'src/pages/topics';
import styled from 'styled-components';
import { UserService } from 'src/domain/user/service/userService';
import { GetServerSideProps } from 'next';
import { RoomService } from 'src/domain/room/service/RoomService';
import { RoomEntityFactory } from 'src/view/types/room';

// tslint:disable-next-line:variable-name
const IndexPage: React.FC<TopicListProps> = (props) => {
  return (<>
    <NavBar/>
    <TopicContainer>
      <ContainerCard>
        <Title>
          <TitleImage src={'/images/character_yellow.png'}/>
          <div>ホットな話題</div>
        </Title>
        <Container>
          <TopicList topics={props.topics} pickup={props.pickup}/>
        </Container>
      </ContainerCard>
    </TopicContainer>
  </>);
};

// tslint:disable-next-line:variable-name
const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const Title = styled.div`
  align-items: center;
  display: flex;
  font-weight: bold;
  font-size: 24px;
  margin: 32px auto;
  text-align: center;
  justify-content: center;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const TitleImage = styled.img`
  margin-right: 32px;
  height: 80px;
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

export default IndexPage;
