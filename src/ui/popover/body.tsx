import { PopoverBodyProps } from "./types";
import { Popover } from "react-bootstrap";

import cn from "../../utils/cn";

import "./styles.css";

export default function Body({ className, ...props }: PopoverBodyProps) {
    return <Popover.Body {...props} className={cn(["ui-popover-body", className])} />;
}
