import FixtureSupport from "../../support/fixture.support";
import FrontRoutes from "../../../src/lib/front-routes";
import SaleUtil from "../../../src/utils/sale.util";
import SaleTestCases from "./sale.test-cases";

import { NewSale, RevenueType, SaleStatus, UpdateSale } from "../../../src/types/sale";
import { CurrencyType, Role } from "../../../src/types/commom";

describe("Vendas", () => {
    function prepareViewBy(role: Role) {
        cy.useInfo(role);
        cy.useUserRoles();
        cy.useProducts();
        cy.useServices();
        cy.useCustomers();
        cy.useContracts();
        cy.useSales();

        cy.visit(FrontRoutes.getSales());

        cy.wait([
            "@useInfo",
            "@useUserRoles",
            "@useProducts",
            "@useServices",
            "@useCustomers",
            "@useContracts",
            "@useSales",
        ]);
    }

    SaleTestCases.viewCases.forEach(({ role, filteredByField }) =>
        it(`Deveria ver vendas ${filteredByField ? `filtradas por ${filteredByField}` : ""} como ${role}`, () => {
            prepareViewBy(role);

            const userInfo = FixtureSupport.getInfoFromUserBy(role);

            if (filteredByField)
                return cy
                    .getDataTest("table-head")
                    .contains(filteredByField)
                    .parent()
                    .parent()
                    .find("input")
                    .should("have.value", userInfo.name);

            const allFilterUserRoleFields = ["Vendedor", "Indicador comercial", "Arquiteto de soluções", "SDR"]; //TODO: permission-support
            allFilterUserRoleFields.forEach((filterField) =>
                cy
                    .getDataTest("table-head")
                    .contains(filterField)
                    .parent()
                    .parent()
                    .find("input")
                    .should("have.value", "")
            );
        })
    );

    SaleTestCases.createCases
        .filter(({ role }) => role !== Role.COMMISSIONING_ANALYST && role !== Role.FINANCIAL_MANAGER) //TODO: fazer novos testes para os casos especificos
        .forEach(({ role, saleStatusAllowed }) =>
            it(`${saleStatusAllowed.length > 1 ? "Deveria" : "Não deveria"} criar vendas com status ${saleStatusAllowed} como ${role}`, () => {
                prepareViewBy(role);

                if (saleStatusAllowed.length < 1) return cy.getDataTest("btn-group-add").should("not.exist");

                cy.getDataTest("btn-group-add").should("exist").click();
                cy.wait(["@useCustomers", "@useUserRoles", "@useContracts"]);

                Object.values(SaleStatus).forEach((saleStatus, index) => {
                    if (saleStatusAllowed.includes(saleStatus))
                        cy.getDataTest("offcanvas-body")
                            .contains("Estado da venda")
                            .parent()
                            .find("select")
                            .select(saleStatus);
                    else
                        cy.getDataTest("offcanvas-body")
                            .contains("Estado da venda")
                            .parent()
                            .find("option")
                            .eq(index)
                            .should("be.disabled");
                });
            })
        );

    SaleTestCases.manageCases
        .filter(({ role }) => role !== Role.COMMISSIONING_ANALYST && role !== Role.FINANCIAL_MANAGER) //TODO: fazer novos testes para os casos especificos
        .forEach(({ role, possibilities }) =>
            possibilities.forEach(({ saleStatus, optionIsVisible }) =>
                it(`${
                    optionIsVisible ? "Deveria" : "Não deveria"
                } visualizar opção de editar e deletar para vendas ${saleStatus} como ${role}`, () => {
                    prepareViewBy(role);

                    cy.wait(400);
                    cy.getDataTest("table-row")
                        .contains(SaleUtil.getStatusDescriptionBy(saleStatus))
                        .parent()
                        .find('[data-test="table-action-button"]')
                        .click({ force: true });

                    cy.wait(100);
                    cy.getDataTest("table-action-popover")
                        .contains("Editar")
                        .should(optionIsVisible ? "be.visible" : "not.exist");

                    cy.getDataTest("table-action-popover")
                        .contains("Deletar")
                        .should(optionIsVisible ? "be.visible" : "not.exist");
                })
            )
        );

    SaleTestCases.auditCases.forEach(({ role, optionIsVisible }) =>
        it(`${optionIsVisible ? "Deveria" : "Não deveria"} auditar vendas como ${role}`, () => {
            prepareViewBy(role);

            cy.wait(300); //Por algum motivo o popover não abre as vezes e isto solucionou.
            const row = cy
                .getDataTest("table-row")
                .contains(SaleUtil.getStatusDescriptionBy("BILLING_AUDIT" as SaleStatus))
                .parent();
            row.find('[data-test="table-action-button"]').click({ force: true });
            cy.getDataTest("table-action-popover")
                .contains("Auditar")
                .should(optionIsVisible ? "be.visible" : "not.exist");
        })
    );

    it("Deveria criar uma venda", () => {
        prepareViewBy(Role.ADMIN);

        cy.getDataTest("btn-group-add").click();
        cy.wait(["@useCustomers", "@useUserRoles", "@useContracts"]);

        const salePersonAM = FixtureSupport.getInfoFromUserBy(Role.VENDEDOR);
        const salePersonAMRoleId = FixtureSupport.getUserRoleIdBy(Role.VENDEDOR);
        const customerA = { name: "Cliente A", id: "customerA" };
        const contractMic = { name: "Contrato Microsoft", id: "contractB" };
        const paymentA = { name: "FormaPagamentoA", id: "paymentMethodA" };
        const productA = { name: "Produto A", id: "productA" };
        const supplierA = { name: "FornecedorA", id: "supplierA" };

        cy.getDataTest("offcanvas-body").contains("Vendedor (AM)").parent().contains("Nenhum").click();
        cy.getDataTest("select-menu").contains(salePersonAM.name).click({ force: true });

        cy.getDataTest("offcanvas-body").contains("Cliente").parent().contains("Nenhum").click();
        cy.getDataTest("select-menu").contains(customerA.name).click({ force: true });

        cy.getDataTest("offcanvas-body").contains("Contrato").parent().contains("Nenhum").click();
        cy.getDataTest("select-menu").contains(contractMic.name).click({ force: true });

        cy.getDataTest("offcanvas-body").contains("Venda de renovação?").parent().find("input").check({ force: true });

        cy.usePaymentMethods();
        cy.getDataTest("offcanvas-body").contains("Adicionar").eq(0).click();

        cy.getDataTest("offcanvas-body")
            .eq(1)
            .contains("Código da Nota")
            .parent()
            .find("input")
            .type("codigoNotaTeste");

        cy.getDataTest("offcanvas-body").eq(1).contains("Núm. Oportunidade CRM").parent().find("input").type("123");
        cy.getDataTest("offcanvas-body").eq(1).contains("Núm. Pedido Distribuidor").parent().find("input").type("456");

        cy.wait(["@usePaymentMethods"]);

        cy.getDataTest("offcanvas-body").eq(1).contains("Forma de pagamento").parent().contains("Nenhuma").click();
        cy.getDataTest("select-menu").contains(paymentA.name).click({ force: true });

        cy.useSuppliers();

        cy.getDataTest("offcanvas-body").eq(1).contains("Produtos").parent().parent().find("button").click();
        cy.wait(["@useSuppliers"]);

        cy.getDataTest("offcanvas-body").eq(2).contains("Fornecedores").parent().contains("Nenhum").click();
        //este menu não tem botão para confirmar e só fecha quando clickar fora dele
        cy.getDataTest("select-menu").contains(supplierA.name).click({ force: true });

        cy.getDataTest("offcanvas-body").eq(2).contains("Produto").parent().contains("Nenhum").click();
        cy.getDataTest("select-menu").contains(productA.name).click({ force: true });
        cy.wait(250);

        cy.getDataTest("offcanvas-body").eq(2).contains("Quantidade").parent().find("input").type("{selectall}100");

        cy.getDataTest("offcanvas-footer").eq(2).contains("Adicionar").click();
        cy.wait(250);

        cy.getDataTest("offcanvas-body").eq(1).contains("Markup Bruto %").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").eq(1).contains("Dedutíveis dist").parent().find("input").type("100,00");
        cy.getDataTest("offcanvas-body").eq(1).contains("Imposto Nota").parent().find("input").type("10,00");

        cy.getDataTest("offcanvas-footer").eq(1).contains("Adicionar").click();

        cy.postSale();

        cy.getDataTest("offcanvas-footer").contains("Adicionar").click();

        cy.wait("@postSale").then((intercept) => {
            const newSale: NewSale = intercept.request.body.data[0];

            expect(newSale.clienteId).equal(customerA.id);
            expect(newSale.contratoId).equal(contractMic.id);
            expect(newSale.estadoVenda).equal(SaleStatus.INITIAL);
            expect(newSale.vendaRenovacao).equal(true);
            expect(newSale.accountManagerId).equal(salePersonAMRoleId);
            expect(newSale.insideSalesId).equal(null);
            expect(newSale.solutionArchitectId).equal(null);
            expect(newSale.comercialAssistantId).equal(null);
            expect(newSale.comercialManagerId).equal(null);

            expect(newSale.notasVenda.length).equal(1);
            expect(newSale.notasVenda[0].formaPagamentoId).equal(paymentA.id);
            expect(newSale.notasVenda[0].datasBoleto.length).equal(1);
            expect(newSale.notasVenda[0].formaParcelamento).equal(1);

            const vendasProduto = newSale.notasVenda[0].vendasProduto;

            expect(vendasProduto.length).equal(1);
            expect(vendasProduto[0].fornecedoresId[0]).equal(supplierA.id);
            expect(vendasProduto[0].produtoId).equal(productA.id);
            expect(vendasProduto[0].quantidade).equal(100);
            expect(vendasProduto[0].tipoMoeda).equal(CurrencyType.BRL);

            expect(newSale.notasVenda[0].markup).equal(newSale.notasVenda[0].markup); //received 0 no git, is 100
            expect(newSale.notasVenda[0].impostoNota).equal(10);
            expect(newSale.notasVenda[0].dedutiveisDistribuidor).equal(100);
            expect(newSale.notasVenda[0].tipoFaturamento).equal(RevenueType.DIRETO);
        });

        cy.contains("Venda adicionada!");
    });

    it.skip("Deveria editar uma venda nova", () => {
        prepareViewBy(Role.ADMIN);

        cy.getDataTest("table-action-button").eq(4).click();
        cy.getDataTest("table-action-popover").contains("Editar").click();

        const amountSaleInvoices = 2;

        const updateDataOfSaleToUpdate: Omit<UpdateSale, "notasVenda"> = {
            accountManagerId: "salePersonRoleA",
            insideSalesId: null,
            referrerId: null,
            comercialAssistantId: null,
            comercialManagerId: null,
            solutionArchitectId: null,
            clienteId: "customerB",
            numOportunidadeCRM: null,
            numPedidoDistribuidor: null,
            vendaRenovacao: false,
            estadoVenda: SaleStatus.INITIAL,
            dataVenda: new Date("2023-06-15T00:00:00.000Z"),
        };

        cy.patchSale("NewSaleD");

        cy.getDataTest("offcanvas-footer").contains("Editar").click();

        cy.wait("@patchSale").then((intercept) => {
            const saleUpdated: UpdateSale = intercept.request.body.data;

            expect(saleUpdated.accountManagerId).equal(updateDataOfSaleToUpdate.accountManagerId);
            expect(saleUpdated.insideSalesId).equal(updateDataOfSaleToUpdate.insideSalesId);
            expect(saleUpdated.comercialAssistantId).equal(updateDataOfSaleToUpdate.comercialAssistantId);
            expect(saleUpdated.comercialManagerId).equal(updateDataOfSaleToUpdate.comercialManagerId);
            expect(saleUpdated.solutionArchitectId).equal(updateDataOfSaleToUpdate.solutionArchitectId);
            expect(saleUpdated.clienteId).equal(updateDataOfSaleToUpdate.clienteId);
            expect(saleUpdated.numOportunidadeCRM).equal(updateDataOfSaleToUpdate.numOportunidadeCRM);
            expect(saleUpdated.numPedidoDistribuidor).equal(updateDataOfSaleToUpdate.numPedidoDistribuidor);
            expect(saleUpdated.vendaRenovacao).equal(updateDataOfSaleToUpdate.vendaRenovacao);
            expect(saleUpdated.estadoVenda).equal(updateDataOfSaleToUpdate.estadoVenda);

            expect(saleUpdated.notasVenda.length).equal(amountSaleInvoices);
        });

        cy.contains("Venda editada!");
    });


    //TODO: Verificar e arrumar testes
    it.skip("Deveria mostrar uma confirmação ao atualizar o estado da venda de INITIAL para BILLING_AUDIT", () => {
        prepareViewBy(Role.ADMIN);

        cy.getDataTest("table-action-button").eq(4).click();
        cy.getDataTest("table-action-popover").contains("Editar").click();

        cy.getDataTest("offcanvas-body")
            .contains("Estado da venda")
            .parent()
            .find("select")
            .select(SaleStatus.BILLING_AUDIT);

        cy.getDataTest("offcanvas-footer").contains("Editar").click();
        cy.contains("Todas as notas fiscais possuem código.");

        cy.patchSale("NewSaleD");

        cy.contains("Confirmar").click({ force: true });

        cy.wait("@patchSale").then((intercept) => {
            const newSale: NewSale = intercept.request.body.data;

            expect(newSale.estadoVenda).equal(SaleStatus.BILLING_AUDIT);
        });

        cy.contains("Venda editada!").should("be.visible");
    });

    it.skip("Deveria mostrar uma confirmação ao retroceder o estado da venda de BILLING_AUDIT para INITIAL", () => {
        prepareViewBy(Role.ADMIN);

        cy.getDataTest("table-action-button").eq(5).click();
        cy.getDataTest("table-action-popover").contains("Editar").click();

        cy.getDataTest("offcanvas-body").contains("Estado da venda").parent().find("select").select(SaleStatus.INITIAL);

        cy.getDataTest("offcanvas-footer").contains("Editar").click({ force: true });
        cy.contains("Motivo do retrocesso").type("Motivo");

        cy.patchSale("NewSaleE");

        cy.contains("Confirmar").click({ force: true });

        cy.wait("@patchSale").then((intercept) => {
            const newSale: NewSale = intercept.request.body.data;

            expect(intercept.request.body.reasonRegressionStatus).equal("Motivo");
            expect(newSale.estadoVenda).equal(SaleStatus.INITIAL);
        });

        cy.contains("Venda editada!").should("be.visible");
    });

    it.skip("Deveria deletar uma venda", () => {
        prepareViewBy(Role.ADMIN);

        cy.getDataTest("table-action-button").eq(0).click();
        cy.getDataTest("table-action-popover").contains("Deletar").click();

        const dataOfSaleToDelete: Omit<UpdateSale, "notasVenda"> = {
            accountManagerId: "salePersonRoleA",
            insideSalesId: "salePersonRoleB",
            comercialAssistantId: "comercialAssistantRole",
            comercialManagerId: null,
            solutionArchitectId: "solutionArchitectRole",
            referrerId: null,
            clienteId: "customerA",
            numPedidoDistribuidor: "oportunidade1",
            numOportunidadeCRM: "oportunidade2",
            vendaRenovacao: true,
            contratoId: "contractA",
            estadoVenda: SaleStatus.BILLING_AUDIT,
            dataVenda: new Date("2024-05-15T00:00:00.000Z"),
        };

        cy.deleteSale("saleA");

        cy.getDataTest("offcanvas-footer").contains("Deletar").click({ force: true });

        cy.wait("@deleteSale").then((intercept) => {
            expect(intercept.request.query.estadoVendaAtual).equal(dataOfSaleToDelete.estadoVenda);
            expect(intercept.request.query.accountManagerIdAtual).equal(dataOfSaleToDelete.accountManagerId);
        });

        cy.contains("Venda deletada!");
    });
});
