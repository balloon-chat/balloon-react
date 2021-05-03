import { topicPath } from 'src/view/route/pagePath';
import styled from 'styled-components';
import { TopicEntity } from 'src/view/types/topic';
import Image from 'next/image';
import { dateFormat } from 'src/view/util/format';
import React from 'react';
import Link from 'next/link';

export const TopicCard: React.FC<TopicEntity> = ({
  id,
  title,
  thumbnailUrl,
  label,
  description,
  createdAt,
  commentCount,
}) => (
  <Card>
    <Link href={topicPath.topic(id)}>
      <Container>
        <Thumbnail>
          <ThumbnailImageContainer>
            <Image src={thumbnailUrl} layout="fill" objectFit="cover" />
          </ThumbnailImageContainer>
          {label && <Label labelColor={label.color}>{label.title}</Label>}
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
