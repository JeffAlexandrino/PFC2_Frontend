//BOTOES
import BotaoPerfil from "./botoes/BotaoPerfil";
import BotaoFechar from "./botoes/BotaoFechar";
import BotaoLabel from "./botoes/BotaoLabel";
import BotaoAdicionarDado from "./botoes/BotaoAdicionarDado";
import BotaoAssincrono from "./botoes/BotaoAssincrono";
import BotaoDeletar from "./botoes/BotaoDeletar";
import BotaoEditar from "./botoes/BotaoEditar";
import BotaoVoltar from "./botoes/BotaoVoltar";
import Botao from "./botoes/Botao";
import BotaoCustom from "./botoes/BotaoCustom";
import ButtonOrganization from "./botoes/BotaoOrganizacao";
import GroupRadio from "./botoes/GroupRadio";

//CARDS
import CardLogin from "./cards/CardLogin";
import CardDashboardResumo from "./cards/CardDashboardResumo";
import CardTopClientes from "./cards/Rankings/CardTopClientes";
import CardRankCategoriasPorVenda from "./cards/Rankings/CardRankCategoriaPorVenda";
import CardTopUserRoles from "./cards/Rankings/CardTopUserRoles";
import CardTiposProdServ from "./cards/Gráficos/Visualizacoes/CardTiposProdServ";
import CardRecuperarSenha from "./cards/CardRecuperarSenha";
import CardCriarNovaSenha from "./cards/CardCriarNovaSenha";
import CardDashboard from "./cards/CardDashboard";
import EvolucaoDashboard from "./cards/Gráficos/Visualizacoes/EvolucaoDashboard";

//DROPDOWNS
import CommissionReports from "./dropdowns/commission-reports";
import DropdownMetricaDashboard from "./filtros/FilterMetricDashboard";
import VisitExpenseInfo from "./dropdowns/visit-expenses-info-per-role";
import VisitReports from "./dropdowns/visit-reports";

//FILTROS
import FiltroSelect from "../ui/filter/Filter";
import FilterUserRoleAndRole from "./filtros/FilterUserRole";
import FiltroEstadosVenda from "./filtros/FilterSaleStatus";
import FilterYears from "./filtros/FilterYear";
import FiltroMes from "./filtros/FilterMonths";

//FORM_GROUPS
import FormGroupInput from "./formGroups/FormGroupInput";
import FormGroupBoolean from "./formGroups/FormGroupBoolean";
import FormGroupSelect from "./formGroups/FormGroupSelect";
import FormGroupGeneric from "./formGroups/FormGroupGeneric";

//FORMS
import FormFornecedor from "./forms/FormFornecedor";
import FormCliente from "./forms/FormCliente";
import FormVendedor from "./forms/FormVendedor";
import FormCategoria from "./forms/FormCategoria";
import FormProduto from "./forms/FormProduto";
import FormFabricante from "./forms/FormFabricante";
import FormAdmin from "./forms/FormAdmin";
import FormServico from "./forms/FormServico";
import FormNovaSenha from "./forms/FormNovaSenha";
import FormSegmento from "./forms/FormSegmento";
import FormTipoProdutoServico from "./forms/FormTipoProdutoServico";
import FormContrato from "./forms/FormContrato";
import FormVisitaGasto from "./forms/FormVisitaGasto";
import FormUserRole from "./forms/FormUserRole";

//INFINITE_SCROLL
import InfiniteScroll from "./infiniteScroll/InfiniteScroll";

//INPUTS
import InputTexto from "./inputs/InputTexto";
import InputValores from "./inputs/InputValores";
import InputPorcentagem from "./inputs/InputPorcentagem";
import InputTextoPorcentagem from "./inputs/InputTextoPorcentagem";
import InputTextArea from "./inputs/InputTextArea";
import InputDate from "./inputs/InputDate";
import InputSenha from "./inputs/InputSenha";
import InputSearch from "./inputs/InputSearch";
import InputTelefone from "./inputs/InputTelefone";
import InputCheckbox from "./inputs/InputCheckbox";

//LINKS
import MenuLink from "./links/MenuLink";
import MyLink from "./links/MyLink";

//MODALS
import { ModalBase } from "./modals/ModalBase";
import ModalAuditoriaComissao from "./modals/ModalAuditoriaComissao";
import ModalAuditoriaCliente from "./modals/ModalAuditoriaCliente";
import ModalAuditoriaFornecedor from "./modals/ModalAuditoriaFornecedor";
import ModalAuditoriaProduto from "./modals/ModalAuditoriaProduto";
import ModalAuditoriaServico from "./modals/ModalAuditoriaServico";
import ModalAuditoriaVenda from "./modals/ModalAuditoriaVenda";
import ModalAuditoriaUser from "./modals/ModalAuditoriaUser";
import ModalImportarClientes from "./modals/ModalImportarClientes";
import ModalImportarFornecedores from "./modals/ModalImportarFornecedores";
import ModalAuditoriaVisita from "./modals/ModalAuditoriaVisita";
import ModalOrganizations from "./modals/ModalOrganizations";

//OFFCANVAS
import { OffcanvasNovoDado } from "./offcanvas/OffcanvasNovoDado";
import { OffcanvasEditarDado } from "./offcanvas/OffcanvasEditarDado";
import { OffcanvasDeletarDado } from "./offcanvas/OffcanvasDeletarDado";
import OffcanvasPerfil from "./offcanvas/OffcanvasPerfil";
import OffcanvasCliente from "./offcanvas/OffcanvasCliente";
import OffcanvasFornecedor from "./offcanvas/OffcanvasFornecedor";
import OffcanvasCategoria from "./offcanvas/OffcanvasCategoria";
import OffcanvasFabricante from "./offcanvas/OffcanvasFabricante";
import OffcanvasSegmento from "./offcanvas/OffcanvasSegmento";
import OffcanvasProduto from "./offcanvas/OffcanvasProduto";
import OffcanvasServico from "./offcanvas/OffcanvasServico";
import OffcanvasTipoProdutoServico from "./offcanvas/OffcanvasTipoProdutoServico";
import OffcanvasFormaPagamento from "./offcanvas/OffcanvasFormaPagamento";
import OffcanvasVisita from "./offcanvas/OffcanvasVisitaCreate";
import OffcanvasContrato from "./offcanvas/OffcanvasContrato";
import OffcanvasOrganization from "./offcanvas/OffcanvasOrganization";

//SELECTS
import SelectMenu from "./selects/SelectMenu";
import SelectCategoria from "./selects/SelectCategoria";
import SelectFabricante from "./selects/SelectFabricante";
import SelectFornecedor from "./selects/SelectFornecedor";
import SelectCliente from "./selects/SelectCliente";
import SelectProduto from "./selects/SelectProduto";
import SelectServico from "./selects/SelectServico";
import SelectSegmento from "./selects/SelectSegmento";
import SelectTipoProdutoServico from "./selects/SelectTipoProdutoServico";
import SelectFormaPagamento from "./selects/SelectFormaPagamento";
import SelectVendedoresPorDistComissao from "./selects/SelectVendedoresPorDistComissao";
import SelectContrato from "./selects/SelectContrato";

//SPAN
import * as Span from "../components/span" //Chama todos os spans da pasta de uma vez só

//TIMELINE
import TimeLine from "./timeline/Timeline";

//TOASTS
import Alerta from "./toasts/Alerta";

export {
    //BOTOES
    BotaoPerfil,
    BotaoFechar,
    BotaoLabel,
    BotaoAdicionarDado,
    BotaoAssincrono,
    BotaoDeletar,
    BotaoEditar,
    BotaoVoltar,
    Botao,
    BotaoCustom,
    ButtonOrganization,
    GroupRadio,

    //CARDS
    CardLogin,
    CardDashboardResumo,
    CardTopClientes,
    CardRankCategoriasPorVenda,
    CardTopUserRoles as CardTopVendedores,
    CardTiposProdServ,
    CardRecuperarSenha,
    CardCriarNovaSenha,
    CardDashboard,
    EvolucaoDashboard,

    //DROPDOWNS
    CommissionReports,
    DropdownMetricaDashboard,
    VisitExpenseInfo,
    VisitReports,

    //FILTROS
    FiltroSelect,
    FilterUserRoleAndRole,
    FiltroEstadosVenda,
    FilterYears as FiltroAnos,
    FiltroMes,

    //FORM_GROUPS
    FormGroupInput,
    FormGroupBoolean,
    FormGroupSelect,
    FormGroupGeneric,

    //FORMS
    FormVendedor,
    FormCliente,
    FormFornecedor,
    FormCategoria,
    FormProduto,
    FormFabricante,
    FormAdmin,
    FormServico,
    FormNovaSenha,
    FormSegmento,
    FormTipoProdutoServico,
    FormContrato,
    FormVisitaGasto,
    FormUserRole,

    //INFINITE_SCROLL
    InfiniteScroll,

    //INPUTS
    InputTexto,
    InputValores,
    InputPorcentagem,
    InputTextoPorcentagem,
    InputTextArea,
    InputDate,
    InputSenha,
    InputSearch,
    InputTelefone,
    InputCheckbox,

    //LINKS
    MenuLink,
    MyLink,

    //MODALS
    ModalBase,
    ModalAuditoriaComissao,
    ModalAuditoriaCliente,
    ModalAuditoriaFornecedor,
    ModalAuditoriaProduto,
    ModalAuditoriaServico,
    ModalAuditoriaVenda,
    ModalAuditoriaUser,
    ModalImportarClientes,
    ModalImportarFornecedores,
    ModalAuditoriaVisita,
    ModalOrganizations as ModalEmpresaRole,

    //OFFCANVAS
    OffcanvasPerfil,
    OffcanvasNovoDado,
    OffcanvasEditarDado,
    OffcanvasDeletarDado,
    OffcanvasCliente,
    OffcanvasFornecedor,
    OffcanvasCategoria,
    OffcanvasFabricante,
    OffcanvasSegmento,
    OffcanvasProduto,
    OffcanvasServico,
    OffcanvasTipoProdutoServico,
    OffcanvasFormaPagamento,
    OffcanvasVisita,
    OffcanvasContrato,
    OffcanvasOrganization,

    //SELECTS
    SelectMenu,
    SelectCategoria,
    SelectFabricante,
    SelectFornecedor,
    SelectCliente,
    SelectProduto,
    SelectServico,
    SelectSegmento,
    SelectTipoProdutoServico,
    SelectFormaPagamento,
    SelectVendedoresPorDistComissao,
    SelectContrato,

    //SPAN
    Span, //Chama todos os spans que estão na pasta "../components/span"

    //TIMELINE
    TimeLine,

    //TOASTS
    Alerta,
};
