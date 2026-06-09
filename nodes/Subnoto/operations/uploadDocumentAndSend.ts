import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { getErrorMessage } from "@subnoto/api-client";
import { NodeOperationError } from "n8n-workflow";
import { mapBlocks } from "../helpers/mapBlocks";
import { mapRecipients } from "../helpers/mapRecipients";
import { getOptionalWorkspaceUuid } from "../helpers/workspaceBody";

export async function executeUploadDocumentAndSend(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const envelopeTitle = this.getNodeParameter("envelopeTitle", i) as string;
    const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i) as string;
    const customInvitationMessage = this.getNodeParameter(
        "customInvitationMessage",
        i,
        "",
    ) as string;
    const recipientsCollection = this.getNodeParameter("recipients", i) as {
        recipient?: IDataObject[];
    };
    const blocksCollection = this.getNodeParameter("blocks", i) as {
        block?: IDataObject[];
    };

    this.helpers.assertBinaryData(i, binaryPropertyName);
    const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
    if (!fileBuffer) {
        throw new NodeOperationError(
            this.getNode(),
            `No binary data found for property "${binaryPropertyName}"`,
        );
    }

    const recipients = mapRecipients(recipientsCollection);
    const blockList = blocksCollection?.block ?? [];
    const blocks = blockList.length > 0 ? mapBlocks(blocksCollection) : undefined;

    try {
        const result = await client.uploadDocumentAndSend({
            ...(workspaceUuid ? { workspaceUuid } : {}),
            fileBuffer,
            envelopeTitle,
            recipients: recipients as Parameters<
                typeof client.uploadDocumentAndSend
            >[0]["recipients"],
            ...(blocks
                ? {
                      blocks: blocks as Parameters<
                          typeof client.uploadDocumentAndSend
                      >[0]["blocks"],
                  }
                : {}),
            ...(customInvitationMessage.trim()
                ? { options: { customInvitationMessage: customInvitationMessage.trim() } }
                : {}),
        });

        return {
            ...(items[i].json as IDataObject),
            envelopeUuid: result.envelopeUuid,
            documentUuid: result.documentUuid,
            success: true,
        };
    } catch (error) {
        throw new NodeOperationError(this.getNode(), getErrorMessage(error));
    }
}
