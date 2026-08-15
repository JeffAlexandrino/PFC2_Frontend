import { FormGroupBoolean, FormGroupGeneric, FormVisitaGasto } from "..";
import { ExpenseType, EditVisit, NewVisitExpense, VisitType } from "../../types/visits";
import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { OffcanvasNovoDado } from "../offcanvas/OffcanvasNovoDado";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { CurrencyType } from "../../types/commom";
import { Formik, FormikHelpers } from "formik";
import { v4 } from "uuid";

import FormGroupSelect from "../formGroups/FormGroupSelect";
import SelectVendedor from "../selects/SelectVendedor";
import SelectCliente from "../selects/SelectCliente";
import BotaoFechar from "../botoes/BotaoFechar";
import BotaoLabel from "../botoes/BotaoLabel";
import utils from "../../utils";

import * as yup from "yup";

const FORM_GASTO = "FORM_GASTO";

export interface IFormVisitaProps {
    formId?: string;
    onSubmit: (visita: EditVisit) => void | Promise<void>;
    valoresIniciais: EditVisit;
}

//FORM
export default function FormVisitaEdit({ onSubmit, valoresIniciais, formId }: IFormVisitaProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [gastos, setGastos] = useState<NewVisitExpense[]>([]);
    const [showOffcanvasAddGasto, setShowOffcanvasAddGasto] = useState(false);
    const [idxGastoEditando, setIdxGastoEditando] = useState<number | null>(null);

    //EVENTOS
    useEffect(() => {
        setGastos(valoresIniciais.gastos);
    }, [valoresIniciais]);

    const onSubmitFormik = useCallback(
        async (visita: EditVisit, helpers: FormikHelpers<EditVisit>) => {
            try {
                const visitaParaEnvio = {
                    ...visita,
                    gastos: gastos,
                };
                await onSubmit(visitaParaEnvio);
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                console.error("Erro: ", err);
            }
        },
        [onSubmit, setPerigo, gastos]
    );

    const handleOnClickAddGasto = useCallback(() => setShowOffcanvasAddGasto(true), []);
    const handleOnClickEditGasto = useCallback((index: number) => setIdxGastoEditando(index), []);
    const handleOnClickCancelAddGasto = useCallback(() => setShowOffcanvasAddGasto(false), []);
    const handleOnClickDeleteGasto = useCallback(
        (index: number) => {
            setGastos((current) => current.filter((_, idx) => idx !== index));

            if (idxGastoEditando === index) {
                setIdxGastoEditando(null);
            }
        },
        [idxGastoEditando]
    );

    const handleOnSubmitGastos = useCallback(
        (gasto: NewVisitExpense) => {
            if (idxGastoEditando === null) {
                setGastos((current) => [...current, gasto]);
                setShowOffcanvasAddGasto(false);
                return;
            }

            setGastos((current) => current.map((g, idx) => (idx === idxGastoEditando ? gasto : g)));
            setIdxGastoEditando(null);
        },
        [idxGastoEditando]
    );

    return (
        <>
            <Formik
                validateOnChange={false}
                validationSchema={yupEsquemaVisitaUpdate}
                onSubmit={onSubmitFormik}
                initialValues={valoresIniciais}
            >
                {({ handleSubmit, values, errors, setValues, setFieldValue }) => {
                    return (
                        <Form id={formId} onSubmit={handleSubmit}>
                            <Row className="gap-3">
                                <FormGroupGeneric label="Vendedor" error={errors.salePersonId}>
                                    <SelectVendedor
                                        idSelecionado={values.salePersonId}
                                        setIdSelecionado={(id) => setValues({ ...values, salePersonId: id as string })}
                                    />
                                </FormGroupGeneric>

                                <FormGroupGeneric label="Cliente" error={errors.clienteId}>
                                    <SelectCliente
                                        setIdSelecionado={(id) => setValues({ ...values, clienteId: id as string })}
                                        idSelecionado={values.clienteId}
                                    />
                                </FormGroupGeneric>

                                <Col sm="12" className="border-top pt-2">
                                    <Row>
                                        <Col sm="12" className="pb-2">
                                            <h6>Tipo de saída</h6>
                                            <FormGroupSelect
                                                label="Selecione o tipo:"
                                                value={values.tipoVisita ?? VisitType.VISITA}
                                                setValue={(tipoVisita) => setFieldValue("tipoVisita", tipoVisita)}
                                                options={utils.returnTipoVisita()}
                                                optionTextFn={utils.returnArrayTipoVisita}
                                                error={errors.tipoVisita}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12">
                                            <h6>Remoto ou presencial?</h6>
                                        </Col>
                                        <FormGroupBoolean
                                            label="Remota"
                                            value={values.remoto}
                                            setValue={(remoto) => setValues({ ...values, remoto })}
                                            error={errors.remoto}
                                        />
                                    </Row>
                                </Col>

                                {!values.remoto && (
                                    <Col sm="12" className="border-top pt-2">
                                        <Row>
                                            <Col sm="12" className="mb-1">
                                                <h6>Gastos</h6>
                                            </Col>
                                            <Form.Control isInvalid={!!errors.gastos} className="d-none" />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.gastos as string}
                                            </Form.Control.Feedback>
                                            <Col sm="12">
                                                <ListaVisitaGastos
                                                    gastos={gastos}
                                                    onClickAdd={handleOnClickAddGasto}
                                                    onClickDelete={handleOnClickDeleteGasto}
                                                    onClickEdit={handleOnClickEditGasto}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                )}

                                <FormGroupInput
                                    label="Data da saída"
                                    required
                                    type={FormGroupInputType.DATE}
                                    value={values.dataVisita}
                                    setValue={(dataVisita) => setValues({ ...values, dataVisita })}
                                    error={errors.dataVisita as string}
                                />
                                <FormGroupInput
                                    label="Comentários"
                                    stringNullable
                                    type={FormGroupInputType.TEXT_AREA}
                                    rows={4}
                                    max={256}
                                    value={values.comentarios ?? ""}
                                    setValue={(comentarios) => setValues({ ...values, comentarios })}
                                    error={errors.comentarios}
                                />
                            </Row>
                            <Row>
                                <div className="d-flex flex-column gap-2x border-top px-3 mt-2">
                                    <h6>Campos Antigos</h6>
                                    {values.carroEmpresa !== null && values.carroEmpresa !== undefined && (
                                        <FormGroupBoolean
                                            disabled
                                            label="Usou carro da empresa?"
                                            value={values.carroEmpresa}
                                            setValue={(carroEmpresa) => setValues({ ...values, carroEmpresa })}
                                            error={errors.carroEmpresa}
                                        />
                                    )}
                                    {values.kmFinal !== null && values.kmFinal !== undefined && (
                                        <FormGroupInput
                                            disabled
                                            label="Km Final"
                                            type={FormGroupInputType.NUMBER}
                                            value={values.kmFinal}
                                            setValue={(kmFinal) => setValues({ ...values, kmFinal })}
                                            error={errors.kmFinal}
                                        />
                                    )}
                                    {values.kmInicial !== null && values.kmInicial !== undefined && (
                                        <FormGroupInput
                                            disabled
                                            label="Km Inicial"
                                            type={FormGroupInputType.NUMBER}
                                            value={values.kmInicial}
                                            setValue={(kmInicial) => setValues({ ...values, kmInicial })}
                                            error={errors.kmInicial}
                                        />
                                    )}
                                </div>
                            </Row>
                        </Form>
                    );
                }}
            </Formik>

            <OffcanvasNovoDado.Root show={showOffcanvasAddGasto}>
                <OffcanvasNovoDado.Header>
                    <h4>Adicionar Gasto à Saída</h4>
                </OffcanvasNovoDado.Header>
                <OffcanvasNovoDado.Body
                    cancelButtonProps={{ onClick: handleOnClickCancelAddGasto }}
                    acceptButtonProps={{ type: "submit", form: FORM_GASTO }}
                >
                    <FormVisitaGasto
                        onSubmit={handleOnSubmitGastos}
                        valoresIniciais={{ tipoGasto: ExpenseType.ALIMENTACAO, nota: null, valor: 0 }}
                        formId={FORM_GASTO}
                    />
                </OffcanvasNovoDado.Body>
            </OffcanvasNovoDado.Root>

            <OffcanvasNovoDado.Root show={idxGastoEditando !== null}>
                <OffcanvasNovoDado.Header>
                    <h4>Editar Gasto da Saída</h4>
                </OffcanvasNovoDado.Header>
                <OffcanvasNovoDado.Body
                    cancelButtonProps={{ onClick: () => setIdxGastoEditando(null) }}
                    acceptButtonProps={{ type: "submit", form: FORM_GASTO, children: "Editar" }}
                >
                    {idxGastoEditando !== null && (
                        <FormVisitaGasto
                            onSubmit={handleOnSubmitGastos}
                            valoresIniciais={gastos[idxGastoEditando]}
                            formId={FORM_GASTO}
                        />
                    )}
                </OffcanvasNovoDado.Body>
            </OffcanvasNovoDado.Root>
        </>
    );
}

//FUNÇÕES AUXILIARES
function ListaVisitaGastos(props: {
    gastos: NewVisitExpense[];
    onClickAdd: () => void;
    onClickEdit: (index: number) => void;
    onClickDelete: (index: number) => void;
}) {
    const totalGasto = props.gastos.reduce((acc, gasto) => (acc += gasto.valor), 0);

    return (
        <Row className="gap-2">
            {props.gastos.map((gasto, index) => {
                return (
                    <Col sm="12" key={v4()}>
                        <Stack className="d-flex w-100 position-relative border rounded shadow-sm p-2">
                            <div className="position-absolute end-0 top-0 mt-1 me-1 z-1">
                                <BotaoFechar onClick={() => props.onClickDelete(index)} />
                            </div>
                            <BotaoLabel
                                variant="info"
                                texto={utils.returnTextTipoGasto(gasto.tipoGasto)}
                                onClick={() => props.onClickEdit(index)}
                            />
                            <div className="d-flex w-100 justify-content-between">
                                <small>Valor</small>
                                <small>{utils.retornaValorMonetario(gasto.valor, CurrencyType.BRL)}</small>
                            </div>
                        </Stack>
                    </Col>
                );
            })}
            <Col sm="12" className="text-secondary-dark">
                <small>Gastos totais: {utils.retornaValorMonetario(totalGasto, CurrencyType.BRL)}</small>
            </Col>
            <Col sm="12" className="text-end">
                <Button className="rounded-pill" size="sm" onClick={props.onClickAdd}>
                    Adicionar
                </Button>
            </Col>
        </Row>
    );
}

export const yupEsquemaVisitaUpdate: yup.ObjectSchema<EditVisit> = yup.object({
    salePersonId: yup.string().required("Este campo é necessário."),
    clienteId: yup.string().required("Este campo é necessário."),
    dataVisita: yup.date().required("Este campo é necessário."),
    comentarios: yup.string().required("Este campo é necessário.").nullable(),
    remoto: yup.boolean().required("Este campo é necessário."),
    visitaPaga: yup.boolean().required("Este campo é necessário."),
    gastos: yup.array().required("Este campo é necessário."),
    tipoVisita: yup.mixed<VisitType>().nullable().optional(),
    // Campos antigos
    carroEmpresa: yup.boolean().optional().nullable(),
    kmInicial: yup.number().optional().nullable(),
    kmFinal: yup.number().optional().nullable(),
});
