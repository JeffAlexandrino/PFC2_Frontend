import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { NewVisit } from "../../types/visits";
import { useCallback } from "react";

import FormVisitaCreate from "../forms/FormVisitaCreate";
import useVisit from "../../hooks/use-visit";
import utils from "../../utils";

type Props = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
};

const FORM = "form-visita-create";

export default function OffcanvasVisitaCreate({ mostrarForm, onTerminou, onCancel }: Props) {
    const { createVisit, creatingVisit, cancelCreateVisit } = useVisit();

    const handleOnCancel = useCallback(() => {
        cancelCreateVisit();
        onCancel?.();
    }, [cancelCreateVisit, onCancel]);

    const handleOnCriar = useCallback(
        async (visita: NewVisit) => {
            await createVisit([visita]);
            onTerminou?.();
        },
        [createVisit, onTerminou]
    );

    return (
        <OffcanvasNovoDado.Root show={mostrarForm}>
            <OffcanvasNovoDado.Header>
                <h4>Nova Saída</h4>
            </OffcanvasNovoDado.Header>

            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{
                    carregando: creatingVisit,
                    type: "submit",
                    form: FORM,
                }}
            >
                <FormVisitaCreate
                    formId={FORM}
                    valoresIniciais={{
                        salePersonId: "",
                        clienteId: "",
                        dataVisita: utils.retornaDataAtual({
                            segundos: 0,
                            minutos: 0,
                            hora: 0,
                        }),
                        gastos: [],
                        comentarios: null,
                        remoto: false,
                        visitaPaga: false,
                    }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    );
}
