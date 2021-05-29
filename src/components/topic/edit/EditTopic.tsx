import React, { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/common/Button';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createTopic, updateTopic as updateTopicAction } from 'src/data/redux/topic/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useRouter } from 'next/router';
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
import { TopicEntity } from 'src/view/types/topic';
import { resetTopicState, setCurrentTopic } from 'src/data/redux/topic/slice';

type Props = {
  topic: TopicEntity|null
}

/**
 * 話題の作成や、話題の編集を行うコンポーネント
 */
export const EditTopic = ({ topic }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { uid } = useUserSelector();
  const { state, currentTopic } = useTopicState();

  // タイトル
  const [title, setTitle] = useState(topic?.title ?? '');
  const [titleError, setTitleError] = useState<string>();
  // 簡単な説明
  const [description, setDescription] = useState(topic?.description ?? '');
  const [descriptionError, setDescriptionError] = useState<string>();
  // プライベートな話題
  const [isPrivate, setIsPrivate] = useState(topic?.isPrivate ?? false);
  // サムネイル画像
  const [file, setFile] = useState<Blob | File>();

  const [dialogMessage, setDialogMessage] = useState<string|null>(null);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string|null>(null);

  useEffect(() => () => {
    dispatcher(resetTopicState());
    dispatcher(setCurrentTopic({ topic }));
  }, []);

  useEffect(() => {
    const topicId = (topic ?? currentTopic)?.id;
    if (!topicId) return;

    if (
      state === topicStates.TOPIC_UPDATED
      || state === topicStates.TOPIC_CREATED
    ) {
      router.push(rootPath.topicPath.topic(topicId)).then();
    } else if (
      state === topicStates.CRETE_TOPIC_ERROR
      || state === topicStates.UPDATE_TOPIC_ERROR
    ) {
      setDialogMessage(null);
      setErrorDialogMessage('予期せぬエラーが発生しました。');
    }
  }, [state]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 入力値の検証
    let valid = true;
    if (!TopicTitle.require(title)) {
      setTitleError('この項目は必須です。');
      valid = false;
    }
    if (description && !TopicDescription.require(description)) {
      setDescriptionError(`文字数は${TopicDescription.MAX_DESCRIPTION_LENGTH}以下です。`);
      valid = false;
    }

    if (!valid) return;

    if (topic) updateTopic();
    else saveTopic();
  };

  const saveTopic = () => {
    if (title && uid && file) {
      setDialogMessage('話題を作成しています。');
      dispatcher(
        createTopic({
          title,
          userId: uid,
          description,
          thumbnail: file,
          isPrivate,
        }),
      );
    }
  };

  const updateTopic = () => {
    if (topic && title && uid) {
      setDialogMessage('修正内容を反映しています。');
      dispatcher(updateTopicAction({
        topicId: topic.id,
        title,
        description,
        thumbnail: file,
        isPrivate,
      }));
    }
  };

  return (
    <>
      {
        dialogMessage && <LoadDialog message={dialogMessage} />
      }
      {
        errorDialogMessage && (
        <ErrorDialog
          message={errorDialogMessage}
          onClose={() => router.reload()}
        />
        )
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
          initialValue={title}
        />
        <TextField
          title="簡単な説明"
          placeholder="例: 『みんなで今日の晩御飯のメニューの妄想を語り合いましょう。』"
          onChange={(v) => setDescription(v)}
          maxLength={TopicDescription.MAX_DESCRIPTION_LENGTH}
          error={descriptionError}
          initialValue={description}
        />
        <ThumbnailInputRow>
          <Title>サムネイル</Title>
          <ImageFileContext.Provider
            value={{ setImageFile: (blob) => setFile(blob) }}
          >
            <TopicThumbnail
              imgUrl={topic?.thumbnailUrl ?? null}
              title={title}
              description={description}
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
