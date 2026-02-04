import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { SubnotoClient } from "@subnoto/api-client";

/* eslint-disable @n8n/community-nodes/icon-validation -- icon is in subnotoDescription (separate module) */
import { subnotoDescription } from "./Subnoto.description";
import { executeWorkspaceList } from "./operations/workspaceList";
import { executeUploadDocument } from "./operations/uploadDocument";
import { executeAddRecipients } from "./operations/addRecipients";
import { executeAddBlocks } from "./operations/addBlocks";
import { executeSend } from "./operations/send";

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

        if (resource === "workspace" && operation === "list" && items.length === 0) {
            const workspaces = await executeWorkspaceList(client);
            for (const w of workspaces) {
                returnData.push(w);
            }
            return [this.helpers.returnJsonArray(returnData)];
        }

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === "workspace") {
                    if (operation === "list") {
                        if (i === 0) {
                            const workspaces = await executeWorkspaceList(client);
                            for (const w of workspaces) {
                                returnData.push(w);
                            }
                        }
                        continue;
                    }
                } else if (resource === "envelope") {
                    let result: IDataObject | IDataObject[];
                    if (operation === "uploadDocument") {
                        result = await executeUploadDocument.call(this, i, client, items);
                    } else if (operation === "addRecipients") {
                        result = await executeAddRecipients.call(this, i, client, items);
                    } else if (operation === "addBlocks") {
                        result = await executeAddBlocks.call(this, i, client, items);
                    } else if (operation === "send") {
                        result = await executeSend.call(this, i, client, items);
                    } else {
                        continue;
                    }
                    if (Array.isArray(result)) {
                        for (const r of result) {
                            returnData.push(r);
                        }
                    } else {
                        returnData.push(result);
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { ...items[i].json, error: (error as Error).message },
                        error: (error as Error).message,
                    });
                } else {
                    throw error;
                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
