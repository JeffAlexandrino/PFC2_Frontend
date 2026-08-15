import { FindParams } from "./commom";

export type Supplier = { id: string; name: string; cnpj: string; createdAt: Date; email: string; updatedAt: Date };

export type NewSupplier = Pick<Supplier, "name" | "email" | "cnpj">;

export type SupplierWhere = {
    name?: string;
    cnpj?: string;
    email?: string;
    gte_updatedAt?: string;
    lte_updatedAt?: string;
};
export type FindSuppliersParams = FindParams<SupplierWhere, keyof Supplier>;
export type EditSupplierData = NewSupplier & Pick<Supplier, "id">;
