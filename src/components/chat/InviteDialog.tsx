import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { SVGIcon } from 'src/components/common/SVGIcon';
import { useRouter } from 'next/router';
import CopyToClipboard from 'react-copy-to-clipboard';

// tslint:disable-next-line:variable-name
export const InviteDialog = () => {
  const router = useRouter();

  const [isClosed, setIsClosed] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${process.env.BASE_URL}${router.asPath}`);
  },        []);

  return (<>
    {
      !isClosed && (<Container>
        <Title>みんなを招待しましょう!</Title>
        <ActionContainer>
          <CloseButton onClick={() => setIsClosed(true)}>閉じる</CloseButton>
          <CopyToClipboard text={url} onCopy={() => setIsClosed(true)}>
            <TopicLinkButton>
              <div>リンクをコピー</div>
              <SVGIcon color={'rgba(0,0,0,.8)'} url={'/svg/content_copy.svg'}/>
            </TopicLinkButton>
          </CopyToClipboard>
        </ActionContainer>
      </Container>)
    }
  </>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, .2) 0 8px 16px 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  transition: all 0.2s ease-out 0s;
  z-index: 2000;
  position: absolute;
  bottom: 24px;
  right: 16px;

  & :before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -15px;
    border: 15px solid transparent;
    border-top: 15px solid white;
  }
`;

// tslint:disable-next-line:variable-name
const Title = styled.h2`
  font-size: 16px;
  margin-bottom: 8px;
`;

// tslint:disable-next-line:variable-name
const TopicLinkButton = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  background-color: #aee1e1;
  border-radius: 5px;
  padding: 8px 16px;

  & > div:first-child {
    margin-right: 8px;
  }
`;

// tslint:disable-next-line:variable-name
const CloseButton = styled.div`
  cursor: pointer;
`;

// tslint:disable-next-line:variable-name
const ActionContainer = styled.div`
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-right: 16px;
  }
`;
