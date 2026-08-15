import SpanSpan from "../../ui/span-component/spanSpan"; // Span Genérico
import UserRoleUtil from "../../utils/user-role.util";

import { Role } from "../../types/commom";

export type SpanOverlayRolesProps = { userRoles: { role: Role }[] };

export default function Roles({ userRoles }: SpanOverlayRolesProps) {
    const rolesDescriptions = userRoles.map((userRole) => UserRoleUtil.getRoleDescription(userRole.role));
    const spanText =
        rolesDescriptions.at(0) + (rolesDescriptions.length > 1 ? `, +${rolesDescriptions.length - 1}` : "");

    return (
        <SpanSpan
            spanTriggerContent={
                <span className="text-info border px-2 rounded-pill border-info text-nowrap">{spanText}</span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-person-badge me-2" />
                    Todos os Papéis
                </>
            }
        >
            {/* Lista de papéis */}
            <div className="gap-2">
                {rolesDescriptions.map((roleDescription) => (
                    <span className="fw-bold" key={roleDescription}>
                        {roleDescription}
                        <br />
                    </span>
                ))}
            </div>
        </SpanSpan>
    );
}
