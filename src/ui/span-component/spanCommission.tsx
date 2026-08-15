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

export default function SpanCommission({
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
                <Popover.Root className="shadow">
                    <Popover.Header className="text-center">
                        <h6>{popoverHeader || "Fornecedores na Nota"}</h6>
                    </Popover.Header>
                    <Popover.Body>{children}</Popover.Body>
                </Popover.Root>
            </SpanOverlay.Menu>
        </SpanOverlay.Root>
    );
}
