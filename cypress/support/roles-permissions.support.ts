import { Role } from "../../src/types/commom";

const rolesThatCanManageAnyCommission = [Role.ADMIN, Role.FINANCIAL_MANAGER, Role.COMMISSIONING_ANALYST];
const rolesThatCanViewAnyCommission = [...rolesThatCanManageAnyCommission, Role.MONITOR];

const rolesThanCanViewDashboardsByAnyRole = [
    Role.ADMIN,
    Role.FINANCIAL_MANAGER,
    Role.COMERCIAL_MANAGER,
    Role.COMMISSIONING_ANALYST,
    Role.MONITOR,
];

const rolesThatCanManageAnySale = [Role.ADMIN, Role.FINANCIAL_MANAGER, Role.COMERCIAL_MANAGER];
const rolesThatCanManageOwnSaleWithRestrictions = [Role.VENDEDOR];
const rolesThatCanReadSpecificSaleFields = [Role.SOLUTION_ARCHITECT, Role.COMERCIAL_ASSISTANT, Role.REFERRER];

const rolesWithoutTargets = [
    Role.ADMIN,
    Role.FINANCIAL_MANAGER,
    Role.COMERCIAL_MANAGER,
    Role.COMMISSIONING_ANALYST,
    Role.MONITOR,
];

const EDITABLE_ROLES_BY_MANAGER = [Role.VENDEDOR, Role.SOLUTION_ARCHITECT, Role.COMERCIAL_ASSISTANT, Role.REFERRER];
const rolesWithTargets = [...EDITABLE_ROLES_BY_MANAGER, Role.COMERCIAL_MANAGER];
const rolesThatCanManageAnyUser = [Role.ADMIN];
const rolesThatCanManageComercialUser = [...rolesThatCanManageAnyUser, Role.COMERCIAL_MANAGER];
const rolesThatCanViewAnyUser = [
    ...rolesThatCanManageComercialUser,
    Role.FINANCIAL_MANAGER,
    Role.COMMISSIONING_ANALYST,
    Role.MONITOR,
];
const rolesThatCanViewAnyUserTarget = [
    ...rolesThatCanManageAnyUser,
    Role.FINANCIAL_MANAGER,
    Role.COMMISSIONING_ANALYST,
    Role.MONITOR,
    Role.COMERCIAL_MANAGER,
];

export {
    rolesThatCanManageAnyCommission,
    rolesThatCanViewAnyCommission,
    rolesThanCanViewDashboardsByAnyRole,
    rolesThatCanManageAnySale,
    rolesThatCanManageOwnSaleWithRestrictions,
    rolesThatCanReadSpecificSaleFields,
    rolesWithoutTargets,
    rolesWithTargets,
    EDITABLE_ROLES_BY_MANAGER,
    rolesThatCanManageAnyUser,
    rolesThatCanManageComercialUser,
    rolesThatCanViewAnyUser,
    rolesThatCanViewAnyUserTarget,
};
