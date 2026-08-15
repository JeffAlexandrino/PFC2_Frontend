import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { SpanOverlayTriggerProps } from "./types";
import { forwardRef, useContext } from "react";
import { SpanOverlayContext } from "./root";

import cn from "../../utils/cn";

const Trigger = forwardRef<HTMLButtonElement, SpanOverlayTriggerProps>(
    ({ tooltip, children, hideArrow, ...props }, ref) => {
        const { setShow } = useContext(SpanOverlayContext);

        return (
            <OverlayTrigger
                placement="top"
                flip
                overlay={<Tooltip className={cn([!tooltip && "d-none"])}>{tooltip}</Tooltip>}
            >
                <Button
                    className="overflow-hidden bg-transparent text-dark border-0 text-nowrap"
                    role="button"
                    onClick={() => setShow((prev) => !prev)}
                    ref={ref}
                >
                    <span {...props}>
                        {children}
                        {!hideArrow && <i className="bi bi-caret-down-fill ms-1" />}
                    </span>
                </Button>
            </OverlayTrigger>
        );
    }
);

export default Trigger;
