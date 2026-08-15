import { Role } from "../../src/types/commom";

export default class FixtureSupport {
    public static getInfoFromUserBy(userRole: Role): { id: string; name: string } {
        switch (userRole) {
            case Role.ADMIN:
                return { id: "admin", name: "Roberto Carlos Administrador" };
            case Role.VENDEDOR:
                return { id: "salePersonA", name: "Alcione Sale Person A" };
            case Role.COMERCIAL_MANAGER:
                return { id: "comercialManager", name: "Cartola Comercial Manager" };
            case Role.COMERCIAL_ASSISTANT:
                return { id: "comercialAssistant", name: "Djavan Comercial Assistant" };
            case Role.SOLUTION_ARCHITECT:
                return { id: "solutionArchitect", name: "Roberto Carlos Solution Architect" };
            case Role.COMMISSIONING_ANALYST:
                return { id: "commissioningAnalyst", name: "Tim Maia Comissioning Analyst" };
            case Role.REFERRER:
                return { id: "referrer", name: "Tom Jobim Referrer" };
            case Role.MONITOR:
                return { id: "monitor", name: "Usuario Monitor" };
            case Role.FINANCIAL_MANAGER:
                return { id: "financialManagerUser", name: "Edward Elric Financial Manager" };
        }
    }

    public static getUserRoleIdBy(userRole: Role): string {
        switch (userRole) {
            case Role.ADMIN:
                return "adminRole";
            case Role.VENDEDOR:
                return "salePersonRoleA";
            case Role.COMERCIAL_MANAGER:
                return "comercialManagerRole";
            case Role.COMERCIAL_ASSISTANT:
                return "comercialAssistantRole";
            case Role.SOLUTION_ARCHITECT:
                return "solutionArchitectRole";
            case Role.COMMISSIONING_ANALYST:
                return "commissioningAnalystRole";
            case Role.REFERRER:
                return "referrerRole";
            case Role.MONITOR:
                return "monitorRole";
            case Role.FINANCIAL_MANAGER:
                return "financialManagerUserRole";
        }
    }
}
