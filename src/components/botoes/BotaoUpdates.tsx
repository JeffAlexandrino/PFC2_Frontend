import { Button } from "react-bootstrap";
import { useState } from "react";
import Modal from "../../ui/modal";

type Props = {
    onOpenNews?: () => void;
    onManage?: () => void;
};

const UPDATES = [
    {
        version: "v10.3.0",
        date: "14/07/2026",
        changes: [
            "Inclusão de indicador consolidado de metas corporativas na tela Dashboard > Metas.",
            "Inclusão de indicador consolidado de metas corporativas na tela Metas.",
            "Revisão e aprimoramento da interface do componente de metas dos vendedores.",
            "Padronização da nomenclatura operacional, substituindo Visitas por Saídas.",
            "Implementação do atributo Tipo de Saída, com suporte a filtragem e ordenação na consulta de registros.",
            "Inclusão da métrica Quantidade de Vendas nos rankings analíticos de clientes e vendedores.",
            "Atualização da documentação funcional e dos manuais do sistema.",
        ],
    },
    {
        version: "v10.2.2",
        date: "01/06/2026",
        changes: [
            "Novo design para todas as sub-telas de dashboard.",
            "Foi criada nova aba para Metas dos usuários.",
            "Correção de auditoria das Visitas.",
            "Adicionado o quanto foi gasto com cada cliente em visitas.",
            "Apenas Administradores e Gerentes podem auditar.",
            "Atualização de manuais.",
        ],
    },
    {
        version: "v10.2.1",
        date: "19/05/2026",
        changes: [
            "Adiciona Origem aos clientes.",
            "Proibe Monitor de trocar de papel.",
            "Checagens de permissão",
            "Visibilidade e ordenação de botões de ação.",
            "Pequenos bugs:\n      - Variável de estado ao deletar vendas.\n      - Variantes de botões de adicionar/editar/excluir em distribuição)",
            "Ajustes gerais de interface e textos.",
        ],
    },
    {
        version: "v10.2.0",
        date: "04/05/2026",
        changes: [
            "Adicionada a coluna Responsável pelo na aba Clientes.\n      - O responsável é definido automaticamente no momento da criação do cliente.",
            "Quando o papel do usuário for Monitor, os valores da Dashboard não serão exibidos.",
            "Padronização do estilo visual na listagem de filtros.",
            "Ao trocar de papel, o usuário será redirecionado automaticamente para a Dashboard.",
            "Atualizações de permissões por papel:\n      - Arquiteto de Soluções: removida a permissão para edição de clientes.\n      - Analista de Comissão: pode editar clientes e adicionar segmentos.\n      - Vendedor: pode criar e editar clientes, sem restrição de campos.",
            "Ajustes gerais de interface e textos.",
            "Atualização dos links para os manuais e guia rápido.",
        ],
    },
    {
        version: "v10.1.9",
        date: "20/04/2026",
        changes: [
            "Ajuste de títulos dos cards e adicionado estilos para item selecionado em listas de filtros.",
            "Atualiza os filtros para usar o componente compartilhado, simplifica opções de ano e ajustes visuais de status de venda.",
            "Filtros de listagem com nova aparencia, incluindo destaque para item selecionado e padronização com todo o sistema.",
            "Ajustes de permissões.",
            "Ajustes de UI/texto.",
        ],
    },
    {
        version: "v10.1.8",
        date: "30/03/2026",
        changes: [
            "Integra uma nova subview Metas no dashboard, com botão para alternar a visualização, além de implementar a UI de listagem e agrupamento de metas.",
            "Adiciona mensagens de estado vazio para os gráficos e rankings do dashboard quando não houver dados disponíveis.",
            "Ajustes de UI/texto.",
        ],
    },
    {
        version: "v10.1.7",
        date: "23/03/2026",
        changes: [
            "Sub-telas de gráficos, ranks e metas na aba Dashboard.",
            "Diversas correções de UI, textos e estilos: rótulos de data, textos informativos, classes de borda/cor, capitalização e ajustes de escrita em vários componentes.",
        ],
    },
    {
        version: "v10.1.6",
        date: "04/03/2026",
        changes: [
            "Quando o usuário for pagar todas as comissões, pelo Pagar Todas, baixar o relatório de todas as comissões pagas com aquele filtro automático.",
            "Corrigido bug onde não permitia clonar vendas que estão com estado de venda Pago.",
            "Impedido a desativação de usuários com comissões não pagas.",
        ],
    },
    {
        version: "v10.1.5",
        date: "28/02/2026",
        changes: [
            "Arrumado filtro de Num. CRM.",
            "Corrigido ausência das opções Aprovar e Marcar como pago no menu contextual da aba de Comissões.",
            "Adicionado campo de Spam no Num. CRM mostrando a nota fiscal e o seu número de crm.",
            "Adicionado campo de Spam no Núm. Pedido Distribuidor mostrando a nota fiscal e os números dos pedidos do distribuidor.",
        ],
    },
    {
        version: "v10.1.4",
        date: "20/02/2026",
        changes: [
            "Adicionado guia rápido no onboarding.",
            "Adicionado Markup Líquido em Valores na aba Vendas.",
            "Mostrar Marcar pago pelo distribuidor APENAS quando a venda estiver com estado de Disponível.",
        ],
    },
    {
        version: "v10.1.3",
        date: "11/02/2026",
        changes: [
            "Adicionado botão que mostra as recentes atualizações do sistema.",
            "Correção que permite pagar comissão quando o estado de venda estiver como Pago.",
            "Não é mais possível por a venda como Pago quando a venda tiver comissões não pagas.",
        ],
    },
    {
        version: "v10.1.2",
        date: "03/02/2026",
        changes: [
            "Mostra o vendedor IS em vendas antigas.",
            "Trata a reatribuição de vendas para administradores ou gerentes quando aplicável.",
        ],
    },
    {
        version: "v10.1.1",
        date: "29/01/2026",
        changes: [
            "Corrige erros de português no texto informativo das métricas de data da venda.",
            "Padroniza os rótulos de papéis de usuário do plural para o singular em testes e na interface.",
            "Melhora a exibição de pessoas na venda ao tratar casos sem vendedores atribuídos, exibindo uma mensagem clara.",
        ],
    },
    {
        version: "v10.1.0",
        date: "19/01/2026",
        changes: [
            "Adicionado exibição de valor da cotação (USD -> REAL) ao adicionar novo produto ou serviço.",
            "Adicionado botões para upload de boletos, notas fiscais e ordem de compras através do sharepoint.",
            "Melhora a clareza e a consistência em português, incluindo capitalização e formulação das frases.",
            "Uso de mensagens mais detalhadas e consistentes.",
        ],
    },
    {
        version: "v10.0.8",
        date: "09/01/2026",
        changes: [
            "Padronização da forma que a cotação é exibida.",
            "Adiciona uma nova visualização de distribuições.",
            "Ajustes de UI/UX.",
            "Atualiza links da documentação.",
        ],
    },
];

export default function BotaoUpdates({ onOpenNews, onManage }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));

    return (
        <div className="d-flex align-items-center gap-2 footer-novidades">
            <Button variant="outline-light" onClick={() => setShowModal(true)}>
                Atualizações
            </Button>
            <Modal.Root show={showModal} onHide={() => setShowModal(false)}>
                <div
                    style={{
                        border: "2px solid #015ca2",
                        borderRadius: "5px",
                        boxShadow: "1px 10px 25px",
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#015ca2", fontWeight: 600 }}>Atualizações do Sistema</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
                            {UPDATES.map((update, index) => (
                                <div
                                    key={index}
                                    className="mb-2"
                                    style={{
                                        borderLeft: "3px solid #015ca2",
                                        borderRadius: "6px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        className="d-flex justify-content-between align-items-center px-3 py-2"
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                        onClick={() => toggle(index)}
                                    >
                                        <h6 className="mb-0 fw-bold">{update.version}</h6>
                                        <div className="d-flex align-items-center gap-3">
                                            <small className="text-muted">{update.date}</small>
                                            <span style={{ fontSize: "0.75rem", color: "#015ca2" }}>
                                                {openIndex === index ? "▲" : "▼"}
                                            </span>
                                        </div>
                                    </div>

                                    {openIndex === index && (
                                        <>
                                            <hr className="my-0" />
                                            <ul className="mb-0 ps-4 py-2">
                                                {update.changes.map((change, idx) => (
                                                    <li key={idx} className="mb-1">
                                                        <small style={{ whiteSpace: "pre-wrap" }}>{change}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </div>
            </Modal.Root>
        </div>
    );
}
