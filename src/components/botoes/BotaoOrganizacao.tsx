import { useCallback, useContext, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";

import OffcanvasOrganization from "../offcanvas/OffcanvasOrganization";
import utils from "../../utils";
import Botao from "./Botao";

import "./styles.css";

export default function ButtonOrganization() {
    const { currentUserRole } = useContext(ContextUser);

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const organizationName = currentUserRole?.empresa.name ?? "";
    const organizationLogoSrc = currentUserRole?.empresa.empresaLogoSrc ?? undefined;

    const handleOnShow = useCallback(() => setShowOffcanvas(true), []);
    const handleOnHide = useCallback(() => setShowOffcanvas(false), []);

    return (
        <>
            <Botao
                title={organizationName}
                className="border-0 position-relative h-100 w-100 rounded-0 p-1"
                onClick={handleOnShow}
            >
                <img
                    alt="logo"
                    src={organizationLogoSrc}
                    className={`my-img-logo rounded ${!organizationLogoSrc && "opacity-0"}`}
                />
                {!organizationLogoSrc && (
                    <div className="d-flex h-100 w-100 p-1 position-absolute top-0 start-0">
                        <div className="d-flex bg-dark bg-opacity-25 h-100 w-100 justify-content-center align-items-center text-white rounded">
                            <h4 className="mb-0">{utils.retornaLetrasDoNome(organizationName)}</h4>
                        </div>
                    </div>
                )}
            </Botao>
            <OffcanvasOrganization onHide={handleOnHide} show={showOffcanvas} />
        </>
    );
}
