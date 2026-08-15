import { Optional, FindParams, UserEntity } from "./commom";
import { UserRole } from "./user-role";

export type Organization = {
    id: string;
    name: string;
    empresaLogoSrc: string | null;
    empresaLogo: { fileName: string; buffer: ArrayBuffer; mimetype: string } | null;
    cnpj: string;
    userRoles: UserRole[];
    createdAt: Date;
    updatedAt: Date;
};

export type OrganizationWhere = Optional<UserEntity>;
export type OrganizationSortBy = Pick<Organization, "name" | "createdAt">;
export type OrganizationQueryProps = FindParams<OrganizationWhere, OrganizationSortBy>;

export type NewOrganization = Pick<Organization, "name" | "cnpj"> & { logo: File | null };
export type EditOrganizationData = NewOrganization & Pick<Organization, "id">;
