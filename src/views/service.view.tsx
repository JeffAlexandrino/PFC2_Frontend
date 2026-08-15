import { BotaoAdicionarDado, ModalAuditoriaServico, OffcanvasServico } from "../components";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TypeProductService } from "../types/type-product-service";
import { ActionTable, Column, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { useSearchParams } from "react-router-dom";
import { LayoutTable } from "../layouts/table";
import { CurrencyType } from "../types/commom";
import { Service } from "../types/service";

import useTypeProductService from "../hooks/use-type-product-service";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import ServiceObs from "../components/span/services-obs";
import TableConstructor from "../ui/table/constructor";
import ServiceUtil from "../utils/service.util";
import StringUtil from "../utils/string.util";
import useService from "../hooks/use-service";
import utils from "../utils";

import * as FilterButtons from "../components/botoes/filters";

export default function Services() {
    const [searchParams] = useSearchParams();
    const { onChangeText, onChangeDate, onClearFilters } = useOnChangeFilter();

    const { findManyServices, cancelFindManyServices, findingServices } = useService();
    const { findManyTypesProdServ, cancelFindManyTypesProdServ } = useTypeProductService();

    //CONTEXTOS
    const { canAddService, canDeleteService, canEditService } = useContext(ContextUser);

    //ESTADOS
    const [services, setServices] = useState<Service[]>([]);
    const [typesProdServ, setTypesProdServ] = useState<TypeProductService[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Service> | null>(null);

    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [serviceToAudit, setServiceToAudit] = useState<Service | null>(null);
    const [showAddService, setShowAddService] = useState(false);

    const activedFilters = useMemo(() => ServiceUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    //EVENTOS
    const loadServices = useCallback(() => {
        findManyServices({
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
            limit: ServiceUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            where: ServiceUtil.getWhereToFindServicesFrom(searchParams),
        })
            .then(setServices)
            .catch((err) => console.error(err));
    }, [findManyServices, currentPage, searchParams, sortMode]);

    useEffect(() => {
        loadServices();
        return () => cancelFindManyServices();
    }, [cancelFindManyServices, loadServices]);

    useEffect(() => {
        findManyTypesProdServ()
            .then(setTypesProdServ)
            .catch((err) => console.error(err));

        return () => cancelFindManyTypesProdServ();
    }, [cancelFindManyTypesProdServ, findManyTypesProdServ]);

    const serviceTableActions = useMemo(
        (): ((service: Service) => ActionTable[]) => (service) => {
            return [
                { actionDescription: "Auditar", action: () => setServiceToAudit(service) },
                ...(canEditService({})
                    ? [
                          {
                              actionDescription: "Editar",
                              action: () => setServiceToEdit(service),
                          },
                      ]
                    : []),
                ...(canDeleteService({})
                    ? [
                          {
                              actionDescription: "Deletar",
                              action: () => setServiceToDelete(service),
                          },
                      ]
                    : []),
            ];
        },
        [canEditService, canDeleteService]
    );

    const serviceTableColumns = useMemo((): Column<Service>[] => {
        return [
            {
                id: "name",
                headerCell: "Nome do serviço",
                sortKey: "name",
                filterOpt: {
                    type: "text",
                    filterText: activedFilters.name,
                    onChange: (filterText) => onChangeText(ServiceUtil.NAME_KEY, filterText),
                },
                bodyCell: (service) => service.name,
            },
            {
                id: "valorCustoHora",
                headerCell: "Custo da hora",
                sortKey: "valorCustoHora",
                bodyCell: (service) =>
                    utils.retornaValorMonetario(service.valorCustoHora, service.tipoMoeda ?? CurrencyType),
            },
            {
                id: "tipoProdutoServicoId",
                headerCell: "Tipo de Produto/Serviço",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.typeProdServId,
                    onChange: (filterValue) => onChangeText(ServiceUtil.TYPE_PROD_SERV_ID_KEY, filterValue),
                    enums: typesProdServ.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (service) => service.tipoProdutoServico.name,
            },
            {
                id: "tipoMoedaId",
                headerCell: "Moeda",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.tipoMoeda,
                    onChange: (value) => onChangeText(ServiceUtil.CURRENCY_TYPE_KEY, value),
                    enums: [
                        { value: CurrencyType.BRL, label: "Real" },
                        { value: CurrencyType.USD, label: "Dólar" },
                    ],
                },
                bodyCell: (service) => StringUtil.getCurrencyTypeDescription(service.tipoMoeda),
            },
            {
                id: "observacoes",
                headerCell: "Observação",
                filterOpt: {
                    type: "text",
                    filterText: activedFilters.observations,
                    onChange: (filterValue) => onChangeText(ServiceUtil.OBSERVATIONS_KEY, filterValue),
                },
                bodyCell: (service) => <ServiceObs observacao={service.observacoes} />,
            },
            {
                id: "updatedAt",
                sortKey: "updatedAt",
                headerCell: "Última Atualização",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(ServiceUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (service) =>
                    service.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [typesProdServ, onChangeDate, onChangeText, activedFilters]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddService({}) && (
                        <BotaoAdicionarDado texto="Serviço" onClickAdd={() => setShowAddService(true)} />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <TableConstructor
                        onChangeSortModeColumn={setSortMode}
                        onChangeCurrentPage={setCurrentPage}
                        columns={serviceTableColumns}
                        tableName="Serviços"
                        data={services}
                        actions={serviceTableActions}
                        selection={useMemo(() => ({ dataId: "id" as keyof Service, onSelect: () => {} }), [])}
                        processing={findingServices}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <OffcanvasServico
                tipo="criar"
                mostrarForm={showAddService}
                onCancel={() => {
                    setShowAddService(false);
                }}
                onTerminou={loadServices}
            />
            <OffcanvasServico
                tipo="editar"
                mostrarForm={serviceToEdit !== null}
                onCancel={() => {
                    setServiceToEdit(null);
                }}
                onTerminou={() => {
                    setServiceToEdit(null);
                    loadServices();
                }}
                dados={serviceToEdit}
            />
            <OffcanvasServico
                tipo="deletar"
                mostrarForm={serviceToDelete !== null}
                onCancel={() => {
                    setServiceToDelete(null);
                }}
                onTerminou={() => {
                    setServiceToDelete(null);
                    loadServices();
                }}
                dados={serviceToDelete}
            />

            <ModalAuditoriaServico
                servico={serviceToAudit}
                show={serviceToAudit !== null}
                onHide={() => setServiceToAudit(null)}
            />
        </>
    );
}
