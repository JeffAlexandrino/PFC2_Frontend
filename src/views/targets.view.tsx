import MetaCardVendedor from "../components/meta-card/meta-card-vendedor";
import CardMetaEmpresa from "../components/cards/CardMetaEmpresa";
import useTargetEmpresa from "../hooks/use-target-empresa";
import UserRoleUtil from "../utils/user-role.util";
import FrontRoutes from "../lib/front-routes";
import useTarget from "../hooks/use-target";
import useUser from "../hooks/use-user";
import utils from "../utils";

import { Button, Card, Col, Container, Form, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BotaoAdicionarDado, InfiniteScroll } from "../components";
import { OrganizationTarget } from "../types/organization-targets";
import { tPossivelMes } from "../components/filtros/FilterMonths";
import { OffcanvasForm } from "../components/offcanvas-form";
import { ContextUser } from "../contexts/ContextUser";
import { SEARCH_PARAMS_KEY } from "../lib/constants";
import { CurrencyType, Role } from "../types/commom";
import { Target, TargetType } from "../types/target";
import { UserRole } from "../types/user-role";
import { LayoutInfo } from "../layouts";
import { User } from "../types/user";

export default function Targets() {
    const { canAddTarget, canUpdateTarget, canDeleteTarget, canReadTarget } = useContext(ContextUser);
    const { getOneUser, gettingOneUser, cancelGetOneUser, findManyUsers, cancelFindManyUsers, findingUsers } =
        useUser();
    const { findManyTargets, findingManyTargets, cancelFindManyTargets } = useTarget();
    const {
        findManyTargetsEmpresa,
        cancelFindManyTargetsEmpresa,
        updateTargetEmpresa,
        updatingTargetEmpresa,
        createTargetsEmpresa,
        creatingTargetsEmpresa,
    } = useTargetEmpresa();

    const [user, setUser] = useState<User | null>(null);

    const [allTargets, setAllTargets] = useState<Target[]>([]);
    const [targets, setTargets] = useState<Target[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [nextPage, setNextPage] = useState(1);
    const [targetsEmpresa, setTargetsEmpresa] = useState<OrganizationTarget[]>([]);

    const [targetTypeSelected, setTargetTypeSelected] = useState<TargetType>(TargetType.FATURAMENTO);
    const [empresaTargetTypeSelected, setEmpresaTargetTypeSelected] = useState<TargetType>(TargetType.FATURAMENTO);
    const [userRoleSelected, setUserRoleSelected] = useState<Omit<UserRole, "user" | "userRoles"> | null>(null);

    const [showAddTarget, setShowAddTarget] = useState(false);
    const [targetUpdating, setTargetUpdating] = useState<Target | null>(null);
    const [targetDeleting, setTargetDeleting] = useState<Target | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const params = useParams();
    const userId = params.id;
    const userComercialRoles = user?.userRoles.filter(({ role }) => UserRoleUtil.isComercialRole(role));

    const initMonthParam = searchParams.get(SEARCH_PARAMS_KEY.INIT_MONTH);
    const endMonthParam = searchParams.get(SEARCH_PARAMS_KEY.END_MONTH);
    const yearParam = searchParams.get(SEARCH_PARAMS_KEY.YEAR);

    const initMonth = (initMonthParam ? Number(initMonthParam) : 0) as tPossivelMes;
    const endMonth = (endMonthParam ? Number(endMonthParam) : 11) as tPossivelMes;
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    const { dataInicialSelecionada: initDate, dataFinalSelecionada: endDate } = useMemo(() => {
        return utils.retornaDatasFiltroMesAno({ inicio: initMonth, fim: endMonth }, year);
    }, [initMonth, endMonth, year]);

    const loadUser = useCallback(() => {
        if (!userId) return;
        getOneUser(userId)
            .then((user) => {
                if (!user) return;

                setUser(user);
                const userComercialRoles = user.userRoles.filter(({ role }) => UserRoleUtil.isComercialRole(role));
                const userRoleReadableTarget = userComercialRoles.find(({ id, role }) =>
                    canReadTarget({ userRoleId: id, userRole: role })
                );
                setUserRoleSelected(userRoleReadableTarget ?? null);
            })
            .catch(console.error);
    }, [userId, getOneUser, canReadTarget]);

    const loadUsers = useCallback(() => {
        findManyUsers({ limit: 50, page: 0 })
            .then((users) => {
                const commercialUsers = users.filter((user) =>
                    user.userRoles.some(
                        ({ id, role }) =>
                            UserRoleUtil.isComercialRole(role) && canReadTarget({ userRoleId: id, userRole: role })
                    )
                );
                setUsers(commercialUsers);
            })
            .catch(console.error);
    }, [findManyUsers, canReadTarget]);

    useEffect(() => {
        if (userId) return;

        loadUsers();
        return () => cancelFindManyUsers();
    }, [userId, loadUsers, cancelFindManyUsers]);

    const loadTargets = useCallback(
        async (page?: number) => {
            if (!userRoleSelected) return 0;

            try {
                const targets = await findManyTargets({
                    limit: 25,
                    page,
                    where: { userRoleId: userRoleSelected.id, userRole: userRoleSelected.role },
                });
                if (page === undefined) {
                    setTargets(targets);
                    setCurrentPage(0);
                    setNextPage(1);
                } else setTargets((prev) => [...prev, ...targets]);

                return targets.length;
            } catch (err) {
                throw err;
            }
        },
        [findManyTargets, userRoleSelected]
    );

    const loadTargetsEmpresa = useCallback(async () => {
        try {
            const where =
                initDate && endDate
                    ? {
                          dataInicioMeta: initDate.toISOString(),
                          dataFimMeta: endDate.toISOString(),
                      }
                    : undefined;

            const targetsEmp = await findManyTargetsEmpresa({
                limit: 100,
                where,
            });
            setTargetsEmpresa(targetsEmp);
            return targetsEmp.length;
        } catch (err) {
            throw err;
        }
    }, [findManyTargetsEmpresa, initDate, endDate]);

    useEffect(() => {
        loadUser();
        return () => cancelGetOneUser();
    }, [userId, loadUser, cancelGetOneUser]);

    useEffect(() => {
        if (!userRoleSelected) return;

        loadTargets().catch(console.error);
        return () => cancelFindManyTargets();
    }, [userRoleSelected, loadTargets, cancelFindManyTargets, user]);

    useEffect(() => {
        loadTargetsEmpresa().catch(console.error);
        return () => cancelFindManyTargetsEmpresa();
    }, [loadTargetsEmpresa, cancelFindManyTargetsEmpresa]);

    const empresaTargetsByType = useMemo(() => {
        return targetsEmpresa
            .filter((target) => {
                if (!initDate || !endDate) return true;

                const targetStart = target.dataInicioMeta ? new Date(target.dataInicioMeta) : undefined;
                const targetEnd = target.dataFimMeta ? new Date(target.dataFimMeta) : undefined;
                if (!targetStart || !targetEnd) return false;

                return targetStart <= endDate && targetEnd >= initDate;
            })
            .flatMap((target) => target.tiposMeta.filter((tipo) => tipo.tipoMeta === empresaTargetTypeSelected));
    }, [targetsEmpresa, empresaTargetTypeSelected, initDate, endDate]);

    const empresaMetaGlobalAnual = empresaTargetsByType.reduce((sum, item) => sum + (item.valorMeta ?? 0), 0);
    const empresaMetaAtingidaAtual = useMemo(() => {
        return allTargets.reduce((sum, target) => {
            if (initDate && endDate) {
                const targetStart = target.dataInicioMeta ? new Date(target.dataInicioMeta) : undefined;
                const targetEnd = target.dataFimMeta ? new Date(target.dataFimMeta) : undefined;
                const dentroDoPeriodo = targetStart && targetEnd && targetStart <= endDate && targetEnd >= initDate;
                if (!dentroDoPeriodo) return sum;
            }

            const targetByType = target.tiposMeta?.find((tipo) => tipo.tipoMeta === empresaTargetTypeSelected);
            return sum + (targetByType?.valorAtingido ?? 0);
        }, 0);
    }, [allTargets, empresaTargetTypeSelected, initDate, endDate]);

    const handleUpdateTargetEmpresa = useCallback(
        async (metaGlobalAnual: number) => {
            if (!initDate || !endDate) return;

            const targetToUpdate = targetsEmpresa.find((target) => {
                const targetStart = target.dataInicioMeta ? new Date(target.dataInicioMeta) : undefined;
                const targetEnd = target.dataFimMeta ? new Date(target.dataFimMeta) : undefined;
                if (!targetStart || !targetEnd) return false;

                const isInsideSelectedPeriod = targetStart <= endDate && targetEnd >= initDate;
                const hasSelectedType = target.tiposMeta.some((tipo) => tipo.tipoMeta === empresaTargetTypeSelected);
                return isInsideSelectedPeriod && hasSelectedType;
            });

            try {
                if (!targetToUpdate) {
                    await createTargetsEmpresa([
                        {
                            dataInicioMeta: initDate,
                            dataFimMeta: endDate,
                            tiposMeta: Object.values(TargetType).map((tipoMeta) => ({
                                tipoMeta,
                                valorMeta: tipoMeta === empresaTargetTypeSelected ? metaGlobalAnual : 0,
                            })),
                        },
                    ]);
                    await loadTargetsEmpresa();
                    return;
                }

                await updateTargetEmpresa({
                    id: targetToUpdate.id,
                    dataInicioMeta: targetToUpdate.dataInicioMeta,
                    dataFimMeta: targetToUpdate.dataFimMeta,
                    tiposMeta: targetToUpdate.tiposMeta.map(({ tipoMeta, valorMeta }) => ({
                        tipoMeta,
                        valorMeta: tipoMeta === empresaTargetTypeSelected ? metaGlobalAnual : valorMeta,
                    })),
                });
                await loadTargetsEmpresa();
            } catch (err) {
                console.error(err);
            }
        },
        [
            targetsEmpresa,
            empresaTargetTypeSelected,
            initDate,
            endDate,
            createTargetsEmpresa,
            updateTargetEmpresa,
            loadTargetsEmpresa,
        ]
    );

    const loadAllTargets = useCallback(async () => {
        try {
            const targets = await findManyTargets({ limit: 1000 });
            setAllTargets(targets);
        } catch (err) {
            console.error(err);
        }
    }, [findManyTargets]);

    useEffect(() => {
        if (userId) return;
        loadAllTargets().catch(console.error);
    }, [userId, loadAllTargets]);

    const getInfoTarget = useCallback(
        (target: Target) => {
            const targetByType = target.tiposMeta?.find((type) => type.tipoMeta === targetTypeSelected);
            const targetNow = targetByType
                ? (targetByType.valorAtingido * 100) / targetByType.aceleratorTriggerValue
                : 0;
            return {
                nowMeta: targetNow,
                targetNowStr: `${targetNow.toFixed(2)}%`,
                commissionTriggerValue: targetByType?.commissionTriggerValue ?? 0,
                acceleratorTriggerValue: targetByType?.aceleratorTriggerValue ?? 0,
                achivedValue: targetByType?.valorAtingido ?? 0,
                isMonetaryTarget: targetTypeSelected !== TargetType.VISITA,
            };
        },
        [targetTypeSelected]
    );

    const handleOnSelectTab = useCallback(
        (roleTabSelected: string | null) => {
            const userRole = user?.userRoles.find(({ role }) => role === roleTabSelected);
            setUserRoleSelected(userRole ?? null);
        },
        [user]
    );

    if (!userId) {
        return (
            <LayoutInfo.Root>
                <LayoutInfo.Header />
                {canReadTarget({}) !== false && (
                    <CardMetaEmpresa
                        targets={targetsEmpresa}
                        targetTypeSelected={empresaTargetTypeSelected}
                        onTargetTypeSelected={setEmpresaTargetTypeSelected}
                        onUpdateTargetEmpresa={handleUpdateTargetEmpresa}
                        updatingTargetEmpresa={updatingTargetEmpresa || creatingTargetsEmpresa}
                        metaAtual={empresaMetaGlobalAnual}
                        metaAtingidaAtual={empresaMetaAtingidaAtual}
                        metaAtingidaAnterior={0}
                        metaGlobalAnual={empresaMetaGlobalAnual}
                    />
                )}
                <LayoutInfo.Body>
                    <Container fluid className="pt-2">
                        <Row className="g-3">
                            {users.length < 1 && !findingUsers ? (
                                <Col sm="12" className="text-center text-secondary fs-5 mt-3">
                                    Nenhum usuário disponível para metas
                                </Col>
                            ) : (
                                users.map((userItem) => {
                                    const roles = userItem.userRoles
                                        .filter(({ role }) => UserRoleUtil.isComercialRole(role))
                                        .map(({ role }) => UserRoleUtil.getRoleDescription(role))
                                        .join(", ");

                                    return (
                                        <Col sm="12" lg="6" key={userItem.id}>
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>{userItem.name}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        {userItem.email}
                                                    </Card.Subtitle>
                                                    <div className="mb-3">
                                                        <strong>Papéis:</strong> {roles || "Nenhum papel comercial"}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() =>
                                                            navigate(FrontRoutes.getTargetsUser(userItem.id))
                                                        }
                                                    >
                                                        Metas
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })
                            )}
                        </Row>
                    </Container>
                </LayoutInfo.Body>
            </LayoutInfo.Root>
        );
    }

    return (
        <>
            <LayoutInfo.Root>
                <LayoutInfo.Header>
                    <LayoutInfo.HeaderLeft carregando={gettingOneUser}>
                        <h5 className="m-0 text-truncate">{user?.name}</h5>
                    </LayoutInfo.HeaderLeft>
                    <LayoutInfo.HeaderRight />
                </LayoutInfo.Header>
                <LayoutInfo.Body>
                    <div className="w-100 h-100 pt-2" key="Tabs">
                        <Tabs activeKey={userRoleSelected?.role ?? undefined} onSelect={handleOnSelectTab}>
                            {userComercialRoles?.map((userRole) => {
                                return (
                                    canReadTarget({ userRoleId: userRole.id, userRole: userRole.role }) && (
                                        <Tab
                                            key={userRole.role}
                                            eventKey={userRole.role}
                                            title={`Metas de ${UserRoleUtil.getRoleDescription(
                                                userRole.role
                                            ).toLowerCase()}`}
                                            className="h-100"
                                        >
                                            <InfiniteScroll
                                                paginaAtual={currentPage}
                                                proximaPagina={nextPage}
                                                setPaginaAtual={setCurrentPage}
                                                setProximaPagina={setNextPage}
                                                buscando={findingManyTargets}
                                                buscar={(page) => loadTargets(page)}
                                            >
                                                <Container fluid className="pt-1 pb-3">
                                                    <Row>
                                                        <Col sm="12" className="mb-3 sticky-top bg-white pb-2 pt-2">
                                                            <Row>
                                                                <Col sm="6" xl="3">
                                                                    <Form.Label>
                                                                        Selecione o tipo de meta para visualizar
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={targetTypeSelected}
                                                                        onChange={(e) =>
                                                                            setTargetTypeSelected(
                                                                                e.target.value as TargetType
                                                                            )
                                                                        }
                                                                    >
                                                                        {Object.values(TargetType).map((targetType) => (
                                                                            <option key={targetType} value={targetType}>
                                                                                {utils.retornaTextoTipoMeta(targetType)}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Col>
                                                                {canAddTarget({ userRole: userRole.role }) && (
                                                                    <Col sm="6" xl="9" className="text-end mb-2">
                                                                        <BotaoAdicionarDado
                                                                            texto="Meta"
                                                                            onClickAdd={() => setShowAddTarget(true)}
                                                                        />
                                                                    </Col>
                                                                )}
                                                            </Row>
                                                        </Col>

                                                        {targets.length < 1 && !findingManyTargets && (
                                                            <Col
                                                                sm="12"
                                                                className="text-center text-secondary fs-5 mt-3"
                                                            >
                                                                Nenhuma meta registrada
                                                            </Col>
                                                        )}
                                                        {targets.map((target) => {
                                                            const {
                                                                nowMeta, //percAtual, number
                                                                targetNowStr, //percAtual com %, string
                                                                commissionTriggerValue, // valor para commission, number
                                                                acceleratorTriggerValue, // valor para Accelerator, number
                                                                achivedValue, // Valor Atual, number
                                                                isMonetaryTarget,
                                                            } = getInfoTarget(target);
                                                            const periodoMeta = utils.retornaPeriodoMeta(target);

                                                            return (
                                                                <>
                                                                    <Col
                                                                        sm="12"
                                                                        lg="6"
                                                                        key={target.id}
                                                                        className=" mb-3"
                                                                    >
                                                                        <Stack data-test="meta-card">
                                                                            <MetaCardVendedor
                                                                                key={periodoMeta}
                                                                                periodoMeta={periodoMeta}
                                                                                targetTypeSelected={targetTypeSelected}
                                                                                CurrencyType={CurrencyType}
                                                                                nowMeta={nowMeta}
                                                                                targetNowStr={targetNowStr}
                                                                                commissionTriggerValue={
                                                                                    commissionTriggerValue
                                                                                }
                                                                                acceleratorTriggerValue={
                                                                                    acceleratorTriggerValue
                                                                                }
                                                                                achivedValue={achivedValue}
                                                                                isMonetaryTarget={isMonetaryTarget}
                                                                            >
                                                                                <Card.Footer className="d-flex justify-content-end gap-2">
                                                                                    {canUpdateTarget({
                                                                                        userRole: userRole.role,
                                                                                    }) && (
                                                                                        <Button
                                                                                            size="sm"
                                                                                            className="rounded-pill"
                                                                                            variant="outline-primary"
                                                                                            onClick={() =>
                                                                                                setTargetUpdating(
                                                                                                    target
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Editar
                                                                                        </Button>
                                                                                    )}
                                                                                    {canDeleteTarget({
                                                                                        userRole: userRole.role,
                                                                                    }) && (
                                                                                        <Button
                                                                                            size="sm"
                                                                                            className="rounded-pill"
                                                                                            variant="outline-danger"
                                                                                            onClick={() =>
                                                                                                setTargetDeleting(
                                                                                                    target
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Deletar
                                                                                        </Button>
                                                                                    )}
                                                                                </Card.Footer>
                                                                            </MetaCardVendedor>
                                                                        </Stack>
                                                                    </Col>
                                                                </>
                                                            );
                                                        })}
                                                    </Row>
                                                </Container>
                                            </InfiniteScroll>
                                        </Tab>
                                    )
                                );
                            })}
                        </Tabs>
                    </div>
                </LayoutInfo.Body>
            </LayoutInfo.Root>

            <OffcanvasForm.Target.Manage
                show={showAddTarget || !!targetUpdating}
                targetUpdating={targetUpdating}
                userRoleId={userRoleSelected?.id}
                userRole={userRoleSelected?.role ?? Role.VENDEDOR}
                onHide={() => {
                    setShowAddTarget(false);
                    setTargetUpdating(null);
                }}
                onDone={() => {
                    setTargetUpdating(null);
                    loadTargets();
                }}
            />

            <OffcanvasForm.Target.Delete
                userRole={userRoleSelected?.role ?? Role.VENDEDOR}
                targetToDelete={targetDeleting}
                onHide={() => setTargetDeleting(null)}
                onDone={() => {
                    setTargetDeleting(null);
                    loadTargets();
                }}
            />
        </>
    );
}
