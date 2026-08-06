// src/app/shared/api/mappers.ts
import type { Request, Message } from "../../features/requests/types";
import type { ApiRequestListItem, ApiRequestDetail, ApiMessage } from "./types";

export function toUiRequest(api: ApiRequestListItem): Request {
  return { ...api };
}

export function toUiMessage(api: ApiMessage): Message {
  return { ...api };
}

export function toUiRequestDetail(api: ApiRequestDetail): { request: Request; messages: Message[] } {
  const { messages, ...rest } = api;
  return {
    request: rest,
    messages: messages.map(toUiMessage),
  };
}