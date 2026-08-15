import { tDashRankVendedorPorFaturamento } from "../../../interfaces";
import { getCodename } from "../../../lib/constants/codenames";
import { Form, ProgressBar, Stack } from "react-bootstrap";
import { CurrencyType, Role } from "../../../types/commom";
import { DashboardMetric } from "../../../types/dashboard";
import { useCallback, useState } from "react";

import UserRoleUtil from "../../../utils/user-role.util";
import StringUtil from "../../../utils/string.util";
import useFiltros from "../../../hooks/useFiltros";
import utils from "../../../utils";

import "../styles.css";

export default function CardTopUserRoles(props: {
    metrica: DashboardMetric;
    dados: tDashRankVendedorPorFaturamento[];
    hideValues?: boolean;
}) {
    const { roleSelected } = useFiltros();

    const [busca, setBusca] = useState("");
    const [vendedorOnOver, setVendedorOnOver] = useState<string | null>(null);

    const dadosFiltrados = props.dados.filter(({ userRole: vendedor }) =>
        vendedor.user.name.toLowerCase().includes(busca.toLowerCase())
    );

    const handleOnBusca = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setBusca(event.target.value);
    }, []);

    return (
        <div className="my-card-top-vendedores d-flex shadow rounded-4 text-white">
            <Stack className="d-flex w-100 gap-2 overflow-auto p-3">
                <h5>
                    Rank de {UserRoleUtil.getRoleDescription(roleSelected ?? Role.VENDEDOR)} por{" "}
                    {StringUtil.getDashboardMetricDescription(props.metrica)}
                </h5>
                <div className="d-flex justify-content-end w-100">
                    <div className="d-flex mb-3 w-50">
                        <Form.Control
                            placeholder="Buscar vendedor"
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
                                key={dado.userRole.id}
                                className="my-div-card-rank-root rounded bg-dark bg-opacity-25 position-relative"
                                role="button"
                                onMouseEnter={() => setVendedorOnOver(dado.userRole.id)}
                                onMouseLeave={() => setVendedorOnOver(null)}
                            >
                                <div className="my-div-card-rank-icon align-items-center fs-4 justify-content-center">
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
                                            {props.hideValues
                                                ? getCodename(dado.userRole.user.name)
                                                : dado.userRole.user.name}
                                        </span>
                                        <small className="text-truncate" hidden={props.hideValues}>
                                            {dado.userRole.user.email}
                                        </small>
                                    </Stack>
                                </div>
                                <div className="my-div-card-rank-informacoes">
                                    <Stack className="w-100 h-100 justify-content-center d-flex align-items-end pe-3">
                                        <span>
                                            {props.metrica === DashboardMetric.VISITA
                                                ? dado.valorAcumulado
                                                : utils.retornaValorMonetario(dado.valorAcumulado, CurrencyType.BRL)}
                                        </span>
                                        <span> Qnt de vendas: {dado.qntVendas}</span>
                                    </Stack>
                                </div>
                                {props.metrica !== DashboardMetric.VISITA && (
                                    <ProgressBar
                                        now={(dado.valorAcumuladoVendaNova * 100) / dado.valorAcumulado}
                                        variant="success"
                                        label={
                                            vendedorOnOver === dado.userRole.id ? (
                                                <DivVendaNovaVsVendaRenovacao dado={dado} />
                                            ) : undefined
                                        }
                                        className={`my-div-card-top-vendedores-venda-renovacao ${
                                            vendedorOnOver === dado.userRole.id ? "show-more" : ""
                                        } rounded-0 bg-dash-orange-light position-absolute w-100 bottom-0 start-0`}
                                    />
                                )}
                            </div>
                        )
                )}
            </Stack>
        </div>
    );
}

//Funções auxiliares
function DivVendaNovaVsVendaRenovacao({ dado }: { dado: tDashRankVendedorPorFaturamento }) {
    const porcentagemNovaVenda =
        dado.valorAcumulado !== 0 ? (dado.valorAcumuladoVendaNova * 100) / dado.valorAcumulado : 0;
    const porcentagemVendaRenovacao =
        dado.valorAcumulado !== 0 ? (dado.valorAcumuladoVendaRenovacao * 100) / dado.valorAcumulado : 0;

    return (
        <div className="position-absolute w-100 d-flex justify-content-center">
            <table className="w-25">
                <thead>
                    <tr>
                        <th className="text-start pe-2">Novas vendas</th>
                        <th className="text-end">Renovações</th>
                    </tr>
                </thead>
                <tbody className="fw-bold">
                    <tr>
                        <td className="text-start pe-2">
                            {utils.retornaValorMonetario(dado.valorAcumuladoVendaNova, CurrencyType.BRL)}
                        </td>
                        <td className="text-end">
                            {utils.retornaValorMonetario(dado.valorAcumuladoVendaRenovacao, CurrencyType.BRL)}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-start pe-2">{porcentagemNovaVenda.toFixed(2)}%</td>
                        <td className="text-end">{porcentagemVendaRenovacao.toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
