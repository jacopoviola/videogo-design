/** @startingPoint section="Objects" subtitle="One shell for NEED · READY · NEXT · LEARNED" viewport="640x260" */
export interface ObjectCardProps { /** 'recommend' is accepted as an alias of 'next' (roadmap v7 vocabulary) */ type?: 'need' | 'ready' | 'next' | 'recommend' | 'learned'; label?: string; title?: React.ReactNode; body?: React.ReactNode; media?: React.ReactNode; /** an <EvidenceRow> */ evidence?: React.ReactNode; /** buttons — at most one primary */ actions?: React.ReactNode; style?: React.CSSProperties; }
export function ObjectCard(props: ObjectCardProps): JSX.Element;
