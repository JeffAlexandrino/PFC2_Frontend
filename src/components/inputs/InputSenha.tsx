import { Form, FormControl, FormControlProps, InputGroup } from "react-bootstrap";
import { forwardRef, useCallback, useState } from "react";
import { v4 } from "uuid";

interface IInputSenhaProps extends FormControlProps {
    valor: string;
    onAccept: (senha: string) => void;
    error?: string;
}

type Ref = HTMLInputElement;

const InputSenha = forwardRef<Ref, IInputSenhaProps>(({ valor, onAccept, error, ...rest }, ref) => {
    //ESTADOS
    const [visualizar, setVisualizar] = useState(false);

    //EVENTOS
    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const senha = event.target.value;
            onAccept(senha);
        },
        [onAccept]
    );

    const handleOnChangeVisualizar = useCallback(() => setVisualizar((estadoAtual) => !estadoAtual), []);

    return (
        <InputGroup className="mb-3">
            <FormControl
                ref={ref}
                value={valor}
                onChange={handleOnChange}
                type={!visualizar ? "password" : "text"}
                {...rest}
            />
            <InputGroup.Text className="p-0" id={v4()}>
                <span
                    className="h-100 d-flex align-items-center ps-2 pe-2"
                    role="button"
                    onClick={handleOnChangeVisualizar}
                >
                    {visualizar ? <i className="bi bi-eye-fill" /> : <i className="bi bi-eye-slash-fill" />}
                </span>
            </InputGroup.Text>
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>
    );
});

export default InputSenha;
