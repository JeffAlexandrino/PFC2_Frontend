import FormFabricante, { tNovoFabricante } from "../forms/FormFabricante";
import { PartialEntity, tFabricante } from "../../interfaces";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import useFabricante from "../../hooks/useFabricante";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasFabricanteProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoFabricante & PartialEntity<tFabricante, "id">) }
    | { tipo: "deletar"; dados: null | tFabricante }
);

const FORM = "form-fabricante";

export default function OffcanvasFabricante(props: IOffcanvasFabricanteProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useFabricante();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (fabricante: tNovoFabricante) => {
            try {
                await criar([fabricante]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (fabricante: tNovoFabricante & PartialEntity<tFabricante, "id">) => {
            try {
                await editar(fabricante);
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
                <h4>Novo Fabricante</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormFabricante formId={FORM} valoresIniciais={{ name: "" }} onSubmit={handleOnCriar} />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Fabricante</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormFabricante
                        formId={FORM}
                        valoresIniciais={{ name: dados.name }}
                        onSubmit={(fabricante) => handleOnEditar({ id: dados.id, ...fabricante })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Fabricante"
            introText="o fabricante"
            details={
                <ul>
                    <li>
                        <strong>Fabricante:</strong> {dados?.name}
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
