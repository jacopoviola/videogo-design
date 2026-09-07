export interface ProcessStagesProps { stages: string[]; /** index of the stage in progress; stages before it are done */ current?: number; /** short note beside the current stage, e.g. "about a minute" — never a percentage */ note?: string; style?: React.CSSProperties; }
export function ProcessStages(props: ProcessStagesProps): JSX.Element;
