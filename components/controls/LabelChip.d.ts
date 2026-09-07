export interface LabelChipProps { /** need = crimson fill · ready = amber fill · next / learned / plain = mono text only */ kind?: 'need' | 'ready' | 'next' | 'learned' | 'plain'; children?: React.ReactNode; style?: React.CSSProperties; }
export function LabelChip(props: LabelChipProps): JSX.Element;
