import { topicPath } from 'src/view/route/pagePath';
import styled from 'styled-components';
import { TopicEntity } from 'src/view/types/topic';
import { dateFormat } from 'src/view/util/format';
import LockIcon from 'src/components/svgs/lock.svg';
import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

export const TopicCard: React.FC<TopicEntity> = ({
  id,
  title,
  thumbnailUrl,
  label,
  description,
  createdAt,
  commentCount,
  isPrivate,
}) => (
  <Card>
    <Link href={topicPath.topic(id)} passHref>
      <Container>
        <Thumbnail>
          <ThumbnailImageContainer>
            <Skeleton height="100%" />
            <ThumbnailImage key={id} src={thumbnailUrl} />
          </ThumbnailImageContainer>
          {label && <Label labelColor={label.color}>{label.title}</Label>}
          {isPrivate && <PrivateContainer><LockIcon /></PrivateContainer>}
        </Thumbnail>
        <TopicInformation>
          <TopicTitle>{title}</TopicTitle>
          {description && <TopicDescription>{description}</TopicDescription>}
          <TopicFooter>
            <div>{`${commentCount}件のコメント`}</div>
            <TimeStamp>{dateFormat(new Date(createdAt), '.')}</TimeStamp>
          </TopicFooter>
        </TopicInformation>
      </Container>
    </Link>
  </Card>
);

const Card = styled.article`
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid white;
  overflow: hidden;
  background-color: white;
`;

const PrivateContainer = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 8px;
  position: absolute;
  bottom: 8px;
  left: 8px;
  & > svg {
    color: #ffbe0f;
    fill: currentColor;
  }
`;

const Container = styled.a`
  display: flex;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
  height: 100%;
`;

const Thumbnail = styled.div`
  box-sizing: border-box;
  height: 250px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ThumbnailImageContainer = styled.div`
  overflow: hidden;
  max-height: 250px;
  height: 100%;
  width: 100%;
  position: relative;
`;

const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Label = styled.div<{ labelColor: string }>`
  color: white;
  background-color: ${(props) => props.labelColor};
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px 64px;
  font-weight: bold;
`;

const TopicInformation = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
`;

const TopicTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  flex-grow: 1;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TopicDescription = styled.div`
  font-size: 12px;
`;

const TopicFooter = styled.div`
  display: flex;
  flex-direction: row;
  color: #a1a1a1;
  font-size: 14px;
  justify-content: space-between;
  margin-top: 8px;
`;

const TimeStamp = styled.div`
  font-weight: bold;
`;
