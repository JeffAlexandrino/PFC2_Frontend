import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { Customer } from "../../types/customer";

import OffcanvasCliente from "../offcanvas/OffcanvasCliente";
import useCliente from "../../hooks/useCliente";
import SelectMenu from "./SelectMenu";

export interface ISelectClienteProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectCliente(props: ISelectClienteProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useCliente();

    //CONTEXTOS
    const { canEditCustomer, canDeleteCustomer, canAddCustomer } = useContext(ContextUser);

    //ESTADOS
    const [clientes, setClientes] = useState<Customer[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [clienteEditando, setClienteEditando] = useState<Customer | null>(null);
    const [clienteDeletando, setClienteDeletando] = useState<Customer | null>(null);

    //VARIAVEIS
    const { setIdSelecionado, idSelecionado } = props;

    const clientesFiltrados = clientes.filter(
        (cliente) =>
            cliente.name.toLowerCase().includes(pesquisa.toLowerCase()) ||
            (pesquisa.replace(/\D/g, "").length > 0 && cliente.cnpj.includes(pesquisa.replace(/\D/g, "").toLowerCase()))
    );

    const valoresFormatados = clientesFiltrados.map((cliente) => ({
        ...cliente,
        texto: cliente.name,
        selecionado: idSelecionado === cliente.id,
    }));

    //EVENTOS
    const buscarClientes = useCallback(() => {
        buscar()
            .then((clientes) => setClientes(clientes))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarClientes();
        return () => cancelar();
    }, [cancelar, buscarClientes]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const clienteEditando = clientes.find((cliente) => cliente.id === id);
            if (clienteEditando) setClienteEditando(clienteEditando);
        },
        [clientes]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const clienteDeletando = clientes.find((cliente) => cliente.id === id);
            if (clienteDeletando) setClienteDeletando(clienteDeletando);
        },
        [clientes]
    );
    const handleOnClickCliente = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo cliente a selecionar
            const clienteNovo = clientes.find((cliente) => cliente.id === id);
            if (!clienteNovo) return;

            if (clienteNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(clienteNovo.id);
        },
        [setIdSelecionado, clientes, idSelecionado]
    );

    const returnLabelClienteSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const clienteSelecionado = clientes.find(({ id }) => id === idSelecionado);
        if (!clienteSelecionado) return "--- Nenhum ---";
        return clienteSelecionado.name;
    }, [idSelecionado, clientes]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                onOpenMenu={buscaComErro ? buscarClientes : undefined}
                texto={returnLabelClienteSelecionado()}
                onClickAdicionar={canAddCustomer({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickCliente}
                onClickDeletar={canDeleteCustomer({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditCustomer({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
                placeholder="Pesquise pelo nome ou cnpj"
            />

            <OffcanvasCliente
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarClientes}
            />

            <OffcanvasCliente
                tipo="editar"
                mostrarForm={clienteEditando !== null}
                dados={clienteEditando}
                onTerminou={() => {
                    buscarClientes();
                    setClienteEditando(null);
                }}
                onCancel={() => setClienteEditando(null)}
            />

            <OffcanvasCliente
                tipo="deletar"
                mostrarForm={clienteDeletando !== null}
                dados={clienteDeletando}
                onTerminou={() => {
                    buscarClientes();
                    setClienteDeletando(null);
                }}
                onCancel={() => setClienteDeletando(null)}
            />
        </>
    );
}
