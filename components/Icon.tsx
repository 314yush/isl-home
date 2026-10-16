export default function Icon({
  name,
  size = 20,
  className = "",
}: {
  name:
    | "arrow"
    | "search"
    | "heart"
    | "close"
    | "ball"
    | "menu"
    | "play"
    | "chevron";
  size?: number;
  className?: string;
}) {
  const paths = {
    arrow: "M4 12h16M13 5l7 7-7 7",
    search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    heart:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    close: "M6 6l12 12M6 18 18 6",
    ball: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7l5 4-2 6H9l-2-6 5-4Z",
    menu: "M4 6h16M4 12h16M4 18h16",
    play: "m9 5 11 7-11 7V5Z",
    chevron: "m9 5 7 7-7 7",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
