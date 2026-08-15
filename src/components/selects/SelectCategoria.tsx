import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tCategoria } from "../../interfaces";

import OffcanvasCategoria from "../offcanvas/OffcanvasCategoria";
import useCategoria from "../../hooks/useCategoria";
import SelectMenu from "./SelectMenu";

export interface ISelectCategoriaProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectCategoria({ setIdSelecionado, idSelecionado }: ISelectCategoriaProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useCategoria();

    //CONTEXTOS
    const { canEditCategory, canDeleteCategory, canAddCategory } = useContext(ContextUser);

    //ESTADOS
    const [categorias, setCategorias] = useState<tCategoria[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [categoriaEditando, setCategoriaEditando] = useState<tCategoria | null>(null);
    const [categoriaDeletando, setCategoriaDeletando] = useState<tCategoria | null>(null);

    //VARIAVEIS
    const categoriasFiltradas = categorias.filter((categoria) =>
        categoria.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = categoriasFiltradas.map((categoria) => ({
        ...categoria,
        texto: categoria.name,
        selecionado: idSelecionado === categoria.id,
    }));

    //EVENTOS
    const buscarCategorias = useCallback(() => {
        buscar()
            .then((categorias) => setCategorias(categorias))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarCategorias();
        return () => cancelar();
    }, [cancelar, buscarCategorias]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const categoriaEditando = categorias.find((categoria) => categoria.id === id);
            if (categoriaEditando) setCategoriaEditando(categoriaEditando);
        },
        [categorias]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const categoriaDeletando = categorias.find((categoria) => categoria.id === id);
            if (categoriaDeletando) setCategoriaDeletando(categoriaDeletando);
        },
        [categorias]
    );
    const handleOnClickCategoria = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando a nova categoria a selecionar
            const categoriaNova = categorias.find((categoria) => categoria.id === id);
            if (!categoriaNova) return;

            if (categoriaNova.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(categoriaNova.id);
        },
        [setIdSelecionado, categorias, idSelecionado]
    );

    const returnLabelCategoriaSelecionada = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhuma ---";

        const categoriaSelecionada = categorias.find(({ id }) => id === idSelecionado);
        if (!categoriaSelecionada) return "--- Nenhuma ---";
        return categoriaSelecionada.name;
    }, [idSelecionado, categorias]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelCategoriaSelecionada()}
                onOpenMenu={buscaComErro ? buscarCategorias : undefined}
                onClickAdicionar={canAddCategory({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickCategoria}
                onClickDeletar={canDeleteCategory({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditCategory({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasCategoria
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarCategorias}
            />

            <OffcanvasCategoria
                tipo="editar"
                mostrarForm={categoriaEditando !== null}
                dados={categoriaEditando}
                onTerminou={() => {
                    buscarCategorias();
                    setCategoriaEditando(null);
                }}
                onCancel={() => setCategoriaEditando(null)}
            />

            <OffcanvasCategoria
                tipo="deletar"
                mostrarForm={categoriaDeletando !== null}
                dados={categoriaDeletando}
                onTerminou={() => {
                    buscarCategorias();
                    setCategoriaDeletando(null);
                }}
                onCancel={() => setCategoriaDeletando(null)}
            />
        </>
    );
}
