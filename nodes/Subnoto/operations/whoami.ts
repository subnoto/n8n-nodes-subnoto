import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";

export async function executeWhoami(
    executeFunctions: IExecuteFunctions,
    client: SubnotoClient,
): Promise<IDataObject> {
    return (await callSubnotoPost(executeFunctions, client, "/public/utils/whoami", {
        body: {},
    })) as IDataObject;
}
