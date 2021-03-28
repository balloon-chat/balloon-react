import ReactImageUploading, { ImageType } from 'react-images-uploading';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { SVGIcon } from 'src/components/common/SVGIcon';
import { ThumbnailTemplate } from 'src/components/topic/edit/ThumbnailTemplate';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { DeleteImageButton, UploadImageButton } from 'src/components/topic/edit/UploadImageButton';
import { UploadDialog } from 'src/components/topic/edit/UploadDialog';

type Props = {
  title: string;
  description: string;
};

// tslint:disable-next-line:variable-name
export const TopicThumbnail = ({ title, description }: Props) => {
  const dataURLKey = 'data_url';
  const [image, setImage] = useState<ImageType>();
  const { setImageFile } = useContext(ImageFileContext);

  const updateImage = (image?: ImageType) => {
    setImage(image);
    if (image?.file) setImageFile(image.file);
  };

  return (
    <ReactImageUploading
      dataURLKey={dataURLKey}
      maxNumber={2}
      onChange={(imageList) => updateImage(imageList[imageList.length - 1])}
      value={image ? [image] : []}
    >
      {({ onImageUpload, onImageRemoveAll, isDragging, dragProps }) => (
        <div {...dragProps}>
          <UploadDialog isDragging={isDragging as boolean} />
          {image ? (
            <ThumbnailImage src={image[dataURLKey]} alt="" />
          ) : (
            <ThumbnailTemplate title={title} description={description} />
          )}
          {image ? (
            <DeleteImageButton onClick={onImageRemoveAll}>
              <SVGIcon url="/svg/delete-24px.svg" />
              アップロードした画像を削除
            </DeleteImageButton>
          ) : (
            <UploadImageButton onClick={onImageUpload}>
              <SVGIcon url="/svg/upload_file-24px.svg" />
              サムネイル画像をアップロード
            </UploadImageButton>
          )}
        </div>
      )}
    </ReactImageUploading>
  );
};

// tslint:disable-next-line:variable-name
const ThumbnailImage = styled.img`
  object-fit: contain;
  max-height: 400px;
  width: 100%;
  margin-bottom: 8px;
`;
