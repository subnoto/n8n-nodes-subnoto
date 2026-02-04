import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";

export async function executeUploadDocument(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
    const envelopeTitle = this.getNodeParameter("envelopeTitle", i) as string;
    const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i) as string;

    this.helpers.assertBinaryData(i, binaryPropertyName);
    const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
    if (!fileBuffer) {
        throw new Error(`No binary data found for property "${binaryPropertyName}"`);
    }

    const result = await client.uploadDocument({
        workspaceUuid,
        fileBuffer,
        envelopeTitle,
    });

    return {
        ...(items[i].json as IDataObject),
        envelopeUuid: result.envelopeUuid,
        documentUuid: result.documentUuid,
    };
}
