import { iconUrl } from '../rendering/icons';

/** 8×8 のドットアイコンを整数倍で表示する（絵文字の代わり）。fine は バトル用の 2 倍の こまかさ */
export function PixelIcon({
  name,
  scale = 3,
  fine = false,
  class: cls,
}: {
  name: string;
  scale?: number;
  fine?: boolean;
  class?: string;
}) {
  const url = iconUrl(name, fine);
  if (!url) return null;
  return (
    <img
      class={`nq-picon ${cls ?? ''}`}
      src={url}
      width={8 * scale}
      height={8 * scale}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
