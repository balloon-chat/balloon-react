import { CSSProperties } from 'react';
import { topicPath } from 'src/pages/pagePath';
import styled from 'styled-components';
import { TopicEntity } from 'src/view/types/topic';

// tslint:disable-next-line:variable-name
export const TopicCard = ({ props }: { props: TopicEntity }) => {
  const createdAt = new Date(props.createdAt);
  const year = `000${createdAt.getFullYear()}`.slice(-4);
  const month = `00${createdAt.getMonth()}`.slice(-2);
  const day = `00${createdAt.getDay()}`.slice(-2);

  return (<Card>
    <a href={topicPath.topic(props.id)} style={link}>
      <Thumbnail>
        <ThumbnailImage src={props.thumbnailUrl}/>
        {
          props.label && <Label labelColor={props.label.color}>{props.label.title}</Label>
        }
      </Thumbnail>
      <TopicInformation>
        <div style={topicTitle}>{props.title}</div>
        {props.description && <div style={topicDescription}>{props.description}</div>}
        <div style={topicFooter}>
          <div style={comment}>{`${props.commentCount}件のコメント`}</div>
          <div style={timeStamp}>{`${year}.${month}.${day}`}</div>
        </div>
      </TopicInformation>
    </a>
  </Card>);
};

// tslint:disable-next-line:variable-name
const Card = styled.article`
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 1px 0 rgb(131 131 131 / 50%);
`;

const link: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
  height: '100%',
} as const;

// tslint:disable-next-line:variable-name
const Thumbnail = styled.div`
  max-height: 230px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

// tslint:disable-next-line:variable-name
const ThumbnailImage = styled.img`
  object-fit: cover;
  overflow: hidden;
  max-height: 230px;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const Label = styled.div<{ labelColor: string }>`
  color: white;
  background-color: ${props => props.labelColor};
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px 64px;
  font-weight: bold;
`;

// tslint:disable-next-line:variable-name
const TopicInformation = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

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
