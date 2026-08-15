import { Modal } from "react-bootstrap";
import cn from "../../utils/cn";

export default function Title({ children, className, ...props }: React.ComponentProps<typeof Modal.Title>) {
    return (
        <Modal.Title {...props} className={cn(["mb-0", className])}>
            {children}
        </Modal.Title>
    );
}
