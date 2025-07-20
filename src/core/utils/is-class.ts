import { Type } from "./types";

/// This function checks if the provided object is a class by checking for the presence of a "prototype" property.
export function isClass<T>(obj: any): obj is Type<T> {
    return "prototype" in obj;
}
