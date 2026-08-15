import { Button, ButtonProps } from "react-bootstrap";
import "./styles.css";

export default function Botao({ className, ...props }: ButtonProps) {
    return (
        <Button variant="none" className={`my-button text-start ${className}`} {...props}>
            {props.children}
        </Button>
    );
}
