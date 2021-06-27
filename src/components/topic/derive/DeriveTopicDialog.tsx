import React, { FormEvent, useCallback, useState } from 'react';
import { Dialog } from 'src/components/common/Dialog';
import { Button } from 'src/components/common/Button';
import { TextField } from 'src/components/common/TextField';
import styled from 'styled-components';

type Props = {
  onClose: () => void,
}

export const DeriveTopicDialog = ({ onClose }: Props) => {
  const [title, setTitle] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog onClose={useCallback(onClose, [])}>
      <Title>話題を広げる</Title>
      <div>話題を広げて、この話題を更に盛り上げましょう！</div>
      <Form onSubmit={useCallback(handleSubmit, [title])}>
        <InputContainer>
          <TextField
            placeholder="新しい話題のタイトル"
            titleTextSize={18}
            boldTitle={false}
            onChange={useCallback(setTitle, [title])}
          />
        </InputContainer>
        <Button isEnabled={!!title}>作成</Button>
      </Form>
    </Dialog>
  );
};

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  & ${Button} {
    justify-self: right;
  }
`;

const InputContainer = styled.div`
  margin-top: 32px;
  margin-bottom: 16px;
`;
