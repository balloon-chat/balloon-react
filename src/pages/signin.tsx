import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { pageTitle, rootPath } from 'src/view/route/pagePath';
import { WelcomeDialog } from 'src/components/login/WelcomeDialog';
import { EditProfileDialog } from 'src/components/login/EditProfileDialog';
import { createUser } from 'src/data/redux/user/action';
import { AuthService } from 'src/domain/auth/service/AuthService';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type Props = {
  name: string | null,
  photoUrl: string | null,
  accessToken: string | null,
}

const DialogStates = {
  SHOW_WELCOME: 'welcome',
  SHOW_EDIT: 'edit',
};

type DialogState = typeof DialogStates[keyof typeof DialogStates];

const SignInPage = ({ accessToken, name, photoUrl }: Props) => {
  const [mName, setName] = useState<string | null>(name);
  const [mPhotoUrl, setPhotoUrl] = useState<string | null>(photoUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(DialogStates.SHOW_WELCOME);

  const router = useRouter();
  const dispatcher = useDispatch();

  useEffect(() => {
    if (accessToken == null) {
      router.push(rootPath.login).then();
    }
  }, []);

  const handleOnSaveEdit = (name: string, photoUrl: string, imageFile: File | null) => {
    setName(name);
    setPhotoUrl(photoUrl);
    setImageFile(imageFile);
    setDialogState(DialogStates.SHOW_WELCOME);
  };

  const createNewUser = async () => {
    // Firebaseにログイン
    const credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
    const result = await firebase.auth().signInWithCredential(credential);

    if (result.user && mName && mPhotoUrl) {
      dispatcher(
        createUser({
          loginId: result.user.uid,
          name: mName,
          photo: imageFile ?? mPhotoUrl,
        }),
      );
    }

    await router.push(rootPath.index).then();
  };

  return (
    <>
      <Head>
        <title>{pageTitle.signIn}</title>
      </Head>
      <Container>
        {
        accessToken !== null && dialogState === DialogStates.SHOW_WELCOME && (
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const service = new AuthService();

  try {
    const result = await service.getOauthResult(context.req.headers.cookie!);
    return { props: result } as const;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      accessToken: null,
      name: null,
      photoUrl: null,
    },
  };
};

export default SignInPage;
