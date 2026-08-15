import useAuditoria, { LIMITE_POR_BUSCA_AUDITORIA } from "../../hooks/useAuditoria";
import React, { useCallback, useEffect, useState } from "react";
import { IModalBaseRoot } from "./ModalBase/ModalBaseRoot";
import { Button, Col, Row } from "react-bootstrap";
import { NewSale, Sale } from "../../types/sale";
import { tAuditoria } from "../../interfaces";
import { ModalBase } from "./ModalBase";

import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import TimeLine from "../timeline/Timeline";
import utils from "../../utils";

import "./styles.css";

export interface ModalAuditoriaVendaProps extends IModalBaseRoot {
    venda: Sale | null;
}
export default function ModalAuditoriaVenda({ venda, ...rest }: ModalAuditoriaVendaProps) {
    //HOOKS
    const { buscaComErro, buscar, estaBuscando, cancelar } = useAuditoria();

    //ESTADOS
    const [auditorias, setAuditorias] = useState<tAuditoria[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [proximaPagina, setProximaPagina] = useState(1);

    //VARIAVEIS
    const buscarAuditorias = useCallback(
        async (venda: Sale, pagina?: number) => {
            try {
                const novasAuditorias = await buscar({
                    limit: LIMITE_POR_BUSCA_AUDITORIA,
                    page: pagina,
                    where: { tabela: "VENDA", dadoId: venda.id },
                });
                if (pagina === undefined) {
                    setAuditorias(novasAuditorias);
                    setPaginaAtual(0);
                    setProximaPagina(1);
                } else setAuditorias((atuais) => [...atuais, ...novasAuditorias]);
                return novasAuditorias.length; // Retorna pro InfiniteScroll
            } catch (err) {
                throw err; // Necessário para avisar que houve um erro ao InfiniteScroll
            }
        },
        [buscar]
    );

    //EVENTOS
    useEffect(() => {
        if (!venda) return setAuditorias([]);

        buscarAuditorias(venda);
        return () => cancelar();
    }, [venda, cancelar, buscarAuditorias]);

    return (
        <ModalBase.Root {...rest}>
            <ModalBase.Header>
                <h4>Auditoria da Venda</h4>
            </ModalBase.Header>
            <ModalBase.Body>
                <Row className="my-auditoria-modal-body">
                    <InfiniteScroll
                        buscando={estaBuscando || buscaComErro}
                        paginaAtual={paginaAtual}
                        proximaPagina={proximaPagina}
                        setPaginaAtual={setPaginaAtual}
                        setProximaPagina={setProximaPagina}
                    >
                        {auditorias.length < 1 && !estaBuscando && !buscaComErro && (
                            <div className="d-flex w-100 justify-content-center">
                                <h6 className="mb-0 text-secondary-dark">Não existe nenhum registro nesta auditoria</h6>
                            </div>
                        )}
                        {auditorias.length > 0 && (
                            <TimeLine
                                dados={auditorias.map((auditoria) => {
                                    const dado: NewSale = auditoria.dado as any;

                                    return {
                                        feitoPor: auditoria.usuario,
                                        data: auditoria.data,
                                        descricao: (
                                            <Row>
                                                {auditoria.acao === "CREATE" || auditoria.acao === "UPDATE" ? (
                                                    <>
                                                        <Col sm="12">
                                                            {utils.retornaTextoAcao(auditoria.acao)} a venda com os
                                                            seguintes valores:
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Estado da venda:</strong>{" "}
                                                            {utils.returnTextoEstadoVenda(dado.estadoVenda)}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Notas fiscais:</strong>{" "}
                                                            <Row>
                                                                {dado.notasVenda?.map((nota) => (
                                                                    <React.Fragment key={nota.codigo}>
                                                                        <Col sm="12">
                                                                            <span className="text-info">
                                                                                {nota.codigo}
                                                                            </span>
                                                                        </Col>
                                                                        <Col sm="12">
                                                                            <span className="text-info">
                                                                                Parcelamentos: {nota.formaParcelamento}
                                                                            </span>
                                                                        </Col>
                                                                    </React.Fragment>
                                                                ))}
                                                            </Row>
                                                        </Col>
                                                    </>
                                                ) : undefined}
                                            </Row>
                                        ),
                                    };
                                })}
                            />
                        )}
                    </InfiniteScroll>
                </Row>
            </ModalBase.Body>
            <ModalBase.Footer>
                <Row>
                    <Col>
                        <Button variant="outline-secondary" className="rounded-pill" onClick={rest.onHide}>
                            Fechar
                        </Button>
                    </Col>
                </Row>
            </ModalBase.Footer>
        </ModalBase.Root>
    );
}
