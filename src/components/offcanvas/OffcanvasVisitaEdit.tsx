import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { EditVisitData, Visit } from "../../types/visits";
import { useCallback } from "react";

import FormVisitaEdit from "../forms/FormVisitaEdit";
import OffcanvasDelete from "./OffcanvasDelete";
import useVisit from "../../hooks/use-visit";

export type IOffcanvasVisitaProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & ({ tipo: "editar"; dados: EditVisitData | null } | { tipo: "deletar"; dados: Visit | null });

const FORM = "form-visita";

export default function OffcanvasVisitaEdit(props: IOffcanvasVisitaProps) {
    const {
        updateVisit,
        deleteVisit,
        updatingVisit,
        deletingVisit,
        cancelCreateVisit,
        cancelDeleteVisit,
        cancelUpdateVisit,
    } = useVisit();

    const { onTerminou, onCancel, dados, tipo } = props;

    const handleOnCancel = useCallback(() => {
        cancelCreateVisit();
        cancelDeleteVisit();
        cancelUpdateVisit();

        onCancel?.();
    }, [onCancel, cancelCreateVisit, cancelDeleteVisit, cancelUpdateVisit]);

    const handleOnEditar = useCallback(
        async (visita: EditVisitData) => {
            if (!dados) return;

            await updateVisit(visita, {
                currentSalePersonId: dados.salePersonId,
            });

            onTerminou?.();
        },
        [updateVisit, onTerminou, dados]
    );

    const handleOnDeletar = useCallback(
        async (id: string) => {
            if (!dados) return;

            await deleteVisit(id, {
                currentSalePersonId: dados.salePersonId,
            });

            onTerminou?.();
        },
        [deleteVisit, onTerminou, dados]
    );

    if (tipo === "editar") {
        return (
            <OffcanvasEditarDado.Root show={props.mostrarForm}>
                <OffcanvasEditarDado.Header>
                    <h4>Editar Saída</h4>
                </OffcanvasEditarDado.Header>

                <OffcanvasEditarDado.Body
                    cancelButtonProps={{ onClick: handleOnCancel }}
                    acceptButtonProps={{
                        form: FORM,
                        carregando: updatingVisit,
                        type: "submit",
                    }}
                >
                    {dados && (
                        <FormVisitaEdit
                            formId={FORM}
                            valoresIniciais={{
                                salePersonId: dados.salePersonId,
                                clienteId: dados.clienteId,
                                tipoVisita: dados.tipoVisita,
                                dataVisita: dados.dataVisita,
                                gastos: dados.gastos.map((gasto) => ({
                                    nota: gasto.nota,
                                    tipoGasto: gasto.tipoGasto,
                                    valor: gasto.valor,
                                    carroEmpresa: gasto.carroEmpresa,
                                    kmInicial: gasto.kmInicial,
                                    kmFinal: gasto.kmFinal,
                                    tipoViagem: gasto.tipoViagem,
                                    dataViagem: gasto.dataViagem,
                                })),
                                comentarios: dados.comentarios,
                                remoto: dados.remoto,
                                kmFinal: dados.kmFinal,
                                kmInicial: dados.kmInicial,
                                carroEmpresa: dados.carroEmpresa,
                                visitaPaga: dados.visitaPaga,
                            }}
                            onSubmit={(visita) =>
                                handleOnEditar({
                                    id: dados.id,
                                    ...visita,
                                })
                            }
                        />
                    )}
                </OffcanvasEditarDado.Body>
            </OffcanvasEditarDado.Root>
        );
    }

    if (tipo === "deletar") {
        return (
            <OffcanvasDelete
                show={props.mostrarForm}
                title="Deletar Saída"
                introText="a saída"
                details={
                    <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                        <li>
                            <strong>Data:</strong> {dados?.dataVisita.toLocaleDateString("pt-BR")}
                        </li>
                        <li>
                            <strong>Cliente:</strong> {dados?.cliente.name}
                        </li>
                        <li>
                            <strong>Vendedor:</strong> {dados?.salePerson.user.name}
                        </li>
                    </ul>
                }
                onHide={handleOnCancel}
                onConfirm={async () => {
                    if (dados) {
                        await handleOnDeletar(dados.id);
                    }
                }}
                pending={deletingVisit}
            />
        );
    }

    return null;
}
