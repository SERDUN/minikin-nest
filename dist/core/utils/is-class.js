/// This function checks if the provided object is a class by checking for the presence of a "prototype" property.
export function isClass(obj) {
    return "prototype" in obj;
}
