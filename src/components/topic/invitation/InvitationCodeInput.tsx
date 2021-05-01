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

  const handleUpdateCode = (i: number, code: number | null) => {
    setCodes((prev) => {
      const codes = prev.slice();
      if (code !== null && !Number.isNaN(code)) {
        codes[i] = code % 10;
      } else {
        codes[i] = null;
      }
      return codes;
    });

    if (code !== null && i < codeLength - 1) {
      inputs[i + 1]?.focus();
    } else {
      inputs[i]?.focus();
    }
  };

  const handleBack = (i: number, key: string) => {
    const isBackspace = key === 'Backspace';
    if (isBackspace && codes[i] === null) {
      inputs[i - 1]?.focus();
    }
  };

  const cells = codes.map((v, i) => (
    <InputCell
      key={i}
      code={v}
      ref={(el) => { inputs[i] = el; }}
      onChanged={(code) => handleUpdateCode(i, code)}
      onKeyDown={(key) => handleBack(i, key)}
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
  onChanged: (code: number) => void,
  onKeyDown: (key: string) => void,
}
const InputCell = React.forwardRef<HTMLInputElement, InputCellProps>((
  { code, onChanged, onKeyDown },
  ref,
) => {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <Input
      type="number"
      placeholder="0"
      maxLength={1}
      hasFocs={hasFocus}
      value={code ?? undefined}
      onChange={(e) => onChanged(parseInt(e.currentTarget.value, 10))}
      onKeyDown={(e) => onKeyDown(e.key)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      ref={ref}
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
