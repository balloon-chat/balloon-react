import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import 'firebase/auth';
import { AuthService } from 'src/domain/auth/service/AuthService';
import { setUser } from 'src/data/redux/user/slice';

export const AuthProvider: React.FC = ({ children }) => {
  const dispatcher = useDispatch();

  const getUserProfile = async () => {
    const service = new AuthService();
    const result = await service.getUserProfile();
    if (!result) return;
    const { id, photoUrl, name } = result;
    dispatcher(setUser({ uid: id, photoUrl, name }));
  };

  useEffect(() => {
    getUserProfile().then();
  }, []);

  return <>{children}</>;
};
