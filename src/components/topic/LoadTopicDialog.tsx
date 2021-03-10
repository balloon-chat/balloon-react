import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const LoadTopicDialog = () => {
  return (<DialogContainer>
    <Dialog>
      <DialogTitle>ちょっと待ってね！</DialogTitle>
      <DialogMessage>話題を読み込んでいます。</DialogMessage>
      <DialogImage src={'/images/character_blue.png'} width={100}/>
    </Dialog>
  </DialogContainer>);
};

// tslint:disable-next-line:variable-name
const DialogContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

// tslint:disable-next-line:variable-name
const Dialog = styled.div`
  padding: 32px 62px;
  background-color: white;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
const DialogTitle = styled.div`
  font-size: 24px;
  margin: 0;
`;

// tslint:disable-next-line:variable-name
const DialogMessage = styled.div`
  margin-bottom: 32px;
  color: rgba(0,0,0,.6);
`;

// tslint:disable-next-line:variable-name
const DialogImage = styled.img`
  animation-name: fade;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;
