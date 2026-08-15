import { useRef, ReactNode } from "react";

import Popover from "../popover";

import * as SpanOverlay from "../../ui/span-overlay";

interface ClickableSpanWithOverlayProps {
    spanTriggerContent?: ReactNode;
    popoverHeader?: ReactNode;
    children: ReactNode;
    spanIcon?: string;
    tooltip?: string;
}

export default function SpanSale({
    spanTriggerContent,
    popoverHeader,
    children,
    spanIcon,
}: ClickableSpanWithOverlayProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    return (
        <SpanOverlay.Root>
            <SpanOverlay.Trigger ref={buttonRef} className="text-info" tooltip={"Clique para ver mais!"} hideArrow>
                <i className={spanIcon} /> {spanTriggerContent}
            </SpanOverlay.Trigger>

            <SpanOverlay.Menu target={buttonRef}>
                <Popover.Root
                    className="shadow"
                    style={{
                        width: "fit-content",
                        minWidth: "150px",
                        maxWidth: "400px",
                        display: "inline-block",
                        height: "fit-content",
                        maxHeight: "350px",
                        overflowY: "hidden",
                    }}
                >
                    <Popover.Header className="text-center">
                        <h6>{popoverHeader}</h6>
                    </Popover.Header>
                    <Popover.Body>{children}</Popover.Body>
                </Popover.Root>
            </SpanOverlay.Menu>
        </SpanOverlay.Root>
    );
}
