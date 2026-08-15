import useAuditoria, { LIMITE_POR_BUSCA_AUDITORIA } from "../../hooks/useAuditoria";
import { IModalBaseRoot } from "./ModalBase/ModalBaseRoot";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { tAuditoria } from "../../interfaces";
import { Visit } from "../../types/visits";
import { ModalBase } from "./ModalBase";

import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import TimeLine from "../timeline/Timeline";
import utils from "../../utils";

import "./styles.css";

export interface ModalAuditoriaVisitaProps extends IModalBaseRoot {
    visita: Visit | null;
}
export default function ModalAuditoriaVisita({ visita, ...rest }: ModalAuditoriaVisitaProps) {
    //HOOKS
    const { buscaComErro, buscar, estaBuscando, cancelar } = useAuditoria();

    //ESTADOS
    const [auditorias, setAuditorias] = useState<tAuditoria[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [proximaPagina, setProximaPagina] = useState(1);

    //VARIAVEIS
    const buscarAuditorias = useCallback(
        async (visita: Visit, pagina?: number) => {
            try {
                const novasAuditorias = await buscar({
                    limit: LIMITE_POR_BUSCA_AUDITORIA,
                    page: pagina,
                    where: { tabela: "VISITA", dadoId: visita.id },
                });
                if (pagina === undefined) {
                    setAuditorias(novasAuditorias);
                    setPaginaAtual(0);
                    setProximaPagina(1);
                } else setAuditorias((atuais) => [...atuais, ...novasAuditorias]);
                return novasAuditorias.length;
            } catch (err) {
                throw err;
            }
        },
        [buscar]
    );

    //EVENTOS
    useEffect(() => {
        if (!visita) return setAuditorias([]);

        buscarAuditorias(visita);
        return () => cancelar();
    }, [visita, cancelar, buscarAuditorias]);

    return (
        <ModalBase.Root {...rest}>
            <ModalBase.Header>
                <h4>Auditoria da Saída</h4>
            </ModalBase.Header>
            <ModalBase.Body>
                <Row className="my-auditoria-modal-body">
                    <InfiniteScroll
                        buscar={async (page) => (visita ? await buscarAuditorias(visita, page) : 0)}
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
                                    const dado: any = auditoria.dado;
                                    const kmTotal =
                                        dado.kmFinal && dado.kmInicial ? dado.kmFinal - dado.kmInicial : "N/A";
                                    return {
                                        feitoPor: auditoria.usuario,
                                        data: auditoria.data,
                                        descricao: (
                                            <Row>
                                                {auditoria.acao === "CREATE" || auditoria.acao === "UPDATE" ? (
                                                    <>
                                                        <Col sm="12">
                                                            {utils.retornaTextoAcao(auditoria.acao)} a saída com os
                                                            seguintes valores:
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Saída Paga:</strong>{" "}
                                                            {dado.visitaPaga ? "Sim" : "Não"}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Tipo:</strong>{" "}
                                                            {dado.remoto ? "Remota" : "Presencial"}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Carro da Empresa:</strong>{" "}
                                                            {dado.carroEmpresa ? "Sim" : "Não"}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Kilometragem:</strong> {kmTotal} km
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
