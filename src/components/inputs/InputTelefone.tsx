import { Form, FormControlProps } from "react-bootstrap";
import { IMaskInput } from "react-imask";

export interface InputTelefoneProps extends FormControlProps {
    valor: string;
    onAccept: (telefone: string) => void;
}

export default function InputTelefone({ valor, onAccept, ...props }: InputTelefoneProps) {
    return (
        <Form.Control
            {...props}
            as={IMaskInput}
            type="text"
            unmask
            mask={["0000-0000", "(00) 00000-0000", "+00 (00) 00000-0000", "(00) 0000-0000"]}
            value={valor}
            onAccept={onAccept}
        />
    );
}
