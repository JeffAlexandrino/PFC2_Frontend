import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";

import Modal from "../../ui/modal";

// BOLETOS
export function ButtonAddTicket() {
    const [showModal, setShowModal] = useState(false);

    const openNewTabAndRedirectToManualLink = useCallback(() => {
        const LINK =
            "https://protectsolutionscombr.sharepoint.com/sites/ComissionProArquivos/Boletos/Forms/AllItems.aspx";
        window.open(LINK, "_blank");
    }, []);

    return (
        <>
            <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center"
                onClick={() => setShowModal((prev) => !prev)}
            >
                <i className="bi bi-cloud-upload me-1"></i>
                Boletos
            </Button>

            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Boletos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Description>
                        O arquivo deve estar no formato PDF e seguir o seguinte padrão: CodNotaFiscal - #NumBoleto -
                        data.pdf
                    </Modal.Description>
                    <span className="text-secondary-dark small">
                        Ao clicar em “Boletos”, você será redirecionado para realizar o upload.
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary-dark" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button onClick={openNewTabAndRedirectToManualLink}>Adicionar boleto</Button>
                </Modal.Footer>
            </Modal.Root>
        </>
    );
}

// NOTA FISCAL
export function ButtonAddInvoice() {
    const [showModal, setShowModal] = useState(false);

    const openNewTabAndRedirectToManualLink = useCallback(() => {
        const LINK =
            "https://protectsolutionscombr.sharepoint.com/sites/ComissionProArquivos/Notas%20Fiscais/Forms/AllItems.aspx";
        window.open(LINK, "_blank");
    }, []);

    return (
        <>
            <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center"
                onClick={() => setShowModal((prev) => !prev)}
            >
                <i className="bi bi-cloud-upload me-1"></i>
                Nota Fiscal
            </Button>

            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Nota Fiscal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Description>
                        O arquivo deve estar no formato PDF e seguir o seguinte padrão: CodVenda - CodNotaFiscal.pdf
                    </Modal.Description>
                    <span className="text-secondary-dark small">
                        Ao clicar em “Adicionar nota”, você será redirecionado para a página de upload.
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary-dark" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button onClick={openNewTabAndRedirectToManualLink}>Adicionar nota</Button>
                </Modal.Footer>
            </Modal.Root>
        </>
    );
}

// ORDEM DE COMPRA
export function ButtonAddSale() {
    const [showModal, setShowModal] = useState(false);

    const openNewTabAndRedirectToManualLink = useCallback(() => {
        const LINK =
            "https://protectsolutionscombr.sharepoint.com/sites/ComissionProArquivos/Vendas/Forms/AllItems.aspx";
        window.open(LINK, "_blank");
    }, []);

    return (
        <>
            <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center"
                onClick={() => setShowModal((prev) => !prev)}
            >
                <i className="bi bi-cloud-upload me-1"></i>
                Ordem de Compra
            </Button>

            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Ordem de Compra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Description>
                        O arquivo deve estar no formato PDF e seguir o seguinte padrão: CodVenda.pdf
                    </Modal.Description>
                    <span className="text-secondary-dark small">
                        Ao clicar em “Adicionar ordem de compra”, você será redirecionado para realizar o upload.
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary-dark" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button onClick={openNewTabAndRedirectToManualLink}>Adicionar ordem de compra</Button>
                </Modal.Footer>
            </Modal.Root>
        </>
    );
}

// PASSAGEM DE VIAGEM
export function ButtonTravelTicket() {
    const [showModal, setShowModal] = useState(false);

    const openNewTabAndRedirectToManualLink = useCallback(() => {
        const LINK = "https://protectsolutionscombr.sharepoint.com/sites/ComissionProArquivos/Visitas%20Externas";
        window.open(LINK, "_blank");
    }, []);

    return (
        <>
            <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center mt-2 mb-2"
                onClick={() => setShowModal((prev) => !prev)}
            >
                <i className="bi bi-cloud-upload me-1"></i>
                Passagem da Viagem
            </Button>

            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Passagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Description>
                        O arquivo deve estar no formato PDF e seguir o seguinte padrão: numeroIDpassagem -
                        Ida/Conexão/Volta.pdf
                    </Modal.Description>
                    <span className="text-secondary-dark small">
                        Ao clicar em “Adicionar passagem”, você será redirecionado para realizar o upload.
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary-dark" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button onClick={openNewTabAndRedirectToManualLink}>Adicionar passagem</Button>
                </Modal.Footer>
            </Modal.Root>
        </>
    );
}
