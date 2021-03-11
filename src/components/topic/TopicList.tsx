import styled from 'styled-components';
import React from 'react';
import { TopicCard } from 'src/components/topic/TopicCard';
import { TopicEntity } from 'src/view/types/topic';

export type TopicListProps = {
  pickup?: TopicEntity | null,
  topics: TopicEntity[];
};

// tslint:disable-next-line:variable-name
export const TopicList: React.FC<TopicListProps> = (props) => {
  return (<>
    {
      props.pickup && <PickupCard>
          <TopicCard props={props.pickup}/>
      </PickupCard>
    }
    <TopicListContainer>
      {props.topics && props.topics.map((topic, index) => {
        return (<li key={index}><TopicCard props={topic}/></li>);
      })}
    </TopicListContainer>
  </>);
};

// tslint:disable-next-line:variable-name
const PickupCard = styled.div`
  max-width: 1050px;
  margin-bottom: 16px;
`;

// tslint:disable-next-line:variable-name
const TopicListContainer = styled.ul`
  align-items: stretch;
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  flex-direction: row;
  list-style: none;
  max-width: 1050px;
  width: 100%;
  padding: 0;
  margin: 0;

  & > li {
    min-width: 300px;
    width: calc(50% - 8px);
    margin-bottom: 16px;
  }

  & > li:nth-child(2n) {
    margin-left: 16px;
  }

  & > li > article {
    height: 100%;
  }

  @media (max-width: 800px) {
    & > li {
      width: 100%;
    }

    & > li:nth-child(2n) {
      margin-left: 0;
    }
  }
`;
