
import { Action } from "../enums/action.enum";
import { Resource } from "../enums/resource.enum";
import { PermissionString } from "../types/permission-string.type";

export class PermissionStringGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(resource: Resource, action: Action): PermissionString {
    const permissionString : PermissionString = `${resource}:${action}`;
    return permissionString;
    }
}   