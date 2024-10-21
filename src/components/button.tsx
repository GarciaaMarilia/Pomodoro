interface ButtonProps {
 onClick: () => void;
 title: string;
 className?: string;
}

export function Button({
 onClick,
 title,
 className,
}: ButtonProps): JSX.Element {
 return (
  <button onClick={onClick} className={className}>
   {title}
  </button>
 );
}
