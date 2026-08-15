import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tProduto } from "../../interfaces";

import OffcanvasProduto from "../offcanvas/OffcanvasProduto";
import useProduto from "../../hooks/useProduto";
import SelectMenu from "./SelectMenu";

export interface ISelectProdutoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
    size?: "sm";
    naoMostrarIds?: string[];
}

export default function SelectProduto(props: ISelectProdutoProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useProduto();

    //CONTEXTOS
    const { canEditProduct, canDeleteProduct, canAddProduct } = useContext(ContextUser);

    //ESTADOS
    const [produtos, setProdutos] = useState<tProduto[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
    const [produtoDeletando, setProdutoDeletando] = useState<tProduto | null>(null);
    const [produtoEditando, setProdutoEditando] = useState<tProduto | null>(null);

    //VARIAVEIS
    const { setIdSelecionado, idSelecionado, naoMostrarIds } = props;

    const produtosFiltrados = produtos.filter((produto) => !naoMostrarIds?.includes(produto.id));
    const produtosBuscados = produtosFiltrados.filter(
        (produto) =>
            produto.name.toLowerCase().includes(pesquisa.toLowerCase()) ||
            produto.partNumber.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = produtosBuscados.map((produto) => ({
        ...produto,
        texto: produto.name,
        selecionado: idSelecionado === produto.id,
    }));

    //EVENTOS
    const buscarProdutos = useCallback(() => {
        buscar()
            .then((produtos) => setProdutos(produtos))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarProdutos();
        return () => cancelar();
    }, [cancelar, buscarProdutos]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const produtoEditando = produtos.find((produto) => produto.id === id);
            if (produtoEditando) setProdutoEditando(produtoEditando);
        },
        [produtos]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const produtoDeletando = produtos.find((produto) => produto.id === id);
            if (produtoDeletando) setProdutoDeletando(produtoDeletando);
        },
        [produtos]
    );
    const handleOnClickProduto = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo produto a selecionar
            const produtoNovo = produtos.find((produto) => produto.id === id);
            if (!produtoNovo) return;

            if (produtoNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(produtoNovo.id);
        },
        [setIdSelecionado, produtos, idSelecionado]
    );

    const returnLabelProdutoSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const produtoSelecionado = produtos.find(({ id }) => id === idSelecionado);
        if (!produtoSelecionado) return "--- Nenhum ---";
        return produtoSelecionado.name;
    }, [idSelecionado, produtos]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                onOpenMenu={buscaComErro ? buscarProdutos : undefined}
                texto={returnLabelProdutoSelecionado()}
                onClickAdicionar={canAddProduct({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickProduto}
                onClickDeletar={canDeleteProduct({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditProduct({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
                placeholder="Pesquise pelo nome ou partNumber"
            />

            <OffcanvasProduto
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarProdutos}
            />

            <OffcanvasProduto
                tipo="editar"
                mostrarForm={produtoEditando !== null}
                onCancel={() => setProdutoEditando(null)}
                onTerminou={() => {
                    setProdutoEditando(null);
                    buscarProdutos();
                }}
                dados={produtoEditando}
            />

            <OffcanvasProduto
                tipo="deletar"
                mostrarForm={produtoDeletando !== null}
                onCancel={() => setProdutoDeletando(null)}
                onTerminou={() => {
                    setProdutoDeletando(null);
                    buscarProdutos();
                }}
                dados={produtoDeletando}
            />
        </>
    );
}
