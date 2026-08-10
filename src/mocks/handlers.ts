import { http, HttpResponse } from "msw";
import { users, seedUsers, requestsDb, messagesDb, type DbUser, type DbRequest } from "./db";

function toSafeUser(user: DbUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function currentUser(request: Request) {
  const auth = request.headers.get("Authorization");
  const id = auth?.startsWith("Bearer dev-token-") ? auth.replace("Bearer dev-token-", "") : null;
  return users.find((u) => u.id === id) ?? null;
}

export const handlers = [
  http.post("/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = seedUsers.find((u) => u.email === body.email && u.password === body.password);
    if (!user) return HttpResponse.json({ message: "Invalid email or password." }, { status: 401 });
    return HttpResponse.json({ user: toSafeUser(user), token: `dev-token-${user.id}` });
  }),

  http.get("/users", ({ request }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role === "requester") return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    return HttpResponse.json(users.map(toSafeUser));
  }),

  http.get("/requests", ({ request }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    const visible = user.role === "requester"
      ? requestsDb.filter((r) => r.requesterId === user.id)
      : requestsDb;
    return HttpResponse.json(visible);
  }),

  http.get("/requests/:id", ({ request, params }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    const req = requestsDb.find((r) => r.id === params.id);
    if (!req) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    if (user.role === "requester" && req.requesterId !== user.id) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const requesterUser = users.find((u) => u.id === req.requesterId);
    const assigneeUser = req.assigneeId ? users.find((u) => u.id === req.assigneeId) : null;

    return HttpResponse.json({
      ...req,
      messages: messagesDb.filter((m) => m.requestId === req.id),
      requesterName: requesterUser?.name ?? "Unknown",
      assigneeName: assigneeUser?.name ?? null,
    });
  }),

  http.post("/requests", async ({ request }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "requester") return HttpResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = (await request.json()) as {
      title: string; description: string; category: DbRequest["category"]; priority: DbRequest["priority"];
    };
    const now = new Date().toISOString();
    const newRequest: DbRequest = {
      id: `r${Date.now()}`,
      title: body.title,
      status: "open",
      priority: body.priority,
      category: body.category,
      requesterId: user.id,
      assigneeId: null,
      createdAt: now,
      updatedAt: now,
    };
    requestsDb.unshift(newRequest);
    messagesDb.push({
      id: `${newRequest.id}-m1`,
      requestId: newRequest.id,
      authorId: user.id,
      body: body.description,
      createdAt: now,
    });

    return HttpResponse.json(
      {
        ...newRequest,
        messages: messagesDb.filter((m) => m.requestId === newRequest.id),
        requesterName: user.name,
        assigneeName: null,
      },
      { status: 201 }
    );
  }),

  http.post("/requests/:id/messages", async ({ request, params }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    const req = requestsDb.find((r) => r.id === params.id);
    if (!req) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    if (user.role === "requester" && req.requesterId !== user.id) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (req.status !== "open" && req.status !== "pending") {
      return HttpResponse.json({ message: "This request is read-only." }, { status: 403 });
    }

    const body = (await request.json()) as { body: string };
    const message = {
      id: `${req.id}-m${messagesDb.filter((m) => m.requestId === req.id).length + 1}`,
      requestId: req.id,
      authorId: user.id,
      body: body.body,
      createdAt: new Date().toISOString(),
    };
    messagesDb.push(message);
    return HttpResponse.json(message, { status: 201 });
  }),

  http.patch("/requests/:id", async ({ request, params }) => {
    const user = currentUser(request);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    const req = requestsDb.find((r) => r.id === params.id);
    if (!req) return HttpResponse.json({ message: "Not found" }, { status: 404 });

    const body = (await request.json()) as { status?: DbRequest["status"]; assigneeId?: string | null };

    if (body.status) {
      const isStaff = user.role === "technician" || user.role === "admin";
      const legal =
        (req.status === "open" && body.status === "pending" && isStaff) ||
        (req.status === "pending" && body.status === "open" && isStaff) ||
        (req.status === "open" && body.status === "cancelled" && user.role === "requester" && req.requesterId === user.id) ||
        ((req.status === "open" || req.status === "pending") && body.status === "closed" && user.role === "admin");

      if (!legal) return HttpResponse.json({ message: "Forbidden status transition." }, { status: 403 });

      req.status = body.status;
      const systemBody =
        body.status === "cancelled" ? `Cancelled by ${user.name}.`
        : body.status === "closed" ? `Closed by ${user.name}.`
        : null;
      if (systemBody) {
        messagesDb.push({
          id: `${req.id}-m${messagesDb.filter((m) => m.requestId === req.id).length + 1}`,
          requestId: req.id,
          authorId: user.id,
          body: systemBody,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (body.assigneeId !== undefined) {
      const isStaff = user.role === "technician" || user.role === "admin";
      const isSelfAssign = body.assigneeId === user.id && isStaff;
      const isReassign = user.role === "admin";
      if (!isSelfAssign && !isReassign) return HttpResponse.json({ message: "Forbidden." }, { status: 403 });
      req.assigneeId = body.assigneeId;
    }

    req.updatedAt = new Date().toISOString();

    const requesterUser = users.find((u) => u.id === req.requesterId);
    const assigneeUser = req.assigneeId ? users.find((u) => u.id === req.assigneeId) : null;

    return HttpResponse.json({
      ...req,
      messages: messagesDb.filter((m) => m.requestId === req.id),
      requesterName: requesterUser?.name ?? "Unknown",
      assigneeName: assigneeUser?.name ?? null,
    });
  }),
];