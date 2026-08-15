import { PopoverRootProps } from "../type";
import { Popover } from "react-bootstrap";
import { forwardRef } from "react";

const Root = forwardRef<HTMLDivElement, PopoverRootProps>(({ className, ...props }, ref) => {
    return <Popover ref={ref} {...props} className={["shadow-sm", className].join(" ")} />;
});

export default Root;
