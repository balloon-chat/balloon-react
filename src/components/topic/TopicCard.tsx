import { CSSProperties } from 'react';

// tslint:disable-next-line:variable-name
export const TopicCard = ({}) => {
  const commentCount = 400;
  const year = 2021;
  const month = 2;
  const day = 1;
  const yearStr = `000${year}`.slice(-4);
  const monthStr = `00${month}`.slice(-2);
  const dayStr = `00${day}`.slice(-2);
  const imgUrl = 'http://placehold.jp/1600x800.png';

  return (<article style={cardStyle}>
    <a style={link}>
      <img style={thumbnail} src={imgUrl}/>
      <div style={topicInformation}>
        <div style={topicTitle}>タイトル</div>
        <div style={topicDescription}>簡単な説明</div>
        <div style={topicFooter}>
          <div style={comment}>{`${commentCount}件のコメント`}</div>
          <div style={timeStamp}>{`${yearStr}.${monthStr}.${dayStr}`}</div>
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
