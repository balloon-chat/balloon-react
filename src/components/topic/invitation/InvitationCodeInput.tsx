import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { InvitationCode } from 'src/domain/topic/models/invitationCode';

type Props = {
  onUpdateCodes: (codes: (number|null)[]) => void
}

export const InvitationCodeInput = ({ onUpdateCodes }: Props) => {
  const { codeLength } = InvitationCode;
  const [codes, setCodes] = useState<(number | null)[]>(Array(codeLength).fill(null));
  const inputs = Array<HTMLInputElement|null>(codeLength).fill(null);

  useEffect(() => {
    onUpdateCodes(codes);
  }, [codes]);

  const handleOnChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let code : number|null = null;

    // 数字以外の入力値の場合、更新しない
    const n = parseInt(e.currentTarget.value, 10);
    if (!Number.isNaN(n)) {
      code = n % 10;
    }

    setCodes((prev) => {
      const codes = prev.slice(); // 値をコピー
      codes[i] = code ?? codes[i];
      return codes;
    });

    // 最後の入力欄に関しては、00 などを受け付けてしまうため
    // 強制的に入力値を更新する。
    if (i === codeLength - 1) e.currentTarget.value = code !== null ? `${code}` : '';

    if (code !== null && i < codeLength - 1) {
      inputs[i + 1]?.focus();
    } else {
      inputs[i]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const isBackspace = key === 'Backspace';
    const isArrowLeft = key === 'ArrowLeft';
    const isArrowRight = key === 'ArrowRight';
    // 数字キーの数字以外の入力だった場合は、入力を拒否する
    const isOperatorOrDot = /[+-.]/.test(key);
    if (
      isBackspace
      || isArrowLeft
      || isArrowRight
      || isOperatorOrDot
    ) {
      e.preventDefault();
    }

    // Backspaceの場合、値の削除、または、前の入力セルにカーソルを移動
    if (isBackspace) {
      if (codes[i] === null && i > 0) {
        inputs[i - 1]?.focus();
      } else {
        setCodes((prev) => {
          const codes = prev.slice(); // 値をコピー
          codes[i] = null;
          return codes;
        });
      }
      return;
    }

    // 矢印キーの場合、カーソルを移動
    if (isArrowLeft && i > 0) {
      inputs[i - 1]?.focus();
      return;
    } if (isArrowRight && i < codeLength - 1) {
      inputs[i + 1]?.focus();
    }
  };

  /**
   * ペーストされた値が、以下のフォーマットに従う場合、入力値を更新する
   * 12345678, 1234-5678, 1234 - 5678
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 空白やハイフンを削除
    const regx = /[\s-]/;
    let value = e.clipboardData.getData('text/plain');
    while (regx.test(value)) {
      value = value.replace(regx, '');
    }

    // 入力値の検証
    if (value.length !== codeLength) return;
    if (Number.isNaN(!parseInt(value, 10))) return;

    // 値を更新
    const nums = value
      .split('')
      .map((v) => parseInt(v, 10));
    setCodes(nums);
  };

  const cells = codes.map((v, i) => (
    <InputCell
      key={i}
      code={v}
      ref={(el) => { inputs[i] = el; }}
      onChange={(e) => handleOnChange(i, e)}
      onKeyDown={(e) => handleKeyDown(i, e)}
      onPaste={(e) => handlePaste(e)}
    />
  ));

  return (
    <Container>
      <InputContainer>
        {
          cells.slice(0, codeLength / 2)
        }
      </InputContainer>
      <InputDivider>—</InputDivider>
      <InputContainer>
        {
          cells.slice(codeLength / 2)
        }
      </InputContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  max-width: 500px;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
`;

type InputCellProps = {
  code: number | null,
} & React.InputHTMLAttributes<HTMLInputElement>

const InputCell = React.forwardRef<HTMLInputElement, InputCellProps>((
  props,
  ref,
) => {
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <Input
      type="number"
      placeholder="0"
      pattern="[0-9]"
      maxLength={1}
      hasFocs={hasFocus}
      value={props.code ?? ''}
      ref={ref}
      {...props}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    />
  );
});

const Input = styled.input<{hasFocs: boolean}>`
  appearance: none;
  border: none;
  border-image: none;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.hasFocs ? '#fa9905' : 'rgba(0, 0, 0, .6)')};
  color: rgba(0,0,0,.8);
  font-size: 20px;
  font-weight: bold;
  outline: none;
  cursor: text;
  text-align: center;
  width: 100%;
  padding: 8px 0;

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InputDivider = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin: 0 16px;
`;
