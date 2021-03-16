import { topicPath } from 'src/pages/pagePath';
import styled from 'styled-components';
import { TopicEntity } from 'src/view/types/topic';
import Image from 'next/image';

// tslint:disable-next-line:variable-name
export const TopicCard = ({ props }: { props: TopicEntity }) => {
  const createdAt = new Date(props.createdAt);
  const year = `000${createdAt.getFullYear()}`.slice(-4);
  const month = `00${createdAt.getMonth()}`.slice(-2);
  const day = `00${createdAt.getDay()}`.slice(-2);

  return (<Card>
    <Container href={topicPath.topic(props.id)}>
      <Thumbnail>
        <ThumbnailImageContainer>
          <Image src={props.thumbnailUrl} layout={'fill'} objectFit={'cover'}/>
        </ThumbnailImageContainer>
        {
          props.label && <Label labelColor={props.label.color}>{props.label.title}</Label>
        }
      </Thumbnail>
      <TopicInformation>
        <TopicTitle>{props.title}</TopicTitle>
        {props.description && <TopicDescription>{props.description}</TopicDescription>}
        <TopicFooter>
          <div>{`${props.commentCount}件のコメント`}</div>
          <TimeStamp>{`${year}.${month}.${day}`}</TimeStamp>
        </TopicFooter>
      </TopicInformation>
    </Container>
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

// tslint:disable-next-line:variable-name
const Container = styled.a`
  display: flex;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
  height: 100%;
`;
// tslint:disable-next-line:variable-name
const Thumbnail = styled.div`
  box-sizing: border-box;
  height: 250px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

// tslint:disable-next-line:variable-name
const ThumbnailImageContainer = styled.div`
  overflow: hidden;
  max-height: 250px;
  height: 100%;
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
  flex-grow: 1;
  padding: 16px;
`;

// tslint:disable-next-line:variable-name
const TopicTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  flex-grow: 1;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// tslint:disable-next-line:variable-name
const TopicDescription = styled.div`
  font-size: 12px;
`;

// tslint:disable-next-line:variable-name
const TopicFooter = styled.div`
  display: flex;
  flex-direction: row;
  color: #a1a1a1;
  font-size: 14px;
  justify-content: space-between;
  margin-top: 8px;
`;

// tslint:disable-next-line:variable-name
const TimeStamp = styled.div`
  font-weight: bold;
`;
