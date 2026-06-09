import type { INodeProperties } from "n8n-workflow";

export const utilsOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: { resource: ["utils"] },
        },
        options: [
            {
                name: "Who Am I",
                value: "whoami",
                description: "Get information about the authenticated team and API key",
                action: "Who am I",
            },
        ],
        default: "whoami",
        noDataExpression: true,
    },
];

export const utilsFields: INodeProperties[] = [];
