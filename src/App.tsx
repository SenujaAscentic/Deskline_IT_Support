import "./app/shared/theme.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { MyRequestsPage } from "./app/features/requests/MyRequestsPage";
import { RequestDetailPage } from "./app/features/requests/RequestDetailPage";
import { LoginPage } from "./app/features/auth/LoginPage";

function App() {
  return (
  <BrowserRouter>
    <AppShell>
      <Routes>
        <Route path = "/login" element={<LoginPage/>}/>
        <Route path="/my-requests" element={<MyRequestsPage/>}/>
        <Route path="/queue" element={<QueuePage/>}/>
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="*" element={<Navigate to="/my-requests" replace />} />
      </Routes>
      <MyRequestsPage />
      <RequestDetailPage />
    </AppShell>
  </BrowserRouter>
  );
}

export default App;