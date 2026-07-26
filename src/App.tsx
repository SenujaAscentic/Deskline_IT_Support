// src/App.tsx
import "./app/shared/theme.css";
import { RequestList } from "./app/features/requests/RequestList"
import { RequestDetail } from "./app/features/requests/RequestDetail";
import { requests } from "./app/features/requests/data";

function App() {
  // Day 1: no routing yet — just hardcode which request "detail" shows.
  const selectedRequest = requests[0];

  return (
    <div className="app-shell">
      <header>
        <h1>Deskline</h1>
      </header>

      <main>
        <section>
          <h2>Requests</h2>
          <RequestList />
        </section>

        <section>
          <h2>Detail (static preview)</h2>
          <RequestDetail request={selectedRequest} />
        </section>
      </main>
    </div>
  );
}

export default App;