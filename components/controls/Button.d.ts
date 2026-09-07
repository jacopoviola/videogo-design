/** @startingPoint section="Controls" subtitle="Blocking · primary · ghost" viewport="520x120" */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { /** blocking only inside a NEED; primary at most one per object */ variant?: 'blocking' | 'primary' | 'ghost'; /** 44px targets */ touch?: boolean; disabled?: boolean; children?: React.ReactNode; }
export function Button(props: ButtonProps): JSX.Element;
