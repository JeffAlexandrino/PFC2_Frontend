import { Modal } from "react-bootstrap";

export default function Header(props: React.ComponentProps<typeof Modal.Header>) {
    return <Modal.Header {...props} />;
}
