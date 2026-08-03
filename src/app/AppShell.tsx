import { NavLink } from "react-router-dom";
import { useTheme } from "./shared/useTheme";
import { useReducedMotion } from "./shared/useReducedMotion";
import {ToggleSwitch} from "./shared/components/ToggleSwitch";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  const { theme, toggleTheme } = useTheme();

  const { reduced,toggleReducedMotion} = useReducedMotion();

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
         <div className="app-controls">
          <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} label="Dark mode" />
          <ToggleSwitch checked={reduced} onChange={toggleReducedMotion} label="Reduce motion" />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}