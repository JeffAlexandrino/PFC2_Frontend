import { Form, FormControlProps } from "react-bootstrap";
import { useCallback, useState } from "react";

interface IInputTextAreaProps extends FormControlProps {
    max?: number;
    rows?: number;
}
export default function InputTextArea({ max, rows, onChange, ...rest }: IInputTextAreaProps) {
    //ESTADOS
    const [tamanhoValor, setTamanhoValor] = useState(0);

    //EVENTOS
    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (max && value.length > max) return;

            setTamanhoValor(value.length);

            if (onChange) onChange(event);
        },
        [max, onChange]
    );

    return (
        <div className="position-relative">
            {max !== undefined && (
                <div className="position-absolute bg-white rounded end-0 bottom-0 mb-1 me-2 opacity-50">
                    <span>
                        {tamanhoValor}/{max}
                    </span>
                </div>
            )}
            <Form.Control as="textarea" rows={rows} {...rest} onChange={handleOnChange} />
        </div>
    );
}
