import React from "react";

interface Props { size?: number; color?: string; }

const WalletIcon = ({ size = 20, color = "#7e93b2" }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
    <circle cx="17" cy="14" r="1.5" fill={color} stroke="none" />
  </svg>
);

export default WalletIcon;
