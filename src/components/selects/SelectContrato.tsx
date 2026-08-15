import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tContrato } from "../../interfaces";

import OffcanvasContrato from "../offcanvas/OffcanvasContrato";
import useContrato from "../../hooks/useContrato";
import SelectMenu from "./SelectMenu";

export interface ISelectContratoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectContrato({ setIdSelecionado, idSelecionado }: ISelectContratoProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useContrato();

    //CONTEXTOS
    const { canEditContract, canDeleteContract, canAddContract } = useContext(ContextUser);

    //ESTADOS
    const [contratos, setContratos] = useState<tContrato[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [contratoEditando, setContratoEditando] = useState<tContrato | null>(null);
    const [contratoDeletando, setContratoDeletando] = useState<tContrato | null>(null);

    //VARIAVEIS
    const contratosFiltrados = contratos.filter((contrato) =>
        contrato.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = contratosFiltrados.map((contrato) => ({
        ...contrato,
        texto: contrato.name,
        selecionado: idSelecionado === contrato.id,
    }));

    //EVENTOS
    const buscarContratos = useCallback(() => {
        buscar()
            .then((contratos) => setContratos(contratos))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarContratos();
        return () => cancelar();
    }, [cancelar, buscarContratos]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const contratoEditando = contratos.find((contrato) => contrato.id === id);
            if (contratoEditando) setContratoEditando(contratoEditando);
        },
        [contratos]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const contratoDeletando = contratos.find((contrato) => contrato.id === id);
            if (contratoDeletando) setContratoDeletando(contratoDeletando);
        },
        [contratos]
    );
    const handleOnClickContrato = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando a novo contrato a selecionar
            const contratoNovo = contratos.find((contrato) => contrato.id === id);
            if (!contratoNovo) return;

            if (contratoNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(contratoNovo.id);
        },
        [setIdSelecionado, contratos, idSelecionado]
    );

    const returnLabelContratoSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const contratoSelecionado = contratos.find(({ id }) => id === idSelecionado);
        if (!contratoSelecionado) return "--- Nenhum ---";
        return contratoSelecionado.name;
    }, [idSelecionado, contratos]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                onOpenMenu={buscaComErro ? buscarContratos : undefined}
                texto={returnLabelContratoSelecionado()}
                onClickAdicionar={canAddContract({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickContrato}
                onClickDeletar={canDeleteContract({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditContract({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasContrato
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarContratos}
            />

            <OffcanvasContrato
                tipo="editar"
                mostrarForm={contratoEditando !== null}
                dados={contratoEditando}
                onTerminou={() => {
                    buscarContratos();
                    setContratoEditando(null);
                }}
                onCancel={() => setContratoEditando(null)}
            />

            <OffcanvasContrato
                tipo="deletar"
                mostrarForm={contratoDeletando !== null}
                dados={contratoDeletando}
                onTerminou={() => {
                    buscarContratos();
                    setContratoDeletando(null);
                }}
                onCancel={() => setContratoDeletando(null)}
            />
        </>
    );
}
