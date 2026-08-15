import { tDashVendaPorTiposProdServ } from "../../../../interfaces";
import { DashboardMetric } from "../../../../types/dashboard";
import { CurrencyType } from "../../../../types/commom";
import { Doughnut } from "react-chartjs-2";
import { Stack } from "react-bootstrap";

import StringUtil from "../../../../utils/string.util";
import utils from "../../../../utils";

import "chart.js/auto";

export default function CardTiposProdServ(props: {
    metrica: DashboardMetric;
    dados?: tDashVendaPorTiposProdServ;
    disabledText?: string;
    hideValues?: boolean;
}) {
    const dadosOrdenados = [...(props.dados ?? [])].sort((a, b) => b.valorAcumulado - a.valorAcumulado);

    const top3 = dadosOrdenados.slice(0, 2);
    const outros = dadosOrdenados.slice(2);

    const somaOutros = outros.reduce((acc, cur) => acc + cur.valorAcumulado, 0);

    const dadosFinal =
        somaOutros > 0 ? [...top3, { tipoProdServ: { name: "OUTROS" }, valorAcumulado: somaOutros }] : top3;

    const nomesDosTipos = dadosFinal.map((d) => d.tipoProdServ.name);
    const valores = dadosFinal.map((d) => d.valorAcumulado);

    const total = valores.reduce((a, b) => a + b, 0);

    const colors = ["#4dabf7", "#ff6b6b", "#ffd43b", "#69db7c"];

    return (
        <div className="my-div-produto-vs-servico-root rounded-4 shadow p-3 text-white h-100">
            {props.disabledText ? (
                <Stack className="d-flex w-100 align-items-center h-100 justify-content-center">
                    <i className="bi bi-exclamation-circle fs-4" />

                    <div className="w-100 text-center">{props.disabledText}</div>
                </Stack>
            ) : (
                <Stack className="d-flex h-100 w-100">
                    <div className="my-div-produto-vs-servico-content">
                        <div className="my-div-produto-vs-servico-header">
                            <h4 className="mb-0 fw-bold">Tipo de produto/serviço</h4>

                            <small className="opacity-75">
                                {StringUtil.getDashboardMetricDescription(props.metrica)}
                            </small>
                        </div>

                        <div className="my-div-produto-vs-servico-chart-wrapper">
                            <div className="my-div-produto-vs-servico-chart">
                                <Doughnut
                                    data={{
                                        labels: nomesDosTipos,
                                        datasets: [
                                            {
                                                data: valores,
                                                backgroundColor: colors,
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        cutout: "68%",
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (ctx) =>
                                                        utils.retornaValorMonetario(ctx.parsed, CurrencyType.BRL),
                                                },
                                            },
                                        },
                                    }}
                                />

                                <div className="my-div-produto-vs-servico-center">
                                    <strong className="my-div-produto-vs-servico-total">
                                        {props.hideValues !== true
                                            ? utils.retornaValorMonetario(total, CurrencyType.BRL)
                                            : ""}
                                    </strong>

                                    <div className="my-div-produto-vs-servico-total-label">Total</div>
                                </div>
                            </div>
                        </div>

                        <div className="my-div-produto-vs-servico-legenda">
                            {dadosFinal.map((item, i) => (
                                <div key={i} className="my-div-produto-vs-servico-legenda-item">
                                    <span
                                        className="my-div-produto-vs-servico-legenda-color"
                                        style={{
                                            backgroundColor: colors[i % colors.length],
                                        }}
                                    />

                                    <span className="my-div-produto-vs-servico-legenda-texto">
                                        {item.tipoProdServ.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Stack>
            )}
        </div>
    );
}
