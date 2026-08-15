import FormNovaSenha, { tNovaSenha } from "../forms/FormNovaSenha";
import { Col, Offcanvas, Row, Stack } from "react-bootstrap";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { useCallback, useContext, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useNavigate } from "react-router-dom";
import { Role } from "../../types/commom";

import ModalOrganizations from "../modals/ModalOrganizations";
import FrontRoutes from "../../lib/front-routes";
import BotaoFechar from "../botoes/BotaoFechar";
import useAuth from "../../hooks/use-auth";
import api from "../../services/api";
import SpanCopy from "../span/copy";
import Botao from "../botoes/Botao";
import utils from "../../utils";

import "./styles.css";

const FORM_ID_NOVA_SENHA = "form-id-nova-senha";

interface Props {
    show: boolean;
    onHide: () => void;
}
export default function OffcanvasPerfil(props: Props) {
    const { usuario, currentUserRole } = useContext(ContextUser);
    const { setPerigo } = useContext(ContextAlerta);
    const { updatePassword, updatingPass, cancelUpdatePassword } = useAuth();

    const navigate = useNavigate();

    const [mostrarModalEmpresaRole, setMostrarModalEmpresaRole] = useState(false);
    const [mostrarOffcanvasNovaSenha, setMostrarOffcanvasNovaSenha] = useState(false);

    const handleOnLogout = useCallback(async () => {
        try {
            await api.logout();
            navigate(FrontRoutes.getLogin());
        } catch (err) {
            setPerigo(utils.retornaMensagemErro(err));
        }
    }, [navigate, setPerigo]);

    const handleOnMudarSenha = useCallback(() => setMostrarOffcanvasNovaSenha(true), []);

    const handleOnMudarEmpresaRole = useCallback(() => setMostrarModalEmpresaRole(true), []);
    const handleOnHideModalEmpresaRole = useCallback(() => setMostrarModalEmpresaRole(false), []);

    const handleOnSubmitNewPassword = useCallback(
        async (passwords: tNovaSenha) => {
            try {
                await updatePassword(passwords.password);
                setMostrarOffcanvasNovaSenha(false);
            } catch (err) {
                console.error(err);
            }
        },
        [updatePassword]
    );

    function shorten(text: string, max: number) {
        if (!text) return "";
        return text.length > max ? text.slice(0, max) + "..." : text;
    }

    return (
        <>
            <Offcanvas show={props.show} onHide={props.onHide} placement="end">
                <Offcanvas.Header className="my-menu-user-header border-bottom">
                    <Row className="align-items-center pt-3">
                        <Col sm="12" className="position-absolute d-flex w-100 justify-content-end top-0 mt-2">
                            <BotaoFechar onClick={props.onHide} />
                        </Col>
                        <Col sm="auto">
                            <div className="my-div-circle-name d-flex justify-content-center align-items-center bg-primary rounded-circle p-4">
                                <span className="fs-2 fw-bold text-light">
                                    {utils.retornaLetrasDoNome(usuario?.name ?? "")}
                                </span>
                            </div>
                        </Col>
                        <Col>
                            <Stack>
                                <span className="fw-bold fs-4 text-primary">{usuario?.name}</span>
                                <SpanCopy
                                    textoCopiar={usuario?.email ?? ""}
                                    tooltip="Clique para copiar seu email"
                                    className="mb-2"
                                >
                                    <strong>Email:</strong> {shorten(usuario?.email ?? "", 12)}
                                </SpanCopy>
                            </Stack>
                        </Col>
                    </Row>
                </Offcanvas.Header>
                <Offcanvas.Body className="overflow-auto">
                    <Stack className="d-flex w-100">
                        {currentUserRole?.role !== Role.MONITOR && (
                            <Botao onClick={handleOnMudarEmpresaRole}>
                                <h6 className="mb-0">
                                    <i className="bi bi-arrow-repeat me-2" />
                                    Trocar de empresa ou papel
                                </h6>
                            </Botao>
                        )}
                        <Botao onClick={handleOnMudarSenha}>
                            <h6 className="mb-0">
                                <i className="bi bi-person-fill-lock me-2" />
                                Mudar minha senha
                            </h6>
                        </Botao>
                        <Botao onClick={handleOnLogout}>
                            <h6 className="mb-0 text-danger fw-semibold">
                                <i className="bi bi-box-arrow-right me-2" />
                                Encerrar sessão
                            </h6>
                        </Botao>
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
            <OffcanvasNovoDado.Root show={mostrarOffcanvasNovaSenha}>
                <OffcanvasNovoDado.Header>
                    <h4>Mudar Senha</h4>
                </OffcanvasNovoDado.Header>
                <OffcanvasNovoDado.Body
                    acceptButtonProps={{
                        children: "Salvar",
                        carregando: updatingPass,
                        form: FORM_ID_NOVA_SENHA,
                        type: "submit",
                    }}
                    cancelButtonProps={{
                        onClick: () => {
                            cancelUpdatePassword();
                            setMostrarOffcanvasNovaSenha(false);
                        },
                    }}
                >
                    <FormNovaSenha
                        valoresIniciais={{ password: "", confirmPass: "" }}
                        formId={FORM_ID_NOVA_SENHA}
                        onSubmit={handleOnSubmitNewPassword}
                    />
                </OffcanvasNovoDado.Body>
            </OffcanvasNovoDado.Root>

            <ModalOrganizations show={mostrarModalEmpresaRole} onHide={handleOnHideModalEmpresaRole} />
        </>
    );
}
