import { FormControl, FormControlProps } from "react-bootstrap";
import { IMaskInput } from "react-imask";
import { useCallback } from "react";

interface IInputPorcentagemProps extends FormControlProps {
    valor: number;
    onAccept: (valor: number) => void;
}

export default function InputPorcentagem({ onAccept, valor, ...rest }: IInputPorcentagemProps) {
    //VARIAVEIS
    const valorFormatado = valor.toFixed(2).replace(".", ",") + " %";

    //EVENTOS
    const handleOnClick = useCallback(
        (event: React.MouseEvent<HTMLInputElement>) => {
            const input = event.currentTarget;

            const cursorPosition = valorFormatado.length - 2;
            setTimeout(() => {
                input.setSelectionRange(cursorPosition, cursorPosition);
            }, 10);
        },
        [valorFormatado]
    );

    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const input = event.target;
            const value = event.target.value;
            const numericValue = value.replace(/\D/g, "");

            // Chama o onAccept com o valor numérico
            onAccept(Number(numericValue) / 100);

            // Mover o cursor para antes do último dígito
            const valorFormatado = (Number(numericValue) / 100).toFixed(2).replace(".", ",") + "%";
            const cursorPosition = valorFormatado.length - 1;
            setTimeout(() => {
                input.setSelectionRange(cursorPosition, cursorPosition);
            }, 0);
        },
        [onAccept]
    );

    return (
        <FormControl
            as={IMaskInput}
            type="text"
            maxLength={18}
            onClick={handleOnClick}
            value={valorFormatado}
            onChange={handleOnChange}
            {...rest}
        />
    );
}
