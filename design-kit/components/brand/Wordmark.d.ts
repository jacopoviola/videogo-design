/** @startingPoint section="Brand" subtitle="Glyph at cap height + VIDEOGO, one colour" viewport="360x120" */
export interface WordmarkProps { /** cap height in px; the glyph renders at 1.4× this */ mark?: number; markOnly?: boolean; /** #0C0B09 on #F5F2EC */ inverse?: boolean; style?: React.CSSProperties; }
export interface MarkProps { size?: number; inverse?: boolean; /** override the ink; defaults to bone / canvas */ color?: string; style?: React.CSSProperties; }
export function Wordmark(props: WordmarkProps): JSX.Element;
export function Mark(props: MarkProps): JSX.Element;
/** The glyph geometry alone (an SVG <g>, currentColor) */
export function MarkGlyph(props: { fill?: string }): JSX.Element;
