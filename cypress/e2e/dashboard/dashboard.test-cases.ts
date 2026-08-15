import { rolesThanCanViewDashboardsByAnyRole } from "../../support/roles-permissions.support";
import { Role } from "../../../src/types/commom";

export default class DashboardTestCases {
    public static viewDashboardsByAnyRoleCases = Object.values(Role).map((role) => {
        return { role, allowed: rolesThanCanViewDashboardsByAnyRole.includes(role) };
    });
}
