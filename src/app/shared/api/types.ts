
import type { Status, Priority, Category } from "../../features/requests/types";
import type { Role } from "../types";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type ApiRequestListItem = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  category: Category;
  requesterId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiMessage = {
  id: string;
  requestId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

// The detail endpoint returns everything the list endpoint does,
// PLUS the message thread — real APIs avoid embedding full nested
// collections in list responses, so this mirrors that deliberately.
export type ApiRequestDetail = ApiRequestListItem & {
  messages: ApiMessage[];
  requesterName: string;
  assigneeName: string | null;
};