export interface ConfidenceClaimProps { grade?: 'collecting' | 'early' | 'learned'; statement: React.ReactNode; /** required at grade early */ nextTest?: string; /** evidence rows, rendered at grade learned */ children?: React.ReactNode; style?: React.CSSProperties; }
export function ConfidenceClaim(props: ConfidenceClaimProps): JSX.Element;
