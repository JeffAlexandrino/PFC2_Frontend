import { FindParams } from "./commom";
import { Segment } from "./segment";
import { User } from "./user";

export enum CustomerOrigin {
    INDICATION = "INDICATION",
    WHATSAPP = "WHATSAPP",
    INSTAGRAM = "INSTAGRAM",
    EMAIL = "EMAIL",
    LINKEDIN = "LINKEDIN",
    PARTNER = "PARTNER",
    CELLPHONE = "CELLPHONE",
}

export const getOriginDescription = (origem: CustomerOrigin): string => {
    switch (origem) {
        case CustomerOrigin.INDICATION:
            return "Indicação";
        case CustomerOrigin.WHATSAPP:
            return "Whatsapp";
        case CustomerOrigin.EMAIL:
            return "E-mail";
        case CustomerOrigin.PARTNER:
            return "Lead de parceiro";
        case CustomerOrigin.INSTAGRAM:
            return "Instagram";
        case CustomerOrigin.LINKEDIN:
            return "LinkedIn";
        case CustomerOrigin.CELLPHONE:
            return "Telefone";
    }
};

export const CustomerOriginOptions = Object.values(CustomerOrigin).map((value) => ({
    value,
    label: getOriginDescription(value),
}));

export type Customer = {
    cnpj: string;
    createdAt: Date;
    email: string;
    id: string;
    comprou?: string;
    name: string;
    origem: CustomerOrigin;
    segmentoId: string;
    segmento: Segment;
    responsavelId: string;
    responsavel: Pick<User, "id" | "name">;
    telefone: string;
    updatedAt: Date;
};

export type NewCustomer = Pick<Customer, "name" | "email" | "cnpj" | "telefone" | "segmentoId" | "origem">;
export type EditCustomerData = NewCustomer & Pick<Customer, "id">;
export type NewImportCustomer = Pick<Customer, "name" | "email" | "cnpj" | "telefone"> & {
    segmentoName: string;
};

export type CustomerWhere = {
    name?: string;
    origem?: CustomerOrigin;
    cnpj?: string;
    email?: string;
    telefone?: string;
    segmentoId?: string;
    responsavelId?: string;
    responsavelNome?: string;
    comprou?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};

export type CustomerQueryProps = FindParams<CustomerWhere, keyof Customer>;
