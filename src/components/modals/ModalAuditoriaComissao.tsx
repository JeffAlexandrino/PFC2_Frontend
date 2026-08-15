import useAuditoria, { LIMITE_POR_BUSCA_AUDITORIA } from "../../hooks/useAuditoria";
import { IModalBaseRoot } from "./ModalBase/ModalBaseRoot";
import { useCallback, useEffect, useState } from "react";
import { tAuditoria, tComissao } from "../../interfaces";
import { Commission } from "../../types/commission";
import { Button, Col, Row } from "react-bootstrap";
import { ModalBase } from "./ModalBase";

import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import TimeLine from "../timeline/Timeline";
import utils from "../../utils";

import "./styles.css";

export interface ModalAuditoriaComissaoProps extends IModalBaseRoot {
    comissao: Commission | null;
}
export default function ModalAuditoriaComissao({ comissao, ...rest }: ModalAuditoriaComissaoProps) {
    //HOOKS
    const { buscaComErro, buscar, estaBuscando, cancelar } = useAuditoria();

    //ESTADOS
    const [auditorias, setAuditorias] = useState<tAuditoria[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [proximaPagina, setProximaPagina] = useState(1);

    //VARIAVEIS
    const buscarAuditorias = useCallback(
        async (comissao: Commission, pagina?: number) => {
            try {
                const novasAuditorias = await buscar({
                    limit: LIMITE_POR_BUSCA_AUDITORIA,
                    page: pagina,
                    where: { tabela: "COMISSAO", dadoId: comissao.id },
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
        if (!comissao) return setAuditorias([]);

        buscarAuditorias(comissao);
        return () => cancelar();
    }, [comissao, cancelar, buscarAuditorias]);

    return (
        <ModalBase.Root {...rest}>
            <ModalBase.Header>
                <h4>Auditoria da Comissão</h4>
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
                                    const dadoComissao: tComissao = auditoria.dado as any;
                                    return {
                                        feitoPor: auditoria.usuario,
                                        data: auditoria.data,
                                        descricao: (
                                            <span className="text-wrap">
                                                {utils.retornaTextoAcao(auditoria.acao)} o estado da comissão para{" "}
                                                <strong>{dadoComissao.comissaoPaga ? "paga" : "não paga"}</strong>
                                            </span>
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
