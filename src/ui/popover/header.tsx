import { PopoverHeaderProps } from "./types";
import { Popover } from "react-bootstrap";

export default function Header(props: PopoverHeaderProps){
    return <Popover.Header {...props}/>;
}