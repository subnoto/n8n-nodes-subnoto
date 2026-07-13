import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeEnvelopeUpdate(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;
    const title = this.getNodeParameter("title", i, "") as string;
    const tagsRaw = this.getNodeParameter("tags", i, "") as string;
    const expirationPeriod = this.getNodeParameter("expirationPeriod", i, 0) as number;
    const reminderFrequencyPeriod = this.getNodeParameter("reminderFrequencyPeriod", i, "") as
        string | number;
    const customInvitationMessage = this.getNodeParameter(
        "customInvitationMessage",
        i,
        "",
    ) as string;
    const signatureOrder = this.getNodeParameter("signatureOrder", i, false) as boolean;
    const useUserAsSenderName = this.getNodeParameter("useUserAsSenderName", i, false) as boolean;

    const update: Record<string, unknown> = {};
    if (title.trim()) {
        update.title = title.trim();
    }
    if (tagsRaw.trim()) {
        update.tags = tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }
    if (expirationPeriod > 0) {
        update.expirationPeriod = expirationPeriod;
    }
    if (reminderFrequencyPeriod !== "" && reminderFrequencyPeriod !== null) {
        update.reminderFrequencyPeriod =
            reminderFrequencyPeriod === "null" ? null : Number(reminderFrequencyPeriod);
    }
    if (customInvitationMessage.trim()) {
        update.customInvitationMessage = customInvitationMessage.trim();
    }
    if (signatureOrder) {
        update.signatureOrder = true;
    }
    if (useUserAsSenderName) {
        update.useUserAsSenderName = true;
    }

    const data = await callSubnotoPost(this, client, "/public/envelope/update", {
        body: withOptionalWorkspace({ envelopeUuid, update }, workspaceUuid),
    });

    return {
        ...(items[i].json as IDataObject),
        envelopeUuid,
        ...(data as IDataObject),
    };
}
