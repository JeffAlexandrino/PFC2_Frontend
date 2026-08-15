import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { ContextUser } from "../../contexts/ContextUser";
import { Organization } from "../../types/organization";
import { UserRole } from "../../types/user-role";
import { ModalBase } from "./ModalBase";

import useOrganization from "../../hooks/useOrganization";
import UserRoleUtil from "../../utils/user-role.util";
import BotaoLabel from "../botoes/BotaoLabel";
import useAuth from "../../hooks/use-auth";

export type ModalOrganizationsProps = { onHide?: () => void; show?: boolean };
export default function ModalOrganizations({ show, ...props }: ModalOrganizationsProps) {
    const { find, isFinding, cancel } = useOrganization();

    const { usuario } = useContext(ContextUser);

    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const findUserOrganizations = useCallback(async () => {
        try {
            const organizations = await find({ where: { userId: usuario?.id } });
            setOrganizations(organizations);
        } catch (err) {
            console.error(err);
        }
    }, [usuario, find]);

    useEffect(() => {
        if (!show) return;
        findUserOrganizations();

        return () => cancel();
    }, [show, cancel, findUserOrganizations]);

    return (
        <ModalBase.Root show={show} {...props} className="modal-lg">
            <ModalBase.Header>
                <h4>Suas empresas e papéis</h4>
            </ModalBase.Header>
            <ModalBase.Body>
                <Row className="row-gap-4">
                    {isFinding && <span className="text-secondary-dark">Buscando empresas e papéis...</span>}
                    {organizations.map((organization) => (
                        <Col sm="auto" key={organization.id}>
                            <OrganizationComponent organization={organization} />
                        </Col>
                    ))}
                </Row>
            </ModalBase.Body>
            <ModalBase.Footer>
                <Row>
                    <Col>
                        <Button variant="outline-secondary" className="rounded-pill" onClick={props.onHide}>
                            Fechar
                        </Button>
                    </Col>
                </Row>
            </ModalBase.Footer>
        </ModalBase.Root>
    );
}

function OrganizationComponent(props: { organization: Organization }) {
    const { updateSessionRole } = useAuth();

    const handleOnClickRole = useCallback(
        async (userRole: UserRole) => {
            try {
                await updateSessionRole(userRole.id);
            } catch (err) {
                console.error(err);
            }
        },
        [updateSessionRole]
    );

    return (
        <Stack className="d-flex w-100 rounded overflow-hidden border position-relative">
            <h5 className="px-3 py-2 mb-0 bg-primary  text-white">{props.organization.name}</h5>
            <Stack className="p-3">
                <small className="text-secondary-dark">Papéis</small>
                {props.organization.userRoles.map((userRole) => (
                    <BotaoLabel
                        key={userRole.id}
                        texto={UserRoleUtil.getRoleDescription(userRole.role)}
                        onClick={() => handleOnClickRole(userRole)}
                    />
                ))}
            </Stack>
        </Stack>
    );
}
