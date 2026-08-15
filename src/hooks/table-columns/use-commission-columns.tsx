import { InvoiceType, SaleStatus } from "../../types/sale";
import { Commission } from "../../types/commission";
import { useSearchParams } from "react-router-dom";
import { CurrencyType } from "../../types/commom";
import { Customer } from "../../types/customer";
import { Column } from "../../ui/table/type";
import { User } from "../../types/user";
import { useMemo } from "react";

import CommissionUtil from "../../utils/commission.util";
import useOnChangeFilter from "../use-onchange-filter";
import StringUtil from "../../utils/string.util";
import SaleUtil from "../../utils/sale.util";

import * as Span from "../../components/span";

type CommissionColumnsProps = { customers: Customer[]; users: User[] };

export default function useCommissionColumns({ customers, users }: CommissionColumnsProps) {
    const { onChangeDate, onChangeText } = useOnChangeFilter();
    const [searchParams] = useSearchParams();

    const activedFilters = useMemo(() => CommissionUtil.getFilterValuesBy(searchParams), [searchParams]);

    return useMemo((): Column<Commission>[] => {
        return [
            {
                id: "dataComissao", //identifier of the column, make sure its the same as the filter params constants. Its used by the tests too
                headerCell: "Data da Comissão / Boleto", //what is shown to user as column name
                sortKey: "dataComissao",
                filterOpt: {
                    //the types available are in type Column
                    type: "date",
                    filterDatesStr: activedFilters.commissionDate,
                    onChange: (value) => onChangeDate(CommissionUtil.COMMISSION_DATE_KEY, value),
                },
                bodyCell: (commission) => {
                    //the place for the actual value from Database of the specified user
                    return <Span.CommissionDate commission={commission} />;
                },
            },
            {
                id: "comissaoPaga",
                headerCell: "Comissão Paga",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.paidStatus,
                    onChange: (value) => onChangeText(CommissionUtil.PAID_STATUS_KEY, value),
                    enums: [
                        { value: "true", label: "Sim" },
                        { value: "false", label: "Não" },
                    ],
                },
                bodyCell: (commission) => (commission.comissaoPaga ? "Sim" : "Não"),
            },
            {
                
                id: "distributorPaid",
                headerCell: "Paga pelo distribuidor",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.distributorPaid,
                    onChange: (value) => onChangeText(CommissionUtil.DISTRIBUTOR_PAID_KEY, value),
                    enums: [
                        { value: "true", label: "Sim" },
                        { value: "false", label: "Não" },
                    ],
                },
                bodyCell: (commission) => (commission.distributorPaid ? "Sim" : "Não"),
            },
            {
                id: "userRoleId",
                headerCell: "Usuário",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.userId,
                    onChange: (value) => onChangeText(CommissionUtil.USER_ID_KEY, value),
                    enums: users.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (commission) => commission.userRole.user.name,
            },
            {
                id: "comissao",
                headerCell: "Valor Esperado / Aprovado",
                bodyCell: (commission) => <Span.CommissionValue commission={commission} />,
            },
            {
                id: "valorMargemBrutaBase",
                headerCell: "Margem Bruta Base",
                sortKey: "valorMargemBrutaBase",
                bodyCell: (commission) =>
                    StringUtil.getCurrencyFormat(commission.valorMargemBrutaBase, CurrencyType.BRL),
            },
            {
                id: "estadoVenda",
                headerCell: "Estado da Venda",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.saleStatus,
                    onChange: (value) => onChangeText(CommissionUtil.SALE_STATUS_KEY, value),
                    enums: Object.values(SaleStatus).map((status) => ({
                        value: status,
                        label: SaleUtil.getStatusDescriptionBy(status),
                    })),
                },
                bodyCell: (commission) => SaleUtil.getStatusDescriptionBy(commission.venda.estadoVenda),
            },
            {
                id: "codigoNota",
                headerCell: "Nota Fiscal",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar nota...",
                    filterText: activedFilters.invoiceCode,
                    onChange: (value) => onChangeText(CommissionUtil.INVOICE_CODE_KEY, value),
                },
                bodyCell: (sale) => <Span.CommissionSaleInvoice commission={[sale]} />,
            },
            {
                id: "numCRM",
                headerCell: "Núm. CRM",
                filterOpt: {
                    type: "text",
                    placeholder: "Encontrar CRM...",
                    filterText: activedFilters.filterNumCrm,
                    onChange: (value) => onChangeText(CommissionUtil.NUM_CRM_KEY, value?.trim()),
                },
                bodyCell: (sale) => {
                    const vendaNum = sale.venda.numOportunidadeCRM;
                    if (!vendaNum || vendaNum === "") {
                        return sale.notaVenda?.numOportunidadeCRM ?? "";
                    }
                    return vendaNum;
                },
            },
            {
                id: "tipoNota",
                headerCell: "Tipo Nota Fiscal", //TODO:Make search
                //sortKey: "tipoNota",
                // filterOpt: {
                //     type: "text",
                //      enums: Object.values(InvoiceType).map((type) => ({
                //          value: type,
                //          label: type,
                //      })),
                //     filterText: activedFilters.invoiceType,
                //     onChange: (filterText) => onChangeText(CommissionUtil.INVOICE_TYPE_KEY, filterText),
                // },
                bodyCell: (sale) =>
                    sale.notaVenda
                        ? sale.notaVenda.vendasProduto.length > 0
                            ? sale.notaVenda.vendasServico.length > 0
                                ? InvoiceType.PRODUCT_AND_SERVICE
                                : InvoiceType.PRODUCT
                            : InvoiceType.SERVICE
                        : InvoiceType.NONE,
            },
            {
                id: "clienteId",
                headerCell: "Cliente",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.customerId,
                    onChange: (value) => onChangeText(CommissionUtil.CUSTOMER_ID_KEY, value),
                    enums: customers.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (commission) => commission.venda.cliente.name ?? "",
            },
            {
                id: "updatedAt",
                sortKey: "updatedAt",
                headerCell: "Última Atualização",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(CommissionUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (commission) =>
                    commission.updatedAt?.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [customers, users, activedFilters, onChangeDate, onChangeText]);
}
