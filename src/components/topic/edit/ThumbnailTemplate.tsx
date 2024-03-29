import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ImageFileContext } from 'src/components/topic/edit/context';
import { imagePath } from 'src/components/constants/imagePath';

type Props = {
  title: string;
  description?: string;
};

export const ThumbnailTemplate = ({
  title,
  description,
}: Props) => {
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const [image, setImage] = useState<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setImageFile } = useContext(ImageFileContext);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) setContext(context);
    }

    // 画像を一度だけ読み込んで、再利用する。
    const image = new Image();
    image.src = imagePath.topic.thumbnailTemplate;
    image.onload = () => setImage(image);
  }, []);

  useEffect(() => {
    if (!context) return;
    if (!image) return;

    // 画像とテキストを描画
    draw(context, image, title, description);

    // 作成された画像をコンテキストに反映
    context?.canvas.toBlob(async (blob) => {
      if (blob) setImageFile(blob);
    }, 'image/jpeg');
  }, [context, image, title, description]);

  return <Canvas width={1200} ref={canvasRef} />;
};

const Canvas = styled.canvas`
  width: 100%;
`;

function getTextHeight(textMetrics: TextMetrics) {
  return textMetrics.fontBoundingBoxAscent - textMetrics.fontBoundingBoxDescent;
}

const draw = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  title: string,
  description?: string,
) => {
  const { canvas } = context;
  const { width } = canvas;
  const height = (width / image.naturalWidth) * image.naturalHeight;
  canvas.height = height;

  /*
    画像を描画
   */
  context.drawImage(image, 0, 0, width, height);

  /*
    文字を描画
   */
  const titleFont = 'bold 48px sans-serif';
  const descriptionFont = '24px sans-serif';

  context.font = titleFont;
  const titleMetrics = context.measureText(title);
  const titleHeight = getTextHeight(titleMetrics);

  if (description) {
    context.font = descriptionFont;
    const descriptionMetrics = context.measureText(description);
    const descriptionHeight = getTextHeight(descriptionMetrics);

    context.font = titleFont;
    context.fillText(
      title,
      (width - titleMetrics.width) / 2,
      (height + titleHeight - descriptionHeight) / 2,
    );

    context.font = descriptionFont;
    context.fillText(
      description,
      (width - descriptionMetrics.width) / 2,
      (height + titleHeight + descriptionHeight) / 2 + 16,
    );
  } else {
    context.font = titleFont;
    context.fillText(
      title,
      (width - titleMetrics.width) / 2,
      (height + titleHeight) / 2,
    );
  }
};
