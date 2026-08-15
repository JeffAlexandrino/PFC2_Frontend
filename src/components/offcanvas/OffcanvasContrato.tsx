import { PartialEntity, tCategoria, tContrato } from "../../interfaces";
import FormContrato, { tNovoContrato } from "../forms/FormContrato";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import useContrato from "../../hooks/useContrato";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasContratoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoContrato & PartialEntity<tContrato, "id">) }
    | { tipo: "deletar"; dados: null | tContrato }
);

const FORM = "form-contrato";

export default function OffcanvasContrato(props: IOffcanvasContratoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useContrato();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (contrato: tNovoContrato) => {
            try {
                await criar([contrato]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (contrato: tNovoContrato & PartialEntity<tCategoria, "id">) => {
            try {
                await editar(contrato);
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
                <h4>Novo Contrato</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormContrato
                    formId={FORM}
                    valoresIniciais={{ name: "", comissaoPrimeiraParcela: false }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Contrato</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormContrato
                        formId={FORM}
                        valoresIniciais={{ name: dados.name, comissaoPrimeiraParcela: dados.comissaoPrimeiraParcela }}
                        onSubmit={(contrato) => handleOnEditar({ id: dados.id, ...contrato })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Contrato"
            introText="o contrato"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Contrato: </strong> {dados?.name}
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
