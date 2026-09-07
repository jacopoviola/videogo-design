export interface FeedSlot { src?: string; title?: string; state: 'published' | 'ready' | 'scheduled' | 'planned'; /** e.g. "Thu 18:00" for scheduled slots */ when?: string; }
export interface FeedPreviewProps { slots: FeedSlot[]; columns?: number; tileWidth?: number; style?: React.CSSProperties; }
export function FeedPreview(props: FeedPreviewProps): JSX.Element;
