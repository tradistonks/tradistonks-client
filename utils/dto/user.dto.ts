export interface UserDTO {
  _id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface UserWithPermissionsDTO extends UserDTO {
  permissions: string[];
}
