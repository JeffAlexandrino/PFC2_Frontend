import { PopoverHeaderProps } from "../type";
import { Popover } from "react-bootstrap";

export default function Header(props: PopoverHeaderProps) {
    return <Popover.Header {...props} />;
}
