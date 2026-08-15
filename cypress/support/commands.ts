import ApiRoutes from "../../src/lib/api-routes";
import query from "./constants/query";

import { tDataTestId, tViewTableProps } from "../cypress.types";
import { Role } from "../../src/types/commom";
import { mount } from "cypress/react";

Cypress.Commands.add("getDataTest", (value: tDataTestId) => {
    return cy.get(`[data-test=${value}]`);
});

Cypress.Commands.add("tableContains", (props?: tViewTableProps) => {
    if (props?.length !== undefined) cy.getDataTest("table-row").should("have.length", props.length);

    if (props?.dataArr !== undefined)
        props.dataArr.forEach((data, index) => {
            cy.getDataTest("table-row").eq(index).contains(data);
        });
});

Cypress.Commands.add("mount", (component, options) => {
    return mount(component, options);
});
//useApiVersion gets the first req from front as v1 then it can update the route with the new acquired version
Cypress.Commands.add("useApiVersion", () => {
    return cy
        .intercept({ method: "GET", url: /\/v\d+\/version.*$/ }, (req) => {
            // Update the version when the response is sent
            ApiRoutes.patchVersion("2");
            // Reply with the proper response body
            req.reply({ body: "2" });
        })
        .as("useApiVersion");
});

Cypress.Commands.add("useInfo", (role: Role) => {
    return cy
        .intercept(
            { method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getMyUserInfo() + "**" },
            { fixture: `info/by-${role}` }
        )
        .as("useInfo");
});

Cypress.Commands.add("useUserRoles", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getUserRoles() + "**";
    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query[query.ROLE];
            const userRoleId = req.query[query.ID];

            req.reply({ fixture: `user-roles/by-${userRoleId ?? role ?? "ALL"}` });
        })
        .as("useUserRoles");
});

Cypress.Commands.add("useCommissions", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getCommissions() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const userId = req.query[query.USER_ID];

            req.reply({ fixture: `commissions/by-${userId ?? "all"}` });
        })
        .as("useCommissions");
});

Cypress.Commands.add("useUsers", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getUser() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            req.reply({ fixture: `users/by-ALL` });
        })
        .as("useUsers");
});

Cypress.Commands.add("useUser", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getUser() + "/*";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const userId = req.url.split("/").pop();
            req.reply({ fixture: `users/by-${userId}` });
        })
        .as("useUser");
});

//Dashboard intercepts
Cypress.Commands.add("useDashTotalValues", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashTotalValues() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-total-values/by-${role}` });
        })
        .as("useDashTotalValues");
});
Cypress.Commands.add("useDashEvolutions", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashEvolutions() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-evolutions/by-${role}` });
        })
        .as("useDashEvolutions");
});
Cypress.Commands.add("useDashTarget", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashTarget() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-target/by-${role}` });
        })
        .as("useDashTarget");
});
Cypress.Commands.add("useDashMarginContribution", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashMarginContribution() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-margin-contribution/by-${role}` });
        })
        .as("useDashMarginContribution");
});
Cypress.Commands.add("useDashRankUserRoles", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashRankSalePerson() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-rank-user-roles/by-${role}` });
        })
        .as("useDashRankUserRoles");
});
Cypress.Commands.add("useDashRankCustomer", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashRankCustomers() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-rank-customer/by-${role}` });
        })
        .as("useDashRankCustomer");
});

Cypress.Commands.add("useDashRankCategory", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashRankCategory() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-rank-category/by-${role}` });
        })
        .as("useDashRankCategory");
});
Cypress.Commands.add("useDashProductServiceType", () => {
    const url = ApiRoutes.getRouteVersion() + ApiRoutes.getDashProductServiceType() + "**";

    return cy
        .intercept({ method: "GET", url }, (req) => {
            const role = req.query.role;

            req.reply({ fixture: `dash-product-service-type/by-${role}` });
        })
        .as("useDashProductServiceType");
});

Cypress.Commands.add("mockDashEvolutions", (role: Role) => {
    return cy
        .intercept("GET", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.getDashEvolutions()}*`, {
            statusCode: 200,
            body: { fixture: `dash-evolutions/by-${role}` },
        })
        .as("mockDashEvolutions");
});

Cypress.Commands.add("mockDashEvolutionsStatus", () => {
    return cy
        .intercept("GET", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.getDashEvolutions()}*`, {
            statusCode: 200,
        })
        .as("mockDashEvolutionsStatus");
});

//Products intercept
Cypress.Commands.add("useProducts", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getProducts() + "**" }, (req) => {
            req.reply({ fixture: "products" });
        })
        .as("useProducts");
});

Cypress.Commands.add("useServices", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getServices() + "**" }, (req) => {
            req.reply({ fixture: "services" });
        })
        .as("useServices");
});

Cypress.Commands.add("useContracts", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getContracts() + "**" }, (req) => {
            req.reply({ fixture: "contracts" });
        })
        .as("useContracts");
});

Cypress.Commands.add("useCustomers", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getCustomers() + "**" }, (req) => {
            req.reply({ fixture: "customers" });
        })
        .as("useCustomers");
});

Cypress.Commands.add("usePaymentMethods", () => {
    return cy
        .intercept(
            { method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getPaymentMethods() + "**" },
            (req) => {
                req.reply({ fixture: "payment-methods" });
            }
        )
        .as("usePaymentMethods");
});

Cypress.Commands.add("useSuppliers", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getSuppliers() + "**" }, (req) => {
            req.reply({ fixture: "suppliers" });
        })
        .as("useSuppliers");
});

//Sale intercepts
Cypress.Commands.add("useSales", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getSales() + "**" }, (req) => {
            const salePersonId = req.query[query.SALE_PERSON_ID];
            const comercialAssistantId = req.query[query.COMMERCIAL_ASSISTANT_ID];
            const solutionArchitectId = req.query[query.SOLUTION_ARCHITECT_ID];

            req.reply({ fixture: `sales/by-${salePersonId ?? comercialAssistantId ?? solutionArchitectId ?? "ALL"}` });
        })
        .as("useSales");
});

Cypress.Commands.add("postSale", () => {
    return cy
        .intercept(
            { method: "POST", url: ApiRoutes.getRouteVersion() + ApiRoutes.postSale() },
            {
                statusCode: 200,
            }
        )
        .as("postSale");
});

Cypress.Commands.add("patchSale", (id: string) => {
    return cy
        .intercept("PATCH", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.patchSale(id)}*`, {
            statusCode: 200,
        })
        .as("patchSale");
});

Cypress.Commands.add("deleteSale", (id: string) => {
    return cy
        .intercept(
            { method: "DELETE", url: ApiRoutes.getRouteVersion() + ApiRoutes.deleteSale(id) + "**" },
            {
                statusCode: 200,
            }
        )
        .as("deleteSale");
});

//User intercepts
Cypress.Commands.add("mockPostUser", () => {
    return cy
        .intercept("POST", ApiRoutes.getRouteVersion() + ApiRoutes.postUser(), {
            statusCode: 200,
        })
        .as("mockPostUser");
});

Cypress.Commands.add("mockPatchUserInfo", (userId: string) => {
    return cy
        .intercept("PATCH", ApiRoutes.getRouteVersion() + ApiRoutes.patchUser(userId) + "**", {
            statusCode: 200,
        })
        .as("mockPatchUserInfo");
});

Cypress.Commands.add("mockPatchUserRole", (userId: string) => {
    return cy
        .intercept("PATCH", ApiRoutes.getRouteVersion() + ApiRoutes.patchUserRole(userId) + "**", {
            statusCode: 200,
        })
        .as("mockPatchUserRole");
});

Cypress.Commands.add("mockDeleteUser", (userId: string) => {
    return cy
        .intercept("DELETE", ApiRoutes.getRouteVersion() + ApiRoutes.deleteUser(userId) + "**", {
            statusCode: 200,
        })
        .as("mockDeleteUser");
});

Cypress.Commands.add("mockGetAudit", (userId: string) => {
    return cy.intercept("GET", ApiRoutes.getRouteVersion() + ApiRoutes.getAudit() + "**", (req) => {
        expect(req.query["where[tabela]"]).equal("USUARIO");
        expect(req.query["where[dadoId]"]).equal(userId);
        expect(req.query["limit"]).equal("50");
        req.reply({});
    }).as("mockGetAudit");
});

//Target intercepts
Cypress.Commands.add("useTargets", () => {
    return cy
        .intercept({ method: "GET", url: ApiRoutes.getRouteVersion() + ApiRoutes.getTargets() + "**" }, (req) => {
            const userRoleId = req.query[query.USER_ROLE_ID];
            req.reply({ fixture: `targets/by-${userRoleId}` });
        })
        .as("useTargets");
});

Cypress.Commands.add("mockPostTarget", () => {
    return cy
        .intercept("POST", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.getTargets()}*`, {
            statusCode: 200,
        })
        .as("mockPostTarget");
});

Cypress.Commands.add("mockPostTargetMultiple", () => {
    return cy
        .intercept("POST", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.postTarget()}*`, {
            statusCode: 200,
        })
        .as("mockPostTargetMultiple");
});

Cypress.Commands.add("mockPatchTarget", (targetId: string) => {
    return cy
        .intercept("PATCH", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.patchTarget(targetId)}*`, {
            statusCode: 200,
        })
        .as("mockPatchTarget");
});

Cypress.Commands.add("mockDeleteTarget", (targetId: string) => {
    return cy
        .intercept("DELETE", `**${ApiRoutes.getRouteVersion()}${ApiRoutes.deleteTarget(targetId)}*`, {
            statusCode: 200,
        })
        .as("mockDeleteTarget");
});

//Commission intercepts
Cypress.Commands.add("mockCommissionInfoRole", () => {
    return cy
        .intercept("GET", ApiRoutes.getRouteVersion() + ApiRoutes.getCommissionInfoRole() + "**", {
            statusCode: 200,
        })
        .as("mockCommissionInfoRole");
});

Cypress.Commands.add("mockCommissionsReports", () => {
    return cy
        .intercept("POST", ApiRoutes.getRouteVersion() + ApiRoutes.getCommissionsReports() + "**", {
            statusCode: 200,
        })
        .as("mockCommissionsReports");
});
