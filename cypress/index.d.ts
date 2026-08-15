import { tDataTestId, tViewTableProps } from "./cypress.types";
import { Role } from "../src/types/commom";
import { mount } from "cypress/react";

declare global {
    namespace Cypress {
        interface Chainable {
            getDataTest(value: tDataTestId): Chainable<any>;

            tableContains(props?: tViewTableProps): void;
            mount: typeof mount;

            useApiVersion: () => Chainable<any>;
            useInfo: (role: Role) => Chainable<any>;

            useUserRoles: () => Chainable<any>;

            useDashEvolutions: () => Chainable<any>;
            useDashMarginContribution: () => Chainable<any>;
            useDashProductServiceType: () => Chainable<any>;
            useDashRankCategory: () => Chainable<any>;
            useDashRankCustomer: () => Chainable<any>;
            useDashRankUserRoles: () => Chainable<any>;
            useDashTarget: () => Chainable<any>;
            useDashTotalValues: () => Chainable<any>;

            useCommissions: () => Chainable<any>;
            useUsers: () => Chainable<any>;
            useUser: () => Chainable<any>;
            useTargets: () => Chainable<any>;
            useProducts: () => Chainable<any>;
            useServices: () => Chainable<any>;
            useContracts: () => Chainable<any>;
            useCustomers: () => Chainable<any>;
            useSuppliers: () => Chainable<any>;
            usePaymentMethods: () => Chainable<any>;

            //Sales intercepts
            useSales: () => Chainable<any>;
            postSale: () => Chainable<any>;
            patchSale: (id: string) => Chainable<any>;
            deleteSale: (id: string) => Chainable<any>;

            mockPostUser: () => Chainable<any>;
            mockPatchUserInfo: (userId: string) => Chainable<any>;
            mockPatchUserRole: (userId: string) => Chainable<any>;
            mockDeleteUser: (userId: string) => Chainable<any>;
            mockGetAudit: (userId: string) => Chainable<any>;

            mockPostTarget: () => Chainable<any>;
            mockPostTargetMultiple: () => Chainable<any>;
            mockPatchTarget: (targetId: string) => Chainable<any>;
            mockDeleteTarget: (targetId: string) => Chainable<any>;

            mockDashEvolutions: (role: Role) => Chainable<any>;
            mockDashEvolutionsStatus: () => Chainable<any>;

            mockCommissionInfoRole: () => Chainable<any>;
            mockCommissionsReports: () => Chainable<any>;
        }
    }
}
