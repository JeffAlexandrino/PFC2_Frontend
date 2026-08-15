import FormGroupInput, { FormGroupInputType } from "../../formGroups/FormGroupInput";
import FormGroupGeneric from "../../formGroups/FormGroupGeneric";
import SelectServico from "../../selects/SelectServico";
import utils from "../../../utils";

import { getUSDtoBRLRate } from "../../../utils/exchange.util";
import { NewServiceSale } from "../../../types/sale-service";
import { OffcanvasForm } from "../../../ui/offcanvas-form";
import { CurrencyType } from "../../../types/commom";
import { RevenueType } from "../../../types/sale";
import { Service } from "../../../types/service";
import { Row, Stack } from "react-bootstrap";
import { FormikHelpers } from "formik";
import { useCallback } from "react";

import * as yup from "yup";

type ManageNewSaleServicesProps = {
    onHide?: () => void;
    onSubmit: (values: NewServiceSale) => void;
    saleServiceUpdating?: NewServiceSale | null;
    show?: boolean;
    services: Service[];
};

export default function ManageNewSaleService({
    onHide,
    onSubmit,
    saleServiceUpdating,
    show,
    services,
}: ManageNewSaleServicesProps) {
    const initialValue: NewServiceSale = saleServiceUpdating ?? {
        cotacao: 1,
        servicoId: "",
        tipoMoeda: CurrencyType.BRL,
        qntdHorasComercial: 0,
        qntdHorasEspecial: 0,
        qntdHorasNaoComercial: 0,
        dedutiveisDistribuidor: null,
        impostoNota: null,
        markup: null,
        tipoFaturamento: null,
    };

    const validateServiceHours = useCallback((saleService: NewServiceSale, helpers: FormikHelpers<NewServiceSale>) => {
        if (saleService.qntdHorasComercial !== 0) return;
        if (saleService.qntdHorasEspecial !== 0) return;
        if (saleService.qntdHorasNaoComercial !== 0) return;

        const ERROR = "Ao menos uma das horas deve ser diferente de 0.";
        helpers.setErrors({
            qntdHorasComercial: ERROR,
            qntdHorasEspecial: ERROR,
            qntdHorasNaoComercial: ERROR,
        });
        return true;
    }, []);

    const handleOnSubmit = useCallback(
        async (saleService: NewServiceSale, helpers: FormikHelpers<NewServiceSale>) => {
            const error = validateServiceHours(saleService, helpers);
            if (error) return;

            onSubmit(saleService);
            helpers.setSubmitting(false);
            helpers.resetForm();
        },
        [onSubmit, validateServiceHours]
    );

    return (
        <OffcanvasForm.Root show={show} onHide={onHide}>
            <OffcanvasForm.Header>
                <OffcanvasForm.Title>{"Adicionar serviço à nota fiscal"}</OffcanvasForm.Title>
            </OffcanvasForm.Header>
            <OffcanvasForm.Body>
                <OffcanvasForm.Formik
                    validateOnChange={false}
                    validationSchema={yupNewSaleServiceSchema}
                    initialValues={initialValue}
                    onSubmit={handleOnSubmit}
                >
                    {({ values, errors, setValues }) => {
                        const atualizaTipoMoeda = (tipoMoedaParam: CurrencyType) => {
                            if (values.tipoMoeda === tipoMoedaParam) return;
                            if (tipoMoedaParam === null)
                                return setValues({ ...values, tipoMoeda: CurrencyType.BRL, cotacao: 1 });
                            if (tipoMoedaParam === CurrencyType.BRL)
                                return setValues({ ...values, tipoMoeda: tipoMoedaParam, cotacao: 1 });
                            getUSDtoBRLRate()
                                .then((rate) => {
                                    if (!rate || isNaN(rate))
                                        return setValues({ ...values, tipoMoeda: tipoMoedaParam });
                                    setValues({ ...values, tipoMoeda: tipoMoedaParam, cotacao: rate });
                                })
                                .catch(() => {
                                    setValues({ ...values, tipoMoeda: tipoMoedaParam });
                                });
                        };

                        const servico = services.find(({ id }) => values.servicoId === id);
                        const valorCustoHora = servico?.valorCustoHora ?? 0;
                        const tipoMoeda = servico?.tipoMoeda ?? CurrencyType.BRL;
                        atualizaTipoMoeda(tipoMoeda);

                        const cotacaoDesabilitada = tipoMoeda === CurrencyType.BRL;
                        const custoTotal =
                            values.qntdHorasComercial * valorCustoHora +
                            values.qntdHorasNaoComercial * valorCustoHora * 1.5 +
                            values.qntdHorasEspecial * valorCustoHora * 2;

                        return (
                            <Stack className="d-flex py-3 gap-3 w-100">
                                <div className="d-flex flex-column px-3 gap-2">
                                    <h6>Serviço</h6>

                                    <FormGroupGeneric label="Serviço" error={errors.servicoId}>
                                        <SelectServico
                                            idSelecionado={values.servicoId}
                                            setIdSelecionado={(id) => setValues({ ...values, servicoId: id as string })}
                                        />
                                    </FormGroupGeneric>
                                </div>

                                <Row className="d-flex p-3 border-top row-gap-2">
                                    <h6>Valores do Serviço</h6>

                                    <FormGroupInput
                                        disabled
                                        sm="7"
                                        label="Custo hora"
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={tipoMoeda}
                                        value={valorCustoHora}
                                        setValue={() => {}}
                                    />
                                    <FormGroupInput
                                        sm="5"
                                        label="Cotação"
                                        disabled={cotacaoDesabilitada}
                                        type={FormGroupInputType.MONETARY}
                                        tipoMoeda={CurrencyType.BRL}
                                        value={values.cotacao}
                                        setValue={(cotacao) => setValues({ ...values, cotacao })}
                                        error={errors.cotacao}
                                    />
                                    <FormGroupInput
                                        sm="12"
                                        label="Qntd. hora comercial"
                                        type={FormGroupInputType.NUMBER}
                                        min={0}
                                        value={values.qntdHorasComercial}
                                        setValue={(qntdHorasComercial) => setValues({ ...values, qntdHorasComercial })}
                                        error={errors.qntdHorasComercial}
                                    />
                                    <FormGroupInput
                                        sm="12"
                                        label="Qntd. hora não comercial (1.5x)"
                                        type={FormGroupInputType.NUMBER}
                                        min={0}
                                        value={values.qntdHorasNaoComercial}
                                        setValue={(qntdHorasNaoComercial) =>
                                            setValues({ ...values, qntdHorasNaoComercial })
                                        }
                                        error={errors.qntdHorasNaoComercial}
                                    />
                                    <FormGroupInput
                                        sm="12"
                                        label="Qntd. hora especial (2x)"
                                        type={FormGroupInputType.NUMBER}
                                        min={0}
                                        value={values.qntdHorasEspecial}
                                        setValue={(qntdHorasEspecial) => setValues({ ...values, qntdHorasEspecial })}
                                        error={errors.qntdHorasEspecial}
                                    />

                                    <small>Custo: {utils.retornaValorMonetario(custoTotal, tipoMoeda)}</small>
                                </Row>
                            </Stack>
                        );
                    }}
                </OffcanvasForm.Formik>
            </OffcanvasForm.Body>
            <OffcanvasForm.Footer>
                <OffcanvasForm.Reset>Cancelar</OffcanvasForm.Reset>
                <OffcanvasForm.Submit>{"Adicionar"}</OffcanvasForm.Submit>
            </OffcanvasForm.Footer>
        </OffcanvasForm.Root>
    );
}

export const yupNewSaleServiceSchema: yup.ObjectSchema<NewServiceSale> = yup.object({
    servicoId: yup.string().required("Selecione um serviço."),
    qntdHorasComercial: yup.number().required("Este campo é obrigatório."),
    qntdHorasEspecial: yup.number().required("Este campo é obrigatório."),
    qntdHorasNaoComercial: yup.number().required("Este campo é obrigatório."),
    cotacao: yup.number().defined("Este campo é necessário.").min(0.000001, "O valor da cotação não pode ser zero."),
    tipoMoeda: yup.mixed<CurrencyType>().oneOf(Object.values(CurrencyType)).defined("Este campo é necessário."),
    //Antigos Campos
    dedutiveisDistribuidor: yup.number().defined("Este campo é obrigatório.").nullable(),
    impostoNota: yup.number().defined("Este campo é obrigatório.").nullable(),
    markup: yup.number().defined("Este campo é necessário.").nullable(),
    tipoFaturamento: yup
        .mixed<RevenueType>()
        .oneOf(Object.values(RevenueType))
        .defined("Tipo Faturamento servico")
        .nullable(),
});
