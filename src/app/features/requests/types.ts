export type Status = "open" | "pending" | "closed" | "cancelled";
export type Priority = "low" | "medium" | "high";
export type Category = "hardware" | "software" | "facilities" | "access";

export type Message = {
  id: string;
  requestId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type Request = {
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

export type CreateRequestInput = {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
};