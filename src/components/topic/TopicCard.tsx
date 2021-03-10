import { CSSProperties } from 'react';
import { topicPath } from 'src/pages/pagePath';

type Props = {
  id: string,
  title: string,
  description?: string,
  createdAt: Date,
  thumbnailUrl: string,
  commentCount: number,
};

// tslint:disable-next-line:variable-name
export const TopicCard = ({ props }: { props: Props }) => {
  const year = `000${props.createdAt.getFullYear()}`.slice(-4);
  const month = `00${props.createdAt.getMonth()}`.slice(-2);
  const day = `00${props.createdAt.getDay()}`.slice(-2);

  return (<article style={cardStyle}>
    <a href={topicPath.topic(props.id)} style={link}>
      <img style={thumbnail} src={props.thumbnailUrl}/>
      <div style={topicInformation}>
        <div style={topicTitle}>{props.title}</div>
        <div style={topicDescription}>{props.description}</div>
        <div style={topicFooter}>
          <div style={comment}>{`${props.commentCount}件のコメント`}</div>
          <div style={timeStamp}>{`${year}.${month}.${day}`}</div>
        </div>
      </div>
    </a>
  </article>);
};

const cardStyle: CSSProperties = {
  boxSizing: 'border-box',
  borderRadius: 5,
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 1px 1px 0 rgb(131 131 131 / 50%)',
} as const;

const link: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
} as const;

const thumbnail: CSSProperties = {
  width: '100%',
  maxHeight: 230,
  objectFit: 'cover',
  overflow: 'hidden',
} as const;

// tslint:disable-next-line:variable-name
const topicInformation: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 16px 16px 28px',
} as const;

// tslint:disable-next-line:variable-name
const topicTitle: CSSProperties = {
  fontWeight: 'bold',
  fontSize: 16,
  overflow: 'hidden',
  textDecoration: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

const topicDescription: CSSProperties = {
  fontSize: 12,
} as const;

const topicFooter: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
} as const;

const comment: CSSProperties = {
  color: '#a1a1a1',
  fontSize: 14,
} as const;

const timeStamp: CSSProperties = {
  color: '#a1a1a1',
  fontSize: 14,
  fontWeight: 'bold',
} as const;
