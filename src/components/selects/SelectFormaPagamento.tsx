import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tFormaPagamento } from "../../interfaces";

import OffcanvasFormaPagamento from "../offcanvas/OffcanvasFormaPagamento";
import useFormaPagamento from "../../hooks/useFormaPagamento";
import SelectMenu from "./SelectMenu";

export interface ISelectFormaPagamentoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
}

export default function SelectFormaPagamento({ setIdSelecionado, idSelecionado }: ISelectFormaPagamentoProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useFormaPagamento();

    //CONTEXTOS
    const { canEditPaymentMethod, canDeletePaymentMethod, canAddPaymentMethod } =
        useContext(ContextUser);

    //ESTADOS
    const [formasPagamento, setFormasPagamento] = useState<tFormaPagamento[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [formaEditando, setFormaEditando] = useState<tFormaPagamento | null>(null);
    const [formaDeletando, setFormaDeletando] = useState<tFormaPagamento | null>(null);

    //VARIAVEIS
    const formasFiltradas = formasPagamento.filter((formaPagamento) =>
        formaPagamento.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = formasFiltradas.map((formaPagamento) => ({
        ...formaPagamento,
        texto: formaPagamento.name,
        selecionado: idSelecionado === formaPagamento.id,
    }));

    //EVENTOS
    const buscarFormasPagamento = useCallback(() => {
        buscar()
            .then((formas) => setFormasPagamento(formas))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarFormasPagamento();
        return () => cancelar();
    }, [cancelar, buscarFormasPagamento]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const formaEditando = formasPagamento.find((forma) => forma.id === id);
            if (formaEditando) setFormaEditando(formaEditando);
        },
        [formasPagamento]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const formaDeletando = formasPagamento.find((forma) => forma.id === id);
            if (formaDeletando) setFormaDeletando(formaDeletando);
        },
        [formasPagamento]
    );
    const handleOnClickFormaPagamento = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando a nova forma a selecionar
            const formaPagamentoNova = formasPagamento.find((forma) => forma.id === id);
            if (!formaPagamentoNova) return;

            if (formaPagamentoNova.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(formaPagamentoNova.id);
        },
        [setIdSelecionado, formasPagamento, idSelecionado]
    );

    const returnLabelFormaPagamentoSelecionada = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhuma ---";

        const formaSelecionada = formasPagamento.find(({ id }) => id === idSelecionado);
        if (!formaSelecionada) return "--- Nenhuma ---";
        return formaSelecionada.name;
    }, [idSelecionado, formasPagamento]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                onOpenMenu={buscaComErro ? buscarFormasPagamento : undefined}
                texto={returnLabelFormaPagamentoSelecionada()}
                onClickAdicionar={canAddPaymentMethod({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickFormaPagamento}
                onClickDeletar={canDeletePaymentMethod({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditPaymentMethod({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasFormaPagamento
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarFormasPagamento}
            />

            <OffcanvasFormaPagamento
                tipo="editar"
                mostrarForm={formaEditando !== null}
                dados={formaEditando}
                onTerminou={() => {
                    buscarFormasPagamento();
                    setFormaEditando(null);
                }}
                onCancel={() => setFormaEditando(null)}
            />

            <OffcanvasFormaPagamento
                tipo="deletar"
                mostrarForm={formaDeletando !== null}
                dados={formaDeletando}
                onTerminou={() => {
                    buscarFormasPagamento();
                    setFormaDeletando(null);
                }}
                onCancel={() => setFormaDeletando(null)}
            />
        </>
    );
}
