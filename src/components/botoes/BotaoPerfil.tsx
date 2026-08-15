import { useCallback, useContext, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Button } from "react-bootstrap";

import OffcanvasPerfil from "../offcanvas/OffcanvasPerfil";
import utils from "../../utils";

import "./styles.css";

export default function BotaoPerfil() {
    //CONTEXTS
    const { usuario } = useContext(ContextUser);

    //ESTADOS
    const [perfilAberto, setPerfilAberto] = useState(false);

    //VARIAVEIS
    const nomeUsuario = usuario?.name ?? "";

    //EVENTOS
    const handleOnShow = useCallback(() => setPerfilAberto(true), []);
    const handleOnHide = useCallback(() => setPerfilAberto(false), []);

    return (
        <div>
            <Button
                variant="dark"
                onClick={handleOnShow}
                className="my-button-perfil d-flex align-items-center justify-content-center border border-light rounded-circle"
                title="Menu do Usuário"
            >
                <span className="text-light">{utils.retornaLetrasDoNome(nomeUsuario)}</span>
            </Button>
            <OffcanvasPerfil show={perfilAberto} onHide={handleOnHide} />
        </div>
    );
}
