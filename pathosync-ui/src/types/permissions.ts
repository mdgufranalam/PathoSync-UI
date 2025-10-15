export type Module = string;
export type Action = string;

export interface Permission {
  id: string;
  module: Module;
  action: Action;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
