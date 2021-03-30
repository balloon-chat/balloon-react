import React, { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/common/Button';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createTopic } from 'src/data/redux/topic/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useRouter } from 'next/router';
import { setIsTopicCreated } from 'src/data/redux/topic/slice';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { TopicThumbnail } from 'src/components/topic/edit/TopicThumbnail';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { TextField } from 'src/components/common/TextField';
import { rootPath } from 'src/view/route/pagePath';

export const EditTopic = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const userId = useUserSelector().uid;
  const { topicId } = useTopicState();
  const { isTopicCreated } = useTopicState();

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string>();
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string>();
  const [file, setFile] = useState<Blob | File>();
  const [isTopicCreating, setIsTopicCreating] = useState(false);

  useEffect(() => {
    if (topicId && isTopicCreated) navigateToTopic(topicId).then();
  }, [topicId, isTopicCreated]);

  const navigateToTopic = async (topicId: string) => {
    dispatcher(setIsTopicCreated({ isTopicCreated: true }));
    await router.push(rootPath.topicPath.topic(topicId));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && userId && file) {
      setIsTopicCreating(true);
      dispatcher(
        createTopic({
          title,
          userId,
          description,
          thumbnail: file,
        }),
      );
      return;
    }

    if (!TopicTitle.require(title)) {
      setTitleError('この項目は必須です。');
    }
    if (description && !TopicDescription.require(description)) {
      setDescriptionError(
        `文字数は${TopicDescription.MAX_DESCRIPTION_LENGTH}以下です。`,
      );
    }
  };

  return (
    <>
      {isTopicCreating && <LoadDialog message="話題を作成しています。" />}
      <Form onSubmit={handleSubmit}>
        <TextField
          title="タイトル"
          placeholder="例: 『今日の晩ごはんは〇〇食べたい！』"
          onChange={(v) => setTitle(v)}
          maxLength={TopicTitle.MAX_TITLE_LENGTH}
          error={titleError}
        />
        <TextField
          title="簡単な説明"
          placeholder="例: 『みんなで今日の晩御飯のメニューの妄想を語り合いましょう。』"
          onChange={(v) => setDescription(v)}
          maxLength={TopicDescription.MAX_DESCRIPTION_LENGTH}
          error={descriptionError}
        />
        <ThumbnailInputRow>
          <Title>サムネイル</Title>
          <ImageFileContext.Provider
            value={{ setImageFile: (blob) => setFile(blob) }}
          >
            <TopicThumbnail title={title} description={description} />
          </ImageFileContext.Provider>
        </ThumbnailInputRow>
        <CreateButton>作成</CreateButton>
      </Form>
    </>
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

const CreateButton = styled(Button)`
  margin-left: auto;
`;
