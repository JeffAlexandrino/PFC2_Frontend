import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Supplier } from "../../types/supplier";

import OffcanvasFornecedor from "../offcanvas/OffcanvasFornecedor";
import useFornecedor from "../../hooks/useFornecedor";
import SelectMenu from "./SelectMenu";

export interface ISelectFornecedorProps {
    idsSelecionados: string[];
    setIdsSelecionados?: (ids: string[]) => void;
}

export default function SelectFornecedor(props: ISelectFornecedorProps) {
    //HOOKS
    const { buscar, cancelar, estaBuscando, buscaComErro } = useFornecedor();

    //CONTEXTOS
    const { canEditSupplier, canDeleteSupplier, canAddSupplier } = useContext(ContextUser);

    //ESTADOS
    const [fornecedores, setFornecedores] = useState<Supplier[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [fornecedorEditando, setFornecedorEditando] = useState<Supplier | null>(null);
    const [fornecedorDeletando, setFornecedorDeletando] = useState<Supplier | null>(null);

    //VARIAVEIS
    const { setIdsSelecionados, idsSelecionados } = props;

    const fornecedoresFiltrados = fornecedores.filter(
        (fornecedor) =>
            fornecedor.name.toLowerCase().includes(pesquisa.toLowerCase()) ||
            (pesquisa.replace(/\D/g, "").length > 0 &&
                fornecedor.cnpj.toLowerCase().includes(pesquisa.replace(/\D/g, "").toLowerCase()))
    );

    const valoresFormatados = fornecedoresFiltrados.map((fornecedor) => ({
        ...fornecedor,
        texto: fornecedor.name,
        selecionado: idsSelecionados.includes(fornecedor.id),
    }));

    //EVENTOS
    const buscarFornecedores = useCallback(() => {
        buscar()
            .then((fornecedores) => setFornecedores(fornecedores))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarFornecedores();
        return () => cancelar();
    }, [cancelar, buscarFornecedores]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const fornecedorEditando = fornecedores.find((fornecedor) => fornecedor.id === id);
            if (fornecedorEditando) setFornecedorEditando(fornecedorEditando);
        },
        [fornecedores]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const fornecedorDeletando = fornecedores.find((fornecedor) => fornecedor.id === id);
            if (fornecedorDeletando) setFornecedorDeletando(fornecedorDeletando);
        },
        [fornecedores]
    );
    const handleOnClickFornecedor = useCallback(
        (id: string) => {
            if (!setIdsSelecionados) return;

            //Encontrando o novo fornecedor a selecionar
            const fornecedorNovo = fornecedores.find((fornecedor) => fornecedor.id === id);
            if (!fornecedorNovo) return;

            if (!idsSelecionados.some((id) => id === fornecedorNovo.id))
                return setIdsSelecionados([...idsSelecionados, fornecedorNovo.id]);

            const novosImpostosSelecionados = idsSelecionados.filter((id) => id !== fornecedorNovo.id);
            setIdsSelecionados(novosImpostosSelecionados);
        },
        [setIdsSelecionados, fornecedores, idsSelecionados]
    );

    const returnLabelFornecedorSelecionado = useCallback((): string => {
        const fornecedoresSelecionados = fornecedores.filter(({ id }) => idsSelecionados.includes(id));
        if (fornecedoresSelecionados.length < 1) return "--- Nenhum ---";
        return fornecedoresSelecionados.map(({ name: nome }) => nome).join(", ");
    }, [idsSelecionados, fornecedores]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                onOpenMenu={buscaComErro ? buscarFornecedores : undefined}
                texto={returnLabelFornecedorSelecionado()}
                onClickAdicionar={canAddSupplier({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickFornecedor}
                onClickDeletar={canDeleteSupplier({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditSupplier({}) ? handleOnClickEditar : undefined}
                carregando={estaBuscando}
                placeholder="Pesquise pelo nome ou cnpj"
            />

            <OffcanvasFornecedor
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={() => {
                    buscarFornecedores();
                    setMostrarAdicionar(false);
                }}
            />

            <OffcanvasFornecedor
                tipo="editar"
                mostrarForm={fornecedorEditando !== null}
                dados={fornecedorEditando}
                onCancel={() => setFornecedorEditando(null)}
                onTerminou={() => {
                    buscarFornecedores();
                    setFornecedorEditando(null);
                }}
            />

            <OffcanvasFornecedor
                tipo="deletar"
                mostrarForm={fornecedorDeletando !== null}
                dados={fornecedorDeletando}
                onCancel={() => setFornecedorDeletando(null)}
                onTerminou={() => {
                    buscarFornecedores();
                    setFornecedorDeletando(null);
                }}
            />
        </>
    );
}
