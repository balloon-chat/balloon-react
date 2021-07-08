import styled from 'styled-components';
import React, { useState } from 'react';

type Props = {
  initialValue?: string | null,
  placeholder?: string,
  title?: string,
  titleTextSize?: number,
  boldTitle?: boolean,
  maxLength?: number,
  onChange: (value :string) => void,
  error?: string | null
}

export const TextField = ({
  initialValue,
  title,
  titleTextSize,
  boldTitle = true,
  maxLength,
  placeholder,
  error,
  onChange,
}: Props) => {
  const [text, setText] = useState(initialValue);

  const handleOnChange = (input: string) => {
    onChange(input);
    setText(input);
  };

  return (
    <InputRow>
      <Title
        bold={boldTitle}
        textSize={titleTextSize}
      >
        {title}
      </Title>
      <Input
        defaultValue={initialValue ?? undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => handleOnChange(e.target.value)}
      />
      <InputRowFooter>
        {error && (<ErrorMessage>{error}</ErrorMessage>)}
        {maxLength && <CharacterCount>{`${text?.length ?? 0}/${maxLength}`}</CharacterCount>}
      </InputRowFooter>
    </InputRow>
  );
};

const InputRow = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const InputRowFooter = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: 4px;
`;

const Title = styled.div<{textSize?: number, bold: boolean}>`
  font-size: ${(props) => props.textSize ?? 20}px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 20px;

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

const ErrorMessage = styled.div`
  font-size: 15px;
  margin-top: 4px;
  
  :before {
    color: white;
    content: '警告';
    border-radius: 5px;
    background-color: #e53935;
    font-weight: bold;
    padding: 2px 8px;
    margin-right: 4px;
  }
`;

const CharacterCount = styled.div`
  margin-left: auto;
  color: grey;
`;
