import { Col, Container, Overlay, OverlayTrigger, Popover, Row, Tooltip } from "react-bootstrap";
import { useCallback, useRef, useState } from "react";
import "./styles.css";

//interface ISpanVendaParcelamentoProps {
//    venda: Sale;
//}
export default function SaleInstallment(/*props: ISpanVendaParcelamentoProps*/) {
    //ESTADOS
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    //VARIAVEIS
    //const { venda } = props;

    //EVENTOS
    const handleOnMostrarInfo = useCallback(() => setMostrarInfo(true), []);
    const handleOnEsconderInfo = useCallback(() => setMostrarInfo(false), []);

    return (
        <>
            <div
                className="d-flex w-100 overflow-hidden text-info justify-content-end"
                role="button"
                onClick={handleOnMostrarInfo}
                ref={divRef}
            >
                <OverlayTrigger placement="top" flip overlay={<Tooltip>Clique para saber mais</Tooltip>}>
                    <span className="text-nowrap">
                        {/*venda.formaParcelamento*/}x
                        <i className="bi bi-caret-down-fill ms-1" />
                    </span>
                </OverlayTrigger>
            </div>

            <Overlay
                rootClose
                onHide={handleOnEsconderInfo}
                target={divRef.current}
                show={mostrarInfo}
                flip
                placement="bottom"
            >
                <Popover className="shadow">
                    <Popover.Body className="my-container-controle-borda p-2">
                        <Container fluid className="p-1">
                            <Row className="my-child-controle-borda border-bottom border-bottom">
                                <Col sm="12" className="d-flex justify-content-between lh-1 align-items-end">
                                    <h6>Datas Boletos:</h6>
                                </Col>
                                <Col sm="12" className="d-flex justify-content-between lh-1 align-items-end">
                                    <div className="d-flex w-100 justify-content-between">
                                        <span className="text-uppercase mb-2">
                                            {/*venda.formaPagamento.name ?? "----"*/}
                                        </span>
                                    </div>
                                </Col>
                                {/*venda.datasBoleto.map(({ data }) => {
                                    return (
                                        <Col sm="12" key={v4()}>
                                            {data.toLocaleDateString("pt-Br", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </Col>
                                    );
                                })*/}
                            </Row>
                        </Container>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </>
    );
}
