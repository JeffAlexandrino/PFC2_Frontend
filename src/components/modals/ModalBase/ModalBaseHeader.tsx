import { ReactNode } from "react";
import { Modal } from "react-bootstrap";

interface IModalBaseHeaderProps {
    children?: ReactNode;
}

export default function ModalBaseHeader(props: IModalBaseHeaderProps) {
    return <Modal.Header className="overflow-hidden">{props.children}</Modal.Header>;
}
