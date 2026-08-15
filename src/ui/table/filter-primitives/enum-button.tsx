import { FilterEnumButtonProps } from "../type";
import { Button } from "react-bootstrap";

export default function EnumButton({ isActive, className, ...props }: FilterEnumButtonProps) {
    return (
        <Button {...props} className={["table-action-button key-value", isActive && "active", className].join(" ")} />
    );
}
