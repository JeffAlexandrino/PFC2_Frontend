import { Modal } from "react-bootstrap";

export default function Footer(props: Omit<React.ComponentProps<typeof Modal.Footer>, "as">) {
    return <Modal.Footer {...props} />;
}
