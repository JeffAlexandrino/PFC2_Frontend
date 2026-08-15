import { FormControl, FormControlProps } from "react-bootstrap";
import { CurrencyType } from "../../types/commom";
import { IMaskInput } from "react-imask";
import { useCallback } from "react";

import utils from "../../utils";

interface IInputValoresProps extends FormControlProps {
    moeda?: CurrencyType | null;
    valor: number;
    onAccept: (valor: number) => void;
}

export default function InputValores({ onAccept, valor, moeda, ...rest }: IInputValoresProps) {
    //EVENTOS
    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const numericValue = value.replace(/\D/g, "");

            // Chama o onAccept com o valor numérico
            onAccept(Number(numericValue) / 100);
        },
        [onAccept]
    );

    return (
        <FormControl
            as={IMaskInput}
            value={utils.retornaValorMonetario(valor, moeda)}
            onChange={handleOnChange}
            type="text"
            maxLength={18}
            {...rest}
        />
    );
}
