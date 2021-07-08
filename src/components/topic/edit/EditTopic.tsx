import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createTopic, updateTopic as updateTopicAction } from 'src/data/redux/topic/action';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topic/topicDescription';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { TopicEntity } from 'src/view/types/topic';
import { EditTopicModes, EditTopicStates } from 'src/data/redux/topic/state';
import { rootPath } from 'src/view/route/pagePath';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useRouter } from 'next/router';
import { ErrorDialog } from 'src/components/common/ErrorDialog';
import { EditTopicArgs, EditTopicForm } from 'src/components/topic/edit/EditTopicForm';

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
  const { edit } = useTopicState();

  const [titleError, setTitleError] = useState<string|null>(null);
  const [descriptionError, setDescriptionError] = useState<string|null>(null);

  const [dialogMessage, setDialogMessage] = useState<string|null>(null);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string|null>(null);

  useEffect(() => {
    if (!edit || !edit.state) return;

    const { state, create, update } = edit;

    switch (state) {
      case EditTopicStates.UPDATED:
        if (!update) break;
        router.push(rootPath.topicPath.topic(update.topic.id)).then();
        break;
      case EditTopicStates.CREATED:
        if (!create?.created) break;
        router.push(rootPath.topicPath.topic(create.created.id)).then();
        break;
      case EditTopicStates.UPDATE_TOPIC_ERROR:
        setDialogMessage(null);
        setErrorDialogMessage('更新中にエラーが発生しました。');
        break;
      case EditTopicStates.CREATE_TOPIC_ERROR:
        setDialogMessage(null);
        setErrorDialogMessage('話題作成中にエラーが発生しました。');
        break;
      default:
        break;
    }
  }, [edit]);

  const handleSubmit = async ({ title, description, thumbnail, isPrivate }: EditTopicArgs) => {
    // 入力値の検証
    let valid = true;
    if (!title || !TopicTitle.require(title)) {
      setTitleError('この項目は必須です。');
      valid = false;
    }
    if (description && !TopicDescription.require(description)) {
      setDescriptionError(`文字数は${TopicDescription.MAX_DESCRIPTION_LENGTH}以下です。`);
      valid = false;
    }

    if (!valid) return;

    switch (edit?.mode) {
      case EditTopicModes.CREATE:
        if (!title || !thumbnail) return;
        saveTopic({ title, description, thumbnail, isPrivate });
        break;
      case EditTopicModes.UPDATE:
        updateTopic({ title, description, thumbnail, isPrivate });
        break;
      default:
        break;
    }
  };

  const saveTopic = ({ title, description, thumbnail, isPrivate }: EditTopicArgs) => {
    if (!uid || !title || !thumbnail) return;

    setDialogMessage('話題を作成しています...');
    dispatcher(
      createTopic({ title, description: description ?? '', thumbnail, isPrivate, userId: uid }),
    );
  };

  const updateTopic = ({ title, description, thumbnail, isPrivate }: EditTopicArgs) => {
    if (!uid || !topic || !thumbnail) return;

    setDialogMessage('話題を更新しています...');
    dispatcher(
      updateTopicAction({ topicId: topic.id, title, description, thumbnail, isPrivate }),
    );
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
      <EditTopicForm
        topic={topic}
        onSubmit={handleSubmit}
        error={{
          title: titleError,
          description: descriptionError,
        }}
      />
    </>
  );
};
