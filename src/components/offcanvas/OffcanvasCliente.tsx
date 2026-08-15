import { Customer, CustomerOrigin, EditCustomerData, NewCustomer } from "../../types/customer";
import { OffcanvasVisualizarDado } from "./OffcanvasVisualizarDados";
import { UserRoleWithOrganization } from "../../types/user-role";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { useCallback } from "react";

import OffcanvasDelete from "./OffcanvasDelete";
import useCliente from "../../hooks/useCliente";
import FormCliente from "../forms/FormCliente";

export type IOffcanvasClienteProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
    currentUserRole?: UserRoleWithOrganization | null;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | EditCustomerData }
    | { tipo: "deletar"; dados: null | Customer }
    | { tipo: "visualizar"; dados: null | EditCustomerData }
);

const FORM = "form-cliente";

export default function OffcanvasCliente(props: IOffcanvasClienteProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useCliente();

    //VARAIVEIS
    const { onTerminou, onCancel, dados } = props;

    // const isVendedor = currentUserRole?.role === Role.VENDEDOR;
    // const disabledFieldsForVendedor: ("name" | "cnpj" | "email" | "telefone")[] = isVendedor
    //     ? ["name", "cnpj", "email", "telefone"]
    //     : [];

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (cliente: NewCustomer) => {
            try {
                await criar([cliente]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (cliente: EditCustomerData) => {
            try {
                await editar(cliente);
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
                <h4>Novo Cliente</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormCliente
                    formId={FORM}
                    valoresIniciais={{
                        name: "",
                        cnpj: "",
                        email: "",
                        telefone: "",
                        segmentoId: "",
                        origem: CustomerOrigin.INDICATION,
                    }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : props.tipo === "visualizar" ? (
        <OffcanvasVisualizarDado.Root show={props.mostrarForm}>
            <OffcanvasVisualizarDado.Header>
                <h4>Visualizar Cliente</h4>
            </OffcanvasVisualizarDado.Header>
            <OffcanvasVisualizarDado.Body onClose={handleOnCancel}>
                {dados && (
                    <FormCliente
                        formId={FORM}
                        valoresIniciais={{
                            name: dados.name,
                            cnpj: dados.cnpj,
                            email: dados.email,
                            telefone: dados.telefone,
                            segmentoId: dados.segmentoId,
                            origem: dados.origem,
                        }}
                        onSubmit={() => {}}
                        readOnly={true}
                    />
                )}
            </OffcanvasVisualizarDado.Body>
        </OffcanvasVisualizarDado.Root>
    ) : props.tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Cliente</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormCliente
                        formId={FORM}
                        valoresIniciais={{
                            name: dados.name,
                            cnpj: dados.cnpj,
                            email: dados.email,
                            telefone: dados.telefone,
                            segmentoId: dados.segmentoId,
                            origem: dados.origem,
                        }}
                        onSubmit={(cliente) => handleOnEditar({ id: dados.id, ...cliente })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : props.tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Cliente"
            introText="o cliente"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Cliente:</strong> {dados?.name}
                    </li>
                    <li>
                        <strong>Email:</strong> {dados?.email}
                    </li>
                    <li>
                        <strong>Telefone:</strong> {dados?.telefone}
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
