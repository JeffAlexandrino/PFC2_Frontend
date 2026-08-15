import FixtureSupport from "../../support/fixture.support";
import FrontRoutes from "../../../src/lib/front-routes";
import UserTestCases from "./user.test-cases";

import { DataUpdateUserInfo, DataUpdateUserRole, NewUser } from "../../../src/types/user";
import { rolesThatCanViewAnyUser } from "../../support/roles-permissions.support";
import { Role } from "../../../src/types/commom";

describe("Usuários", () => {
    function prepareUserView(role: Role) {
        //cy.useApiVersion(); //Teste para comprovar funcionamento da rota versião dinamica
        //cy.visit(FrontRoutes.getUsers());
        //cy.wait("@useApiVersion");

        cy.useInfo(role);
        cy.useUsers();

        cy.visit(FrontRoutes.getUsers());

        cy.wait(["@useInfo", "@useUsers"]);
    }
    const USERS_AMOUNT = 11; // 6 usuarios comerciais, 2 Gerente, 2 admins, 1 monitor
    const USERS_AMOUNT_NOT_ADMIN = 8; //Admins are only seen by Manager_Roles : 6 usuarios comerciais, 2 Gerente
    UserTestCases.viewCases.forEach(({ role, allowed }) =>
        it(`${allowed ? "Deveria" : "Não deveria"} visualizar todos os usuários como ${role}`, () => {
            prepareUserView(role);

            cy.tableContains({
                length: allowed ? USERS_AMOUNT : USERS_AMOUNT_NOT_ADMIN,
            });
        })
    );

    UserTestCases.createCases.forEach(({ role, isOptionVisible }) =>
        it(`${isOptionVisible ? "Deveria" : "Não deveria"} criar usuários como ${role}`, () => {
            prepareUserView(role);

            if (isOptionVisible) return cy.getDataTest("btn-group-add").contains("Usuário").should("be.visible");
            cy.getDataTest("btn-group-add").should("not.exist");
        })
    );

    UserTestCases.auditCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ isOptionVisible, userId }) =>
            it(`${isOptionVisible ? "Deveria" : "Não deveria"} auditar o ${userId} como ${role}`, () => {
                prepareUserView(role);

                if (!rolesThatCanViewAnyUser.includes(role) && (userId === "admin" || userId === "monitor")) {
                    return cy.getDataTest("table-row").contains(userId).should("not.exist");
                }

                cy.getDataTest("table-row").contains(userId).parent().find("td").find("button").eq(1).click();

                cy.getDataTest("table-action-popover")
                    .should("be.visible")
                    .should("have.length", 1)
                    .contains("Auditar")
                    .should(isOptionVisible ? "be.visible" : "not.exist");
            })
        )
    );

    UserTestCases.viewTargetsCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ isOptionVisible, userId }) =>
            it(`${isOptionVisible ? "Deveria" : "Não deveria"} mostrar metas de ${userId} como ${role}`, () => {
                prepareUserView(role);
                //Deveria estar em test-cases a inclusão ou exclusão de papeis---
                if (
                    !rolesThatCanViewAnyUser.includes(role) &&
                    (userId === "admin" || userId === "monitor" || userId === "comercial_manager")
                ) {
                    return cy.getDataTest("table-row").contains(userId).should("not.exist");
                }
                //----

                cy.getDataTest("table-row").contains(userId).parent().find("td").find("button").eq(1).click();

                cy.getDataTest("table-action-popover")
                    .should("be.visible")
                    .should("have.length", 1)
                    .contains("Visualizar metas")
                    .should(isOptionVisible ? "be.visible" : "not.exist");
            })
        )
    );

    UserTestCases.updateOrDeleteUserInfoCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ isOptionVisible, userId }) =>
            it(`${isOptionVisible ? "Deveria" : "Não deveria"} atualizar ou deletar o ${userId} como ${role}`, () => {
                prepareUserView(role);

                if (!rolesThatCanViewAnyUser.includes(role) && (userId === "admin" || userId === "monitor")) {
                    return cy.getDataTest("table-row").contains(userId).should("not.exist");
                }

                cy.getDataTest("table-row").contains(userId).parent().find("td").find("button").eq(1).click();

                cy.getDataTest("table-action-popover")
                    .should("be.visible")
                    .should("have.length", 1)
                    .contains("Editar")
                    .should(isOptionVisible ? "be.visible" : "not.exist");

                cy.getDataTest("table-action-popover")
                    .should("be.visible")
                    .should("have.length", 1)
                    .contains("Desativar")
                    .should(isOptionVisible ? "be.visible" : "not.exist");
            })
        )
    );

    UserTestCases.updateUserRolesCases.forEach(({ role, possibilities }) =>
        possibilities.forEach(({ isOptionVisible, userId }) =>
            it(`${isOptionVisible ? "Deveria" : "Não deveria"} atualizar papéis de ${userId} como ${role}`, () => {
                prepareUserView(role);

                if (!rolesThatCanViewAnyUser.includes(role) && (userId === "admin" || userId === "monitor")) {
                    return cy.getDataTest("table-row").contains(userId).should("not.exist"); //erro
                }

                const row = cy.getDataTest("table-row").contains(userId).parent().find("td");
                row.find("button").eq(1).click();

                cy.getDataTest("table-action-popover")
                    .should("be.visible")
                    .should("have.length", 1)
                    .contains("Gerenciar papéis")
                    .should(isOptionVisible ? "be.visible" : "not.exist");
            })
        )
    );

    it("Deveria adicionar um usuário", () => {
        prepareUserView(Role.ADMIN);

        cy.getDataTest("btn-group-add").contains("Usuário").click();

        cy.getDataTest("offcanvas-body").contains("Nome do usuário").parent().find("input").type("Novo");
        cy.getDataTest("offcanvas-body").contains("E-mail do usuário").parent().find("input").type("teste@teste.com");
        cy.getDataTest("offcanvas-body")
            .contains("Papel do usuário")
            .parent()
            .find("select")
            .select("Gerente Comercial");

        cy.mockPostUser();

        cy.getDataTest("offcanvas-footer").contains("Adicionar").click();

        cy.wait("@mockPostUser").then((intercept) => {
            const body = intercept.request.body;
            expect(body.data).to.be.an("array").length(1);

            const newUser: NewUser = body.data[0];

            expect(newUser.name).to.equal("Novo");
            expect(newUser.email).to.equal("teste@teste.com");
            expect(newUser.role).to.equal(Role.COMERCIAL_MANAGER);
        });

        cy.contains("Usuário criado!");
    });

    it("Deveria atualizar informações de um usuário", () => {
        prepareUserView(Role.ADMIN);

        const userToEdit = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);

        const row = cy.getDataTest("table-row").contains(userToEdit.name).parent().find("td");
        row.find("button").eq(1).click();

        cy.getDataTest("table-action-popover").should("be.visible").should("have.length", 1).contains("Editar").click();

        cy.getDataTest("offcanvas-body").contains("Nome do usuário").parent().find("input").clear().type("Novo");
        cy.getDataTest("offcanvas-body")
            .contains("E-mail do usuário")
            .parent()
            .find("input")
            .clear()
            .type("teste@teste.com");

        cy.mockPatchUserInfo(userToEdit.id);

        cy.getDataTest("offcanvas-footer").contains("Editar").click();

        cy.wait("@mockPatchUserInfo").then((intercept) => {
            const updateData: DataUpdateUserInfo = intercept.request.body.data;

            expect(updateData.name).to.equal("Novo");
            expect(updateData.email).to.equal("teste@teste.com");

            expect(intercept.request.query["onlyComercialNotManagerRoles"]).equal("true");
        });

        cy.contains("Usuário atualizado!");
    });

    it("Deveria atualizar roles de um usuário", () => {
        prepareUserView(Role.ADMIN);

        const userToEdit = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);

        const row = cy.getDataTest("table-row").contains(userToEdit.name).parent().find("td");
        row.find("button").eq(1).click();

        cy.useUser();
        cy.useUserRoles();

        cy.getDataTest("table-action-popover")
            .should("be.visible")
            .should("have.length", 1)
            .contains("Gerenciar papéis")
            .click();

        cy.mockPatchUserRole(userToEdit.id);

        cy.getDataTest("offcanvas-footer").contains("Atualizar").click();

        cy.wait("@mockPatchUserRole").then((intercept) => {
            const updateData: DataUpdateUserRole = intercept.request.body.data;

            expect(updateData.userRoles).to.be.an("array").length(2);
            expect(updateData.userRoles[0].role).to.equal(Role.SOLUTION_ARCHITECT);
            expect(updateData.userRoles[1].role).to.equal(Role.VENDEDOR);

            expect(intercept.request.query["onlyComercialNotManagerRoles"]).equal("true");
        });

        cy.contains("Papéis do usuário atualizados!");
    });

    it("Deveria deletar um usuário", () => {
        prepareUserView(Role.ADMIN);

        const userToDelete = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);

        const row = cy.getDataTest("table-row").contains(userToDelete.name).parent().find("td");
        row.find("button").eq(1).click();

        cy.getDataTest("table-action-popover")
            .should("be.visible")
            .should("have.length", 1)
            .contains("Desativar")
            .click();

        cy.mockDeleteUser(userToDelete.id);

        cy.getDataTest("offcanvas-footer").contains("Desativar").click();

        cy.wait("@mockDeleteUser").then((intercept) => {
            expect(intercept.request.query["onlyComercialNotManagerRoles"]).equal("true");
        });

        cy.contains("Usuário desativado!");
    });

    it("Deveria auditar um usuário", () => {
        prepareUserView(Role.ADMIN);

        const userToAudit = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);

        const row = cy.getDataTest("table-row").contains(userToAudit.name).parent().find("td");
        row.find("button").eq(1).click();

        cy.mockGetAudit(userToAudit.id);

        cy.getDataTest("table-action-popover")
            .should("be.visible")
            .should("have.length", 1)
            .contains("Auditar")
            .click();
    });

    it("Deveria visualizar metas de um usuário", () => {
        prepareUserView(Role.ADMIN);

        const user = FixtureSupport.getInfoFromUserBy(Role.COMERCIAL_ASSISTANT);

        const row = cy.getDataTest("table-row").contains(user.name).parent().find("td");
        row.find("button").eq(1).click();

        cy.useUser();
        cy.useTargets();

        cy.getDataTest("table-action-popover")
            .should("be.visible")
            .should("have.length", 1)
            .contains("Visualizar metas")
            .click();

        cy.wait(["@useTargets", "@useUser"]);

        cy.location().should((loc) => expect(loc.pathname).to.equal(FrontRoutes.getTargetsUser(user.id)));
    });
});
