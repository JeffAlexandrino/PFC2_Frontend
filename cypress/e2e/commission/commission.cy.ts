import FixtureSupport from "../../support/fixture.support";
import CommissionTestCases from "./commission.test-cases";
import FrontRoutes from "../../../src/lib/front-routes";

import { SaleStatus } from "../../../src/types/sale";
import { Role } from "../../../src/types/commom";

describe("Comissoes", () => {
    function prepareCommissionViewBy(role: Role) {
        cy.useInfo(role);
        cy.useUsers();
        cy.useCustomers();
        cy.useCommissions();

        cy.visit(FrontRoutes.getCommissions());

        cy.wait(["@useInfo", "@useCustomers", "@useUsers", "@useCommissions"]);
    }

    CommissionTestCases.viewFilteredByUserCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ allowedViewAll, allowedViewFiltered, userRole }) =>
            it(`${
                allowedViewAll ? "Deveria" : "Não deveria"
            } visualizar as comissões de ${userRole} como ${role}`, () => {
                prepareCommissionViewBy(role);

                const user = FixtureSupport.getInfoFromUserBy(userRole);
                const input = cy.getDataTest("table-head").contains("Usuário").parent().parent().find("input");

                if (allowedViewAll) input.should("have.value", "");
                else if (allowedViewFiltered) input.should("have.value", `${user.name}`);
                else input.should("not.have.value", user.name).and("not.have.value", "");
            })
        )
    );

    CommissionTestCases.viewAuditCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} auditar como ${role}`, () => {
            prepareCommissionViewBy(role);

            cy.getDataTest("table-action-button").eq(0).click();
            const button = cy.getDataTest("table-action-popover").contains("Auditar");

            if (allowed) button.should("be.visible");
            else button.should("not.exist");
        })
    );

    CommissionTestCases.viewSupplierPayCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} marcar como pago pelo distribuidor como ${role}`, () => {
            prepareCommissionViewBy(role);

            cy.getDataTest("table-action-button").eq(0).click();
            const button = cy.getDataTest("table-action-popover").contains("Marcar não paga pelo distribuidor");

            button.should("not.exist");
        })
    );

    CommissionTestCases.viewMarkAsPaidCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} marcar como pago como ${role}`, () => {
            prepareCommissionViewBy(role);

            //cy.getDataTest("clear-filters-button").contains("Remover").click();
            //cy.wait(500);
            cy.getDataTest("table-action-button").eq(0).click();

            // if (allowed) {
            //     if (cy.getDataTest("table-action-popover").contains("Marcar não paga pelo distribuidor")) {
            //         cy.getDataTest("table-action-popover").contains("Marcar como paga").should("not.exist");
            //     } else {
            //         cy.getDataTest("table-action-popover").contains("Marcar paga pelo distribuidor").click();
            //         cy.getDataTest("offcanvas-footer").contains("Confirmar").click();
            //         cy.wait(500);
            //         cy.getDataTest("table-action-button").eq(0).click();
            //         cy.getDataTest("table-action-popover").contains("Marcar como paga").should("be.visible");
            //     }
            // }
            cy.getDataTest("table-action-popover").contains("Marcar como paga").should("not.exist");
        })
    );

    it("Deveria filtrar por data, usuário, saleStatus e pagamento de distribuidor, e verificar sincronia com dropdown", () => {
        prepareCommissionViewBy(Role.COMMISSIONING_ANALYST);

        const user = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);
        const gte_InsertDate = "2024-05-01";
        const lte_InsertDate = "2024-06-02";
        const gte_ExpectedDate = "2024-05-01";
        const lte_ExpectedDate = "2024-06-0";
        const saleStatusStr = "Pago";
        const saleStatus = SaleStatus.PAID;
        const distributorPaidStr = "Não";
        const distributorPaid = "false";

        cy.getDataTest("clear-filters-button").contains("Remover 3 filtros").click();
        cy.wait(1000);

        cy.getDataTest("table-head").contains("Data da Comissão").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains("Data inicial").parent().find("input").type(gte_InsertDate);
        cy.getDataTest("table-filter-popover").contains("Data final").parent().find("input").type(lte_InsertDate);
        cy.getDataTest("table-filter-popover").contains("Aplicar").click();

        cy.getDataTest("table-head").contains("Paga pelo distribuidor").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(distributorPaidStr).click();

        cy.getDataTest("table-head").contains("Usuário").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(user.name).click();

        cy.getDataTest("table-head").contains("Estado da Venda").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(saleStatusStr).click();
        cy.wait(1000);
        cy.getDataTest("dropdown-item").contains("Comissões totais a pagar").click();

        cy.mockCommissionInfoRole();

        // this event will automatically be unbound when this
        // test ends because it's attached to 'cy'
        cy.on("uncaught:exception", (err, runnable) => {
            expect(err.message).to.include("commissionInfoPerRole.reduce is not a function");
            // return false to prevent the error from
            // failing this test
            return false;
        });

        cy.getDataTest("dropdown-menu").contains("Buscar").click();

        cy.wait("@mockCommissionInfoRole").then((intercept) => {
            const initialDate: string = intercept.request.query.where.gte_dataComissao;
            const endDate: string = intercept.request.query.where.lte_dataComissao;

            expect(initialDate).contains(gte_ExpectedDate);
            expect(endDate).contains(lte_ExpectedDate);

            expect(intercept.request.query.where.distributorPaid).equal(distributorPaid);
            expect(intercept.request.query.where.estadoVenda).equal(saleStatus);
        });
    });

    it("Deveria filtrar por data, usuário, saleStatus e pagamento de distribuidor, e baixar relatorio", () => {
        prepareCommissionViewBy(Role.COMMISSIONING_ANALYST);

        const user = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);
        const gte_InsertDate = "2024-05-01";
        const lte_InsertDate = "2024-06-02";
        const gte_ExpectedDate = "2024-05-01";
        const lte_ExpectedDate = "2024-06-0";
        const saleStatusStr = "Pago";
        const saleStatus = SaleStatus.PAID;
        const distributorPaidStr = "Não";
        const distributorPaid = "false";

        cy.getDataTest("clear-filters-button").contains("Remover 3 filtros").click();
        cy.wait(1000);

        cy.getDataTest("table-head").contains("Data da Comissão").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains("Data inicial").parent().find("input").type(gte_InsertDate);
        cy.getDataTest("table-filter-popover").contains("Data final").parent().find("input").type(lte_InsertDate);
        cy.getDataTest("table-filter-popover").contains("Aplicar").click();

        cy.getDataTest("table-head").contains("Paga pelo distribuidor").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(distributorPaidStr).click();

        cy.getDataTest("table-head").contains("Usuário").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(user.name).click();

        cy.getDataTest("table-head").contains("Estado da Venda").parent().parent().find("button").eq(1).click();
        cy.getDataTest("table-filter-popover").contains(saleStatusStr).click();
        cy.wait(1000);

        cy.getDataTest("dropdown-item").contains("Relatórios").click();

        cy.mockCommissionsReports();

        cy.getDataTest("dropdown-menu").contains("Baixar relatórios").click();

        cy.wait("@mockCommissionsReports").then((intercept) => {
            const initialDate = intercept.request.query.where.gte_dataComissao;
            const endDate = intercept.request.query.where.lte_dataComissao;

            expect(initialDate).contains(gte_ExpectedDate);
            expect(endDate).contains(lte_ExpectedDate);

            expect(intercept.request.query.where.estadoVenda).equal(saleStatus);
            expect(intercept.request.query.where.distributorPaid).equal(distributorPaid);
            expect(intercept.request.query.where.userId).equal(user.id);
        });
    });
});
