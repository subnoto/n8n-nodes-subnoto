import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeEnvelopeDelete(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;

    await callSubnotoPost(this, client, "/public/envelope/delete", {
        body: withOptionalWorkspace({ envelopeUuid }, workspaceUuid),
    });

    return {
        envelopeUuid,
        success: true,
        json: items[i].json,
    };
}
