import useAuditoria, { LIMITE_POR_BUSCA_AUDITORIA } from "../../hooks/useAuditoria";
import { IModalBaseRoot } from "./ModalBase/ModalBaseRoot";
import { tAuditoria, tProduto } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { tNovoProduto } from "../forms/FormProduto";
import { ModalBase } from "./ModalBase";

import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import TimeLine from "../timeline/Timeline";
import utils from "../../utils";

import "./styles.css";

export interface ModalAuditoriaProdutoProps extends IModalBaseRoot {
    produto: tProduto | null;
}
export default function ModalAuditoriaProduto({ produto, ...rest }: ModalAuditoriaProdutoProps) {
    //HOOKS
    const { buscaComErro, buscar, estaBuscando, cancelar } = useAuditoria();

    //ESTADOS
    const [auditorias, setAuditorias] = useState<tAuditoria[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [proximaPagina, setProximaPagina] = useState(1);

    //VARIAVEIS
    const buscarAuditorias = useCallback(
        async (produto: tProduto, pagina?: number) => {
            try {
                const novasAuditorias = await buscar({
                    limit: LIMITE_POR_BUSCA_AUDITORIA,
                    page: pagina,
                    where: { tabela: "PRODUTO", dadoId: produto.id },
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
        if (!produto) return setAuditorias([]);

        buscarAuditorias(produto);
        return () => cancelar();
    }, [produto, cancelar, buscarAuditorias]);

    return (
        <ModalBase.Root {...rest}>
            <ModalBase.Header>
                <h4>Auditoria do Produto</h4>
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
                                    const dado: tNovoProduto = auditoria.dado as any;
                                    return {
                                        feitoPor: auditoria.usuario,
                                        data: auditoria.data,
                                        descricao: (
                                            <Row>
                                                {auditoria.acao === "CREATE" || auditoria.acao === "UPDATE" ? (
                                                    <>
                                                        <Col sm="12">
                                                            {utils.retornaTextoAcao(auditoria.acao)} o produto com os
                                                            seguintes dados:
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Nome:</strong> {dado.name}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>PartNumber:</strong> {dado.partNumber}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Custo Unitário:</strong>{" "}
                                                            {utils.retornaValorMonetario(
                                                                dado.custoUnit,
                                                                dado.tipoMoeda
                                                            )}
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
