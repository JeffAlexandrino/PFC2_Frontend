import { Popover } from "react-bootstrap";
import { PopoverRootProps } from "./types";
import { forwardRef } from "react";

import cn from "../../utils/cn";

import "./styles.css";

const Root = forwardRef<HTMLDivElement, PopoverRootProps>(({ className, ...props }, ref) => {
    return <Popover {...props} className={cn(["shadow", className])} ref={ref} />;
});

export default Root;
