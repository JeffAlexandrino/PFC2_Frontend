import useAuditoria, { LIMITE_POR_BUSCA_AUDITORIA } from "../../hooks/useAuditoria";
import InfiniteScroll from "../infiniteScroll/InfiniteScroll";
import { IModalBaseRoot } from "./ModalBase/ModalBaseRoot";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { tAuditoria } from "../../interfaces";
import { Optional } from "../../types/commom";
import { ModalBase } from "./ModalBase";
import { User } from "../../types/user";

import TimeLine from "../timeline/Timeline";
import utils from "../../utils";

import "./styles.css";

export interface ModalAuditoriaVendedorProps extends IModalBaseRoot {
    user: User | null;
}
export default function ModalAuditoriaUser({ user, ...rest }: ModalAuditoriaVendedorProps) {
    //HOOKS
    const { buscaComErro, buscar, estaBuscando, cancelar } = useAuditoria();

    //ESTADOS
    const [auditorias, setAuditorias] = useState<tAuditoria[]>([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [proximaPagina, setProximaPagina] = useState(1);

    //VARIAVEIS
    const buscarAuditorias = useCallback(
        async (user: User, pagina?: number) => {
            try {
                const novasAuditorias = await buscar({
                    limit: LIMITE_POR_BUSCA_AUDITORIA,
                    page: pagina,
                    where: { tabela: "USUARIO", dadoId: user.id },
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
        if (!user) return setAuditorias([]);

        buscarAuditorias(user);
        return () => cancelar();
    }, [user, cancelar, buscarAuditorias]);

    return (
        <ModalBase.Root {...rest}>
            <ModalBase.Header>
                <h4>Auditoria do Usuário</h4>
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
                                    const dado: Optional<User> = auditoria.dado as any;
                                    return {
                                        feitoPor: auditoria.usuario,
                                        data: auditoria.data,
                                        descricao: (
                                            <Row>
                                                {auditoria.acao === "CREATE" ? (
                                                    <>
                                                        <Col sm="12">
                                                            {utils.retornaTextoAcao(auditoria.acao)} o usuário com os
                                                            seguintes dados:
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Nome:</strong> {dado.name}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>E-mail:</strong> {dado.email}
                                                        </Col>{" "}
                                                    </>
                                                ) : auditoria.acao === "UPDATE" ? (
                                                    <>
                                                        <Col sm="12">
                                                            {utils.retornaTextoAcao(auditoria.acao)} o usuário com os
                                                            seguintes dados:
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Nome:</strong> {dado.name}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>E-mail:</strong> {dado.email}
                                                        </Col>
                                                        <Col sm="12">
                                                            <strong>Bloqueado?:</strong>{" "}
                                                            {dado.bloqueado ? "Sim" : "Não"}
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
