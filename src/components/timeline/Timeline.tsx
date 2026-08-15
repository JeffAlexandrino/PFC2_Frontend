import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import { v4 } from "uuid";

import "./styles.css";

export interface IDadoTimeLine {
    data: Date;
    feitoPor: { id: string; name: string };
    descricao: ReactNode;
}

interface IDadoTimeLineAgrupado {
    data: string;
    dados: IDadoTimeLine[];
}

interface ITimeLineProps {
    dados?: IDadoTimeLine[];
}

export default function TimeLine(props: ITimeLineProps) {
    //ESTADOS
    const [dadosAgrupados, setDadosAgrupados] = useState<IDadoTimeLineAgrupado[]>([]);

    //VARIAVEIS
    const { dados } = props;

    //EVENTOS
    const agrupaDadosEmDatas = useCallback((dados: IDadoTimeLine[]): Record<string, IDadoTimeLine[]> => {
        //Funcao para formatar a data em string
        function formataData(data: Date) {
            return data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        }

        const dadosAgrupados: Record<string, IDadoTimeLine[]> = dados.reduce(
            (acc, dado) => {
                const dataFormatada = formataData(dado.data);
                if (!acc[dataFormatada]) {
                    acc[dataFormatada] = [];
                }
                acc[dataFormatada].push(dado);
                return acc;
            },
            {} as Record<string, IDadoTimeLine[]>
        );

        return dadosAgrupados;
    }, []);

    useEffect(() => {
        if (!dados) return;

        const dadosAgrupadosEmObjeto = agrupaDadosEmDatas(dados);
        const dadosAgrupadosEmArray: IDadoTimeLineAgrupado[] = Object.keys(dadosAgrupadosEmObjeto).map((key) => ({
            data: key,
            dados: dadosAgrupadosEmObjeto[key],
        }));

        setDadosAgrupados(dadosAgrupadosEmArray);
    }, [dados, agrupaDadosEmDatas]);

    return (
        <div className="my-div-timeline-root d-flex p-3 gap-3">
            <Row className="my-div-timeline-row">
                {dadosAgrupados.map((dadoAgrupado) => (
                    <React.Fragment key={v4()}>
                        <Col className="my-col-timeline-dot col-3">
                            <Stack className="d-flex w-100 h-100 align-items-center position-relative">
                                <label className={`my-label-timeline-data-point rounded-circle`} />
                                <label className={`my-label-timeline-line my-data`} />
                            </Stack>
                        </Col>
                        <Col className="my-col-timeline-data col-9 mb-4">
                            <span className="fs-5 text-secondary-dark lh-1 text-nowrap">{dadoAgrupado.data}</span>
                        </Col>
                        {dadoAgrupado.dados.map((dado) => (
                            <React.Fragment key={v4()}>
                                <Col className="my-col-timeline-dot col-3">
                                    <Stack className="d-flex w-100 h-100 align-items-center">
                                        <label className={`my-label-timeline-hora-point rounded-circle`} />
                                        <label className={`my-label-timeline-line my-hora`} />
                                    </Stack>
                                </Col>
                                <Col className="my-col-timeline-data col-9 mb-4">
                                    <Stack className="d-flex">
                                        <div className="d-flex me-3 align-items-center gap-2">
                                            <span className="text-secondary-dark">
                                                {dado.data.toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>{" "}
                                            -
                                            <span className="lh-1 small">
                                                <i className="bi bi-person-fill me-2" />
                                                {dado.feitoPor.name}
                                            </span>
                                        </div>
                                        <span className="w-100">{dado.descricao}</span>
                                    </Stack>
                                </Col>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </Row>
        </div>
    );
}
