import FormSegmento, { tNovoSegmento } from "../forms/FormSegmento";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { PartialEntity, tSegmento } from "../../interfaces";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import useSegmento from "../../hooks/useSegmento";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasSegmentoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoSegmento & PartialEntity<tSegmento, "id">) }
    | { tipo: "deletar"; dados: null | tSegmento }
);

const FORM = "form-segmento";

export default function OffcanvasSegmento(props: IOffcanvasSegmentoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useSegmento();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (segmento: tNovoSegmento) => {
            try {
                await criar([segmento]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (segmento: tNovoSegmento & PartialEntity<tSegmento, "id">) => {
            try {
                await editar(segmento);
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
                <h4>Novo Segmento</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormSegmento formId={FORM} valoresIniciais={{ name: "" }} onSubmit={handleOnCriar} />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Segmento</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormSegmento
                        formId={FORM}
                        valoresIniciais={{ name: dados.name }}
                        onSubmit={(segmento) => handleOnEditar({ id: dados.id, ...segmento })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Segmento"
            introText="o segmento"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Segmento: </strong> {dados?.name}
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
