type Variant = "square" | "circle" | "plain";

const OUTLINE_PATHS: Record<Variant, string | null> = {
  square: "M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z",
  circle: "M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z",
  plain: null,
};

interface Props {
  size?: number;
  color?: string;
  variant?: Variant;
}

const CloseIcon = ({ size = 16, color = "currentColor", variant = "plain" }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.16998 14.83L14.83 9.17004" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.83 14.83L9.16998 9.17004" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {OUTLINE_PATHS[variant] && (
      <path d={OUTLINE_PATHS[variant]!} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

export default CloseIcon;
