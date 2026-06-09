import type { INodeProperties } from "n8n-workflow";
import { pageField, workspaceUuidField } from "./shared.description";

export const templateOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: { resource: ["template"] },
        },
        options: [
            {
                name: "List",
                value: "list",
                description: "List all templates accessible by the team",
                action: "List templates",
            },
        ],
        default: "list",
        noDataExpression: true,
    },
];

export const templateFields: INodeProperties[] = [
    workspaceUuidField({
        show: { resource: ["template"], operation: ["list"] },
    }),
    pageField({
        show: { resource: ["template"], operation: ["list"] },
    }),
];
