import { Dialog } from 'src/components/common/Dialog';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from 'src/components/common/TextField';
import { Button, TextButton } from 'src/components/common/Button';
import ReactImageUploading, { ImageType } from 'react-images-uploading';
import { AvatarImage } from 'src/components/common/AvatarImage';

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
  const [mName, setName] = useState(name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [image, setImage] = useState<ImageType>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleOnSave = () => {
    if (!mName || mName.length === 0) {
      setNameError('表示名を入力してください');
      return;
    }

    const defaultIconUrl = process.env.TEMPLATE_USER_ICON_URL;
    if (!photoUrl && !defaultIconUrl && !imageFile) {
      return;
    }
    onSave(
      mName,
      image?.dataURL ?? photoUrl ?? defaultIconUrl!,
      imageFile,
    );
  };

  const updateImage = (image?: ImageType) => {
    setImage(image);
    if (image?.file) setImageFile(image.file);
  };

  return (
    <Dialog onClose={() => {
    }}
    >
      <Title>登録内容を修正</Title>
      <Spacer />
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
              <AvatarImage
                size={126}
                floating
                src={image?.dataURL ?? photoUrl ?? '/images/character_blue.png'}
              />
              <TextButton onClick={onImageUpload}>アイコンを変更</TextButton>
            </ProfileImageContainer>
          )
        }
      </ReactImageUploading>
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
