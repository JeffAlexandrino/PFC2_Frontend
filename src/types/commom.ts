export type Optional<Entity> = {
    [Key in keyof Entity]?: Entity[Key];
};

export type FindParams<Where, SortBy> = {
    limit?: number;
    page?: number;
    sortBy?: SortBy;
    sortType?: "asc" | "desc";
    where?: Where;
};

export type UserEntity = { userId: string };
export type SalePersonRoleIdEntity = { vendedorRoleId: string };
export type SearchEntity = { campoPesquisa: string };
export type IntervalDateEntity = { dataInicio: Date; dataFim: Date };

export enum CurrencyType {
    BRL = "BRL",
    USD = "USD",
}

export enum Role {
    MONITOR = "MONITOR",
    ADMIN = "ADMIN",
    FINANCIAL_MANAGER = "FINANCIAL_MANAGER",
    COMERCIAL_MANAGER = "COMERCIAL_MANAGER",
    COMMISSIONING_ANALYST = "COMMISSIONING_ANALYST",
    COMERCIAL_ASSISTANT = "COMERCIAL_ASSISTANT",
    SOLUTION_ARCHITECT = "SOLUTION_ARCHITECT",
    REFERRER = "REFERRER",
    VENDEDOR = "VENDEDOR",
}

export enum Actions {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
}

export enum Bloqueado {
    TRUE = "true",
    FALSE = "false",
}
