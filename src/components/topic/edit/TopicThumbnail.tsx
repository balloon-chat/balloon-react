import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThumbnailTemplate } from 'src/components/topic/edit/ThumbnailTemplate';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { DeleteImageButton, UploadImageButton } from 'src/components/topic/edit/UploadImageButton';
import { UploadDialog } from 'src/components/topic/edit/UploadDialog';
import Delete from 'src/components/svgs/delete.svg';
import UploadFile from 'src/components/svgs/upload_file.svg';
import { useDropzone } from 'react-dropzone';

type Props = {
  title: string,
  imgUrl: string| null,
  description: string,
};

export const TopicThumbnail = ({
  title,
  imgUrl,
  description,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string|null>(imgUrl);
  const { setImageFile } = useContext(ImageFileContext);

  const { getRootProps, getInputProps, open, isDragActive, acceptedFiles } = useDropzone({
    maxFiles: 2,
    accept: 'image/jpeg, image/png',
    noKeyboard: true,
    noClick: true,
  });

  useEffect(() => {
    if (acceptedFiles.length === 0) {
      setImageUrl(null);
    } else {
      setImageFile(acceptedFiles[0]);
      setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [acceptedFiles]);

  return (
    <>
      <input {...getInputProps()} />
      <UploadDialog isDragging={isDragActive as boolean} />
      <div {...getRootProps()}>
        {imageUrl ? (
          <ThumbnailImage src={imageUrl} alt="" />
        ) : (
          <ThumbnailTemplate title={title} description={description} />
        )}
      </div>
      {imageUrl ? (
        <DeleteImageButton type="button" onClick={() => setImageUrl(null)}>
          <Delete />
          アップロードした画像を削除
        </DeleteImageButton>
      ) : (
        <UploadImageButton type="button" onClick={() => open()}>
          <UploadFile />
          サムネイル画像をアップロード
        </UploadImageButton>
      )}
    </>
  );
};

const ThumbnailImage = styled.img`
  object-fit: contain;
  max-height: 400px;
  width: 100%;
  margin-bottom: 8px;
`;
