import { useCallback, useContext, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Role } from "../../types/commom";
import { Button } from "react-bootstrap";

import Modal from "../../ui/modal";

export default function ButtonUserManual() {
    const [showModal, setShowModal] = useState(false);
    const { currentUserRole } = useContext(ContextUser);

    const manualCompleto = useCallback(() => {
        const ADMIN_LINK =
            "https://protectsolutionscombr.sharepoint.com/:b:/r/sites/Onboarding/Documentos%20Compartilhados/Processos%20Internos/7%20-%20CommissionPro/Manuais%20de%20uso/CommissionPro%20V5.0%20-%20Manual%20de%20Admin.pdf?csf=1&web=1&e=21lhb2";
        const USER_LINK =
            "https://protectsolutionscombr.sharepoint.com/:b:/r/sites/Onboarding/Documentos%20Compartilhados/Processos%20Internos/7%20-%20CommissionPro/Manuais%20de%20uso/CommissionPro%20V5.0%20-%20Manual%20de%20Usu%C3%A1rio.pdf?csf=1&web=1&e=GGlJnY";

        const manualLink = currentUserRole?.role === Role.ADMIN ? ADMIN_LINK : USER_LINK;
        window.open(manualLink, "_blank");
        setShowModal(false);
    }, [currentUserRole]);

    const guiaRapido = useCallback(() => {
        const QUICK_START =
            "https://protectsolutionscombr.sharepoint.com/:b:/r/sites/Onboarding/Documentos%20Compartilhados/Processos%20Internos/7%20-%20CommissionPro/Manuais%20de%20uso/CommissionPro%20-%20Guia%20R%C3%A1pido%20V3.pdf?csf=1&web=1&e=HZIrry";

        window.open(QUICK_START, "_blank");
        setShowModal(false);
    }, []);

    return (
        <>
            <Button variant="outline-light" onClick={() => setShowModal((prev) => !prev)}>
                Manuais
            </Button>
            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manuais do usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Description>
                        Ao clicar em uma das opções abaixo, você será redirecionado para o respectivo conteúdo do
                        manual.
                    </Modal.Description>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={manualCompleto}>Manual Completo</Button>
                    <Button onClick={guiaRapido}>Guia Rápido</Button>
                </Modal.Footer>
            </Modal.Root>
        </>
    );
}
