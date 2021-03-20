import React from 'react';
import { TopicCard } from 'src/components/topic/TopicCard';
import { TopicEntity } from 'src/view/types/topic';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { fetchTopicsFrom } from 'src/data/redux/topic/action';
import { useTopicState } from 'src/data/redux/topic/selector';

export type TopicListProps = {
  pickup?: TopicEntity | null,
};

// tslint:disable-next-line:variable-name
export const TopicList: React.FC<TopicListProps> = ({ pickup }) => {
  const dispatcher = useDispatch();
  const { topics } = useTopicState();

  const loader = () => {
    return <div>Loading...</div>;
  };

  const fetchData = () => {
    dispatcher(fetchTopicsFrom({ from: topics[topics.length - 1].id }));
  };

  return (<>
    {
      pickup && <PickupCard>
          <TopicCard {...pickup}/>
      </PickupCard>
    }
    <InfiniteScroll dataLength={topics.length} next={fetchData} hasMore={true} loader={loader}>
      <TopicListContainer>
        {topics && topics.map((topic, index) => {
          return (<li key={index}><TopicCard {...topic}/></li>);
        })}
      </TopicListContainer>
    </InfiniteScroll>
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
