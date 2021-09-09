import React, { FormEvent, useCallback, useState } from 'react';
import { Dialog } from 'src/components/common/Dialog';
import { Button } from 'src/components/common/Button';
import { TextField } from 'src/components/common/TextField';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deriveTopic } from 'src/data/redux/topic/action';
import { closeDeriveTopicDialog } from 'src/data/redux/chat/slice';
import { useChatState } from 'src/data/redux/chat/selector';
import { DialogHeader } from 'src/components/common/DialogHeader';

export const DeriveTopicDialog = () => {
  const dispatcher = useDispatch();
  const [title, setTitle] = useState<string>();
  const { topicId } = useChatState();
  const { dialog } = useChatState();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topicId || !title) return;

    dispatcher(deriveTopic({ topicId, title }));
    onClose();
  };

  const onClose = () => {
    dispatcher(closeDeriveTopicDialog());
  };

  return (
    <Dialog animate isVisible={dialog.deriveTopicDialog} onClose={useCallback(onClose, [])}>
      <DialogHeader
        title="話題を広げる"
        message="話題を広げて、この話題を更に盛り上げましょう！"
      />
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <TextField
            placeholder="新しい話題のタイトル"
            titleTextSize={18}
            boldTitle={false}
            onChange={useCallback(setTitle, [title])}
          />
        </InputContainer>
        <Button type="submit" isEnabled={!!title}>作成</Button>
      </Form>
    </Dialog>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;

  & ${Button} {
    justify-self: right;
  }
`;

const InputContainer = styled.div`
  margin: 16px 0;
`;
