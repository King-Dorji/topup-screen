interface Props {
  size?: number;
  color?: string;
}

const LockIcon = ({ size = 14, color = "currentColor" }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M3.5 5.83332V4.66666C3.5 2.73582 4.08333 1.16666 7 1.16666C9.91667 1.16666 10.5 2.73582 10.5 4.66666V5.83332"
      stroke={color} strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M6.99996 10.7917C7.80537 10.7917 8.45829 10.1387 8.45829 9.33333C8.45829 8.52792 7.80537 7.875 6.99996 7.875C6.19454 7.875 5.54163 8.52792 5.54163 9.33333C5.54163 10.1387 6.19454 10.7917 6.99996 10.7917Z"
      stroke={color} strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M9.91663 12.8333H4.08329C1.74996 12.8333 1.16663 12.25 1.16663 9.91668V8.75001C1.16663 6.41668 1.74996 5.83334 4.08329 5.83334H9.91663C12.25 5.83334 12.8333 6.41668 12.8333 8.75001V9.91668C12.8333 12.25 12.25 12.8333 9.91663 12.8333Z"
      stroke={color} strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export default LockIcon;
