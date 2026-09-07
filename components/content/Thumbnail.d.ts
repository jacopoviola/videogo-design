export interface ThumbnailProps { src?: string; alt?: string; /** e.g. "1:08" */ duration?: string; width?: number; height?: number; style?: React.CSSProperties; }
export function Thumbnail(props: ThumbnailProps): JSX.Element;
