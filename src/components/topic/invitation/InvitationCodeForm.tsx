import React, { useEffect, useState } from 'react';
import { InvitationCodeInput } from 'src/components/topic/invitation/InvitationCodeInput';
import { Button } from 'src/components/common/Button';
import styled from 'styled-components';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useRouter } from 'next/router';
import { useTopicState } from 'src/data/redux/topic/selector';
import { topicStates } from 'src/data/redux/topic/state';
import { useDispatch } from 'react-redux';
import { resetTopicState } from 'src/data/redux/topic/slice';
import { rootPath } from 'src/view/route/pagePath';

export const InvitationCodeForm = () => {
  const router = useRouter();
  const dispatcher = useDispatch();

  const [codes, setCodes] = useState<(number | null)[]|null>();
  const [isAvailable, setIsAvailable] = useState(false);

  const { state, topicId } = useTopicState();

  useEffect(() => {
    const filled = codes?.every((c) => c !== null);
    setIsAvailable(filled ?? false);
  }, [codes]);

  useEffect(() => {
    if (state === topicStates.TOPIC_FOUND && topicId) {
      // 話題のページにリダイレクト
      router.push(rootPath.topicPath.topic(topicId)).then(() => {
        dispatcher(resetTopicState());
      });
    }
  });

  const updatedCodes = (codes: (number|null)[]) => {
    setCodes(codes);
    if (state === topicStates.CANNOT_FIND_BY_CODE) {
      dispatcher(resetTopicState());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 入力値の検証
    if (!codes) return;
    const c = codes.filter<number>((c): c is number => c !== null);
    if (c.length !== codes.length) return;
    await router.push(
      {
        path: rootPath.topicPath.index,
        query: { code: c.join('') },
      },
      undefined,
      {
        shallow: false,
      },
    );
  };

  return (
    <Wrapper>
      <Container>
        <Title>招待コードから参加する</Title>
        <Form onSubmit={handleSubmit}>
          <InvitationCodeInput onUpdateCodes={updatedCodes} />
          <Button isEnabled={isAvailable}>参加する</Button>
        </Form>
        {
          state === topicStates.CANNOT_FIND_BY_CODE
            && <InvitationError>招待コードに対応する話題がありませんでした。</InvitationError>
        }
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  padding: 32px 16px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    padding: 64px 16px;
  }
`;

const Title = styled.h3`
`;

const InvitationError = styled.div`
  color: red;
  margin-top: 8px;
`;

const Form = styled.form`
  align-items: center;
  margin-top: 16px;
  display: flex;
  flex-direction: column;

  & ${Button} {
    margin-top: 16px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    & ${Button} {
      margin-top: 0;
    }
  }
`;
