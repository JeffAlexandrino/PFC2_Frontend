import { EditOrganizationData } from "../../types/organization";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { ContextUser } from "../../contexts/ContextUser";
import { useCallback, useContext } from "react";

import useOrganization from "../../hooks/useOrganization";
import FormOrganization from "../forms/FormOrganization";
import utils from "../../utils";

const FORM = "form-id-organization";

type OffcanvasOrganizationProps = { show: boolean; onHide: () => void };

export default function OffcanvasOrganization({ onHide, ...props }: OffcanvasOrganizationProps) {
    const { update, isUpdating } = useOrganization();
    const { currentUserRole } = useContext(ContextUser);

    const empresaLogo = currentUserRole?.empresa.empresaLogo;
    const empresaLogoSrc = currentUserRole?.empresa.empresaLogoSrc;

    const handleOnUpdate = useCallback(
        async (editData: EditOrganizationData) => {
            try {
                await update(editData);
                onHide();
            } catch (err) {
                throw err;
            }
        },
        [update, onHide]
    );

    return (
        <OffcanvasEditarDado.Root show={props.show}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Dados da Empresa</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: onHide }}
                acceptButtonProps={{ form: FORM, carregando: isUpdating, type: "submit" }}
            >
                <FormOrganization
                    formId={FORM}
                    valoresIniciais={{
                        name: currentUserRole?.empresa.name ?? "",
                        cnpj: currentUserRole?.empresa.cnpj ?? "",
                        logo:
                            empresaLogo && empresaLogoSrc
                                ? utils.base64ToFile(empresaLogoSrc, empresaLogo.fileName, empresaLogo.mimetype)
                                : null,
                    }}
                    onSubmit={(organization) =>
                        handleOnUpdate({ id: currentUserRole?.empresaId ?? "", ...organization })
                    }
                />
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    );
}
