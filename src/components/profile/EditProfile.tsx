import { AvatarImage } from 'src/components/common/AvatarImage';
import { Button, TextButton } from 'src/components/common/Button';
import { TextField } from 'src/components/common/TextField';
import React, { useEffect, useState } from 'react';
import { UserEntity } from 'src/view/types/user';
import styled from 'styled-components';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useDispatch } from 'react-redux';
import { updateProfile as updateProfileAction } from 'src/data/redux/user/action';
import { useUserSelector } from 'src/data/redux/user/selector';
import { setUserActionState } from 'src/data/redux/user/slice';
import { UserActionStates } from 'src/data/redux/user/state';
import { ErrorDialog } from 'src/components/common/ErrorDialog';
import { useRouter } from 'next/router';
import { Snackbar } from 'src/components/common/Snackbar';
import { useDropzone } from 'react-dropzone';
import { LoadDialog } from 'src/components/common/LoadDialog';

type Props = {
  user: UserEntity
  loginId: string,
}

export const EditProfile = ({ user, loginId }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  const { getInputProps, open, acceptedFiles } = useDropzone({
    maxFiles: 2,
    accept: 'image/jpeg, image/png',
    noDrag: true,
    noKeyboard: true,
    noClick: true,
  });

  const [valid, setValid] = useState(false);
  const [name, setName] = useState(user.name);
  const [photo, setPhoto] = useState<File|null>(null);
  const { state } = useUserSelector();

  useEffect(() => () => {
    dispatcher(setUserActionState({ state: null }));
  }, []);

  useEffect(() => {
    if (acceptedFiles.length === 0) setPhoto(null);
    else setPhoto(acceptedFiles[0]);
  }, [acceptedFiles]);

  useEffect(() => {
    if (name) setValid(true);
    else setValid(false);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid) {
      dispatcher(updateProfileAction({
        userId: user.uid,
        loginId,
        name,
        photo: photo ?? undefined,
      }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {
        state === UserActionStates.PROFILE_UPDATING && <LoadDialog message="プロフィールを更新中です..." />
      }
      {
        state === UserActionStates.PROFILE_UPDATED && <Snackbar message="更新しました" />
      }
      <ErrorDialog
        message={state === UserActionStates.PROFILE_UPDATE_ERROR ? '更新中にエラーが発生しました' : null}
        closeMessage="再読込み"
        onClose={() => router.reload()}
      />
      <ProfileImageContainer>
        <input {...getInputProps()} />
        <AvatarImage size={126} floating src={photo ? URL.createObjectURL(photo) : user.photoUrl} />
        <TextButton type="button" onClick={() => open()}>アイコンを変更</TextButton>
      </ProfileImageContainer>
      <Spacer />
      <TextField
        placeholder="名前(ニックネーム)"
        initialValue={name}
        maxLength={50}
        onChange={(v) => setName(v)}
      />
      <SaveButton isEnabled={valid}>更新する</SaveButton>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SaveButton = styled(Button)`
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    align-self: flex-end;
  }
`;

const Spacer = styled.div`
  height: 16px;
  width: 100%;
`;

const ProfileImageContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 16px;

  & > ${TextButton} {
    margin-top: 8px;
  }
`;
