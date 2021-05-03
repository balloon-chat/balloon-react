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
import { topicStates } from 'src/data/redux/topic/state';
import { ErrorDialog } from 'src/components/common/ErrorDialog';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export const EditTopic = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const userId = useUserSelector().uid;
  const { topicId } = useTopicState();
  const { isTopicCreated } = useTopicState();
  const { state } = useTopicState();

  // タイトル
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string>();
  // 簡単な説明
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string>();
  // プライベートな話題
  const [isPrivate, setIsPrivate] = useState(false);
  // サムネイル画像
  const [file, setFile] = useState<Blob | File>();
  // 作成中のダイアログを表示するフラグ
  const [isTopicCreating, setIsTopicCreating] = useState(false);

  useEffect(() => {
    if (topicId && isTopicCreated) {
      navigateToTopic(topicId).then();
    }
  }, [topicId, isTopicCreated]);

  useEffect(() => {
    if (state === topicStates.CRETE_TOPIC_ERROR) {
      setIsTopicCreating(false);
    }
  }, [state]);

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
          isPrivate,
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
      {
        isTopicCreating && <LoadDialog message="話題を作成しています。" />
      }
      {
        state === topicStates.CRETE_TOPIC_ERROR && (
          <ErrorDialog
            message="話題の作成中にエラーが発生しました。"
            onClose={() => { router.reload(); }}
          />
        )
      }
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
