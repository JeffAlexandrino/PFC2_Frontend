import { BotaoAdicionarDado, ModalAuditoriaProduto, OffcanvasProduto } from "../components";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TypeProductService } from "../types/type-product-service";
import { ActionTable, Column, SortTable } from "../ui/table/type";
import { ContextUser } from "../contexts/ContextUser";
import { Manufacturer } from "../types/manufacturer";
import { useSearchParams } from "react-router-dom";
import { LayoutTable } from "../layouts/table";
import { CurrencyType } from "../types/commom";
import { Category } from "../types/category";
import { Product } from "../types/product";

import useTypeProductService from "../hooks/use-type-product-service";
import useOnChangeFilter from "../hooks/use-onchange-filter";
import useManufacturer from "../hooks/use-manufacturer";
import TableConstructor from "../ui/table/constructor";
import useCategory from "../hooks/use-category";
import ProductUtil from "../utils/product.util";
import useProduct from "../hooks/use-product";
import StringUtil from "../utils/string.util";
import utils from "../utils";

import * as FilterButtons from "../components/botoes/filters";

export default function Products() {
    const [searchParams] = useSearchParams();
    const { onChangeDate, onChangeText, onClearFilters } = useOnChangeFilter();
    const { canAddProduct, canDeleteProduct } = useContext(ContextUser);

    const { findManyProducts, cancelFindManyProducts, findingProducts } = useProduct();
    const { findManyCategories, cancelFindManyCategories } = useCategory();
    const { findManyManufacturers, cancelFindManyManufacturers } = useManufacturer();
    const { findManyTypesProdServ, cancelFindManyTypesProdServ } = useTypeProductService();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [typesProdServ, setTypesProdServ] = useState<TypeProductService[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [sortMode, setSortMode] = useState<SortTable<Product> | null>(null);

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToAudit, setProductToAudit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const activedFilters = useMemo(() => ProductUtil.getFilterValuesBy(searchParams), [searchParams]);
    const activedFiltersCount = Object.values(activedFilters).filter((v) => v).length;

    const loadProducts = useCallback(() => {
        findManyProducts({
            limit: ProductUtil.DEFAULT_LIMIT_PER_PAGE,
            page: currentPage,
            where: ProductUtil.getWhereParamsBy(searchParams),
            sortBy: sortMode?.by,
            sortType: sortMode?.type,
        })
            .then(setProducts)
            .catch((err) => console.error(err));
    }, [findManyProducts, currentPage, searchParams, sortMode]);

    useEffect(() => {
        loadProducts();
        return () => cancelFindManyProducts();
    }, [cancelFindManyProducts, loadProducts]);

    useEffect(() => {
        findManyManufacturers()
            .then(setManufacturers)
            .catch((err) => console.error(err));
        findManyTypesProdServ()
            .then(setTypesProdServ)
            .catch((err) => console.error(err));
        findManyCategories()
            .then(setCategories)
            .catch((err) => console.error(err));

        return () => {
            cancelFindManyCategories();
            cancelFindManyManufacturers();
            cancelFindManyTypesProdServ();
        };
    }, [
        findManyManufacturers,
        findManyTypesProdServ,
        cancelFindManyManufacturers,
        cancelFindManyTypesProdServ,
        findManyCategories,
        cancelFindManyCategories,
    ]);

    const productTableActions = useMemo(
        (): ((product: Product) => ActionTable[]) => (product) => {
            return [
                { actionDescription: "Auditar", action: () => setProductToAudit(product) },
                { actionDescription: "Editar", action: () => setProductToEdit(product) },
                ...(canDeleteProduct({})
                    ? [{ actionDescription: "Deletar", action: () => setProductToDelete(product) }]
                    : []),
            ];
        },
        [canDeleteProduct]
    );
    const productTableColumns = useMemo((): Column<Product>[] => {
        return [
            {
                id: "name",
                headerCell: "Nome do produto",
                sortKey: "name",
                filterOpt: {
                    type: "text",
                    filterText: activedFilters.name,
                    onChange: (value) => onChangeText(ProductUtil.NAME_KEY, value),
                },
                bodyCell: (product) => product.name,
            },
            {
                id: "partNumber",
                headerCell: "PartNumber do produto",
                sortKey: "partNumber",
                filterOpt: {
                    type: "text",
                    filterText: activedFilters.partNumber,
                    onChange: (value) => onChangeText(ProductUtil.PART_NUMBER_KEY, value),
                },
                bodyCell: (product) => product.partNumber,
            },
            {
                id: "custoUnit",
                headerCell: "Custo Unitário",
                sortKey: "custoUnit",
                bodyCell: (product: Product) =>
                    utils.retornaValorMonetario(product.custoUnit ?? 0, product.tipoMoeda ?? CurrencyType.BRL),
            },
            {
                id: "fabricanteId",
                headerCell: "Fabricante",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.manufacturerId,
                    onChange: (value) => onChangeText(ProductUtil.MANUFACTURER_ID_KEY, value),
                    enums: manufacturers.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (product) => product.fabricante.name,
            },
            {
                id: "tipoProdutoServicoId",
                headerCell: "Tipo de Produto/Serviço",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.typeProdServId,
                    onChange: (value) => onChangeText(ProductUtil.TYPE_PROD_SERV_ID_KEY, value),
                    enums: typesProdServ.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (product) => product.tipoProdutoServico.name,
            },
            {
                id: "categoriaId",
                headerCell: "Categoria",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.categoryId,
                    onChange: (value) => onChangeText(ProductUtil.CATEGORY_ID_KEY, value),
                    enums: categories.map(({ name, id }) => ({ value: id, label: name })),
                },
                bodyCell: (product) => product.categoria.name,
            },
            {
                id: "tipoMoedaId",
                headerCell: "Moeda",
                filterOpt: {
                    type: "enum",
                    filterValue: activedFilters.tipoMoeda,
                    onChange: (value) => onChangeText(ProductUtil.CURRENCY_TYPE_KEY, value),
                    enums: [
                        { value: CurrencyType.BRL, label: utils.retornaTextoTipoMoeda(CurrencyType.BRL) },
                        { value: CurrencyType.USD, label: utils.retornaTextoTipoMoeda(CurrencyType.USD) },
                    ],
                },
                bodyCell: (product) => StringUtil.getCurrencyTypeDescription(product.tipoMoeda ?? CurrencyType.BRL),
            },
            {
                id: "updatedAt",
                headerCell: "Última Atualização",
                sortKey: "updatedAt",
                filterOpt: {
                    type: "date",
                    filterDatesStr: activedFilters.updatedAt,
                    onChange: (value) => onChangeDate(ProductUtil.UPDATED_AT_KEY, value),
                },
                bodyCell: (product) =>
                    product.updatedAt.toLocaleDateString("pt-Br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
        ];
    }, [typesProdServ, manufacturers, categories, activedFilters, onChangeText, onChangeDate]);

    return (
        <>
            <LayoutTable.Root>
                <LayoutTable.Header className="justify-content-between">
                    <div className="d-flex gap-2">
                        {activedFiltersCount !== 0 && (
                            <FilterButtons.ClearFilters activedFilters={activedFiltersCount} onClick={onClearFilters} />
                        )}
                    </div>
                    {canAddProduct({}) && (
                        <BotaoAdicionarDado texto="Produto" onClickAdd={() => setShowAddProduct(true)} />
                    )}
                </LayoutTable.Header>
                <LayoutTable.Body>
                    <TableConstructor
                        tableName="Produtos"
                        columns={productTableColumns}
                        data={products}
                        actions={productTableActions}
                        selection={useMemo(() => ({ dataId: "id" as keyof Product, onSelect: () => {} }), [])}
                        onChangeCurrentPage={setCurrentPage}
                        onChangeSortModeColumn={setSortMode}
                        processing={findingProducts}
                    />
                </LayoutTable.Body>
            </LayoutTable.Root>

            <OffcanvasProduto
                tipo="criar"
                mostrarForm={showAddProduct}
                onCancel={() => {
                    setShowAddProduct(false);
                }}
                onTerminou={loadProducts}
            />

            <OffcanvasProduto
                tipo="editar"
                mostrarForm={productToEdit !== null}
                onCancel={() => {
                    setProductToEdit(null);
                }}
                onTerminou={() => {
                    setProductToEdit(null);
                    loadProducts();
                }}
                dados={productToEdit}
            />

            <OffcanvasProduto
                tipo="deletar"
                mostrarForm={productToDelete !== null}
                onCancel={() => {
                    setProductToDelete(null);
                }}
                onTerminou={() => {
                    setProductToDelete(null);
                    loadProducts();
                }}
                dados={productToDelete}
            />

            <ModalAuditoriaProduto
                produto={productToAudit}
                show={productToAudit !== null}
                onHide={() => setProductToAudit(null)}
            />
        </>
    );
}
