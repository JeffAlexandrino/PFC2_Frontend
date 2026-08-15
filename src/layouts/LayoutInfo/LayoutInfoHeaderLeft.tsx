import { ReactNode, useCallback } from "react";
import { BotaoVoltar } from "../../components";
import { useNavigate } from "react-router-dom";
import { Placeholder } from "react-bootstrap";

import "./styles.css";

interface ILayoutInfoHeaderLeftProps {
    children?: ReactNode;
    carregando?: boolean;
}

export default function LayoutInfoHeaderLeft(props: ILayoutInfoHeaderLeftProps) {
    //VARIAVEIS
    const navigate = useNavigate();

    //EVENTOS
    const handleOnBack = useCallback(() => navigate(-1), [navigate]);

    return (
        <div className="my-layout-info-header-left d-flex align-items-center gap-3">
            <BotaoVoltar title="Voltar" onClick={handleOnBack} />{" "}
            {props.carregando ? (
                <Placeholder as="h5" className="mb-0 opacity-25" animation="glow">
                    <Placeholder className="rounded">Titulo grande da sessao</Placeholder>
                </Placeholder>
            ) : (
                props.children
            )}
        </div>
    );
}
