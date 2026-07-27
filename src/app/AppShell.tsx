import { NavLink } from "react-router-dom";
import { useTheme } from "./shared/useTheme";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <header>
        <h1>Deskline</h1>
        <nav className="app-nav">
            <NavLink to="/my-requests">My Requests</NavLink>
            <NavLink to="/queue">Queue</NavLink>
            <NavLink to="/requests/new">New Request</NavLink>
            <NavLink to="/login">Log in</NavLink>
        </nav>
        <button onClick={toggleTheme} aria-pressed={theme === "dark"}>
          {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}