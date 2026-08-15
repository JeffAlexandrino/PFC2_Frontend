import { FormControl, FormControlProps } from "react-bootstrap";
import { IMaskInput } from "react-imask";
import { useCallback } from "react";

interface IInputDateProps extends FormControlProps {
    valor: Date;
    onAccept: (valor: Date) => void;
    useLastTime?: boolean;
}

export default function InputDate({ valor, onAccept, useLastTime, ...rest }: IInputDateProps) {
    const [dia, mes, ano] = valor
        .toLocaleDateString("pt-Br", { year: "numeric", month: "2-digit", day: "2-digit" })
        .split("/");

    const diaTwoDigits = dia.padStart(2, "0");
    const mesTwoDigits = mes.padStart(2, "0");
    const anoFourDigits = ano.padStart(4, "0");

    const valorFormatado = `${anoFourDigits}-${mesTwoDigits}-${diaTwoDigits}`;

    //EVENTOS
    const handleOnChane = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const valor = event.target.value;
            const [ano, mes, dia] = valor.split("-");

            if (isNaN(Date.parse(valor)) || ano.length > 4) return;
            const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia));

            novaData.setFullYear(Number(ano)); 
            novaData.setHours(useLastTime ? 23 : 0);
            novaData.setMinutes(useLastTime ? 59 : 0);
            novaData.setSeconds(useLastTime ? 59 : 0);
            novaData.setMilliseconds(useLastTime ? 999 : 0);

            onAccept(novaData);
        },
        [onAccept, useLastTime]
    );

    return <FormControl type="date" as={IMaskInput} {...rest} value={valorFormatado} onChange={handleOnChane} />;
}
