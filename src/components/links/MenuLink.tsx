import { Badge, OverlayTrigger, Placeholder, Stack, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useCallback } from "react";

import "./styles.css";

interface Props {
    nome: string;
    icon: string;
    path: string;
    carregando?: boolean;
    desenvolvendo?: boolean;
}

export default function MenuLink(props: Props) {
    //VARIAVEIS
    const { carregando, desenvolvendo } = props;

    //EVENTOS
    const handleClassNameNavLink = useCallback(
        (props: { isActive: boolean; isPending: boolean }) => {
            const classNameComum = "d-flex my-navlink-item-menu text-decoration-none text-white w-100";
            const classNameCarregando = classNameComum + " my-navlink-disabled";
            switch (true) {
                case carregando || desenvolvendo:
                    return classNameCarregando;
                case props.isActive:
                    return "bg-success bg-opacity-75 " + classNameComum;
                case props.isPending:
                    return "bg-danger " + classNameComum;
                default:
                    return classNameComum;
            }
        },
        [carregando, desenvolvendo]
    );

    return (
        <NavLink
            className={handleClassNameNavLink}
            to={props.carregando || props.desenvolvendo ? "#" : props.path}
            role="button"
        >
            <OverlayTrigger
                flip
                delay={200}
                placement="right"
                overlay={
                    <Tooltip className={`${props.carregando ? "d-none" : ""}`}>
                        {!props.desenvolvendo ? props.nome : props.nome + " em breve"}
                    </Tooltip>
                }
            >
                <div className="d-flex w-100 h-100 position-relative">
                    {props.desenvolvendo && (
                        <Badge className="bg-success position-absolute end-0 top-0 mt-1 me-1 p-1">New</Badge>
                    )}
                    <Stack className="w-100 d-flex ps-1 pe-1 justify-content-center">
                        <div className="d-flex w-100 justify-content-center">
                            {props.carregando ? (
                                <Placeholder className="w-100 h-100 text-center" animation="glow">
                                    <Placeholder xs="4" className="rounded-1" />
                                </Placeholder>
                            ) : (
                                <i className={`bi bi-${props.icon}`} />
                            )}
                        </div>
                        <div className="d-flex w-100 small justify-content-center">
                            {props.carregando ? (
                                <Placeholder className="w-100 h-100 text-center" animation="glow">
                                    <Placeholder xs="12" className="rounded-1" />
                                </Placeholder>
                            ) : (
                                <span className="text-truncate">{props.nome}</span>
                            )}
                        </div>
                    </Stack>
                </div>
            </OverlayTrigger>
        </NavLink>
    );
}
