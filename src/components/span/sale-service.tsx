import { Col, Container, Overlay, OverlayTrigger, Popover, Row, Tooltip } from "react-bootstrap";
import React, { useCallback, useRef, useState } from "react";
import { ServiceSale } from "../../types/sale-service";
import { CurrencyType } from "../../types/commom";
import utils from "../../utils";
import "./styles.css";

interface ISpanVendaServicoProps {
    servicos?: ServiceSale[];
}
export default function SaleService(props: ISpanVendaServicoProps) {
    //ESTADOS
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    //VARIAVEIS
    const { servicos } = props;

    const returnTextoServicos = useCallback(() => {
        if ((servicos?.length ?? 0) < 1) return "--- Nenhum ---";
        const nomes = servicos?.map(({ servico }) => servico.name);
        const texto = nomes?.join(", ");
        if ((texto?.length ?? 0) < 20) return texto;
        return texto?.slice(0, 20) + "...";
    }, [servicos]);

    //EVENTOS
    const handleOnMostrarInfo = useCallback(() => setMostrarInfo(true), []);
    const handleOnEsconderInfo = useCallback(() => setMostrarInfo(false), []);

    return (
        <>
            <div
                className="d-flex w-100 overflow-hidden text-info"
                role="button"
                onClick={handleOnMostrarInfo}
                ref={divRef}
            >
                <OverlayTrigger placement="top" flip overlay={<Tooltip>Clique para saber mais</Tooltip>}>
                    <span className="text-nowrap">
                        {returnTextoServicos()}
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
                        {(props.servicos?.length ?? 0) < 1 && <span>--- Nenhum serviço ---</span>}
                        {props.servicos?.map((servicoVenda) => {
                            return (
                                <React.Fragment key={servicoVenda.servicoId}>
                                    <Container fluid className="p-1">
                                        <Row className="my-child-controle-borda border-bottom border-bottom">
                                            <Col sm="12" className="text-start fs-6 fw-bold">
                                                {servicoVenda.servico.name}
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Valor custo hora:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorCustoHora,
                                                        servicoVenda.servico.tipoMoeda
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Comercial:</span>
                                                <span>{servicoVenda.qntdHorasComercial} h</span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Não comercial (1.5x):</span>
                                                <span>{servicoVenda.qntdHorasNaoComercial} h</span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1 mb-2"
                                            >
                                                <span>Especial (2x):</span>
                                                <span>{servicoVenda.qntdHorasEspecial} h</span>
                                            </Col>
                                            {servicoVenda.servico.tipoMoeda !== CurrencyType.BRL && (
                                                <Col
                                                    sm="12"
                                                    className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                                >
                                                    <span>Cotação:</span>
                                                    <span>
                                                        {utils.retornaValorMonetario(
                                                            servicoVenda.cotacao,
                                                            CurrencyType.BRL
                                                        )}
                                                    </span>
                                                </Col>
                                            )}
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Custo:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorCusto,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Markup:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorMarkup,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Valor venda:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorVenda,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-3"
                                            >
                                                <span>Impostos:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorImpostos,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Margem:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        servicoVenda.valorMargem,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
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
