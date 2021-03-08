import React, { CSSProperties } from 'react';

// tslint:disable-next-line:variable-name
export const ContainerCard: React.FC = ({ children }) => {
  return (<div style={cardStyle}>{children}</div>);
};

const cardStyle: CSSProperties = {
  boxSizing: 'border-box',
  borderRadius: 5,
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 1px 1px 0 rgb(131 131 131 / 50%)',
  width: '100%',
  margin: '0 auto',
  maxWidth: 1050,
  minHeight: '100vh',
} as const;
