import "./app/shared/theme.css";
import { AppShell } from "./app/AppShell";
import { MyRequestsPage } from "./app/features/requests/MyRequestsPage";
import { RequestDetailPage } from "./app/features/requests/RequestDetailPage";

function App() {
  return (
    <AppShell>
      <MyRequestsPage />
      <RequestDetailPage />
    </AppShell>
  );
}

export default App;