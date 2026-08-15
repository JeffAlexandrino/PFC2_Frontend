import { Button, ButtonProps } from "react-bootstrap";
import { forwardRef } from "react";

import cn from "../../../../utils/cn";

export type CustomizationOverlayTriggerProps = Omit<ButtonProps, "children"> & {};

const Trigger = forwardRef<HTMLButtonElement, CustomizationOverlayTriggerProps>(({ className, ...props }, ref) => {
    return (
        <Button
            ref={ref}
            {...props}
            className={cn(["table-action-button rounded-0 p-0 w-100 py-2 text-primary", className])}
            aria-label={props["aria-label"] ?? "Customizar colunas"}
            title={props.title ?? "Customizar colunas"}
        >
            <i className="bi bi-table text-primary" />
        </Button>
    );
});

export default Trigger;
