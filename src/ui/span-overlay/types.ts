import { OverlayProps } from "react-bootstrap";

import React from "react";

export type SpanOverlayContextProps = { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> };

export type SpanOverlayRootProps = React.HTMLAttributes<HTMLDivElement> & {};
export type SpanOverlayTriggerProps = React.HTMLAttributes<HTMLSpanElement> & {
    tooltip?: string;
    hideArrow?: boolean;
};
export type SpanOverlayMenuProps = OverlayProps & {};
