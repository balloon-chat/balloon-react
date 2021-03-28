import React, { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/topic/Button';
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
    await router.push(`/topics/${topicId}`);
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
      setTitleError('エラー: この項目は必須です。');
    }
    if (description && !TopicDescription.require(description)) {
      setDescriptionError(
        `エラー: 文字数は${TopicDescription.MAX_DESCRIPTION_LENGTH}以下です。`,
      );
    }
  };

  return (
    <>
      {isTopicCreating && <LoadDialog message="話題を作成しています。" />}
      <Form onSubmit={handleSubmit}>
        <InputRow>
          <Title>タイトル</Title>
          <Input
            maxLength={TopicTitle.MAX_TITLE_LENGTH}
            placeholder="例: 『今日の晩ごはんは〇〇食べたい！』"
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputRowFooter>
            {titleError && <InputErrorMessage>{titleError}</InputErrorMessage>}
            <CharacterCount>
              {title.length}
              {' '}
              /
              {TopicTitle.MAX_TITLE_LENGTH}
            </CharacterCount>
          </InputRowFooter>
        </InputRow>
        <InputRow>
          <Title>簡単な説明</Title>
          <Input
            maxLength={TopicDescription.MAX_DESCRIPTION_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 『みんなで今日の晩御飯のメニューの妄想を語り合いましょう。』"
          />
          <InputRowFooter>
            {descriptionError && (
              <InputErrorMessage>{descriptionError}</InputErrorMessage>
            )}
            <CharacterCount>
              {description.length}
              {' '}
              /
              {TopicDescription.MAX_DESCRIPTION_LENGTH}
            </CharacterCount>
          </InputRowFooter>
        </InputRow>
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

const InputRow = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const InputRowFooter = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 5px;

  :focus {
    border: 1px solid #5b87fa;
    outline: none;
  }

  :required {
    color: #630015;
    border-color: #c20c33;
    background-color: #ffd9e1;
  }

  :valid {
    color: #333;
    border-color: #ccc;
    background: #fff;
  }
`;

const InputErrorMessage = styled.div`
  color: #c20c33;
  font-size: 15px;
`;

const CharacterCount = styled.div`
  margin-left: auto;
  color: grey;
`;

const ThumbnailInputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const CreateButton = styled(Button)`
  margin-left: auto;
`;
