import {
    tDashMetaAtingida,
    tDashVendaPorTiposProdServ,
    tDashRankCategoriaPorVenda,
    tDashRankClientePorVenda,
    tDashRankVendedorPorFaturamento,
    tDashValoresTotais,
    tDashEvolucoes,
    tDashtMargemContribuicao,
} from "../interfaces";
import { useCallback, useContext, useState } from "react";
import { ContextAlerta } from "../contexts/ContextAlert";
import { DashboardWhere } from "../types/dashboard";

import api from "../services/api";
import utils from "../utils";

export type tDadosDashboard = {
    valoresTotais: tDashValoresTotais;
    evolucoes: tDashEvolucoes;
    meta: tDashMetaAtingida;
    margemContribuicao: tDashtMargemContribuicao;
    rankVendedores: tDashRankVendedorPorFaturamento[];
    rankClientes: tDashRankClientePorVenda;
    rankCategorias?: tDashRankCategoriaPorVenda;
    vendasPorTipoProdServ?: tDashVendaPorTiposProdServ;
};

let abortController: AbortController | undefined;
export default function useDashboard() {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [arrBuscando, setArrBuscando] = useState<true[]>([]);
    const [buscaComErro, setBuscaComErro] = useState(false);

    const buscar = useCallback(
        async (params: DashboardWhere): Promise<tDadosDashboard> => {
            abortController = new AbortController();
            const signal = abortController.signal;

            const { metrica, ...paramsWithoutMetrica } = params;

            return new Promise(async (resolve, reject) => {
                try {
                    const _valoresTotais = api.getDashValoresTotais(params, signal);
                    const _evolucoes = api.getDashEvoluces(params, signal);
                    const _metaAtingida = api.getDashMetaAtingida(params, signal);
                    const _margemContribuicao = api.getDashMargemContribuicao(paramsWithoutMetrica, signal);
                    const _rankVendedores = api.getDashRankVendedores(params, signal);
                    const _rankClientes = api.getDashRankClientes(params, signal);
                    //const _rankCategorias =
                    //    metrica !== "VISITA" ? api.getDashRankCategorias(params, signal) : { data: undefined };
                    //const _vendasPorTipoProdServ =
                    //    metrica !== "VISITA" ? api.getDashVendasPorTipoProdServ(params, signal) : { data: undefined };

                    setArrBuscando((current) => [...current, true]);
                    const [
                        valoresTotais,
                        evolucoes,
                        metaAtingida,
                        margemContribuicao,
                        rankVendedores,
                        rankClientes,
                        //rankCategorias,
                        //vendasPorTipoProdServ,
                    ] = await Promise.all([
                        _valoresTotais,
                        _evolucoes,
                        _metaAtingida,
                        _margemContribuicao,
                        _rankVendedores,
                        _rankClientes,
                        //_rankCategorias,
                        //_vendasPorTipoProdServ,
                    ]);

                    setBuscaComErro(false);

                    resolve({
                        valoresTotais: valoresTotais.data,
                        evolucoes: evolucoes.data,
                        meta: metaAtingida.data,
                        margemContribuicao: margemContribuicao.data,
                        rankCategorias: undefined,
                        rankClientes: rankClientes.data,
                        rankVendedores: rankVendedores.data,
                        vendasPorTipoProdServ: undefined,
                    });
                } catch (err) {
                    if (utils.blErroCancelamento(err)) return;
                    setPerigo(utils.retornaMensagemErro(err));
                    setBuscaComErro(true);
                    reject(err);
                } finally {
                    setArrBuscando((current) => current.slice(1));
                }
            });
        },
        [setPerigo]
    );

    const cancelar = useCallback(() => abortController?.abort(), []);

    return {
        estaBuscando: arrBuscando.length > 0,
        buscaComErro,
        buscar,
        cancelar,
    };
}
