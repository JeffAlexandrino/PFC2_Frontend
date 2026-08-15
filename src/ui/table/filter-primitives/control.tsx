import { FormControl, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FilterControlProps } from "../type";

import "./styles.css";

export default function Control({ className, value, size, ...props }: FilterControlProps) {
    return (
        <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="bottom"
            rootClose
            overlay={<Tooltip className={!value ? "d-none" : ""}>{value}</Tooltip>}
        >
            <FormControl
                {...props}
                className={["filter-control", value && "active", className].join(" ")}
                value={value}
                size={size ?? "sm"}
            />
        </OverlayTrigger>
    );
}
