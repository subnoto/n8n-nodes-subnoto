import type { INodeProperties } from "n8n-workflow";

export const workspaceOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: { resource: ["workspace"] },
        },
        options: [
            {
                name: "List",
                value: "list",
                description: "List all workspaces the API key owner is a member of",
                action: "List workspaces",
            },
        ],
        default: "list",
        noDataExpression: true,
    },
];

export const workspaceFields: INodeProperties[] = [];
