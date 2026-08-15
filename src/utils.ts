import { DashboardMetric, DashboardMetricKey } from "./types/dashboard";
import { tMesesSelecionados } from "./components/filtros/FilterMonths";
import { EditUserByUserRoleData, UserRole } from "./types/user-role";
import { ExpenseType, NewVisit, VisitType } from "./types/visits";
import { RevenueType, SaleStatus } from "./types/sale";
import { Target, TargetType } from "./types/target";
import { CurrencyType } from "./types/commom";
import { tAcao } from "./interfaces";

import * as XLSX from "xlsx";

const utils = {
    isNil: (value: any) => value === undefined || value === null,
    blErroCancelamento: (err: any): boolean => err?.code === "ERR_CANCELED" || err?.code === undefined,
    retornaValorMonetario: (value: number | null | undefined, moeda?: CurrencyType | null) => {
        if (value == null || isNaN(value)) {
            value = 0;
        }
        if (moeda === undefined) {
            moeda = null;
        }
        return (
            retornaCifraoMoeda(moeda) +
            " " +
            value.toLocaleString("pt-BR", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    },

    retornaLetrasDoNome: (nomeUsuario: string) => {
        const partesDoNome = nomeUsuario.split(" ");
        const partesDoNomeDefinidas = partesDoNome.filter((parte) => parte !== undefined);

        const qntDePartes = partesDoNomeDefinidas.length;
        const primeiraParte = partesDoNomeDefinidas[0];
        const ultimaParte = partesDoNomeDefinidas[qntDePartes - 1];

        if (qntDePartes > 1) return primeiraParte[0] + ultimaParte[0];
        else return primeiraParte[0];
    },
    retornaCNPJFormatado: (CNPJ: string) => {
        return CNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    },
    retornaTelefoneFormatado: (telefone: string) => {
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
    },
    retornaArrayTipoFaturamento: (): RevenueType[] => {
        return Object.values(RevenueType) as RevenueType[];
    },
    retornaTextoTipoFaturamento: (tipo: RevenueType): string => {
        switch (tipo) {
            case RevenueType.DIRETO:
                return "Direto";
            case RevenueType.REVENDA:
                return "Revenda";
        }
    },
    returnTipoVisita: (): VisitType[] => {
        return Object.values(VisitType) as VisitType[];
    },
    returnArrayTipoVisita: (tipo: VisitType) => {
        switch (tipo) {
            case VisitType.VISITA:
                return "Visita";
            case VisitType.REUNIAO:
                return "Reunião";
            case VisitType.SUPORTE:
                return "Suporte";
            case VisitType.TREINAMENTO:
                return "Treinamento";
            case VisitType.WEBINAR:
                return "Webinar";
            case VisitType.WORKSHOP:
                return "Workshop";
        }
    },
    returnTextTipoVisita: (tipo: VisitType | null | undefined): string => {
        if (!tipo) return "Não informado";
        switch (tipo) {
            case VisitType.VISITA:
                return "Visita";
            case VisitType.REUNIAO:
                return "Reunião";
            case VisitType.SUPORTE:
                return "Suporte";
            case VisitType.TREINAMENTO:
                return "Treinamento";
            case VisitType.WEBINAR:
                return "Webinar";
            case VisitType.WORKSHOP:
                return "Workshop";
            default:
                return tipo;
        }
    },
    returnTiposGasto: (): ExpenseType[] => {
        return Object.values(ExpenseType) as ExpenseType[];
    },
    returnTextTipoGasto: (tipo: ExpenseType) => {
        switch (tipo) {
            case ExpenseType.COMBUSTIVEL:
                return "Combustível";
            case ExpenseType.VIAGEM:
                return "Viagem";
            case ExpenseType.ALIMENTACAO:
                return "Alimentação";
            case ExpenseType.JANTA:
                return "Jantar";
            case ExpenseType.ALMOCO:
                return "Almoço";
            case ExpenseType.HOSPEDAGEM:
                return "Hospedagem";
            case ExpenseType.PEDAGIO:
                return "Pedágio";
            case ExpenseType.ESTACIONAMENTO:
                return "Estacionamento";
            case ExpenseType.COFFE:
                return "Café";
        }
    },
    retornaArrayTipoMeta: (): TargetType[] => {
        const objTipos: { [Key in TargetType]: undefined } = {
            VALOR_VENDA: undefined,
            FATURAMENTO: undefined,
            MARGEM: undefined,
            MARKUP_BRUTO: undefined,
            MARKUP_LIQUIDO: undefined,
            VISITA: undefined,
        };
        return Object.keys(objTipos) as TargetType[];
    },
    retornaTextoTipoMeta: (tipo: TargetType) => {
        switch (tipo) {
            case TargetType.FATURAMENTO:
                return "Faturamento";
            case TargetType.MARGEM:
                return "Margem Bruta";
            case TargetType.MARKUP_BRUTO:
                return "Markup Bruto";
            case TargetType.MARKUP_LIQUIDO:
                return "Markup Líquido";
            case TargetType.VALOR_VENDA:
                return "Valor da Venda";
            case TargetType.VISITA:
                return "Saídas";
        }
    },
    returnEstadosVenda: (): SaleStatus[] => {
        return Object.values(SaleStatus) as SaleStatus[];
    },
    returnTextoEstadoVenda: (estado: SaleStatus) => {
        switch (estado) {
            case SaleStatus.INITIAL:
                return "Inicial";
            case SaleStatus.BILLING_AUDIT:
                return "Auditoria faturamento";
            case SaleStatus.FINANCIAL_AUDIT:
                return "Auditoria financeira";
            case SaleStatus.AVAILABLE_PAYMENT:
                return "Disponível para pagamento";
            case SaleStatus.PAID:
                return "Pago";
        }
    },
    retornaArrayTipoMoeda: (): CurrencyType[] => {
        const objTipoMoeda: { [Key in CurrencyType]: undefined } = { BRL: undefined, USD: undefined };
        return Object.keys(objTipoMoeda) as CurrencyType[];
    },
    retornaTextoTipoMoeda: (tipoMoeda: CurrencyType): string => {
        switch (tipoMoeda) {
            case CurrencyType.BRL:
                return "Real";
            case CurrencyType.USD:
                return "Dólar";
        }
    },
    returnDashboardMetrics: (): DashboardMetric[] => {
        return Object.values(DashboardMetric) as DashboardMetric[];
    },
    returnDashboardMetricKey: (value: DashboardMetric): DashboardMetricKey => {
        const mapDashboardMetricKeyByValue = Object.keys(DashboardMetric).reduce(
            (acc, key) => {
                return { ...acc, [DashboardMetric[key as DashboardMetricKey]]: key };
            },
            {} as Record<DashboardMetric, DashboardMetricKey>
        );
        return mapDashboardMetricKeyByValue[value];
    },
    retornaCifraoMoeda,
    palavraSimilar: (palavra: string, similares: string[]): boolean => {
        for (let similar of similares) {
            if (palavra.toLowerCase().includes(similar.toLowerCase())) return true;
        }
        return false;
    },
    limitString: (texto: string, tamanho: number): string => {
        if (!texto) return "";
        return texto.length > tamanho ? texto.slice(0, tamanho) + "..." : texto;
    },
    retornaMensagemErro: (error: any): string => {
        const msg = error?.response?.data?.message ?? error?.message ?? "Erro desconhecido.";
        const codigo = error?.response?.status ?? error?.code ?? "Erro";
        return `${codigo}: ${msg}`;
    },
    retornaDataDMA: (data: Date): string => {
        return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    },
    retornaDataMA: (data: Date): string => {
        return data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    },
    retornaDataA: (data: Date): string => {
        return data.toLocaleDateString("pt-BR", { year: "numeric" });
    },
    retornaDataM: (data: Date): string => {
        return data.toLocaleDateString("pt-BR", { month: "long" });
    },
    base64ToFile: (base64String: string, fileName: string, mimeType?: string): File => {
        const byteCharacters = atob(base64String.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        return new File([byteArray], fileName, { type: mimeType || "application/octet-stream" });
    },
    retornaTiposMoedaObjeto: (): { valor: CurrencyType; texto: string }[] => {
        const tempMoedasObject: { [key in CurrencyType]: undefined } = { BRL: undefined, USD: undefined };
        return (Object.keys(tempMoedasObject) as CurrencyType[]).map((tipoMoeda) => ({
            valor: tipoMoeda,
            texto: tipoMoeda === CurrencyType.BRL ? "Real" : "Dolar",
        }));
    },
    retornaDataAtual: (props: {
        diasAdicionais?: number;
        mesesAdicionais?: number;
        anosAdicionais?: number;
        hora?: number;
        minutos?: number;
        segundos?: number;
        millisegundos?: number;
    }) => {
        const dataAtual = new Date();
        if (props.diasAdicionais !== undefined) dataAtual.setDate(dataAtual.getDate() + props.diasAdicionais);
        if (props.mesesAdicionais !== undefined) dataAtual.setMonth(dataAtual.getMonth() + props.mesesAdicionais);
        if (props.anosAdicionais !== undefined) dataAtual.setFullYear(dataAtual.getFullYear() + props.anosAdicionais);
        if (props.hora !== undefined) dataAtual.setHours(props.hora);
        if (props.minutos !== undefined) dataAtual.setMinutes(props.minutos);
        if (props.segundos !== undefined) dataAtual.setSeconds(props.segundos);
        if (props.millisegundos !== undefined) dataAtual.setMilliseconds(props.millisegundos);
        dataAtual.setMilliseconds(0);
        return dataAtual;
    },
    retornaData: (props: {
        dia?: number;
        mes?: number;
        ano?: number;
        hora?: number;
        minutos?: number;
        segundos?: number;
        miliSeg?: number;
    }) => {
        const data = new Date();
        if (props.dia !== undefined) data.setDate(props.dia);
        if (props.mes !== undefined) data.setMonth(props.mes);
        if (props.ano !== undefined) data.setFullYear(props.ano);
        if (props.hora !== undefined) data.setHours(props.hora);
        if (props.minutos !== undefined) data.setMinutes(props.minutos);
        if (props.segundos !== undefined) data.setSeconds(props.segundos);
        if (props.miliSeg !== undefined) data.setMilliseconds(props.miliSeg);
        return data;
    },
    retornaPeriodoMeta: (meta: Target): string => {
        let mesInicial = utils.retornaDataM(meta.dataInicioMeta);
        const anoInicial = utils.retornaDataA(meta.dataInicioMeta);
        let mesFinal = utils.retornaDataM(meta.dataFimMeta);
        const anoFinal = utils.retornaDataA(meta.dataFimMeta);

        //Formatando mes inicial
        mesInicial = mesInicial[0].toUpperCase() + mesInicial.slice(1);
        mesFinal = mesFinal[0].toUpperCase() + mesFinal.slice(1);
        return `${mesInicial}, ${anoInicial} - ${mesFinal}, ${anoFinal}`;
    },
    datasPorMesesAno: (mesInicial?: string | null, mesFinal?: string | null, ano?: string | null) => {
        //This function gets the date from props and verifies its state and value
        const faltamValores = !mesInicial || !mesFinal || !ano;
        const anoErrado = isNaN(Number(ano)) || !Number.isInteger(Number(ano));
        const mesesErrados =
            isNaN(Number(mesInicial)) ||
            isNaN(Number(mesFinal)) ||
            !Number.isInteger(Number(mesInicial)) ||
            !Number.isInteger(Number(mesFinal));

        if (faltamValores || anoErrado || mesesErrados) return {}; //If mesInicial=null, exits

        const dataInicial = utils.retornaData({
            dia: 1,
            mes: Number(mesInicial),
            ano: Number(ano),
            hora: 0,
            minutos: 0,
            segundos: 0,
            miliSeg: 0,
        });
        const dataFinal = utils.retornaData({
            dia: 1,
            mes: Number(mesFinal),
            ano: Number(ano),
            hora: 23,
            minutos: 59,
            segundos: 59,
            miliSeg: 999,
        });

        dataFinal?.setMonth(dataFinal.getMonth() + 1);
        dataFinal?.setDate(dataFinal.getDate() - 1);

        return { dataInicial, dataFinal };
    },
    retornaDatasFiltroMesAno: (meses: tMesesSelecionados | null, ano?: number | null) => {
        const possivelCalcularDatas = meses !== null && ano !== null && ano !== undefined;
        const dataInicialSelecionada = possivelCalcularDatas
            ? utils.retornaData({
                  dia: 1,
                  mes: meses.inicio,
                  ano,
                  hora: 0,
                  minutos: 0,
                  segundos: 0,
                  miliSeg: 0,
              })
            : undefined;
        const dataFinalSelecionada = possivelCalcularDatas
            ? utils.retornaData({
                  dia: 1,
                  mes: meses.fim,
                  ano,
                  hora: 23,
                  minutos: 59,
                  segundos: 59,
                  miliSeg: 999,
              })
            : undefined;
        dataFinalSelecionada?.setMonth(dataFinalSelecionada.getMonth() + 1);
        dataFinalSelecionada?.setDate(dataFinalSelecionada.getDate() - 1);
        return { dataInicialSelecionada, dataFinalSelecionada };
    },
    retornaTextoAcao: (acao: tAcao): string => {
        switch (acao) {
            case "CREATE":
                return "Criou";
            case "UPDATE":
                return "Atualizou";
            case "DELETE":
                return "Deletou";
        }
    },
    xlsx_to_json: (data: ArrayBuffer): any[] => {
        const dadosTransformados = [];
        const workbook = XLSX.read(data);
        for (let nomeDaPagina of workbook.SheetNames) {
            const dadosJSON = XLSX.utils.sheet_to_json(workbook.Sheets[nomeDaPagina], { defval: "" });
            dadosTransformados.push(...dadosJSON);
        }
        return dadosTransformados;
    },
    json_to_xlsx_url: (nomePlanilha: string, data: any[]): string => {
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, nomePlanilha);

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        return url;
    },
    retornaNovaVisitaDeVisita: (visita: NewVisit): NewVisit => {
        return {
            clienteId: visita.clienteId,
            dataVisita: visita.dataVisita,
            salePersonId: visita.salePersonId,
            comentarios: visita.comentarios,
            remoto: visita.remoto,
            visitaPaga: visita.visitaPaga ?? false,
            gastos: visita.gastos,
        };
    },
    getEditUserByUserRoleDataFromUserRole: (userRole: UserRole): EditUserByUserRoleData => {
        return { name: userRole.user.name, email: userRole.user.email, role: userRole.role, userRoleId: userRole.id };
    },
    deStringPara: <T>(value: any, type: "number" | "date" | "boolean"): T | undefined => {
        switch (type) {
            case "number":
                const num = Number(value);
                return isNaN(num) ? undefined : (num as T);
            case "date":
                const date = new Date(value);
                return isNaN(date.getTime()) ? undefined : (date as T);
            case "boolean":
                return value === "true" ? (true as T) : value === "false" ? (false as T) : undefined;
            default:
                return undefined;
        }
    },
};

export default utils;

function retornaCifraoMoeda(moeda: CurrencyType | null) {
    switch (moeda) {
        case CurrencyType.USD:
            return "US$";
        case CurrencyType.BRL:
            return "R$";
        default:
            return "$";
    }
}
