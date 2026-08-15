import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tTipoProdutoServico } from "../../interfaces";

import OffcanvasTipoProdutoServico from "../offcanvas/OffcanvasTipoProdutoServico";
import useTipoProdutoServico from "../../hooks/useTipoProdutoServico";
import SelectMenu from "./SelectMenu";

export interface ISelectTipoProdutoServicoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectTipoProdutoServico({ idSelecionado, setIdSelecionado }: ISelectTipoProdutoServicoProps) {
    //HOOKS
    const { buscar, estaBuscando, cancelar, buscaComErro } = useTipoProdutoServico();

    //CONTEXTOS
    const { canEditTypeProductService, canDeleteTypeProductService, canAddTypeProductService } =
        useContext(ContextUser);

    //ESTADOS
    const [tipos, setTipos] = useState<tTipoProdutoServico[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
    const [tipoEditando, setTipoEditando] = useState<tTipoProdutoServico | null>(null);
    const [tipoDeletando, setTipoDeletando] = useState<tTipoProdutoServico | null>(null);

    //VARIAVEIS

    const tiposFiltrados = tipos.filter((tipo) => tipo.name.toLowerCase().includes(pesquisa.toLowerCase()));

    const valoresFormatados = tiposFiltrados.map((tipo) => ({
        ...tipo,
        texto: tipo.name,
        selecionado: idSelecionado === tipo.id,
    }));

    //EVENTOS
    const buscarTiposProdServ = useCallback(() => {
        buscar()
            .then((tipos) => setTipos(tipos))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarTiposProdServ();
        return () => cancelar();
    }, [buscarTiposProdServ, cancelar]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);

    const handleOnClickEditar = useCallback(
        (id: string) => {
            const tipoEditando = tipos.find((tipo) => tipo.id === id);
            if (tipoEditando) setTipoEditando(tipoEditando);
        },
        [tipos]
    );

    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const tipoDeletando = tipos.find((tipo) => tipo.id === id);
            if (tipoDeletando) setTipoDeletando(tipoDeletando);
        },
        [tipos]
    );

    const handleOnClickTipo = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo tipo a selecionar
            const tipoNovo = tipos.find((tipo) => tipo.id === id);
            if (!tipoNovo) return;

            if (tipoNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(tipoNovo.id);
        },
        [setIdSelecionado, tipos, idSelecionado]
    );

    const returnLabelTipoSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const tipoSelecionado = tipos.find(({ id }) => id === idSelecionado);
        if (!tipoSelecionado) return "--- Nenhum ---";
        return tipoSelecionado.name;
    }, [idSelecionado, tipos]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelTipoSelecionado()}
                onOpenMenu={buscaComErro ? buscarTiposProdServ : undefined}
                onClickAdicionar={canAddTypeProductService({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickTipo}
                onClickDeletar={canDeleteTypeProductService({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditTypeProductService({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasTipoProdutoServico
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarTiposProdServ}
            />

            <OffcanvasTipoProdutoServico
                tipo="editar"
                mostrarForm={tipoEditando !== null}
                onCancel={() => setTipoEditando(null)}
                onTerminou={() => {
                    setTipoEditando(null);
                    buscarTiposProdServ();
                }}
                dados={tipoEditando}
            />

            <OffcanvasTipoProdutoServico
                tipo="deletar"
                mostrarForm={tipoDeletando !== null}
                onCancel={() => setTipoDeletando(null)}
                onTerminou={() => {
                    setTipoDeletando(null);
                    buscarTiposProdServ();
                }}
                dados={tipoDeletando}
            />
        </>
    );
}
