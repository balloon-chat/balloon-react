import React, { CSSProperties } from 'react';
import { TopicList } from 'src/components/topic/TopicList';
import { NavBar } from 'src/components/navbar/NavBar';

// tslint:disable-next-line:variable-name
const IndexPage = () => (
    <div style={page}>
      <NavBar/>
      <div style={body}>
        <TopicList/>
      </div>
    </div>
);

const page: CSSProperties = {
  minWidth: 370,
} as const;

const body: CSSProperties = {
  boxSizing: 'border-box',
  backgroundColor: '#AEE1E1',
  width: '100%',
} as const;

export default IndexPage;
