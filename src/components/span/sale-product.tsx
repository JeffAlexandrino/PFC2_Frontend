import React, { useCallback, useRef, useState } from "react";
import utils from "../../utils";

import { Col, Container, Overlay, OverlayTrigger, Popover, Row, Tooltip } from "react-bootstrap";
import { ProductSale } from "../../types/sale-product";
import { CurrencyType } from "../../types/commom";

interface ISpanVendaProdutoProps {
    produtos?: ProductSale[];
}

export default function SaleProduct(props: ISpanVendaProdutoProps) {
    //ESTADOS
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    //VARIAVEIS
    const { produtos } = props;

    const returnTextoProdutos = useCallback(() => {
        if ((produtos?.length ?? 0) < 1) return "--- Nenhum ---";
        const nomes = produtos?.map(({ produto }) => produto.name);
        const texto = nomes?.join(", ");
        if ((texto?.length ?? 0) < 20) return texto;
        return texto?.slice(0, 20) + "...";
    }, [produtos]);

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
                        {returnTextoProdutos()}
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
                        {(props.produtos?.length ?? 0) < 1 && <span>--- Nenhum produto ---</span>}
                        {props.produtos?.map((vendaProduto) => {
                            return (
                                <React.Fragment key={vendaProduto.produtoId}>
                                    <Container fluid className="p-1">
                                        <Row className="my-child-controle-borda border-bottom border-bottom">
                                            <Col sm="12" className="text-start fs-6 fw-bold">
                                                {vendaProduto.produto.name}
                                            </Col>
                                            <Col sm="12" className="text-start small mb-2">
                                                {vendaProduto.tipoFaturamento}
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <OverlayTrigger
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip>
                                                            {vendaProduto.fornecedores.map((fornecedor) => (
                                                                <p className="mb-1" key={fornecedor.id}>
                                                                    {fornecedor.name}
                                                                </p>
                                                            ))}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <span role="button" className="text-info">
                                                        Fornecedores <i className="bi bi-info-circle-fill" />
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Custo unitário:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        vendaProduto.valorCustoUnit,
                                                        vendaProduto.tipoMoeda
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                            >
                                                <span>Quantidade:</span>
                                                <span>{vendaProduto.quantidade} un</span>
                                            </Col>

                                            {vendaProduto.tipoMoeda !== CurrencyType.BRL && (
                                                <Col
                                                    sm="12"
                                                    className="d-flex justify-content-between align-items-end lh-1 mt-1"
                                                >
                                                    <span>Cotação:</span>
                                                    <span>
                                                        {utils.retornaValorMonetario(
                                                            vendaProduto.cotacao,
                                                            CurrencyType.BRL
                                                        )}
                                                    </span>
                                                </Col>
                                            )}
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 mt-3"
                                            >
                                                <span>Custo:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        vendaProduto.valorCusto,
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
                                                        vendaProduto.valorMarkup,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 gap-2 mt-1"
                                            >
                                                <span>Valor venda:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        vendaProduto.valorVenda,
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
                                                        vendaProduto.valorImpostos,
                                                        CurrencyType.BRL
                                                    )}
                                                </span>
                                            </Col>
                                            <Col
                                                sm="12"
                                                className="d-flex justify-content-between align-items-end lh-1 gap-2 mt-1"
                                            >
                                                <span>Margem:</span>
                                                <span>
                                                    {utils.retornaValorMonetario(
                                                        vendaProduto.valorMargem,
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
