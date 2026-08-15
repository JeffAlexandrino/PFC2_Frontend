import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import { ExpenseType, NewVisitExpense, TravelType } from "../../types/visits";
import { ButtonTravelTicket } from "../botoes/BotaoAdicionarDocumento";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { CurrencyType } from "../../types/commom";
import { useCallback, useContext } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Row } from "react-bootstrap";

import FormGroupBoolean from "../formGroups/FormGroupBoolean";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import utils from "../../utils";

import * as yup from "yup";

export interface FormVisitaGastoProps {
    formId?: string;
    onSubmit: (gasto: NewVisitExpense) => void | Promise<void>;
    valoresIniciais: NewVisitExpense;
}

//FORM
export default function FormVisitaGasto({ formId, onSubmit, valoresIniciais }: FormVisitaGastoProps) {
    //CONTEXTOS
    const { setPerigo } = useContext(ContextAlerta);

    //EVENTOS
    const onSubmitFormik = useCallback(
        async (gasto: NewVisitExpense, helpers: FormikHelpers<NewVisitExpense>) => {
            try {
                await onSubmit(gasto);
                helpers.setSubmitting(false);
                helpers.resetForm();
            } catch (err) {
                if (utils.blErroCancelamento(err)) return;
                setPerigo(utils.retornaMensagemErro(err));
                console.error(err);
            }
        },
        [onSubmit, setPerigo]
    );

    return (
        <Formik
            validateOnChange={false}
            validationSchema={yupEsquemaVisitaGasto}
            onSubmit={onSubmitFormik}
            initialValues={valoresIniciais}
        >
            {({ handleSubmit, values, errors, setValues }) => {
                return (
                    <Form id={formId} onSubmit={handleSubmit}>
                        <Row className="gap-1">
                            <FormGroupSelect
                                label="Tipo de gasto"
                                value={values.tipoGasto}
                                setValue={(tipoGasto) => setValues({ ...values, tipoGasto })}
                                options={utils.returnTiposGasto()}
                                optionTextFn={utils.returnTextTipoGasto}
                                error={errors.tipoGasto}
                            />

                            {values.tipoGasto === ExpenseType.COMBUSTIVEL && (
                                <>
                                    <FormGroupBoolean
                                        label="Usou o carro da empresa?"
                                        value={values.carroEmpresa ?? false}
                                        setValue={(carroEmpresa) => setValues({ ...values, carroEmpresa })}
                                        error={errors.carroEmpresa as string}
                                    />
                                    <FormGroupInput
                                        label="Km Final"
                                        type={FormGroupInputType.NUMBER}
                                        sm="5"
                                        required={values.tipoGasto === ExpenseType.COMBUSTIVEL}
                                        min={values.kmInicial ?? 0 + 1}
                                        value={values.kmFinal ?? 0}
                                        setValue={(kmFinal) => setValues({ ...values, kmFinal })}
                                        error={errors.kmFinal as string}
                                    />
                                    <FormGroupInput
                                        label="Km Inicial"
                                        type={FormGroupInputType.NUMBER}
                                        sm="5"
                                        required={values.tipoGasto === ExpenseType.COMBUSTIVEL}
                                        min={0}
                                        value={values.kmInicial ?? 0}
                                        setValue={(kmInicial) => setValues({ ...values, kmInicial })}
                                        error={errors.kmInicial as string}
                                    />
                                </>
                            )}

                            {values.tipoGasto === ExpenseType.VIAGEM && (
                                <>
                                    <FormGroupSelect
                                        label="Tipo de viagem"
                                        value={values.tipoViagem ?? TravelType.ONIBUS}
                                        setValue={(tipoViagem) => setValues({ ...values, tipoViagem })}
                                        options={[TravelType.ONIBUS, TravelType.AVIAO, TravelType.TREM]}
                                        optionTextFn={(tipo) => {
                                            switch (tipo) {
                                                case TravelType.AVIAO:
                                                    return "Avião";
                                                case TravelType.TREM:
                                                    return "Trem";
                                                case TravelType.ONIBUS:
                                                    return "Ônibus";
                                            }
                                        }}
                                        error={errors.tipoViagem as string}
                                    />
                                    <FormGroupInput
                                        label="Data de Ida"
                                        type={FormGroupInputType.DATE}
                                        sm="8"
                                        value={values.dataViagem ?? new Date()}
                                        setValue={(dataViagem) => setValues({ ...values, dataViagem })}
                                        error={errors.dataViagem as string}
                                    />
                                    <ButtonTravelTicket />
                                </>
                            )}

                            <FormGroupInput
                                label="Nota fiscal"
                                type={FormGroupInputType.TEXT}
                                required
                                value={values.nota ?? ""}
                                setValue={(nota) => setValues({ ...values, nota })}
                                error={errors.nota}
                            />
                            <FormGroupInput
                                label={values.tipoGasto === ExpenseType.VIAGEM ? "Valor da passagem" : "Valor do gasto"}
                                required
                                type={FormGroupInputType.MONETARY}
                                value={values.valor}
                                tipoMoeda={CurrencyType.BRL}
                                setValue={(valor) => setValues({ ...values, valor })}
                                error={errors.valor}
                            />
                        </Row>
                    </Form>
                );
            }}
        </Formik>
    );
}

export const yupEsquemaVisitaGasto: yup.ObjectSchema<NewVisitExpense> = yup.object({
    nota: yup.string().defined(),
    tipoGasto: yup.mixed<ExpenseType>().oneOf(Object.values(ExpenseType)).required(),
    valor: yup.number().required(),
    tipoViagem: yup
        .mixed<TravelType>()
        .oneOf(Object.values(TravelType) as TravelType[])
        .when("tipoGasto", {
            is: ExpenseType.VIAGEM,
            then: (schema) => schema.required("Tipo de viagem é obrigatório para VIAGEM."),
            otherwise: (schema) => schema.notRequired(),
        }),
    dataViagem: yup.date().when("tipoGasto", {
        is: ExpenseType.VIAGEM,
        then: (schema) => schema.required("Data da viagem é obrigatória para VIAGEM."),
        otherwise: (schema) => schema.notRequired(),
    }),
    carroEmpresa: yup.boolean().when("tipoGasto", {
        is: ExpenseType.COMBUSTIVEL,
        then: (schema) => schema.required("O campo carroEmpresa é obrigatório para COMBUSTIVEL."),
        otherwise: (schema) => schema.notRequired(),
    }),
    kmInicial: yup
        .number()
        .min(0, "Km Inicial deve ser >= 0")
        .when("tipoGasto", {
            is: ExpenseType.COMBUSTIVEL,
            then: (schema) => schema.required("Km Inicial é obrigatório para COMBUSTIVEL."),
            otherwise: (schema) => schema.notRequired(),
        }),
    kmFinal: yup
        .number()
        .min(0, "Km Final deve ser maior ou igual ao Km Inicial.")
        .when("tipoGasto", {
            is: ExpenseType.COMBUSTIVEL,
            then: (schema) => schema.required("Km Final é obrigatório para COMBUSTIVEL."),
            otherwise: (schema) => schema.notRequired(),
        }),
});
