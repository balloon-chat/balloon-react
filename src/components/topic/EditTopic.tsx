import { ContainerCard } from 'src/components/topic/ContainerCard';
import { CSSProperties } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/topic/Button';

// tslint:disable-next-line:variable-name
export const EditTopic = () => {
  return (<ContainerCard>
    <form style={form}>
      <label style={field}>
        <div style={title}>タイトル</div>
        <Input/>
      </label>
      <label style={field}>
        <div style={title}>簡単な説明</div>
        <Input/>
      </label>
      <Button style={createButton}>作成</Button>
    </form>
  </ContainerCard>);
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  maxWidth: 800,
  margin: '0 auto',
} as const;

const field: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24,
} as const;

const title: CSSProperties = {
  color: 'rgba(0, 0, 0, .6)',
  fontSize: 14,
  marginBottom: 4,
} as const;

// tslint:disable-next-line:variable-name
const Input = styled.input`
  padding: 8px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 5px;

  :focus {
    border: 1px solid #5B87FA;
    outline: none;
  }
`;

const createButton: CSSProperties = {
  marginLeft: 'auto',
} as const;
