import UserRoleUtil from "../../../src/utils/user-role.util";
import StringUtil from "../../../src/utils/string.util";
import DashboardTestCases from "./dashboard.test-cases";
import FrontRoutes from "../../../src/lib/front-routes";

import { DashboardMetric } from "../../../src/types/dashboard";
import { Role } from "../../../src/types/commom";

describe("Dashboards", () => {
    function prepareDashbordViewBy(role: Role) {
        cy.useInfo(role);
        cy.useUserRoles();
        cy.useDashTotalValues();
        cy.useDashTarget();
        cy.useDashMarginContribution();
        cy.useDashEvolutions();
        // cy.useDashProductServiceType();
        // cy.useDashRankCategory();
        cy.useDashRankCustomer();
        cy.useDashRankUserRoles();

        cy.visit(FrontRoutes.getDashboard());

        cy.wait([
            "@useInfo",
            "@useUserRoles",
            "@useDashTotalValues",
            "@useDashTarget",
            "@useDashMarginContribution",
            "@useDashEvolutions",
            // "@useDashProductServiceType",
            // "@useDashRankCategory",
            "@useDashRankCustomer",
            "@useDashRankUserRoles",
        ]);
    }

    DashboardTestCases.viewDashboardsByAnyRoleCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} mostrar os dashboards por qualquer role como ${role}`, () => {
            prepareDashbordViewBy(role);

            if (!allowed) {
                cy.getDataTest("filter-btn").eq(3).should("be.visible");
                return;
            } else {
                cy.getDataTest("filter-btn").eq(4).click();
                UserRoleUtil.COMERCIAL_ROLES.forEach((comercialRole) => {
                    cy.getDataTest("filter-menu")
                        .contains(UserRoleUtil.getRoleDescription(comercialRole))
                        .should("be.visible");
                });
            }
        })
    );

    UserRoleUtil.COMERCIAL_ROLES.forEach((role) =>
        it(`Deveria visualizar todas as possiveis métricas como ${role} `, () => {
            prepareDashbordViewBy(role);
            //Aqui só seleciona, não verifica se de fato abriu o correto e os valores
            cy.getDataTest("filter-btn")
                .contains(StringUtil.getDashboardMetricDescription(DashboardMetric.MARKUP_BRUTO))
                .click();

            cy.contains(StringUtil.getDashboardMetricDescription(DashboardMetric.FATURAMENTO), { timeout: 1500 })
                .should("be.visible")
                .click();

            cy.contains(StringUtil.getDashboardMetricDescription(DashboardMetric.VALOR_VENDA), { timeout: 1500 })
                .should("be.visible")
                .click();

            cy.contains(StringUtil.getDashboardMetricDescription(DashboardMetric.MARKUP_LIQUIDO), { timeout: 1500 })
                .should("be.visible")
                .click();

            cy.getDataTest("filter-btn")
                .contains(StringUtil.getDashboardMetricDescription(DashboardMetric.VISITA), { timeout: 1500 })
                .should("be.visible")
                .click();
        })
    );

    it(`Deveria filtrar por ano`, () => {
        //Verify the existence of the filter year 2024
        prepareDashbordViewBy(Role.VENDEDOR);

        cy.getDataTest("filter-btn").contains("Ano").click();

        cy.mockDashEvolutionsStatus();

        cy.getDataTest("filter-menu").contains("2024").click();

        cy.wait("@mockDashEvolutionsStatus").then((intercept) => {
            const year = intercept.request.query.dataInicio;
            expect(new Date(year).getFullYear()).to.equal(2024);
        });
    });

    it(`Deveria filtrar por meses de Jan a Jan`, () => {
        prepareDashbordViewBy(Role.VENDEDOR);

        cy.getDataTest("filter-btn").contains("Período").click();
        cy.getDataTest("filter-menu").contains("Selecionar").click();
        cy.contains("Jan").click();

        cy.mockDashEvolutionsStatus();

        cy.contains("Jan").click();

        cy.wait("@mockDashEvolutionsStatus").then((intercept) => {
            const dataInicio = intercept.request.query.dataInicio;
            const dataFim = intercept.request.query.dataFim;

            expect(new Date(dataInicio).getMonth()).to.equal(0); // janeiro
            expect(new Date(dataFim).getMonth()).to.equal(0);
        });
    });

    it(`Deveria filtrar por meses de Jan a Dec`, () => {
        prepareDashbordViewBy(Role.VENDEDOR);

        cy.getDataTest("filter-btn").contains("Período").click();
        cy.getDataTest("filter-menu").contains("Selecionar").click();
        cy.contains("Jan").click();

        cy.mockDashEvolutionsStatus();

        cy.contains("Dec").click();

        cy.wait("@mockDashEvolutionsStatus").then((intercept) => {
            const dataInicio = intercept.request.query.dataInicio;
            const dataFim = intercept.request.query.dataFim;

            expect(new Date(dataInicio).getMonth()).to.equal(0); // janeiro
            expect(new Date(dataFim).getMonth()).to.equal(11); // dezembro
        });
    });

    it(`Deveria filtrar por meses de Dec a Dec`, () => {
        prepareDashbordViewBy(Role.VENDEDOR);

        cy.getDataTest("filter-btn").contains("Período").click();
        cy.getDataTest("filter-menu").contains("Selecionar").click();
        cy.contains("Dec").click();

        cy.mockDashEvolutionsStatus();

        cy.contains("Dec").click();

        cy.wait("@mockDashEvolutionsStatus").then((intercept) => {
            const dataInicio = intercept.request.query.dataInicio;
            const dataFim = intercept.request.query.dataFim;

            expect(new Date(dataInicio).getMonth()).to.equal(11); // dezembro
            expect(new Date(dataFim).getMonth()).to.equal(11);
        });
    });
});
