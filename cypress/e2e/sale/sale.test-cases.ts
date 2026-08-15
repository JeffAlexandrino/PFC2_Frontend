import { rolesThatCanManageAnySale } from "../../support/roles-permissions.support";
import { SaleStatus } from "../../../src/types/sale";
import { Role } from "../../../src/types/commom";

export default class SaleTestCases {
    public static viewCases = Object.values(Role).map((role) => ({
        role,
        filteredByField:
            role === Role.VENDEDOR
                ? "Vendedor"
                : role === Role.COMERCIAL_ASSISTANT
                  ? "SDR"
                  : role === Role.SOLUTION_ARCHITECT
                    ? "Arquiteto de soluções"
                    : role === Role.REFERRER
                      ? "Indicador"
                      : null,
    }));

    //TODO: Separar em casos especificos
    public static createCases = Object.values(Role).map((role) => ({
        role,
        saleStatusAllowed: rolesThatCanManageAnySale.includes(role)
            ? Object.values(SaleStatus)
            : role === Role.COMMISSIONING_ANALYST
              ? [SaleStatus.INITIAL, SaleStatus.BILLING_AUDIT, SaleStatus.FINANCIAL_AUDIT]
              : role === Role.VENDEDOR
                ? [SaleStatus.INITIAL, SaleStatus.BILLING_AUDIT]
                : [],
    }));

    public static manageCases = Object.values(Role).map((role) => ({
        role,
        possibilities: (role === Role.COMERCIAL_ASSISTANT
            ? [SaleStatus.BILLING_AUDIT, SaleStatus.FINANCIAL_AUDIT]
            : role === Role.REFERRER
              ? [SaleStatus.INITIAL]
              : role === Role.SOLUTION_ARCHITECT
                ? [SaleStatus.BILLING_AUDIT]
                : [SaleStatus.INITIAL, SaleStatus.BILLING_AUDIT, SaleStatus.FINANCIAL_AUDIT]
        ).map((saleStatus) => ({
            saleStatus,
            optionIsVisible:
                rolesThatCanManageAnySale.includes(role) ||
                (role === Role.VENDEDOR && saleStatus === SaleStatus.INITIAL) ||
                (role === Role.COMMISSIONING_ANALYST &&
                    [SaleStatus.INITIAL, SaleStatus.BILLING_AUDIT, SaleStatus.FINANCIAL_AUDIT].includes(saleStatus)),
        })),
    }));

    public static auditCases = Object.values(Role).map((role) => ({ role, optionIsVisible: true }));
}
