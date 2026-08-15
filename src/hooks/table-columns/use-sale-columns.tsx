import { Sale, SaleStatus } from "../../types/sale";
import { useSearchParams } from "react-router-dom";
import { UserRole } from "../../types/user-role";
import { Customer } from "../../types/customer";
import { Contract } from "../../types/contract";
import { Column } from "../../ui/table/type";
import { useMemo } from "react";

import useOnChangeFilter from "../use-onchange-filter";
import SaleUtil from "../../utils/sale.util";

import * as Span from "../../components/span";

type SaleColumnsProps = {
    managers: UserRole[];
    customers: Customer[];
    contracts: Contract[];
    referrers: UserRole[];
    salePeople: UserRole[];
    architects: UserRole[];
    assistants: UserRole[];
};

export default function useSaleColumns({
    customers,
    salePeople,
    referrers,
    contracts,
    managers,
    assistants,
    architects,
}: SaleColumnsProps) {
    const { onChangeDate, onChangeText } = useOnChangeFilter();
    const [searchParams] = useSearchParams();

    const activedFilters = useMemo(() => SaleUtil.getFilterValuesBy(searchParams), [searchParams]);

    return useMemo((): Column<Sale>[] => {
        return [
            {
                id: "estadoVenda", //identifier of the column, make sure its the same as the filter params constants. Its used by the tests too
                headerCell: "Estado da Venda", //what is shown to user as column name
                sortKey: "estadoVenda",
                filterOpt: {
                    //the types available are in type Column
                    type: "enum",
                    filterValue: activedFilters.filterSaleStatus,
                    onChange: (filterText) => onChangeText(SaleUtil.SALE_STATUS_KEY, filterText),
                    enums: Object.values(SaleStatus).map((status) => ({
                        value: status,
                        label: SaleUtil.getStatusDescriptionBy(status),
                    })),
                },
                //the place for the actual value from Database of the specified user
                bodyCell: (sale) => SaleUtil.getStatusDescriptionBy(sale.estadoVenda),
            },
            {
                id: "dataVenda",
                headerCell: "Data da Venda",
                sortKey: "dataVenda",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.filterSaleDate,
                    onChange: (filterDatesStr) => onChangeDate(SaleUtil.SALE_DATE_KEY, filterDatesStr),
                },
                bodyCell: (sale) =>
                    sale.dataVenda.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
            {
                id: "faturamentos",
                headerCell: "Faturamentos",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.filterSaleInvoiceDate,
                    onChange: (filterDatesStr) => onChangeDate(SaleUtil.SALE_INVOICE_DATE_KEY, filterDatesStr),
                },
                bodyCell: (sale) => <Span.SaleInvoiceRevenueDates invoices={sale.notasVenda} />,
            },
            {
                id: "numOportunidadeCRM",
                headerCell: "Núm. CRM",
                sortKey: "numOportunidadeCRM",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar núm. CRM...",
                    filterText: activedFilters.filterNumCrm,
                    onChange: (filterText) => onChangeText(SaleUtil.NUM_CRM_KEY, filterText),
                },
                bodyCell: (sale) => <Span.SaleNumCRM saleInvoices={sale.notasVenda} />,
            },
            {
                id: "numPedidoDistribuidor",
                headerCell: "Núm. Pedido Distribuidor",
                sortKey: "numPedidoDistribuidor",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar núm. pedido...",
                    filterText: activedFilters.filterNumDistributor,
                    onChange: (filterText) => onChangeText(SaleUtil.NUM_DISTRIBUTOR_KEY, filterText),
                },
                bodyCell: (sale) => <Span.SaleNumDistributor saleInvoices={sale.notasVenda} />,
            },
            {
                id: "codigoNota",
                headerCell: "Notas Fiscais",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar nota...",
                    filterText: activedFilters.filterInvoiceCode,
                    onChange: (filterText) => onChangeText(SaleUtil.INVOICE_CODE_KEY, filterText),
                },
                bodyCell: (sale) => <Span.SaleInvoiceCodes saleInvoices={sale.notasVenda} />,
            },
            {
                id: "clienteId",
                headerCell: "Cliente",
                filterOpt: {
                    type: "enum",
                    enums: customers.map((customer) => ({ label: customer.name, value: customer.id })),
                    filterValue: activedFilters.filterCustomerId,
                    onChange: (filterValue) => onChangeText(SaleUtil.CUSTOMER_ID_KEY, filterValue),
                },
                bodyCell: (sale) => sale.cliente.name,
            },
            {
                id: "valorImpostoNota",
                headerCell: "Impostos",
                bodyCell: (sale) => <Span.SaleTax venda={sale} />,
            },
            {
                id: "valorVenda",
                headerCell: "Valores",
                bodyCell: (sale) => <Span.SaleValues venda={sale} />,
            },
            {
                id: "comissões",
                headerCell: "Comissões",
                bodyCell: (sale) => <Span.SaleCommissions sale={sale} />,
            },
            {
                id: "salePeople",
                headerCell: "Vendedor",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterSalePersonId,
                    onChange: (filterValue) => onChangeText(SaleUtil.SALE_PERSON_ID_KEY, filterValue),
                    enums: salePeople.map((saleUserRole) => ({
                        label: saleUserRole.user.name,
                        value: saleUserRole.id,
                    })),
                },
                bodyCell: (sale) => <Span.SalePeopleOfSale venda={sale} />,
            },
            {
                id: "achitect",
                headerCell: "Arquiteto de soluções",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterSolutionArchitectId,
                    onChange: (filterValue) => onChangeText(SaleUtil.SOLUTION_ARCHITECT_ROLE_ID_KEY, filterValue),
                    enums: architects.map((architectRole) => ({
                        label: architectRole.user.name,
                        value: architectRole.id,
                    })),
                },
                bodyCell: (sale) => sale.solutionArchitect?.user.name,
            },
            {
                id: "referrer",
                headerCell: "Indicador comercial",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterReferrerId,
                    onChange: (filterValue) => onChangeText(SaleUtil.REFERRER_ROLE_ID_KEY, filterValue),
                    enums: referrers.map((referrerRole) => ({
                        label: referrerRole.user.name,
                        value: referrerRole.id,
                    })),
                },
                bodyCell: (sale) => sale.referrer?.user.name,
            },
            {
                id: "assistant",
                headerCell: "SDR",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterComercialAssistantId,
                    onChange: (filterValue) => onChangeText(SaleUtil.COMERCIAL_ASSISTANT_ROLE_ID_KEY, filterValue),
                    enums: assistants.map((assistantRole) => ({
                        label: assistantRole.user.name,
                        value: assistantRole.id,
                    })),
                },
                bodyCell: (sale) => sale.comercialAssistant?.user.name,
            },
            {
                id: "manager",
                headerCell: "Gerente comercial",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterComercialManagerId,
                    onChange: (filterValue) => onChangeText(SaleUtil.COMERCIAL_MANAGER_ROLE_ID_KEY, filterValue),
                    enums: managers.map((managerRole) => ({
                        label: managerRole.user.name,
                        value: managerRole.id,
                    })),
                },
                bodyCell: (sale) => sale.comercialManager?.user.name,
            },
            {
                id: "vendaRenovacao",
                headerCell: "Tipo de venda",
                bodyCell: (sale) => (sale.vendaRenovacao ? "Renovação" : "Nova Venda"),
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterRenewalSale,
                    onChange: (filterValue) => onChangeText(SaleUtil.RENEWAL_SALE_KEY, filterValue),
                    enums: [
                        { label: "Renovação", value: "true" },
                        { label: "Nova Venda", value: "false" },
                    ],
                },
            },
            {
                id: "contratoId",
                headerCell: "Contrato",
                bodyCell: (sale) => sale.contrato?.name,
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.filterContractId,
                    onChange: (filterValue) => onChangeText(SaleUtil.CONTRACT_ID_KEY, filterValue),
                    enums: contracts.map((contract) => ({ label: contract.name, value: contract.id })),
                },
            },
            {
                id: "updatedAt",
                headerCell: "Última Atualização",
                sortKey: "updatedAt",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.filterUpdatedAt,
                    onChange: (filterDateStr) => onChangeDate(SaleUtil.UPDATED_AT_KEY, filterDateStr),
                },
                bodyCell: (sale) =>
                    sale.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [
        customers,
        salePeople,
        contracts,
        activedFilters,
        onChangeText,
        onChangeDate,
        managers,
        referrers,
        assistants,
        architects,
    ]);
}
