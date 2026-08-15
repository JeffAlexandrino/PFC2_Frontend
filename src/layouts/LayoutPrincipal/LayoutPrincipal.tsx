import { BotaoPerfil, ButtonOrganization } from "../../components";
import { Col, Placeholder, Stack } from "react-bootstrap";
import { ContextUser } from "../../contexts/ContextUser";
import { Outlet } from "react-router-dom";
import { useContext } from "react";

import ButtonUserManual from "../../components/botoes/BotaoManual";
import BotaoUpdates from "../../components/botoes/BotaoUpdates";
import UserRoleUtil from "../../utils/user-role.util";
import AvisosSistema from "./avisosSistema";
import Menu from "./Menu";

import "./styles.css";

export const SYSTEM_NAME = "CommissionPro";

export default function LayoutPrincipal() {
    const { carregandoUsuario, currentUserRole, usuario } = useContext(ContextUser);

    return (
        <div className="d-flex flex-column vh-100">
            <AvisosSistema />
            <div className="d-flex my-div-header-layout-principal bg-primary flex-shrink-0">
                <div className="d-flex my-div-header-icon-lp justify-content-center align-items-center">
                    {carregandoUsuario ? (
                        <Placeholder className="my-img-logo-header-lp" animation="glow">
                            <Placeholder className="w-100 h-100 rounded" />
                        </Placeholder>
                    ) : (
                        <ButtonOrganization />
                    )}
                </div>
                <div className="d-flex my-div-header-lp">
                    <div className="d-flex align-items-center w-100 h-100">
                        {carregandoUsuario ? (
                            <Placeholder as={Col} sm="6" lg="3" animation="glow">
                                <Placeholder as="h4" className="w-100 rounded mb-0" />
                            </Placeholder>
                        ) : (
                            <h4 className="mb-0 text-white text-nowrap ms-2">{SYSTEM_NAME}</h4>
                        )}
                    </div>
                </div>
                <div className="d-flex my-div-header-profile-lp justify-content-end align-items-center me-2 gap-1">
                    {carregandoUsuario ? (
                        <>
                            <Placeholder className="w-75 h-100 p-1" animation="glow">
                                <Placeholder className="w-100 h-100 rounded-pill" />
                            </Placeholder>
                            <Placeholder className="w-25 h-100 pt-1 pb-1" animation="glow">
                                <Placeholder className="w-100 h-100 rounded" />
                            </Placeholder>
                        </>
                    ) : (
                        <div className="d-flex gap-3">
                            <BotaoUpdates />
                            <ButtonUserManual />
                            <Stack className="text-light lh-1 gap-1">
                                <span>{usuario?.name}</span>
                                <small>
                                    <strong>
                                        {currentUserRole?.role
                                            ? UserRoleUtil.getRoleDescription(currentUserRole?.role)
                                            : ""}
                                    </strong>
                                </small>
                            </Stack>
                            <BotaoPerfil />
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="d-flex w-100 h-100">
                    <Menu carregando={carregandoUsuario} />
                    <div className="my-div-body-lp flex-grow-1 overflow-auto">{currentUserRole && <Outlet />}</div>
                </div>
            </div>

            <footer className="footer-fixed bg-primary text-white flex-shrink-0">
                <div className="container-fluid h-100">
                    <div className="row align-items-center h-100">
                        <div className="col">
                            <span className="footer-version d-flex align-items-center">
                                <i className="bi bi-c-circle me-1"></i>
                                {new Date().getFullYear()} Altus Group
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
