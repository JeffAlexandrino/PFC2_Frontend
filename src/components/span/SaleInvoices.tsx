import { Col, Container, Overlay, OverlayTrigger, Popover, Row, Tooltip } from "react-bootstrap";
import React, { useCallback, useRef, useState } from "react";
import { SaleInvoice } from "../../types/sale-invoice";

interface SpanSaleInvoicesProps {
    invoices?: SaleInvoice[];
}

export default function SaleInvoices({ invoices }: SpanSaleInvoicesProps) {
    const [showPopover, setShowPopover] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    const getInvoicesText = useCallback(() => {
        if ((invoices?.length ?? 0) < 1) return "--- Nenhum ---";
        const codes = invoices?.map(({ codigo }) => codigo);
        const text = codes?.join(", ");
        if ((text?.length ?? 0) < 20) return text;
        return text?.slice(0, 20) + "...";
    }, [invoices]);

    //EVENTOS
    const handleOnShowPopover = useCallback(() => setShowPopover(true), []);
    const handleOnHidePopover = useCallback(() => setShowPopover(false), []);

    return (
        <>
            <div
                className="d-flex w-100 overflow-hidden text-info"
                role="button"
                onClick={handleOnShowPopover}
                ref={divRef}
            >
                <OverlayTrigger placement="top" flip overlay={<Tooltip>Clique para saber mais</Tooltip>}>
                    <span className="text-nowrap">
                        {getInvoicesText()}
                        <i className="bi bi-caret-down-fill ms-1" />
                    </span>
                </OverlayTrigger>
            </div>

            <Overlay
                rootClose
                onHide={handleOnHidePopover}
                target={divRef.current}
                show={showPopover}
                flip
                placement="bottom"
            >
                <Popover className="shadow">
                    <Popover.Body className="my-container-controle-borda p-2">
                        {invoices?.map((saleInvoice) => {
                            return (
                                <React.Fragment key={saleInvoice.id}>
                                    <Container fluid className="p-1">
                                        <Row className="my-child-controle-borda border-bottom border-bottom">
                                            <Col sm="12" className="text-start fs-6 fw-bold">
                                                {saleInvoice.codigo}
                                            </Col>
                                        </Row>
                                    </Container>
                                </React.Fragment>
                            );
                        })}
                    </Popover.Body>
                </Popover>
            </Overlay>
        </>
    );
}
