export interface PermissionLockupProps { state?: 'granted' | 'requested' | 'refused'; scope: string; detail?: string; onRevoke?: () => void; onGrant?: () => void; style?: React.CSSProperties; }
export const TRUST_LINE: string;
export function PermissionLockup(props: PermissionLockupProps): JSX.Element;
