import React, { useEffect, useState } from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';
import { EditProfileDialog } from 'src/components/login/EditProfileDialog';
import { WelcomeDialog } from 'src/components/login/WelcomeDialog';
import { createUser, login } from 'src/data/redux/user/action';
import { isInnerPath, rootPath } from 'src/view/route/pagePath';
import { LoadDialog } from 'src/components/common/LoadDialog';

const LoginPage = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;
  const { isLoggedIn } = useUserSelector();

  const [uid, setUid] = useState<string>();
  const [name, setName] = useState<string | null>();
  const [photoUrl, setPhotoUrl] = useState<string | null>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  /**
   * ユーザー情報の編集状態を管理
   */
  const [isEditing, setIsEditing] = useState(false);
  /**
   * ユーザーの作成状態を管理
   */
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
          setName(user.displayName);
          setPhotoUrl(user.photoURL);
          setIsEditing(!user.displayName || !user.photoURL);
          dispatcher(login({ loginId: user?.uid }));
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (return_to && typeof return_to === 'string' && isInnerPath(return_to)) {
      router.push(return_to).then();
    } else {
      router.push(rootPath.index).then();
    }
  }, [return_to, isLoggedIn]);

  const handleOnSaveEdit = (name: string, photoUrl: string, imageFile: File | null) => {
    setName(name);
    setPhotoUrl(photoUrl);
    setImageFile(imageFile);
    setIsEditing(false);
  };

  const createNewUser = () => {
    if (uid && name && photoUrl) {
      setIsCreating(true);
      dispatcher(
        createUser({
          loginId: uid,
          name,
          photo: imageFile ?? photoUrl,
        }),
      );
    }
  };

  return (
    <>
      {
        uid && !isEditing && (
          <WelcomeDialog
            name={name!}
            imgUrl={photoUrl ?? ''}
            onEdit={() => setIsEditing(true)}
            onCreateUser={createNewUser}
          />
        )
      }
      {
        isEditing && (
          <EditProfileDialog
            name={name ?? null}
            photoUrl={photoUrl ?? null}
            onCancel={() => setIsEditing(false)}
            onSave={handleOnSaveEdit}
          />
        )
      }
      {
        isCreating && <LoadDialog message="ユーザー情報を登録しています。" />
      }
      <Container>
        <LoginDialog />
      </Container>
    </>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: #aee1e1;
  display: flex;
  height: 100%;
  justify-content: center;
`;

export default LoginPage;
