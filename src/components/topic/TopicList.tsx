import styled from 'styled-components';
import React, { CSSProperties } from 'react';
import { TopicCard } from 'src/components/topic/TopicCard';

// tslint:disable-next-line:variable-name
export const TopicList = () => {
  return (<TopicContainer>
    <main style={cardStyle}>
      <div style={title}>
        <img style={titleImage} src={'/images/character_yellow.png'}/>
        <div>ホットな話題</div>
      </div>
      <TopicListComponent style={topicList}>
        <li><TopicCard/></li>
        <li><TopicCard/></li>
        <li><TopicCard/></li>
        <li><TopicCard/></li>
        <li><TopicCard/></li>
      </TopicListComponent>
    </main>
  </TopicContainer>);
};

// tslint:disable-next-line:variable-name
export const TopicContainer = styled.div`
  padding: 32px 16px;

  @media (max-width: 850px) {
    padding: 16px 0;
  }
`;

const cardStyle: CSSProperties = {
  boxSizing: 'border-box',
  backgroundColor: 'white',
  boxShadow: '3px 3px 6px 5px rgba(0, 64, 128, .16)',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  maxWidth: 1050,
  padding: '48px 16px 32px 16px',
  width: '100%',
};

const title: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  fontWeight: 'bold',
  fontSize: 24,
  margin: '0 auto 60px auto',
  textAlign: 'center',
} as const;

const titleImage: CSSProperties = {
  marginRight: 32,
  height: 80,
} as const;

// tslint:disable-next-line:variable-name
const TopicListComponent = styled.ul`
  & > li {
    min-width: 300px;
    width: 50%;
    flex-grow: 1;
  }

  & > li:first-child {
    flex-grow: 2;
    width: 100%;
  }

  & > li > article {
    margin: 0 8px 16px 8px;
  }
`;

const topicList: CSSProperties = {
  display: 'flex',
  boxSizing: 'border-box',
  flexWrap: 'wrap',
  flexDirection: 'row',
  listStyle: 'none',
  maxWidth: 1050,
  width: '100%',
  padding: 0,
  margin: 0,
} as const;
