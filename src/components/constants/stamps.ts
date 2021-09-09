import { imagePath } from 'src/components/constants/imagePath';

type Props = {
  // プレビューに表示するタイトル（どのような表情になるか）
  title: string,

  // 実際に送信するメッセージ
  message: string,

  // プレビュー画像
  imageUrl: string,
}
/**
 * キャラクターとして表示すると、表情に見えるメッセージの一覧
 * バックスラッシュを含むものは、エスケープ処理が必須
 */
export const stamps: Array<Props> = [
  {
    title: '笑',
    message: '〃　　▽　　〃',
    imageUrl: imagePath.stamps.smile1,
  },
  {
    title: 'ぷっ',
    message: '〃　　c_　　〃',
    imageUrl: imagePath.stamps.smile2,
  },
  {
    title: 'ハナタカ',
    message: '/_',
    imageUrl: imagePath.stamps.proud,
  },
  {
    title: 'ゲッ',
    message: '〃　　д　　〃',
    imageUrl: imagePath.stamps.surprise1,
  },
  {
    title: 'ぽかーん',
    message: '□',
    imageUrl: imagePath.stamps.surprise2,
  },
  {
    title: 'ヒゲ',
    message: '////　　\\\\\\\\',
    imageUrl: imagePath.stamps.moustache,
  },
  {
    title: '照れ1',
    message: '****　　　 ****',
    imageUrl: imagePath.stamps.shy1,
  },
  {
    title: '照れ2',
    message: '//　　　　//',
    imageUrl: imagePath.stamps.shy2,
  },
  {
    title: '照れ3',
    message: '〃　　ω　　〃',
    imageUrl: imagePath.stamps.shy3,
  },
  {
    title: 'てへぺろ',
    message: '●　　ω　　●',
    imageUrl: imagePath.stamps.cheating,
  },
  {
    title: '納得',
    message: '△',
    imageUrl: imagePath.stamps.got_it,
  },
  {
    title: 'ほうれい線',
    message: '//　　　　\\\\',
    imageUrl: imagePath.stamps.laugh_lines,
  },
  {
    title: 'ちゅっ',
    message: 'ε',
    imageUrl: imagePath.stamps.kiss,
  },
  {
    title: 'よだれ',
    message: 'q',
    imageUrl: imagePath.stamps.drool,
  },
  {
    title: 'ヘッ',
    message: '* 　　∀　　 *',
    imageUrl: imagePath.stamps.laugh,
  },
  {
    title: '汗',
    message: '； 　　∀　　  ',
    imageUrl: imagePath.stamps.irritated,
  },
];
