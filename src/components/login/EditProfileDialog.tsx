import { Dialog } from 'src/components/common/Dialog';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField } from 'src/components/common/TextField';
import { Button, TextButton } from 'src/components/common/Button';
import { AvatarImage } from 'src/components/common/AvatarImage';
import { useDropzone } from 'react-dropzone';
import { imagePath } from '../constants/imagePath';

type Props = {
  photoUrl: string | null,
  name: string | null,
  onSave: (name: string, photoUrl: string, imageFile: File | null) => void,
  onCancel: () => void
};

export const EditProfileDialog = ({
  photoUrl,
  name,
  onSave,
  onCancel,
}: Props) => {
  const defaultIconUrl = photoUrl || process.env.TEMPLATE_USER_ICON_URL || imagePath.character.blue;

  const [mName, setName] = useState(name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUri, setImageUri] = useState<string>(defaultIconUrl);

  const { getInputProps, open, acceptedFiles } = useDropzone({
    maxFiles: 2,
    accept: 'image/jpeg, image/png',
    noDrag: true,
    noKeyboard: true,
    noClick: true,
  });

  const handleOnSave = () => {
    if (!mName || mName.length === 0) {
      setNameError('表示名を入力してください');
      return;
    }
    onSave(mName, imageUri, imageFile);
  };

  useEffect(() => {
    if (acceptedFiles.length === 0) {
      setImageFile(null);
      setImageUri(defaultIconUrl);
    } else {
      setImageFile(acceptedFiles[0]);
      setImageUri(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [acceptedFiles]);

  return (
    <Dialog onClose={() => {}}>
      <Title>登録内容を修正</Title>
      <Spacer />
      <ProfileImageContainer>
        <input {...getInputProps()} />
        <AvatarImage size={126} src={imageUri} floating />
        <TextButton type="button" onClick={() => open()}>アイコンを変更</TextButton>
      </ProfileImageContainer>
      <Spacer />
      <TextField
        title="表示名"
        initialValue={name ?? undefined}
        error={nameError}
        maxLength={50}
        onChange={(v) => setName(v)}
      />
      <ButtonContainer>
        {name && photoUrl && <TextButton onClick={() => onCancel()}>修正を破棄</TextButton>}
        <Button onClick={() => handleOnSave()}>
          {
            name && photoUrl ? '修正を保存' : '保存'
          }
        </Button>
      </ButtonContainer>
    </Dialog>
  );
};

const Title = styled.h2`
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
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 8px;
  justify-content: flex-end;
  width: 100%;
`;
