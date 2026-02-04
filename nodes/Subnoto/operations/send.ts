import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";

export async function executeSend(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
    const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;
    const customInvitationMessage = this.getNodeParameter("customInvitationMessage", i) as string;

    await client.POST("/public/envelope/send", {
        body: {
            workspaceUuid,
            envelopeUuid,
            ...(customInvitationMessage ? { customInvitationMessage } : {}),
        },
    });

    return {
        envelopeUuid,
        success: true,
        json: items[i].json,
    };
}
