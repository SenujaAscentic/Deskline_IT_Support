import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RequestRow } from "./RequestRow";
import type { Request } from "../types";

type Props = {
  requests: Request[];
};

export function VirtualizedRequestList({ requests }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: requests.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  });

  return (
    <>
    <div className="request-list-legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot--status" /> Status
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--priority" /> Priority
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--category" /> Category
        </span>
      </div>
    <div ref={parentRef} className="virtual-list-viewport">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={requests[virtualRow.index].id}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className="virtual-row-wrapper"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <RequestRow request={requests[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}