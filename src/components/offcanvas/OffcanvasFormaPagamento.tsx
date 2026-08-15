import FormFormaPagamento, { tNovaFormaPagamento } from "../forms/FormFormaPagamento";
import { PartialEntity, tFormaPagamento } from "../../interfaces";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import useFormaPagamento from "../../hooks/useFormaPagamento";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasFormaPagamentoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovaFormaPagamento & PartialEntity<tFormaPagamento, "id">) }
    | { tipo: "deletar"; dados: null | tFormaPagamento }
);

const FORM = "form-forma-pagamento";

export default function OffcanvasFormaPagamento(props: IOffcanvasFormaPagamentoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useFormaPagamento();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (formaPagamento: tNovaFormaPagamento) => {
            try {
                await criar([formaPagamento]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (formaPagamento: tNovaFormaPagamento & PartialEntity<tFormaPagamento, "id">) => {
            try {
                await editar(formaPagamento);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [editar, onTerminou]
    );

    const handleOnDeletar = useCallback(
        async (id: string) => {
            try {
                await deletar(id);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [deletar, onTerminou]
    );

    return props.tipo === "criar" ? (
        <OffcanvasNovoDado.Root show={props.mostrarForm}>
            <OffcanvasNovoDado.Header>
                <h4>Nova Forma de Pagamento</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormFormaPagamento formId={FORM} valoresIniciais={{ name: "" }} onSubmit={handleOnCriar} />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Forma de Pagamento</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormFormaPagamento
                        formId={FORM}
                        valoresIniciais={{ name: dados.name }}
                        onSubmit={(categoria) => handleOnEditar({ id: dados.id, ...categoria })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Forma de Pagamento"
            introText="a forma de pagamento"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Forma de pagamento: </strong>
                        {dados?.name}
                    </li>
                </ul>
            }
            onHide={handleOnCancel}
            onConfirm={async () => {
                if (dados) await handleOnDeletar(dados.id);
            }}
            pending={estaDeletando}
        />
    ) : undefined;
}
