import { tDashRankClientePorVenda } from "../../../interfaces";
import { DashboardMetric } from "../../../types/dashboard";
import { CurrencyType } from "../../../types/commom";
import { Form, Stack } from "react-bootstrap";
import { useCallback, useState } from "react";

import StringUtil from "../../../utils/string.util";
import utils from "../../../utils";

import "../styles.css";

export default function CardTopClientes(props: { metrica: DashboardMetric; dados: tDashRankClientePorVenda }) {
    const [busca, setBusca] = useState("");

    const dadosFiltrados = props.dados.filter(({ cliente }) =>
        cliente.name.toLowerCase().includes(busca.toLowerCase())
    );

    const handleOnBusca = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setBusca(event.target.value);
    }, []);

    //Depois passar essa função de limite variavel de uma string para util e usar atraves do codigo
    function limitString(input: string, maxLength: number): string {
        return input.length > maxLength ? input.substring(0, maxLength) : input;
    }

    return (
        <div className="my-card-top-clientes d-flex shadow rounded-4 text-white">
            <Stack className="d-flex w-100 gap-2 overflow-auto p-3">
                <h5>Rank de Clientes por {StringUtil.getDashboardMetricDescription(props.metrica)}</h5>
                <div className="d-flex justify-content-end w-100">
                    <div className="d-flex mb-3 w-50">
                        <Form.Control
                            placeholder="Buscar cliente"
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
                                key={dado.cliente.id}
                                className="my-div-card-rank-cliente-root rounded bg-dark bg-opacity-25"
                            >
                                <div className="my-div-card-rank-icon d-flex align-items-center fs-4 justify-content-center">
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
                                <div className="my-div-card-rank-nome ms-2">
                                    <Stack className="w-100 h-100 justify-content-center d-flex">
                                        <span>
                                            {dado.cliente.name.length > 19
                                                ? limitString(dado.cliente.name, 19) + "..."
                                                : dado.cliente.name}
                                        </span>
                                        <small className="text-truncate">{dado.cliente.segmento.name}</small>
                                    </Stack>
                                </div>

                                <div className="my-div-card-rank-valor align-items-center justify-content-center">
                                    <span>
                                        {props.metrica === DashboardMetric.VISITA
                                            ? dado.valorAcumulado
                                            : utils.retornaValorMonetario(dado.valorAcumulado, CurrencyType.BRL)}
                                    </span>
                                </div>

                                <div className="my-div-card-rank-informacoes pe-3">
                                    <small className="text-truncate-right">Qtd de vendas: {dado.qntVendas}</small>
                                    <small className="text-truncate-right">
                                        Despesa: {utils.retornaValorMonetario(dado.valorGasto, CurrencyType.BRL)}
                                    </small>
                                </div>
                            </div>
                        )
                )}
            </Stack>
        </div>
    );
}
