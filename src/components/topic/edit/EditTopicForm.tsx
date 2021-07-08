import { TextField } from 'src/components/common/TextField';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topic/topicDescription';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { TopicThumbnail } from 'src/components/topic/edit/TopicThumbnail';
import styled from 'styled-components';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { Button } from 'src/components/common/Button';
import React, { FormEvent, useState } from 'react';
import { TopicEntity } from 'src/view/types/topic';
import { useTopicState } from 'src/data/redux/topic/selector';
import { EditTopicModes } from 'src/data/redux/topic/state';

export type EditTopicArgs = {
  title?: string,
  description?: string,
  thumbnail?: File | Blob,
  isPrivate: boolean,
};

type Props = {
  topic: TopicEntity | null,

  onSubmit: (args: EditTopicArgs) => void,

  error: {
    title: string | null,
  }
};

export const EditTopicForm = ({
  topic,
  onSubmit,
  error,
}: Props) => {
  const { edit } = useTopicState();

  // タイトル
  const [title, setTitle] = useState(topic?.title);

  // 簡単な説明
  const [description, setDescription] = useState(topic?.description ?? undefined);

  // プライベートな話題
  const [isPrivate, setIsPrivate] = useState(topic?.isPrivate ?? false);

  // サムネイル画像
  const [thumbnail, setThumbnail] = useState<Blob | File>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (edit?.mode) {
      case EditTopicModes.CREATE:
        onSubmit({ title, description, thumbnail, isPrivate });
        break;
      case EditTopicModes.UPDATE:
        onSubmit({ title, description, isPrivate, thumbnail });
        break;
      default:
        break;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        title="タイトル"
        placeholder="例: 『今日の晩ごはんは〇〇食べたい！』"
        onChange={(v) => setTitle(v)}
        maxLength={TopicTitle.MAX_TITLE_LENGTH}
        error={error.title}
        initialValue={title}
      />
      <TextField
        title="簡単な説明"
        placeholder="例: 『みんなで今日の晩御飯のメニューの妄想を語り合いましょう。』"
        onChange={(v) => setDescription(v)}
        maxLength={TopicDescription.MAX_DESCRIPTION_LENGTH}
        initialValue={description ?? ''}
      />
      <ThumbnailInputRow>
        <Title>サムネイル</Title>
        <ImageFileContext.Provider value={{ setImageFile: (blob) => setThumbnail(blob) }}>
          <TopicThumbnail
            imgUrl={topic?.thumbnailUrl ?? null}
            title={title ?? ''}
            description={description ?? ''}
            isDefaultThumbnail
          />
        </ImageFileContext.Provider>
      </ThumbnailInputRow>
      <Title>オプション</Title>
      <CheckInputRow htmlFor="isPrivate">
        <input
          id="isPrivate"
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        <CheckInputBody>
          <CheckInputTitle>秘密の話題</CheckInputTitle>
          <CheckInputDescription>URLまたは招待コードを知っているユーザーのみが話題に参加することができます。</CheckInputDescription>
        </CheckInputBody>
      </CheckInputRow>
      <CreateButton>{topic ? '保存' : '作成'}</CreateButton>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const ThumbnailInputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const CheckInputRow = styled.label`
  align-items: start;
  display: flex;
  margin: 16px 0;
  cursor: pointer;

  & input[type='checkbox'] {
    margin-top: 8px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    & input[type='checkbox'] {
      width: 16px;
      height: 16px;
    }
  }
`;

const CheckInputBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const CheckInputTitle = styled.div`
  color: rgba(1, 1, 1, .8);
  font-weight: bold;
`;

const CheckInputDescription = styled.div`
  color: rgba(1, 1, 1, .6);
`;

const CreateButton = styled(Button)`
  margin-left: auto;
`;
