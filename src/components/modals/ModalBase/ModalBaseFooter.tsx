import { ReactNode } from "react";
import { Modal } from "react-bootstrap";

interface IModalBaseFooterProps {
    children?: ReactNode;
}

export default function ModalBaseFooter(props: IModalBaseFooterProps) {
    return <Modal.Footer className="overflow-hidden">{props.children}</Modal.Footer>;
}
