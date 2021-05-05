import ReactImageUploading, { ImageType } from 'react-images-uploading';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ThumbnailTemplate } from 'src/components/topic/edit/ThumbnailTemplate';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { DeleteImageButton, UploadImageButton } from 'src/components/topic/edit/UploadImageButton';
import { UploadDialog } from 'src/components/topic/edit/UploadDialog';
import Delete from 'src/components/svgs/delete.svg';
import UploadFile from 'src/components/svgs/upload_file.svg';

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
  const [imageUrl, setImageUrl] = useState<string|undefined>(imgUrl ?? undefined);
  const { setImageFile } = useContext(ImageFileContext);

  const updateImage = (image?: ImageType) => {
    setImageUrl(image?.dataURL);

    if (image?.file) setImageFile(image.file);
  };

  return (
    <ReactImageUploading
      maxNumber={2}
      onChange={(imageList) => updateImage(imageList[imageList.length - 1])}
      value={imageUrl ? [{ dataUrl: imageUrl }] : []}
    >
      {({
        onImageUpload,
        onImageRemoveAll,
        isDragging,
        dragProps,
      }) => (
        <div {...dragProps}>
          <UploadDialog isDragging={isDragging as boolean} />
          {imageUrl ? (
            <ThumbnailImage src={imageUrl} alt="" />
          ) : (
            <ThumbnailTemplate title={title} description={description} />
          )}
          {imageUrl ? (
            <DeleteImageButton onClick={onImageRemoveAll}>
              <Delete />
              アップロードした画像を削除
            </DeleteImageButton>
          ) : (
            <UploadImageButton onClick={onImageUpload}>
              <UploadFile />
              サムネイル画像をアップロード
            </UploadImageButton>
          )}
        </div>
      )}
    </ReactImageUploading>
  );
};

const ThumbnailImage = styled.img`
  object-fit: contain;
  max-height: 400px;
  width: 100%;
  margin-bottom: 8px;
`;
