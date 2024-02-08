export enum ValidRoles {
  admin = 'admin',
  colaborator = 'colaborator',
  client = 'client',
}

export const auditCodeRoles = [ValidRoles.admin, ValidRoles.colaborator];
export const adminCodeRoles = [ValidRoles.admin];
