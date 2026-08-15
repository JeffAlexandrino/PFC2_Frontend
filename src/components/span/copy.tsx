import React, { ReactNode, useCallback, useContext, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { ContextAlerta } from "../../contexts/ContextAlert";
import utils from "../../utils";

interface ISpanCopyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    tooltip?: ReactNode;
    textoCopiar: string;
}

export default function Copy(props: ISpanCopyProps) {
    //CONTEXTO
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [copiando, setCopiando] = useState(false);
    const [textoCopiado, setTextoCopiado] = useState(false);

    //VARIAVEIS
    const { textoCopiar } = props;

    //EVENTOS
    const handleOnClickSpan = useCallback(async () => {
        try {
            setCopiando(true);
            const type = "text/plain";
            const blob = new Blob([textoCopiar], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            await navigator.clipboard.write(data);
            setTextoCopiado(true);
        } catch (err) {
            setPerigo(utils.retornaMensagemErro(err));
            setTextoCopiado(false);
        } finally {
            setCopiando(false);
        }
    }, [textoCopiar, setPerigo]);

    return (
        <OverlayTrigger
            overlay={
                <Tooltip>
                    {textoCopiado ? (
                        <span className="text-success">Copiado!</span>
                    ) : (
                        props.tooltip ?? "Clique para copiar"
                    )}
                </Tooltip>
            }
        >
            <span role="button" className={`lh-1 ${props.className}`} onClick={handleOnClickSpan}>
                {props.children}{" "}
                {copiando ? (
                    <Spinner size="sm" animation="grow" />
                ) : textoCopiado ? (
                    <i className="bi bi-check2-square text-success" />
                ) : (
                    <i className="bi bi-copy" />
                )}
            </span>
        </OverlayTrigger>
    );
}
