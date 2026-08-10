

import "./app/shared/styles/tokens.css";
import "./app/shared/styles/base.css";
import "./app/shared/styles/layout.css";
import "./app/shared/styles/buttons.css";
import "./app/shared/styles/forms.css";
import "./app/shared/styles/states.css";
import "./app/features/requests/requests.css";
//import "./app/features/auth/auth.css";
import "./app/shared/styles/motion.css";
//import "./app/shared/theme.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { MyRequestsPage } from "./app/features/requests/pages/MyRequestsPage";
import { RequestDetailPage } from "./app/features/requests/pages/RequestDetailPage";
import { LoginPage } from "./app/features/auth/LoginPage";
import { QueuePage } from "./app/features/requests/pages/QueuePage";
import { NewRequestPage } from "./app/features/requests/pages/NewRequestPage";
import { ProtectedRoute } from "./app/shared/components/ProtectedRoute";

function App() {
  return (
  <BrowserRouter>
    <AppShell>
      <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/my-requests"
            element={
              <ProtectedRoute allowedRoles={["requester"]}>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute allowedRoles={["technician", "admin"]}>
                <QueuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute allowedRoles={["requester"]}>
                <NewRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/my-requests" replace />} />
        </Routes>
      
    </AppShell>
  </BrowserRouter>
  );
}

export default App;