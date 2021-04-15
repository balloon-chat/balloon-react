import React, { useEffect, useState } from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useUserSelector } from 'src/data/redux/user/selector';
import { EditProfileDialog } from 'src/components/login/EditProfileDialog';
import { WelcomeDialog } from 'src/components/login/WelcomeDialog';
import { createUser, login as loginAction, logout } from 'src/data/redux/user/action';
import { isInnerPath, pageTitle, rootPath } from 'src/view/route/pagePath';
import { LoadDialog } from 'src/components/common/LoadDialog';
import { LoginStates } from 'src/data/redux/user/state';
import Head from 'next/head';
import { Dialog } from 'src/components/common/Dialog';
import { Button } from 'src/components/common/Button';
import { resetUserState } from 'src/data/redux/user/slice';

const DialogStates = {
  SHOW_WELCOME: 'welcome',
  SHOW_EDIT: 'edit',
};

type DialogState = typeof DialogStates[keyof typeof DialogStates];

const LoginPage = () => {
  const dispatcher = useDispatch();
  const router = useRouter();
  const { return_to } = router.query;
  const { loginState } = useUserSelector();

  const [uid, setUid] = useState<string>();
  const [name, setName] = useState<string | null>();
  const [photoUrl, setPhotoUrl] = useState<string | null>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        setName(user.displayName);
        setPhotoUrl(user.photoURL);

        login(user).catch((e) => console.error(e));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loginState === LoginStates.USER_NOF_FOUND) {
      // Googleログインは成功したが、ユーザーが登録されていない
      if (name && photoUrl) {
        // 名前とアイコンが提供される場合は、ウェルカムダイアログを表示
        setDialogState(DialogStates.SHOW_WELCOME);
      } else {
        setDialogState(DialogStates.SHOW_EDIT);
      }
    } else {
      setDialogState(null);
    }
  }, [loginState]);

  useEffect(() => {
    if (loginState !== LoginStates.LOGGED_IN) return;

    if (return_to && typeof return_to === 'string' && isInnerPath(return_to)) {
      router.push(return_to).then();
    } else {
      router.push(rootPath.index).then();
    }
  }, [return_to, loginState]);

  const login = async (user: firebase.User) => {
    const token = await user.getIdToken();
    dispatcher(loginAction({ loginId: user?.uid, token }));
  };

  const resetLoginPageState = () => {
    setDialogState(null);
    dispatcher(logout());
    dispatcher(resetUserState());
  };

  const handleOnSaveEdit = (name: string, photoUrl: string, imageFile: File | null) => {
    setName(name);
    setPhotoUrl(photoUrl);
    setImageFile(imageFile);
    setDialogState(DialogStates.SHOW_WELCOME);
  };

  const createNewUser = () => {
    if (uid && name && photoUrl) {
      setDialogState(null); // close dialog
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
      <Head>
        <title>{pageTitle.login}</title>
      </Head>
      {
        loginState === LoginStates.FINDING && (
          <LoadDialog message="ユーザー情報を確認しています。" />
        )
      }
      {
        dialogState === DialogStates.SHOW_WELCOME && (
          <WelcomeDialog
            name={name!}
            imgUrl={photoUrl ?? ''}
            onEdit={() => setDialogState(DialogStates.SHOW_EDIT)}
            onCreateUser={createNewUser}
          />
        )
      }
      {
        dialogState === DialogStates.SHOW_EDIT && (
          <EditProfileDialog
            name={name ?? null}
            photoUrl={photoUrl ?? null}
            onCancel={() => setDialogState(DialogStates.SHOW_WELCOME)}
            onSave={handleOnSaveEdit}
          />
        )
      }
      {
        loginState === LoginStates.CREATING && (
          <LoadDialog message="ユーザー情報を登録しています。" />
        )
      }
      {
        loginState === LoginStates.LOGIN_ERROR && (
          <Dialog onClose={resetLoginPageState}>
            <ErrorDialogContainer>
              <div>ログイン中にエラーが発生しました。</div>
              <Button onClick={resetLoginPageState}>閉じる</Button>
            </ErrorDialogContainer>
          </Dialog>
        )
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

const ErrorDialogContainer = styled.div`
  display: flex;
  flex-direction: column;

  & ${Button} {
    margin-top: 32px;
  }
`;

export default LoginPage;
