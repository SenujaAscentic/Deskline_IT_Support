import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "./shared/useTheme";
import { useReducedMotion } from "./shared/useReducedMotion";
import {ToggleSwitch} from "./shared/components/ToggleSwitch";
import { useSession } from "./features/auth/useSession";
import { setSession } from "./features/auth/session";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  const session = useSession();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { reduced,toggleReducedMotion} = useReducedMotion();

  function handleLogout() {
    setSession(null);
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <div className="header-bar">
      <header>
        
        <h1>Deskline</h1>
        <nav className="app-nav">
          {session && (
            <>
            {session.role === "requester" && (
              <>
                <NavLink to="/my-requests">My Requests</NavLink>
                <NavLink to="/requests/new">New Request</NavLink>
                
              </>
              )}
              
              {(session.role === "technician" || session.role === "admin") && (
                <NavLink to="/queue">Queue</NavLink>
              )}
              
            </>
          )}
        </nav>
         <div className="app-controls">
          <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} label="Dark mode" />
          <ToggleSwitch checked={reduced} onChange={toggleReducedMotion} label="Reduce motion" />
          {session ? (
            <button className="btn" onClick={handleLogout}>Log out</button>
          ) : (
            <NavLink to="/login" className="btn">Log in</NavLink>
          )}
          
        </div>
      </header>
      </div>
      <main>{children}</main>
    </div>
  );
}