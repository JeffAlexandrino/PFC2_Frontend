import { tDashRankCategoriaPorVenda } from "../../../interfaces";
import { DashboardMetric } from "../../../types/dashboard";
import { CurrencyType } from "../../../types/commom";
import { useCallback, useState } from "react";
import { Form, Stack } from "react-bootstrap";

import StringUtil from "../../../utils/string.util";
import utils from "../../../utils";

import "../styles.css";

export default function CardRankCategoriasPorVenda(props: {
    metrica: DashboardMetric;
    dados?: tDashRankCategoriaPorVenda;
    disabledText?: string;
}) {
    const [busca, setBusca] = useState("");

    const dadosFiltrados =
        props.dados?.filter(({ categoria }) => categoria.name.toLowerCase().includes(busca.toLowerCase())) ?? [];
    const handleOnBusca = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setBusca(event.target.value);
    }, []);

    return (
        <div className="my-div-faturamento-categorias-root d-flex rounded-4 shadow text-white">
            {props.disabledText ? (
                <Stack className="d-flex w-100 align-items-center h-100 justify-content-center">
                    <i className="bi bi-exclamation-circle fs-4" />
                    <div className="w-100 text-center">{props.disabledText}</div>
                </Stack>
            ) : (
                <Stack className="d-flex w-100 gap-2 overflow-auto p-3">
                    <h5>Rank de Categorias por {StringUtil.getDashboardMetricDescription(props.metrica)}</h5>
                    <div className="d-flex justify-content-end w-100">
                        <div className="d-flex mb-3 w-50">
                            <Form.Control
                                placeholder="Buscar categoria"
                                className="bg-transparent text-white rounded-3 my-placeholder-light"
                                size="sm"
                                onChange={handleOnBusca}
                                value={busca}
                            />
                            <div className="d-flex h-100 align-items-center ps-2 pe-2">
                                <i className="bi bi-search" />
                            </div>
                        </div>
                    </div>

                    {dadosFiltrados.map(
                        (dado) =>
                            dado.valorAcumulado !== 0 && (
                                <div
                                    key={dado.categoria.id}
                                    className="my-div-card-rank-root rounded bg-dark bg-opacity-25 pe-2"
                                >
                                    <div className="my-div-card-rank-icon d-flex justify-content-center align-items-center fs-4">
                                        {dado.posicao === 1 ? (
                                            <span>🥇</span>
                                        ) : dado.posicao === 2 ? (
                                            <span>🥈</span>
                                        ) : dado.posicao === 3 ? (
                                            <span>🥉</span>
                                        ) : (
                                            <span className="fs-5">{dado.posicao}</span>
                                        )}
                                    </div>
                                    <div className="my-div-card-rank-nome d-flex text-truncate ms-2 justify-content-start align-items-center">
                                        <span>{dado.categoria.name}</span>
                                    </div>
                                    <div className="my-div-card-rank-valor d-flex justify-content-end align-items-center">
                                        <Stack className="w-100 h-100 justify-content-center d-flex align-items-end pe-3">
                                            <span>
                                                {utils.retornaValorMonetario(dado.valorAcumulado, CurrencyType.BRL)}
                                            </span>
                                        </Stack>
                                    </div>
                                </div>
                            )
                    )}
                </Stack>
            )}
        </div>
    );
}
