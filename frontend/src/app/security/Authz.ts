export type Permission =
  | "org:read"
  | "user:read"
  | "role:read"
  | "policy:read"
  | "policy:write"
  | "audit:read";

export function hasPermission(perms: Permission[], p: Permission) {
  return perms.includes(p);
}
