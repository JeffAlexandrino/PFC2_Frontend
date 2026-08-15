import { ReactNode } from "react";
import { Modal, ModalProps } from "react-bootstrap";

export interface IModalBaseRoot extends ModalProps {
    children?: ReactNode;
}
export default function ModalBaseRoot({ children, ...rest }: IModalBaseRoot) {
    return (
        <Modal {...rest} aria-labelledby="contained-modal-title-vcenter" centered>
            {children}
        </Modal>
    );
}
