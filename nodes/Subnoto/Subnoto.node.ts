import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { SubnotoClient } from "@subnoto/api-client";

/* eslint-disable @n8n/community-nodes/icon-validation -- icon is in subnotoDescription (separate module) */
import { subnotoDescription } from "./Subnoto.description";
import { executeAddBlocks } from "./operations/addBlocks";
import { executeAddRecipients } from "./operations/addRecipients";
import { executeContactCreate } from "./operations/contactCreate";
import { executeContactDelete } from "./operations/contactDelete";
import { executeContactGet } from "./operations/contactGet";
import { executeContactList } from "./operations/contactList";
import { executeContactUpdate } from "./operations/contactUpdate";
import { executeCreateFromTemplate } from "./operations/createFromTemplate";
import { executeEnvelopeDelete } from "./operations/envelopeDelete";
import { executeEnvelopeGet } from "./operations/envelopeGet";
import { executeEnvelopeList } from "./operations/envelopeList";
import { executeEnvelopeUpdate } from "./operations/envelopeUpdate";
import { executeSend } from "./operations/send";
import { executeTemplateList } from "./operations/templateList";
import { executeUploadDocument } from "./operations/uploadDocument";
import { executeUploadDocumentAndSend } from "./operations/uploadDocumentAndSend";
import { executeWhoami } from "./operations/whoami";
import { executeWorkspaceList } from "./operations/workspaceList";

const NO_INPUT_OPERATIONS = new Set([
    "workspace:list",
    "template:list",
    "contact:list",
    "envelope:list",
    "utils:whoami",
]);

function pushResults(returnData: IDataObject[], result: IDataObject | IDataObject[]): void {
    if (Array.isArray(result)) {
        for (const entry of result) {
            returnData.push(entry);
        }
        return;
    }
    returnData.push(result);
}

export class Subnoto implements INodeType {
    description = subnotoDescription;

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials("subnotoApi");
        if (!credentials?.apiBaseUrl || !credentials?.accessKey || !credentials?.secretKey) {
            throw new NodeOperationError(
                this.getNode(),
                "Subnoto API credentials (apiBaseUrl, accessKey, secretKey) are required",
            );
        }

        const client = new SubnotoClient({
            apiBaseUrl: credentials.apiBaseUrl as string,
            accessKey: credentials.accessKey as string,
            secretKey: credentials.secretKey as string,
            unattested: (credentials.unattested as boolean) ?? false,
        });

        const resource = this.getNodeParameter("resource", 0) as string;
        const operation = this.getNodeParameter("operation", 0) as string;
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const operationKey = `${resource}:${operation}`;

        const executeOperation = async (
            itemIndex: number,
        ): Promise<IDataObject | IDataObject[]> => {
            switch (operationKey) {
                case "workspace:list":
                    return executeWorkspaceList(this, client);
                case "utils:whoami":
                    return executeWhoami(this, client);
                case "template:list":
                    return executeTemplateList.call(this, itemIndex, client);
                case "contact:list":
                    return executeContactList.call(this, itemIndex, client);
                case "contact:create":
                    return executeContactCreate.call(this, itemIndex, client, items);
                case "contact:get":
                    return executeContactGet.call(this, itemIndex, client, items);
                case "contact:update":
                    return executeContactUpdate.call(this, itemIndex, client, items);
                case "contact:delete":
                    return executeContactDelete.call(this, itemIndex, client, items);
                case "envelope:list":
                    return executeEnvelopeList.call(this, itemIndex, client);
                case "envelope:uploadDocument":
                    return executeUploadDocument.call(this, itemIndex, client, items);
                case "envelope:uploadDocumentAndSend":
                    return executeUploadDocumentAndSend.call(this, itemIndex, client, items);
                case "envelope:createFromTemplate":
                    return executeCreateFromTemplate.call(this, itemIndex, client, items);
                case "envelope:addRecipients":
                    return executeAddRecipients.call(this, itemIndex, client, items);
                case "envelope:addBlocks":
                    return executeAddBlocks.call(this, itemIndex, client, items);
                case "envelope:send":
                    return executeSend.call(this, itemIndex, client, items);
                case "envelope:get":
                    return executeEnvelopeGet.call(this, itemIndex, client, items);
                case "envelope:update":
                    return executeEnvelopeUpdate.call(this, itemIndex, client, items);
                case "envelope:delete":
                    return executeEnvelopeDelete.call(this, itemIndex, client, items);
                default:
                    throw new NodeOperationError(
                        this.getNode(),
                        `Unknown operation "${operation}" for resource "${resource}"`,
                    );
            }
        };

        if (NO_INPUT_OPERATIONS.has(operationKey) && items.length === 0) {
            try {
                pushResults(returnData, await executeOperation(0));
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: (error as Error).message });
                } else {
                    const message = error instanceof Error ? error.message : String(error);
                    throw new NodeOperationError(this.getNode(), message);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        }

        const loopCount = Math.max(items.length, 1);
        for (let i = 0; i < loopCount; i++) {
            try {
                if (NO_INPUT_OPERATIONS.has(operationKey) && i > 0) {
                    continue;
                }
                pushResults(returnData, await executeOperation(i));
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        ...(items[i]?.json as IDataObject),
                        error: (error as Error).message,
                    });
                } else {
                    const message = error instanceof Error ? error.message : String(error);
                    throw new NodeOperationError(this.getNode(), message);
                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
