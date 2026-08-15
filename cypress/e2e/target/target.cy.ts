import FixtureSupport from "../../support/fixture.support";
import FrontRoutes from "../../../src/lib/front-routes";
import TargetTestCases from "./target.test-cases";

import { rolesWithoutTargets } from "../../support/roles-permissions.support";
import { NewTarget, TargetType } from "../../../src/types/target";
import { Role } from "../../../src/types/commom";

describe("Metas", () => {
    function prepareTargetView(role: Role, targetedRole?: Role) {
        cy.useInfo(role);
        cy.useTargets();
        cy.useUser();

        const targetRole = targetedRole
            ? targetedRole
            : rolesWithoutTargets.includes(role)
              ? Role.COMERCIAL_ASSISTANT
              : role;
        const userOfTargets = FixtureSupport.getInfoFromUserBy(targetRole);
        cy.visit(FrontRoutes.getTargetsUser(userOfTargets.id));

        cy.wait(["@useInfo", "@useUser", "@useTargets"]);
    }

    TargetTestCases.viewCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} visualizar as metas como ${role}`, () => {
            prepareTargetView(role);

            if (allowed) {
                cy.getDataTest("meta-card").should("be.visible");
            } else {
                cy.getDataTest("meta-card").should("not.exist");
            }
        })
    );

    TargetTestCases.manageCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ targetRole, allowed }) =>
            it(`${allowed ? "Deveria" : "Não deveria"} gerenciar metas de ${targetRole} como ${role}`, () => {
                prepareTargetView(role, targetRole);

                if (allowed) {
                    cy.getDataTest("btn-group-add").should("contain", "Meta");
                    cy.getDataTest("meta-card")
                        .first()
                        .within(() => {
                            cy.contains("Editar").should("be.visible");
                            cy.contains("Deletar").should("be.visible");
                        });
                } else {
                    cy.getDataTest("btn-group-add").should("not.exist");
                    cy.getDataTest("meta-card").contains("Editar").should("not.exist");
                    cy.getDataTest("meta-card").contains("Deletar").should("not.exist");
                }
            })
        )
    );

    it("Deveria adicionar uma meta", () => {
        prepareTargetView(Role.ADMIN);

        cy.getDataTest("btn-group-add").contains("Meta").click();

        cy.getDataTest("offcanvas-body").contains("Venda").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Faturamento").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Faturamento Mín.").parent().find("input").type("80,00");
        cy.getDataTest("offcanvas-body").contains("Margem Bruta").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Markup Bruto").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Markup Líquido").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Saídas").parent().find("input").type("{selectall}100");

        cy.getDataTest("offcanvas-body").contains("Ano").parent().find("select").select("2025");
        cy.getDataTest("offcanvas-body").contains("Trimestre").parent().find("select").select("Q1");

        cy.mockPostTarget();

        cy.getDataTest("offcanvas-footer").contains("Adicionar").click();

        cy.wait("@mockPostTarget").then((intercept) => {
            const targets: NewTarget[] = intercept.request.body.data;
            expect(targets).to.be.an("array").length(1);

            const startDate = new Date(targets[0].dataInicioMeta);
            const endDate = new Date(targets[0].dataFimMeta);

            expect(startDate.getFullYear()).to.equal(2025);
            expect(startDate.getMonth()).to.equal(0); // Janeiro (0-indexed)
            expect(startDate.getDate()).to.equal(1);

            expect(endDate.getFullYear()).to.equal(2025);
            expect(endDate.getMonth()).to.equal(2); // Março (0-indexed)
            expect(endDate.getDate()).to.equal(31);

            expect(targets[0].userRoleId).to.equal(FixtureSupport.getUserRoleIdBy(Role.COMERCIAL_ASSISTANT));

            targets[0].tiposMeta.forEach((tipoMeta) => {
                if (tipoMeta.tipoMeta === TargetType.FATURAMENTO) {
                    expect(tipoMeta.commissionTriggerValue).to.equal(80);
                    expect(tipoMeta.aceleratorTriggerValue).to.equal(100);
                } else if (tipoMeta.tipoMeta === TargetType.VALOR_VENDA) {
                    expect(tipoMeta.commissionTriggerValue).to.equal(0);
                    expect(tipoMeta.aceleratorTriggerValue).to.equal(100);
                } else {
                    expect(tipoMeta.commissionTriggerValue).to.equal(0);
                    expect(tipoMeta.aceleratorTriggerValue).to.equal(100);
                }
            });
        });

        cy.contains("Meta adicionada!");
    });

    it.skip("Deveria adicionar múltiplas metas", () => {
        prepareTargetView(Role.ADMIN);

        cy.getDataTest("btn-group-add").contains("Meta").click();

        cy.getDataTest("offcanvas-body").contains("Venda").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").contains("Data inicial").parent().find("input").type("2025-01-01");
        cy.getDataTest("offcanvas-body").contains("Data final").parent().find("input").type("2025-12-31");
        cy.getDataTest("offcanvas-body")
            .contains("Criar múltiplas metas por meses no período?")
            .parent()
            .find("input")
            .check();

        cy.getDataTest("offcanvas-footer").contains("Adicionar").click();

        cy.mockPostTargetMultiple();

        cy.contains("Confirmar").click();

        cy.wait("@mockPostTargetMultiple").then((intercept) => {
            const targets: NewTarget[] = intercept.request.body.data;
            expect(targets).to.be.an("array").length(12);

            expect(new Date(targets[0].dataInicioMeta).toLocaleDateString("pt-Br")).equal("01/01/2025");
            expect(new Date(targets[0].dataFimMeta).toLocaleDateString("pt-Br")).equal("31/01/2025");

            expect(targets[0].userRoleId).to.equal(FixtureSupport.getUserRoleIdBy(Role.COMERCIAL_ASSISTANT));

            targets[0].tiposMeta.forEach((tipoMeta) => {
                return expect(tipoMeta.aceleratorTriggerValue).equal(100);
            });
        });

        cy.contains("Metas adicionadas!");
    });

    it("Deveria editar uma meta", () => {
        prepareTargetView(Role.ADMIN);

        cy.getDataTest("meta-card").contains("Editar").click();
        cy.getDataTest("offcanvas-body").contains("Venda").parent().find("input").clear().type("100,00");

        cy.mockPatchTarget("assistantTarget");

        cy.getDataTest("offcanvas-footer").contains("Editar").click();

        cy.wait("@mockPatchTarget").then((intercept) => {
            //expect(intercept.request.query.userRole).to.equal(Role.COMERCIAL_ASSISTANT);

            const targets: NewTarget = intercept.request.body.data;

            expect(targets.userRoleId).to.equal(FixtureSupport.getUserRoleIdBy(Role.COMERCIAL_ASSISTANT));

            targets.tiposMeta.forEach((tipoMeta) => {
                if (tipoMeta.tipoMeta === TargetType.VALOR_VENDA)
                    return expect(tipoMeta.aceleratorTriggerValue).equal(100);
            });
        });

        cy.contains("Meta editada!");
    });

    it("Deveria deletar uma meta", () => {
        prepareTargetView(Role.ADMIN);

        cy.getDataTest("meta-card").contains("Deletar").click();

        cy.mockDeleteTarget("assistantTarget");

        cy.getDataTest("offcanvas-footer").contains("Deletar").click();

        cy.wait("@mockDeleteTarget").then((intercept) => {
            //expect(intercept.request.query.userRole).to.equal(Role.COMERCIAL_ASSISTANT);
        });

        cy.contains("Meta deletada!");
    });
});
