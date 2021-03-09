import { CSSProperties, FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/topic/Button';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createRoom } from 'src/data/redux/room/action';
import { useRoomState } from 'src/data/redux/room/selector';
import { useRouter } from 'next/router';
import { setIsRoomCreated } from 'src/data/redux/room/slice';
import { UserService } from 'src/domain/user/service/userService';
import { setUserId } from 'src/data/redux/user/slice';

// tslint:disable-next-line:variable-name
export const EditTopic = () => {

  const dispatcher = useDispatch();
  const router = useRouter();
  const userId = useUserSelector().uid;
  const roomId = useRoomState().roomId;
  const isRoomCreated = useRoomState().isRoomCreated;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // TODO: remove this
  useEffect(() => {
    const service = new UserService();
    dispatcher(setUserId(service.getCurrentUserId().value));
  },        []);

  useEffect(() => {
    if (roomId && isRoomCreated) navigateToRoom(roomId).then();
  },        [roomId, isRoomCreated]);

  const navigateToRoom = async (roomId: string) => {
    dispatcher(setIsRoomCreated({ isRoomCreated: true }));
    await router.push(`/topics/${roomId}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && userId) dispatcher(createRoom({ title, userId, description }));
  };

  return (<form style={form} onSubmit={handleSubmit}>
    <label style={field}>
      <div style={titleStyle}>タイトル</div>
      <Input onChange={e => setTitle(e.target.value)}/>
    </label>
    <label style={field}>
      <div style={titleStyle}>簡単な説明</div>
      <Input onChange={e => setDescription(e.target.value)}/>
    </label>
    <Button style={createButton}>作成</Button>
  </form>);
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

const titleStyle: CSSProperties = {
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
