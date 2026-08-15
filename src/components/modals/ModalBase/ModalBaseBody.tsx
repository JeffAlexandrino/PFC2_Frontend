import { ReactNode } from "react";
import { Modal } from "react-bootstrap";

interface IModalBaseBodyProps {
    children?: ReactNode;
    className?: string;
}

export default function ModalBaseBody(props: IModalBaseBodyProps) {
    return <Modal.Body className={`overflow-hidden ${props.className}`}>{props.children}</Modal.Body>;
}
