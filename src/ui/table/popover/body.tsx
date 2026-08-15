import { Popover } from "react-bootstrap";
import { PopoverBodyProps } from "../type";

import "./styles.css";

export default function Body({ className, ...props }: PopoverBodyProps) {
    return <Popover.Body {...props} className={["date-filter-popover-body overflow-hidden", className].join(" ")} />;
}
