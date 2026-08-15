import { tMesesSelecionados, tPossivelMes } from "../../../filtros/FilterMonths";
import { CurrencyType } from "../../../../types/commom";
import { Stack } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { useCallback } from "react";

import useFiltros from "../../../../hooks/useFiltros";
import utils from "../../../../utils";

import "../../styles.css";
import "chart.js/auto";

//TYPES
export type tDadosEvolucaoDashboard = {
    anoAtual: { mesAno: string; valor: number }[];
    anoAnterior: { mesAno: string; valor: number }[];
};

//TODO: Buscar uma forma das cores do gráfico estarem em acordo com as cores definidas no bootstrap
export default function EvolucaoDashboard(props: {
    title?: string;
    currentColor?: "blue" | "yellow";
    passColor?: "blue" | "yellow" | "gray";
    dados: tDadosEvolucaoDashboard;
    monetario?: boolean;
    disabledText?: string;
}) {
    //HOOKS
    const { mesInicialSelecionado, mesFinalSelecionado } = useFiltros();

    //VARIAVEIS
    const inicio = mesInicialSelecionado as tPossivelMes;
    const fim = mesFinalSelecionado as tPossivelMes;

    const currentBorderColor = props.currentColor === "blue" ? "rgba(75,192,192,1)" : "rgba(255,207,0,1)";
    const currentBackgroundColor = props.currentColor === "blue" ? "rgba(75,192,192,0.2)" : "rgba(255,207,0,0.2)";

    const passBorderColor =
        props.passColor === "blue"
            ? "rgba(75,192,192,1)"
            : props.passColor === "yellow"
              ? "rgba(255,207,0,1)"
              : "#bfc0c0";

    const retornaMesesEmIntervalo = useCallback((meses: tMesesSelecionados | null) => {
        if (meses === null) return [];
        if (meses.inicio === undefined || meses.fim === undefined) return [];

        const nomesMeses = [
            "jan.",
            "fev.",
            "mar.",
            "abr.",
            "mai.",
            "jun.",
            "jul.",
            "ago.",
            "set.",
            "out.",
            "nov.",
            "dez.",
        ];

        const mesesRetornar = [];

        for (let mes = meses.inicio; mes <= meses.fim; mes++) {
            mesesRetornar.push(nomesMeses[mes]);
        }

        return mesesRetornar;
    }, []);

    const retornaArrayValoresOrdenado = useCallback(
        (dados: tDadosEvolucaoDashboard, meses: tMesesSelecionados | null) => {
            if (meses === null) return [];
            if (meses.inicio === undefined || meses.fim === undefined) return [];

            const arrMeses = [];

            for (let mes = meses.inicio; mes <= meses.fim; mes++) {
                arrMeses.push(mes);
            }

            return arrMeses.map((mes) => {
                const dadoAtualDoMes = dados.anoAtual.find((dado) => {
                    const [mesDoDado] = dado.mesAno.split("-");

                    return Number(mesDoDado) - 1 === mes;
                });

                const dadoAnteriorDoMes = dados.anoAnterior.find((dado) => {
                    const [mesDoDado] = dado.mesAno.split("-");

                    return Number(mesDoDado) - 1 === mes;
                });

                return {
                    valorAtual: dadoAtualDoMes?.valor ?? 0,
                    valorAnterior: dadoAnteriorDoMes?.valor ?? 0,
                };
            });
        },
        []
    );

    const meses = retornaMesesEmIntervalo({ inicio, fim });
    const valoresAtuais = retornaArrayValoresOrdenado(props.dados, { inicio, fim }).map(({ valorAtual }) => valorAtual);
    const valoresAnteriores = retornaArrayValoresOrdenado(props.dados, { inicio, fim }).map(
        ({ valorAnterior }) => valorAnterior
    );
    //TODO: Mudar o nome da classe de css de faturamento para algo generico
    return (
        <div className="my-div-evolucao-faturamento-root rounded-4 shadow p-3 text-white">
            {props.disabledText ? (
                <Stack className="d-flex w-100 align-items-center h-100 justify-content-center">
                    <i className="bi bi-exclamation-circle fs-4" />
                    <div className="w-100 text-center">{props.disabledText}</div>
                </Stack>
            ) : (
                <Stack className="d-flex gap-2 h-100 w-100">
                    <div className="my-div-evolucao-faturamento-header d-flex">
                        <h5>{props.title}</h5>
                    </div>

                    <div className="my-div-evolucao-faturamento-grafico d-flex w-100">
                        <Line
                            options={{
                                aspectRatio: 0,
                                scales: {
                                    x: { ticks: { color: "white", font: { size: 18 } } },
                                    y: {
                                        ticks: {
                                            color: "white",
                                            callback: (valor) =>
                                                props.monetario
                                                    ? utils.retornaValorMonetario(Number(valor), CurrencyType.BRL)
                                                    : valor,
                                            font: { size: 20 },
                                        },
                                        suggestedMin: 0,
                                    },
                                },
                                plugins: {
                                    legend: {
                                        title: { color: "white" },
                                        labels: { color: "white", font: { size: 18 } },
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (info) =>
                                                `Valor: ${
                                                    props.monetario
                                                        ? utils.retornaValorMonetario(info.parsed.y, CurrencyType.BRL)
                                                        : info.parsed.y
                                                }`,
                                        },
                                    },
                                },
                            }}
                            data={{
                                labels: meses,
                                datasets: [
                                    {
                                        label: "Atual",
                                        fill: true,
                                        data: valoresAtuais,
                                        backgroundColor: currentBackgroundColor,
                                        borderColor: currentBorderColor,
                                    },
                                    {
                                        label: "Ano anterior",
                                        data: valoresAnteriores,
                                        borderColor: passBorderColor,
                                        borderDash: [8],
                                    },
                                ],
                            }}
                        />
                    </div>
                </Stack>
            )}
        </div>
    );
}
