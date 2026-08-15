import { Modal } from "react-bootstrap";

export default function Root({ centered, ...props }: React.ComponentProps<typeof Modal>) {
    return <Modal {...props} centered={centered === undefined ? true : centered} />;
}
