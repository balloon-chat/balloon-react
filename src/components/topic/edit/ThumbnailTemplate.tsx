import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ImageFileContext } from 'src/components/topic/edit/context';

type Props = {
  title: string,
  description?: string,
};

// tslint:disable-next-line:variable-name
export const ThumbnailTemplate = ({ title, description }: Props) => {
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
    image.src = '/images/topic_template.png';
    image.onload = () => setImage(image);
  },        []);

  useEffect(() => {
    if (!context) return;
    if (!image) return;

    // 画像とテキストを描画
    draw(context, image, title, description);

    // 作成された画像をコンテキストに反映
    context?.canvas.toBlob(async (blob) => {
      if (blob) setImageFile(blob);
    },                     'image/jpeg');

  },        [context, image, title, description]);

  return (<Canvas width={1200} ref={canvasRef}/>);
};

// tslint:disable-next-line:variable-name
const Canvas = styled.canvas`
  width: 100%;
`;

const textHeight = (textMetrics: TextMetrics) => {
  return textMetrics.fontBoundingBoxAscent - textMetrics.fontBoundingBoxDescent;
};

const draw = (
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    title: string,
    description?: string,
) => {
  const canvas = context.canvas;
  const width = canvas.width;
  const height = width / image.naturalWidth * image.naturalHeight;
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
  const titleHeight = textHeight(titleMetrics);

  if (description) {

    context.font = descriptionFont;
    const descriptionMetrics = context.measureText(description);
    const descriptionHeight = textHeight(descriptionMetrics);

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
