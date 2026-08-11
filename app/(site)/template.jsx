// Route transition, the stable way: a template remounts on every navigation,
// so its enter animation plays each time the content changes while the header,
// tab bar and footer hold still - the app-shell effect, no experimental flags.
// Exit animations would need the experimental View Transitions integration;
// enter-only is what most shipped sites do and it reads as intended.
export default function Template({ children }) {
  return <div className="route-enter">{children}</div>;
}
