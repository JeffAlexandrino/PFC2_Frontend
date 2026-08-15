import { DashboardMetric } from "../types/dashboard";
import { CurrencyType } from "../types/commom";

export default class StringUtil {
    private static getCurrencySymbolFor(currencyType?: CurrencyType) {
        switch (currencyType) {
            case CurrencyType.USD:
                return "US$";
            case CurrencyType.BRL:
                return "R$";
            default:
                return "$";
        }
    }

    public static getCNPJFormat(cnpjStr: string): string {
        return cnpjStr.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    public static getPhoneFormat(telefone: string) {
        telefone = telefone.replace(/\D/g, ""); // Remove qualquer caractere não numérico

        if (telefone.length === 13 && telefone.startsWith("55")) {
            telefone = telefone.substring(2); // Remove o 55 (código do país)
            return "+55 (" + telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "$1) $2-$3");
        }

        // Formato para celular com DDD
        if (telefone.length === 11) {
            return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        }

        // Formato para telefone fixo com DDD
        if (telefone.length === 10) {
            return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
        }

        return telefone;
    }

    public static getCurrencyFormat(value: number, currencyType?: CurrencyType) {
        if (value === undefined) {
            value = 0;
        }
        return (
            this.getCurrencySymbolFor(currencyType) +
            " " +
            value.toLocaleString("pt-Br", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }

    public static getFirstName(fullName: string) {
        return fullName.split(" ").at(0);
    }

    public static getInitials(fullName: string) {
        const splittedName = fullName.split(" ");
        const firstName = splittedName.at(0) ?? "";
        const lastName = splittedName.at(-1) ?? "";
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }

    public static truncate(str: string, length: number) {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    public static getDashboardMetricDescription(metric: DashboardMetric) {
        switch (metric) {
            case DashboardMetric.FATURAMENTO:
                return "Faturamento";
            case DashboardMetric.VALOR_VENDA:
                return "Valor da Venda";
            //case DashboardMetric.MARGEM:
            //    return "Margem";
            case DashboardMetric.MARKUP_BRUTO:
                return "Markup Bruto";
            case DashboardMetric.MARKUP_LIQUIDO:
                return "Markup Líquido";
            case DashboardMetric.VISITA:
                return "Saída";
        }
    }

    public static getCurrencyTypeDescription(currencyType: CurrencyType) {
        switch (currencyType) {
            case CurrencyType.BRL:
                return "Real";
            case CurrencyType.USD:
                return "Dólar";
            default:
                return "Desconhecido";
        }
    }
}
