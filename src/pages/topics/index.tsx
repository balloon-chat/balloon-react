import React, { CSSProperties, useEffect } from 'react';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { TopicList } from 'src/components/topic/TopicList';
import { UserService } from 'src/domain/user/service/userService';
import { setUserId } from 'src/data/redux/user/slice';
import { useDispatch } from 'react-redux';

// tslint:disable-next-line:variable-name
const RoomIndexPage = () => {
  const dispatcher = useDispatch();

  useEffect(() => {
    // TODO: delete this
    const service = new UserService();
    dispatcher(setUserId(service.getCurrentUserId().value));
  },        []);
  return (<div style={page}>
    <NavBarSmall/>
    <div style={body}>
      <TopicList/>
    </div>
  </div>);
};

const page: CSSProperties = {
  minWidth: 370,
} as const;

const body: CSSProperties = {
  boxSizing: 'border-box',
  backgroundColor: '#AEE1E1',
  width: '100%',
} as const;

export default RoomIndexPage;
