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
        <button onClick={toggleTheme} aria-pressed={theme === "dark"}>
          {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}