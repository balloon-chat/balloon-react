import ReactImageUploading, { ImageType } from 'react-images-uploading';
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

type Props = {
  user: UserEntity
  loginId: string,
}

export const EditProfile = ({ user, loginId }: Props) => {
  const dispatcher = useDispatch();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [valid, setValid] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [image, setImage] = useState<ImageType|null>(null);
  const { state } = useUserSelector();

  useEffect(() => () => {
    dispatcher(setUserActionState(null));
  }, []);

  useEffect(() => {
    console.log(name);
    if (name && photoUrl) setValid(true);
    else setValid(false);
  }, [name, image]);

  const updateImage = (image?: ImageType) => {
    if (image) setImage(image);
    if (image?.dataURL) setPhotoUrl(image.dataURL);
  };

  const updateProfile = () => {
    if (valid) {
      dispatcher(updateProfileAction({
        userId: user.uid,
        loginId,
        name,
        photo: image?.file,
      }));
    }
  };

  return (
    <>
      {
        state === UserActionStates.PROFILE_UPDATED && <Snackbar message="更新しました" />
      }
      {
        state === UserActionStates.PROFILE_UPDATE_ERROR && (
          <ErrorDialog
            message="更新中にエラーが発生しました"
            closeMessage="再読込み"
            onClose={() => router.reload()}
          />
        )
      }
      <ReactImageUploading
        maxNumber={2}
        onChange={(imageList) => updateImage(imageList[imageList.length - 1])}
        value={image ? [image] : []}
      >
        {
        ({
          onImageUpload,
        }) => (
          <ProfileImageContainer>
            <AvatarImage size={126} floating src={photoUrl} />
            <TextButton onClick={onImageUpload}>アイコンを変更</TextButton>
          </ProfileImageContainer>
        )
      }
      </ReactImageUploading>
      <Spacer />
      <TextField
        placeholder="名前(ニックネーム)"
        initialValue={name}
        maxLength={50}
        onChange={(v) => setName(v)}
      />
      <SaveButton
        onClick={() => updateProfile()}
        isEnabled={valid}
      >
        更新する
      </SaveButton>
    </>
  );
};

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
