export interface MetricTileProps { /** includes the observation window, e.g. "SAVES · LAST 28 DAYS" */ label: string; value: React.ReactNode; /** against the account's own baseline, in words */ delta?: string; /** "You told me" for owner-reported figures */ provenance?: string; style?: React.CSSProperties; }
export function MetricTile(props: MetricTileProps): JSX.Element;
