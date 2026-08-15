import MetaEmpresaGlobal from "../../components/cards/Gráficos/Indicadores/MetaEmpresaDashboard";
import CardMetaVendedores from "../../components/cards/Gráficos/Indicadores/MetaVendedores";
import MetaCardVendedor from "../../components/meta-card/meta-card-vendedor";
import useTargetEmpresa from "../../hooks/use-target-empresa";
import useTarget from "../../hooks/use-target";
import useUser from "../../hooks/use-user";
import utils from "../../utils";

import { OrganizationTarget } from "../../types/organization-targets";
import { tPossivelMes } from "../../components/filtros/FilterMonths";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCodename } from "../../lib/constants/codenames";
import { tDadosDashboard } from "../../hooks/useDashboard";
import { Card, Col, Row, Stack } from "react-bootstrap";
import { CurrencyType, Role } from "../../types/commom";
import { Target, TargetType } from "../../types/target";
import { DashboardMetric } from "../../types/dashboard";
import { User } from "../../types/user";

interface GroupedTargetsByUserAndRole {
    userId: string;
    userName: string;
    userRole: string;
    targets: Target[];
}

interface DashboardTargetsProps {
    metricaAtual: DashboardMetric;
    dados: tDadosDashboard;
    year?: number;
    initMonth?: tPossivelMes;
    endMonth?: tPossivelMes;
    role?: Role;
    userRoleId?: string;
    hideValues?: boolean;
}

export default function DashboardTargets({
    metricaAtual,
    year,
    initMonth,
    endMonth,
    role,
    userRoleId,
    hideValues,
}: DashboardTargetsProps) {
    const { findManyTargets, cancelFindManyTargets } = useTarget();
    const { findManyTargetsEmpresa } = useTargetEmpresa();
    const { findManyUsers } = useUser();

    const [allTargets, setAllTargets] = useState<Target[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [targetsEmpresa, setTargetsEmpresa] = useState<OrganizationTarget[]>([]);
    const targetTypeSelected = metricaAtual as unknown as TargetType;
    const empresaTargetTypeSelected = targetTypeSelected;

    const { dataInicialSelecionada: initDate, dataFinalSelecionada: endDate } = useMemo(() => {
        if (initMonth === undefined || endMonth === undefined || year === undefined)
            return { dataInicialSelecionada: undefined, dataFinalSelecionada: undefined };
        return utils.retornaDatasFiltroMesAno({ inicio: initMonth, fim: endMonth }, year);
    }, [initMonth, endMonth, year]);

    const loadTargets = useCallback(
        async (page?: number) => {
            try {
                const where: any = {};
                if (role) where.userRole = role;
                if (userRoleId) where.userRoleId = userRoleId;

                const targets = await findManyTargets({
                    limit: 100,
                    page,
                    where,
                });
                if (page === undefined) {
                    setAllTargets(targets);
                } else setAllTargets((prev) => [...prev, ...targets]);

                return targets.length;
            } catch (err) {
                throw err;
            }
        },
        [findManyTargets, role, userRoleId]
    );

    useEffect(() => {
        loadTargets().catch(console.error);
        return () => cancelFindManyTargets();
    }, [role, userRoleId, initDate, endDate, targetTypeSelected, cancelFindManyTargets, loadTargets]);

    useEffect(() => {
        if (allTargets.length === 0) {
            setUsers([]);
            return;
        }

        const userIds = Array.from(new Set(allTargets.map((t) => t.userRole.userId)));

        Promise.all(
            userIds.map((userId) =>
                findManyUsers({ where: { id: userId } })
                    .then((usersResult) => usersResult)
                    .catch(() => [])
            )
        )
            .then((results) => {
                const allUsers = results.flat();
                setUsers(allUsers);
            })
            .catch(console.error);
    }, [allTargets, findManyUsers]);

    const getAggregatedTargetInfo = useCallback(
        (targets: Target[]) => {
            if (!targets.length) {
                return {
                    nowMeta: 0,
                    targetNowStr: "0%",
                    commissionTriggerValue: 0,
                    acceleratorTriggerValue: 0,
                    achivedValue: 0,
                    isMonetaryTarget: targetTypeSelected !== TargetType.VISITA,
                };
            }

            let totalAchivedValue = 0;
            let totalCommissionTrigger = 0;
            let totalAcceleratorTrigger = 0;

            targets.forEach((target) => {
                const targetByType = target.tiposMeta?.find((type) => type.tipoMeta === targetTypeSelected);
                if (targetByType) {
                    totalAchivedValue += targetByType.valorAtingido ?? 0;
                    totalCommissionTrigger += targetByType.commissionTriggerValue ?? 0;
                    totalAcceleratorTrigger += targetByType.aceleratorTriggerValue ?? 0;
                }
            });

            const totalNowMeta = totalAcceleratorTrigger > 0 ? (totalAchivedValue * 100) / totalAcceleratorTrigger : 0;

            const dataInicios = targets.map((t) => t.dataInicioMeta).filter(Boolean);
            const dataFins = targets.map((t) => t.dataFimMeta).filter(Boolean);

            let periodoCombinado = "Período não definido";
            if (dataInicios.length > 0 && dataFins.length > 0) {
                const minInicio = new Date(Math.min(...dataInicios.map((d) => new Date(d).getTime())));
                const maxFim = new Date(Math.max(...dataFins.map((d) => new Date(d).getTime())));
                periodoCombinado = `${minInicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })} - ${maxFim.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
            }

            return {
                nowMeta: totalNowMeta,
                targetNowStr: `${totalNowMeta.toFixed(2)}%`,
                commissionTriggerValue: totalCommissionTrigger,
                acceleratorTriggerValue: totalAcceleratorTrigger,
                achivedValue: totalAchivedValue,
                isMonetaryTarget: targetTypeSelected !== TargetType.VISITA,
                periodoMeta: periodoCombinado,
                totalTargets: targets.length,
            };
        },
        [targetTypeSelected]
    );

    const filteredTargets = useMemo(() => {
        return allTargets.filter((target) => {
            const hasSameType = target.tiposMeta?.some((type) => type.tipoMeta === targetTypeSelected);
            if (!hasSameType) return false;

            if (!initDate || !endDate) return true;

            const targetStart = target.dataInicioMeta ? new Date(target.dataInicioMeta) : undefined;
            const targetEnd = target.dataFimMeta ? new Date(target.dataFimMeta) : undefined;

            if (!targetStart || !targetEnd) return false;

            return targetStart <= endDate && targetEnd >= initDate;
        });
    }, [allTargets, targetTypeSelected, initDate, endDate]);

    const groupedTargetsByUserAndRole = useMemo(() => {
        const grouped = new Map<string, GroupedTargetsByUserAndRole>();
        const userMap = new Map(users.map((u) => [u.id, u.name]));

        filteredTargets.forEach((target) => {
            const userId = target.userRole.userId;
            const userRole = target.userRole.role;
            const groupKey = `${userId}_${userRole}`;

            let userName;
            if (userMap.get(userId)) {
                userName = userMap.get(userId) || `Usuário Desativado`;
            } else {
                return;
            }

            if (!grouped.has(groupKey)) {
                grouped.set(groupKey, {
                    userId,
                    userName,
                    userRole,
                    targets: [],
                });
            }

            grouped.get(groupKey)?.targets.push(target);
        });

        return Array.from(grouped.values());
    }, [filteredTargets, users]);

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
        loadTargetsEmpresa().catch(console.error);
    }, [loadTargetsEmpresa]);

    const allTargetsAggregated = useMemo(() => {
        const allTargetsFlat = groupedTargetsByUserAndRole.flatMap((group) => group.targets);
        return getAggregatedTargetInfo(allTargetsFlat);
    }, [groupedTargetsByUserAndRole, getAggregatedTargetInfo]);

    const hasData = groupedTargetsByUserAndRole.length > 0;

    const empresaTargetsFiltrados = useMemo(() => {
        return targetsEmpresa.filter((target) => {
            if (!initDate || !endDate) return true;

            const targetStart = target.dataInicioMeta ? new Date(target.dataInicioMeta) : undefined;
            const targetEnd = target.dataFimMeta ? new Date(target.dataFimMeta) : undefined;

            if (!targetStart || !targetEnd) return false;

            return targetStart <= endDate && targetEnd >= initDate;
        });
    }, [targetsEmpresa, initDate, endDate]);

    const empresaTargetsByType = useMemo(() => {
        return empresaTargetsFiltrados.flatMap((target) =>
            target.tiposMeta.filter((tipo) => tipo.tipoMeta === empresaTargetTypeSelected)
        );
    }, [empresaTargetsFiltrados, empresaTargetTypeSelected]);

    const empresaMetaGlobalAnual = empresaTargetsByType.reduce((sum, item) => sum + (item.valorMeta ?? 0), 0);
    const empresaMetaAtingidaAtual = allTargetsAggregated.achivedValue;

    if (!hasData) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 text-muted">
                <i className="bi bi-bullseye fs-1" />
                <p className="fs-4 fw-semibold mb-0">Nenhum dado disponível</p>
                <p>
                    Não foram encontrados resultados para os filtros aplicados. <br />
                    Ajuste a métrica, período ou demais parâmetros para visualizar as metas.
                </p>
            </div>
        );
    }

    return (
        <>
            <Row className="mb-4">
                <Col lg={4}>
                    <CardMetaVendedores
                        metrica={metricaAtual}
                        metaAtual={allTargetsAggregated.acceleratorTriggerValue}
                        metaAtingidaAtual={allTargetsAggregated.achivedValue}
                        metaAtingidaAnterior={0}
                        hideValues={hideValues}
                    />
                </Col>
                <Col lg={8}>
                    <MetaEmpresaGlobal
                        targets={empresaTargetsFiltrados}
                        metrica={metricaAtual}
                        metaAtual={empresaMetaGlobalAnual}
                        metaAtingidaAtual={empresaMetaAtingidaAtual}
                        metaAtingidaAnterior={0}
                        metaGlobalAnual={empresaMetaGlobalAnual}
                        hideValues={hideValues}
                    />
                </Col>
            </Row>
            <Row>
                {groupedTargetsByUserAndRole.map((group) => {
                    const aggregatedInfo = getAggregatedTargetInfo(group.targets);
                    return (
                        <Col sm="12" key={`${group.userId}_${group.userRole}`} className="mb-4">
                            <Card className="border-primary h-100">
                                <Card.Header className="bg-primary text-white">
                                    <Row className="align-items-center">
                                        <Col>
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <p className="m-0 fs-5 fw-bold">
                                                    {hideValues === true ? getCodename(group.userName) : group.userName}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Stack data-test="meta-card">
                                        <MetaCardVendedor
                                            periodoMeta={aggregatedInfo.periodoMeta}
                                            targetTypeSelected={targetTypeSelected}
                                            CurrencyType={CurrencyType}
                                            nowMeta={aggregatedInfo.nowMeta}
                                            targetNowStr={aggregatedInfo.targetNowStr}
                                            commissionTriggerValue={aggregatedInfo.commissionTriggerValue}
                                            acceleratorTriggerValue={aggregatedInfo.acceleratorTriggerValue}
                                            achivedValue={aggregatedInfo.achivedValue}
                                            isMonetaryTarget={aggregatedInfo.isMonetaryTarget}
                                        />
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}
