import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/topic/Button';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createTopic } from 'src/data/redux/topic/action';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useRouter } from 'next/router';
import { setIsTopicCreated } from 'src/data/redux/topic/slice';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { TopicThumbnail } from 'src/components/topic/edit/TopicThumbnail';
import { CreateTopicDialog } from 'src/components/topic/edit/CreateTopicDialog';

// tslint:disable-next-line:variable-name
export const EditTopic = () => {

  const dispatcher = useDispatch();
  const router = useRouter();
  const userId = useUserSelector().uid;
  const topicId = useTopicState().topicId;
  const isTopicCreated = useTopicState().isTopicCreated;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<Blob | File>();
  const [isTopicCreating, setIsTopicCreating] = useState(false);

  useEffect(() => {
    if (topicId && isTopicCreated) navigateToTopic(topicId).then();
  },        [topicId, isTopicCreated]);

  const navigateToTopic = async (topicId: string) => {
    dispatcher(setIsTopicCreated({ isTopicCreated: true }));
    await router.push(`/topics/${topicId}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && userId && file) {
      setIsTopicCreating(true);
      dispatcher(createTopic({ title, userId, description, thumbnail: file }));
    }
  };

  return (<>
    {isTopicCreating && <CreateTopicDialog/>}
    <Form onSubmit={handleSubmit}>
      <InputRaw>
        <Title>タイトル</Title>
        <Input onChange={e => setTitle(e.target.value)}/>
      </InputRaw>
      <InputRaw>
        <Title>簡単な説明</Title>
        <Input onChange={e => setDescription(e.target.value)}/>
      </InputRaw>
      <ThumbnailInputRaw>
        <Title>サムネイル</Title>
        <ImageFileContext.Provider value={{ setImageFile: (blob => setFile(blob)) }}>
          <TopicThumbnail title={title} description={description}/>
        </ImageFileContext.Provider>
      </ThumbnailInputRaw>
      <CreateButton>作成</CreateButton>
    </Form>
  </>);
};

// tslint:disable-next-line:variable-name
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

// tslint:disable-next-line:variable-name
const InputRaw = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

// tslint:disable-next-line:variable-name
const ThumbnailInputRaw = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

// tslint:disable-next-line:variable-name
const Title = styled.div`
  color: rgba(0, 0, 0, .6);
  font-size: 14px;
  margin-bottom: 4px;
`;

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

// tslint:disable-next-line:variable-name
const CreateButton = styled(Button)`
  margin-left: auto;
`;
