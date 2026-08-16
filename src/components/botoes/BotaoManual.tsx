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
            "";
        const USER_LINK =
            "";

        const manualLink = currentUserRole?.role === Role.ADMIN ? ADMIN_LINK : USER_LINK;
        window.open(manualLink, "_blank");
        setShowModal(false);
    }, [currentUserRole]);

    const guiaRapido = useCallback(() => {
        const QUICK_START =
            "";

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
