/** @startingPoint section="Controls" subtitle="Four items, side rail or bottom bar" viewport="214x600" */
export interface NavProps { active?: 'Today' | 'Studio' | 'Knowledge' | 'Connections'; onSelect?: (item: string) => void; /** rendered at the foot of the side rail */ account?: { name: string; sector?: string; initials?: string; onClick?: () => void }; orientation?: 'side' | 'bottom'; /** optional stroke icons keyed by item — always beside the label, never instead of it */ icons?: Record<string, React.ReactNode>; style?: React.CSSProperties; }
export const NAV_ITEMS: string[];
export function Nav(props: NavProps): JSX.Element;
