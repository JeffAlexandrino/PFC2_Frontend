import FormFornecedor, { tNovoFornecedor } from "../forms/FormFornecedor";
import { EditSupplierData, Supplier } from "../../types/supplier";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { PartialEntity } from "../../interfaces";
import { useCallback } from "react";

import useFornecedor from "../../hooks/useFornecedor";
import OffcanvasDelete from "./OffcanvasDelete";

export type IOffcanvasFornecedorProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | EditSupplierData }
    | { tipo: "deletar"; dados: null | Supplier }
);

const FORM = "form-fornecedor";

export default function OffcanvasFornecedor(props: IOffcanvasFornecedorProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useFornecedor();

    //VARAIVEIS
    const { onTerminou, onCancel, dados } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (fornecedor: tNovoFornecedor) => {
            try {
                await criar([fornecedor]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (fornecedor: tNovoFornecedor & PartialEntity<Supplier, "id">) => {
            try {
                await editar(fornecedor);
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
                <h4>Novo Fornecedor</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormFornecedor
                    formId={FORM}
                    valoresIniciais={{ name: "", cnpj: "", email: "" }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : props.tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Fornecedor</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormFornecedor
                        formId={FORM}
                        valoresIniciais={{
                            name: dados.name,
                            cnpj: dados.cnpj,
                            email: dados.email,
                        }}
                        onSubmit={(fornecedor) => handleOnEditar({ id: dados.id, ...fornecedor })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : props.tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Fornecedor"
            introText="o fornecedor"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Fornecedor:</strong> {dados?.name}
                    </li>
                    <li>
                        <strong>Email:</strong> {dados?.email}
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
