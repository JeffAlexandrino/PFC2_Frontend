import FormTipoProdutoServico, { tNovoTipoProdutoServico } from "../forms/FormTipoProdutoServico";
import { PartialEntity, tTipoProdutoServico } from "../../interfaces";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import useTipoProdutoServico from "../../hooks/useTipoProdutoServico";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasTipoProdutoServicoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoTipoProdutoServico & PartialEntity<tTipoProdutoServico, "id">) }
    | { tipo: "deletar"; dados: null | tTipoProdutoServico }
);

const FORM = "form-tipo-produto-servico";

export default function OffcanvasTipoProdutoServico(props: IOffcanvasTipoProdutoServicoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useTipoProdutoServico();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (tipoProdutoServico: tNovoTipoProdutoServico) => {
            try {
                await criar([tipoProdutoServico]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (tipoProdutoServico: tNovoTipoProdutoServico & PartialEntity<tTipoProdutoServico, "id">) => {
            try {
                await editar(tipoProdutoServico);
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
                <h4>Novo Tipo Produto/Serviço</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormTipoProdutoServico formId={FORM} valoresIniciais={{ name: "" }} onSubmit={handleOnCriar} />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Tipo Produto/Serviço</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormTipoProdutoServico
                        formId={FORM}
                        valoresIniciais={{ name: dados.name }}
                        onSubmit={(tipo) => handleOnEditar({ id: dados.id, ...tipo })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Tipo de Serviço/Produto"
            introText="o tipo de produto/serviço"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                       <strong>Tipo: </strong> {dados?.name}
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
