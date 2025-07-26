import { Request, Response } from "express";
import { ArgumentMetadata, extractParams, get, Type } from "../utils";
import { runPipes } from "../decorators/use-pipes";

class PipeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PipeError";
    }
}

// getHandlerArgs is a utility function that retrieves the arguments for a specific handler method on a controller.
//
// controller: The controller class that contains the handler method.
// handler: The specific method on the controller for which to retrieve arguments.
// req: The incoming request object containing parameters to be extracted.
// globalPipes: An array of global pipes that should be applied to the handler arguments.
const getHandlerArgs = async (controller: Function, handler: Function, req: Request, globalPipes: Array<Type>) => {
    console.log("Handler: ", handler.name);
    // Get parameter metadata for the controller
    const paramMeta: Array<ArgumentMetadata> = get('mini:params', controller) ?? [];
    // Filter metadata for the specific handler (method) example: getUser
    const methodMeta: Array<ArgumentMetadata> = paramMeta.filter(m => m.name === handler.name);
    console.log("Method metadata:", methodMeta, "for handler:", handler.name);
    // Sort the metadata by index to ensure parameters are processed in the correct order
    const sortedMeta = [...methodMeta].sort((a, b) => a.index - b.index);

    const args: any[] = [];
    console.log("Arguments metadata sorted:", args);
    for (const metadata of sortedMeta) {
        const extracted = extractParams(req, metadata.type);
        const argument = metadata.data ? extracted[metadata.data] : extracted;

        try {
            args[metadata.index] = await runPipes(controller, handler, argument, metadata, globalPipes);
        } catch (error: any) {
            throw new PipeError(`Pipe error for: ${error.message}`);
        }
    }

    return args;
}

// HandlerMiddleware is a middleware function that processes incoming requests, extracts parameters based on metadata, applies pipes for validation/transformation, and invokes the specified handler method on the controller instance.
//
// instance: The controller instance that contains the handler method. example: UserController
// handler: The specific method on the controller to be invoked. example: getUser
// globalPipes: An array of global pipes that should be applied to the handler arguments. example: [ValidationPipe, TransformPipe]
export const HandlerMiddleware = (instance: Type, handler: Function, globalPipes: Array<Type>) => {
    return async (req: Request, res: Response) => {
        console.log("Handelr: ", handler.name);
        // Get the handler arguments by extracting parameters from the request and applying pipes
        const args = await getHandlerArgs(instance.constructor, handler, req, globalPipes);
        const result = await handler.apply(instance, args);
        res.json(result);
    }
}
