import FormGroupSelect from "../../formGroups/FormGroupSelect";
import useTarget from "../../../hooks/use-target";
import utils from "../../../utils";

import { NewTarget, NewTargetTypeValue, Target, TargetType } from "../../../types/target";
import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import { ContextAlerta } from "../../../contexts/ContextAlert";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { CurrencyType, Role } from "../../../types/commom";
import { FormikHelpers } from "formik";

import * as yup from "yup";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

const getQuarterDates = (year: number, quarter: Quarter): { start: Date; end: Date } => {
    const quarterMap: Record<Quarter, { startMonth: number; endMonth: number }> = {
        Q1: { startMonth: 0, endMonth: 2 },
        Q2: { startMonth: 3, endMonth: 5 },
        Q3: { startMonth: 6, endMonth: 8 },
        Q4: { startMonth: 9, endMonth: 11 },
    };

    const { startMonth, endMonth } = quarterMap[quarter];
    const start = new Date(year, startMonth, 1, 0, 0, 0, 0);
    const end = new Date(year, endMonth + 1, 0, 23, 59, 59, 999);

    return { start, end };
};

const getQuarterFromDate = (date: Date): Quarter => {
    const month = date.getMonth();
    if (month < 3) return "Q1";
    if (month < 6) return "Q2";
    if (month < 9) return "Q3";
    return "Q4";
};

const getAvailableYears = (): number[] => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
};

const getQuarterLabel = (quarter: Quarter): string => {
    const labels: Record<Quarter, string> = {
        Q1: "Jan - Mar",
        Q2: "Abr - Jun",
        Q3: "Jul - Set",
        Q4: "Out - Dez",
    };
    return labels[quarter];
};

const MIN_TARGET_EXPLANATION = "Meta mínima para ativar a comissão!";
const TARGET_EXPLANATION = "Após bater a meta, o comissionamento é acelerado!";

type ManageProps = {
    userRoleId?: string;
    userRole: Role;
    targetUpdating?: Target | null;
    show?: boolean;
    onHide?: () => void;
    onDone?: () => void;
};

export default function Manage({ userRoleId, userRole, targetUpdating, onHide, onDone, ...props }: ManageProps) {
    const { setAviso } = useContext(ContextAlerta);

    const { createTargets, cancelCreateTargets, creatingTargets } = useTarget();
    const { updateTarget, cancelUpdateTarget, updatingTarget } = useTarget();

    const [disableSubButton, setdisableSubButton] = useState(true);

    const { initialYear, initialQuarter } = useMemo(() => {
        if (targetUpdating) {
            return {
                initialYear: targetUpdating.dataInicioMeta.getFullYear(),
                initialQuarter: getQuarterFromDate(targetUpdating.dataInicioMeta),
            };
        }
        return {
            initialYear: new Date().getFullYear(),
            initialQuarter: getQuarterFromDate(new Date()),
        };
    }, [targetUpdating]);

    const [selectedYear, setSelectedYear] = useState<string>(initialYear.toString());
    const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(initialQuarter);

    const initialValues: NewTarget = useMemo(() => {
        const { start, end } = getQuarterDates(parseInt(selectedYear), selectedQuarter);

        return targetUpdating
            ? {
                  dataInicioMeta: targetUpdating.dataInicioMeta,
                  dataFimMeta: targetUpdating.dataFimMeta,
                  userRoleId: targetUpdating.userRoleId,
                  tiposMeta: targetUpdating.tiposMeta.map(
                      ({ aceleratorTriggerValue, commissionTriggerValue, tipoMeta }) => ({
                          aceleratorTriggerValue,
                          commissionTriggerValue,
                          tipoMeta,
                      })
                  ),
              }
            : {
                  dataInicioMeta: start,
                  dataFimMeta: end,
                  userRoleId: userRoleId ?? "",
                  tiposMeta: [],
              };
    }, [targetUpdating, userRoleId, selectedYear, selectedQuarter]);

    const cancelAndHide = useCallback(() => {
        cancelCreateTargets();
        cancelUpdateTarget();
        if (onHide) onHide();
    }, [onHide, cancelCreateTargets, cancelUpdateTarget]);

    const handleOnSubmit = useCallback(
        async (target: NewTarget, helpers: FormikHelpers<NewTarget>) => {
            setdisableSubButton(true);
            if (targetUpdating)
                return updateTarget({ id: targetUpdating.id, ...target }, { userRole })
                    .then(() => {
                        if (onDone) onDone();
                        helpers.resetForm();
                    })
                    .catch(console.error);

            createTargets([target], { userRole })
                .then(() => {
                    if (onDone) onDone();
                    helpers.resetForm();
                })
                .catch(console.error);
        },
        [targetUpdating, onDone, updateTarget, createTargets, userRole]
    );

    return (
        <OffcanvasForm.Root show={props.show} onHide={cancelAndHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>{targetUpdating ? "Editar meta" : "Nova meta"}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik
                    initialValues={initialValues}
                    validationSchema={yupTargetSchema}
                    onSubmit={handleOnSubmit}
                >
                    {({ values, setValues, errors }) => {
                        const errorBy = (targetType: TargetType) =>
                            (errors?.tiposMeta as unknown as NewTargetTypeValue[])?.find(
                                (tm) => tm.tipoMeta === targetType
                            );

                        const valueBy = (targetType: TargetType) =>
                            values.tiposMeta.find((tm) => tm.tipoMeta === targetType);

                        const setValueBy = (targetType: TargetType, acelerator?: number, commission?: number) => {
                            const typeValue = valueBy(targetType);
                            let lastAcc = valueBy(targetType)?.aceleratorTriggerValue;
                            let lastCom = valueBy(targetType)?.commissionTriggerValue;
                            const notUndefinedAcc = acelerator !== undefined;
                            const notUndefinedCom = commission !== undefined;
                            notUndefinedAcc && (lastAcc = acelerator);
                            notUndefinedCom && (lastCom = commission);
                            if (lastAcc && lastCom && lastAcc! <= lastCom!) {
                                setdisableSubButton(true);
                                return setAviso("Faturamento precisa ser maior que Faturamento Min.!");
                            }
                            setdisableSubButton(false);
                            if (!typeValue) {
                                const newTypeValue: NewTargetTypeValue = {
                                    tipoMeta: targetType,
                                    aceleratorTriggerValue: acelerator ?? 0,
                                    commissionTriggerValue: commission ?? 0,
                                };
                                return setValues({ ...values, tiposMeta: [...values.tiposMeta, newTypeValue] });
                            }

                            const typesUpdated: NewTargetTypeValue[] = values.tiposMeta.map((tm) => {
                                if (tm.tipoMeta !== targetType) return tm;
                                if (notUndefinedAcc) return { ...tm, aceleratorTriggerValue: acelerator };
                                if (notUndefinedCom) return { ...tm, commissionTriggerValue: commission };
                                return tm;
                            });
                            return setValues({ ...values, tiposMeta: typesUpdated });
                        };

                        const handleQuarterChange = (quarter: Quarter) => {
                            setSelectedQuarter(quarter);
                            const { start, end } = getQuarterDates(parseInt(selectedYear), quarter);
                            setValues({ ...values, dataInicioMeta: start, dataFimMeta: end });
                        };

                        const handleYearChange = (year: string) => {
                            setSelectedYear(year);
                            const { start, end } = getQuarterDates(parseInt(year), selectedQuarter);
                            setValues({ ...values, dataInicioMeta: start, dataFimMeta: end });
                        };
                        return (
                            <Stack className="d-flex w-100 gap-2">
                                <h6 className="px-3">Tipos de metas</h6>

                                <Row className="px-3 row-gap-2">
                                    {utils.retornaArrayTipoMeta().map((tipoMeta) => (
                                        <React.Fragment key={tipoMeta}>
                                            <FormGroupInput
                                                sm={tipoMeta === TargetType.FATURAMENTO ? "6" : "12"}
                                                label={
                                                    <>
                                                        <span>Meta {utils.retornaTextoTipoMeta(tipoMeta)}</span>{" "}
                                                        {tipoMeta === TargetType.FATURAMENTO && (
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>{TARGET_EXPLANATION}</Tooltip>}
                                                            >
                                                                <i className="bi bi-question-circle-fill text-info" />
                                                            </OverlayTrigger>
                                                        )}
                                                    </>
                                                }
                                                type={
                                                    tipoMeta === "VISITA"
                                                        ? FormGroupInputType.NUMBER
                                                        : FormGroupInputType.MONETARY
                                                }
                                                tipoMoeda={CurrencyType.BRL}
                                                value={valueBy(tipoMeta)?.aceleratorTriggerValue ?? 0}
                                                setValue={(acelerator) => setValueBy(tipoMeta, acelerator)}
                                                error={errorBy(tipoMeta)?.aceleratorTriggerValue as unknown as string}
                                            />
                                            {tipoMeta === TargetType.FATURAMENTO && (
                                                <FormGroupInput
                                                    sm="6"
                                                    label={
                                                        <>
                                                            <span>Faturamento Mín.</span>{" "}
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>{MIN_TARGET_EXPLANATION}</Tooltip>}
                                                            >
                                                                <i className="bi bi-question-circle-fill text-info" />
                                                            </OverlayTrigger>
                                                        </>
                                                    }
                                                    type={FormGroupInputType.MONETARY}
                                                    tipoMoeda={CurrencyType.BRL}
                                                    value={valueBy(tipoMeta)?.commissionTriggerValue ?? 0}
                                                    setValue={(commission) =>
                                                        setValueBy(tipoMeta, undefined, commission)
                                                    }
                                                    error={
                                                        errorBy(tipoMeta)?.commissionTriggerValue as unknown as string
                                                    }
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Row>

                                <div className="d-flex flex-column border-top pt-2 gap-2 px-3">
                                    <h6>Período da meta</h6>

                                    <Row className="row-gap-2">
                                        <FormGroupSelect
                                            sm="6"
                                            label="Ano"
                                            value={selectedYear}
                                            options={getAvailableYears().map((y) => y.toString())}
                                            setValue={handleYearChange}
                                            optionTextFn={(year) => year}
                                        />
                                        <FormGroupSelect
                                            sm="6"
                                            label="Trimestre"
                                            value={selectedQuarter}
                                            options={["Q1", "Q2", "Q3", "Q4"] as Quarter[]}
                                            setValue={handleQuarterChange}
                                            optionTextFn={(quarter) => `${quarter}: ${getQuarterLabel(quarter)}`}
                                        />
                                    </Row>
                                </div>
                            </Stack>
                        );
                    }}
                </OffcanvasForm.Formik>
            </OffcanvasForm.Body>
            <OffcanvasForm.Footer>
                <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                <OffcanvasForm.Submit pending={creatingTargets || updatingTarget} disabled={disableSubButton}>
                    {targetUpdating ? "Editar" : "Adicionar"}
                </OffcanvasForm.Submit>
            </OffcanvasForm.Footer>
        </OffcanvasForm.Root>
    );
}

export const yupTargetSchema: yup.ObjectSchema<NewTarget> = yup.object({
    userRoleId: yup.string().required("Este campo é necessário."),
    dataInicioMeta: yup.date().required("Este campo é necessário."),
    dataFimMeta: yup.date().required("Este campo é necessário."),
    tiposMeta: yup
        .array(
            yup.object({
                tipoMeta: yup.mixed<TargetType>().oneOf(Object.values(TargetType)).required("Este campo é encessário."),
                commissionTriggerValue: yup.number().required("Este campo é necessário."),
                aceleratorTriggerValue: yup.number().required("Este campo é necessário."),
            })
        )
        .required("Este campo é necessário."),
});
