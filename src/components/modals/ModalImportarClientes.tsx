import { Button, Col, Container, Form, InputGroup, Modal, ModalProps, Row, Table } from "react-bootstrap";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { ContextAlerta } from "../../contexts/ContextAlert";
import { NewImportCustomer } from "../../types/customer";

import BotaoAssincrono from "../botoes/BotaoAssincrono";
import InputTexto from "../inputs/InputTexto";
import utils from "../../utils";

import * as yup from "yup";

const LINK_MODEL_ID = "link-model-import-cliente";
const FILE_MODEL_NAME = "modelo_cliente.xlsx";

export interface ModalImportarClientesProps extends ModalProps {
    onImport?: (dados: NewImportCustomer[]) => Promise<void> | void;
    onFinishImport?: () => void;
}

export default function ModalImportarClientes({ ...rest }: ModalImportarClientesProps) {
    //CONTEXTOS
    const { setAviso, setPerigo } = useContext(ContextAlerta);

    //ESTADOS
    const [nomeArquivo, setNomeArquivo] = useState<string | undefined>();
    const [dadosAImportar, setDadosAImportar] = useState<NewImportCustomer[]>([]);

    //VARIAVEIS
    const { show, onImport, onHide, onFinishImport } = rest;

    //EVENTOS
    useEffect(() => {
        if (show) return;
        setNomeArquivo(undefined);
        setDadosAImportar([]);
    }, [show]);

    const handleOnImportarDados = useCallback(async () => {
        try {
            if (dadosAImportar.length < 1) return setAviso("Nenhum dado foi encontrado!");
            for (const dado of dadosAImportar) {
                await new Promise(async (resolve, reject) => {
                    try {
                        resolve(await yupEsquemaImportCliente.validate(dado));
                    } catch (err: any) {
                        //Os erros do yup possuem atributo message
                        reject({ message: err?.message, index: dadosAImportar.indexOf(dado) });
                    }
                });
            }

            //Importa os dados
            if (onImport) await onImport(dadosAImportar);
            if (onFinishImport) onFinishImport();
            if (onHide) onHide();
        } catch (err: any) {
            if (err.index !== undefined)
                setAviso(`Na linha ${err.index + 1}: ${err?.message ?? "Algo não deu certo ao verificar esta linha."}`);
            else setPerigo(utils.retornaMensagemErro(err));
            console.error(err);
        }
    }, [dadosAImportar, setAviso, onImport, onHide, setPerigo, onFinishImport]);

    const handleOnSelectFiles = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const arquivosSelecionados: FileList = (e.target as any).files;
            const arquivos = Array.from(arquivosSelecionados);
            const nomeDosArquivos = arquivos.map((arquivo) => arquivo.name).join(", ");

            //Mostrando feedback visual dos arquivos selecionados
            if (nomeDosArquivos) setNomeArquivo(nomeDosArquivos);
            else setNomeArquivo(undefined);

            //Salva os dados em JSON
            const dadosDosClientes = [];
            for (let arquivo of arquivos) {
                const dadosDoArquivo = await arquivo.arrayBuffer();
                const dadosJSON = utils.xlsx_to_json(dadosDoArquivo);
                dadosDosClientes.push(...dadosJSON);
            }

            //Limpa e formata os dados para o padrão dos clientes no sistema
            const clientes: NewImportCustomer[] = [];
            for (const dado of dadosDosClientes) {
                const keysDoDado = Object.keys(dado);
                const nome = dado[keysDoDado.find((key) => key === "Nome") ?? ""];
                const CNPJ = dado[keysDoDado.find((key) => key === "CNPJ") ?? ""];
                const email = dado[keysDoDado.find((key) => key === "Email") ?? ""]?.split(" ")[0];
                const telefone = dado[keysDoDado.find((key) => key === "Telefone") ?? ""];
                const segmento = dado[keysDoDado.find((key) => key === "Segmento") ?? ""];

                if (!nome || !CNPJ || !email || !telefone || !segmento)
                    return setAviso("Erro ao importar. Arquivos fora do modelo.");

                clientes.push({
                    name: nome.toString().trim(),
                    cnpj: CNPJ.toString().trim().replace(/\D/g, ""),
                    email: email.toString().trim(),
                    telefone: telefone.toString().trim().replace(/\D/g, ""),
                    segmentoName: segmento.toString().trim(),
                });
            }

            setDadosAImportar(clientes);
        },
        [setAviso]
    );

    const handleOnChangeDado = useCallback((novoDado: NewImportCustomer, index: number) => {
        setDadosAImportar((dadosAtuais) => dadosAtuais.map((dado, i) => (i === index ? { ...novoDado } : dado)));
    }, []);

    const handleOnDownload = useCallback(() => {
        const elementDownload = document.getElementById(LINK_MODEL_ID) as any;
        if (!elementDownload) return setAviso("Houve um problema inesperado!");

        elementDownload.href = utils.json_to_xlsx_url("Modelo Importar Clientes", [
            ["Nome", "CNPJ", "Email", "Telefone", "Segmento"],
        ]);
    }, [setAviso]);

    return (
        <Modal {...rest} centered size="xl">
            <Modal.Header>
                <Modal.Title>Importar clientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col sm="12" className="mb-2">
                            <span>
                                Escolha os arquivos dos quais deseja importar os clientes, siga este{" "}
                                <a
                                    className="text-info"
                                    id={LINK_MODEL_ID}
                                    href="#import"
                                    download={FILE_MODEL_NAME}
                                    onClick={handleOnDownload}
                                >
                                    modelo
                                </a>
                                .
                            </span>
                        </Col>
                        <Col sm="12" className="overflow-hidden">
                            <label htmlFor="form-cliente-import">
                                <InputGroup>
                                    <InputGroup.Text className="bg-primary text-white" role="button">
                                        Escolha os arquivos
                                    </InputGroup.Text>
                                    <InputGroup.Text className="text-truncate">
                                        {nomeArquivo ?? "Nenhum arquivo escolhido"}
                                    </InputGroup.Text>
                                </InputGroup>
                            </label>
                            <Form.Control
                                className="d-none"
                                id="form-cliente-import"
                                type="file"
                                accept=".xlsx"
                                multiple
                                onChange={handleOnSelectFiles}
                            />
                        </Col>
                        {dadosAImportar.length > 0 && (
                            <>
                                <Col sm="12" className="mt-3">
                                    <Form.Label>
                                        Verifique se todos os dados estão corretos. O responsável atribuido será aquele
                                        que importar os dados.
                                    </Form.Label>
                                </Col>
                                <Col sm="12" className="overflow-auto">
                                    <Table bordered striped size="sm">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Nome do cliente</th>
                                                <th>CNPJ do cliente</th>
                                                <th>E-mail</th>
                                                <th>Telefone para contato</th>
                                                <th>Segmento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dadosAImportar.map((dado, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>
                                                        <InputTexto
                                                            valor={dado.name}
                                                            setValor={(nome) =>
                                                                handleOnChangeDado(
                                                                    { ...dado, name: nome.toString() },
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputTexto
                                                            valor={dado.cnpj}
                                                            mask="00.000.000/0000-00"
                                                            functionMask={utils.retornaCNPJFormatado}
                                                            setValor={(cnpj) =>
                                                                handleOnChangeDado({ ...dado, cnpj }, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputTexto
                                                            valor={dado.email}
                                                            setValor={(email) =>
                                                                handleOnChangeDado({ ...dado, email }, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputTexto
                                                            valor={dado.telefone}
                                                            functionMask={utils.retornaTelefoneFormatado}
                                                            setValor={(telefone) =>
                                                                handleOnChangeDado({ ...dado, telefone }, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputTexto
                                                            valor={dado.segmentoName}
                                                            setValor={(segmentoName) =>
                                                                handleOnChangeDado({ ...dado, segmentoName }, index)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </>
                        )}
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" className="rounded-pill" onClick={rest.onHide}>
                    Cancelar
                </Button>
                <BotaoAssincrono variante="primary" className="rounded-pill" onClick={handleOnImportarDados}>
                    Importar
                </BotaoAssincrono>
            </Modal.Footer>
        </Modal>
    );
}

export const yupEsquemaImportCliente: yup.ObjectSchema<NewImportCustomer> = yup.object({
    name: yup.string().required("Um nome é necessário.").max(256, "Deve ter no máximo 256 carecteres."),
    cnpj: yup
        .string()
        .required("Um CNPJ é necessário.")
        .min(14, "Um CNPJ válido deve ter 14 dígitos.")
        .max(14, "Um CNPJ válido deve ter 14 dígitos."),
    email: yup
        .string()
        .email("Insira um e-mail válido.")
        .required("Um e-mail é necessário.")
        .max(256, "Deve ter no máximo 256 caracteres."),
    telefone: yup.string().required("Um telefone é necessário."),
    segmentoName: yup
        .string()
        .max(256, "Deve ter no máximo 256 caracteres.")
        .required("O nome do segmento é necessário."),
});
