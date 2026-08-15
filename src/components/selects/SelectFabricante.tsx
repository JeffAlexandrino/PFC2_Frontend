import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tFabricante } from "../../interfaces";

import OffcanvasFabricante from "../offcanvas/OffcanvasFabricante";
import useFabricante from "../../hooks/useFabricante";
import SelectMenu from "./SelectMenu";

export interface ISelectFabricanteProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectFabricante(props: ISelectFabricanteProps) {
    //HOOKS
    const { buscar, cancelar, estaBuscando, buscaComErro } = useFabricante();

    //CONTEXTOS
    const { canEditManufacturer, canDeleteManufacturer, canAddManufacturer } = useContext(ContextUser);

    //ESTADOS
    const [fabricantes, setFabricantes] = useState<tFabricante[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [fabricanteEditando, setFabricanteEditando] = useState<tFabricante | null>(null);
    const [fabricanteDeletando, setFabricanteDeletando] = useState<tFabricante | null>(null);

    //VARIAVEIS
    const { setIdSelecionado, idSelecionado } = props;

    const fabricantesFiltrados = fabricantes.filter((fabricante) =>
        fabricante.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = fabricantesFiltrados.map((fabricante) => ({
        ...fabricante,
        texto: fabricante.name,
        selecionado: idSelecionado === fabricante.id,
    }));

    //EVENTOS
    const buscarFabricantes = useCallback(() => {
        buscar()
            .then((fabricantes) => setFabricantes(fabricantes))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarFabricantes();
        return () => cancelar();
    }, [cancelar, buscarFabricantes]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const fabricanteEditando = fabricantes.find((fabricante) => fabricante.id === id);
            if (fabricanteEditando) setFabricanteEditando(fabricanteEditando);
        },
        [fabricantes]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const fabricanteDeletando = fabricantes.find((fabricante) => fabricante.id === id);
            if (fabricanteDeletando) setFabricanteDeletando(fabricanteDeletando);
        },
        [fabricantes]
    );
    const handleOnClickFabricante = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo fabricante a selecionar
            const fabricanteNovo = fabricantes.find((fabricante) => fabricante.id === id);
            if (!fabricanteNovo) return;

            if (fabricanteNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(fabricanteNovo.id);
        },
        [setIdSelecionado, fabricantes, idSelecionado]
    );

    const returnLabelFabricanteSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const fabricanteSelecionado = fabricantes.find(({ id }) => id === idSelecionado);
        if (!fabricanteSelecionado) return "--- Nenhum ---";
        return fabricanteSelecionado.name;
    }, [idSelecionado, fabricantes]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelFabricanteSelecionado()}
                onOpenMenu={buscaComErro ? buscarFabricantes : undefined}
                onClickAdicionar={canAddManufacturer({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickFabricante}
                onClickDeletar={canDeleteManufacturer({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditManufacturer({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasFabricante
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarFabricantes}
            />

            <OffcanvasFabricante
                tipo="editar"
                mostrarForm={fabricanteEditando !== null}
                dados={fabricanteEditando}
                onCancel={() => setFabricanteEditando(null)}
                onTerminou={() => {
                    buscarFabricantes();
                    setFabricanteEditando(null);
                }}
            />

            <OffcanvasFabricante
                tipo="deletar"
                mostrarForm={fabricanteDeletando !== null}
                dados={fabricanteDeletando}
                onCancel={() => setFabricanteDeletando(null)}
                onTerminou={() => {
                    buscarFabricantes();
                    setFabricanteDeletando(null);
                }}
            />
        </>
    );
}
