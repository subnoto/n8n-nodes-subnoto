/* eslint-disable n8n-nodes-base/node-filename-against-convention -- description in separate file by design */
import { NodeConnectionTypes, type INodeTypeDescription } from "n8n-workflow";
import { contactFields, contactOperations } from "./descriptions/contact.description";
import { envelopeFields, envelopeOperations } from "./descriptions/envelope.description";
import { templateFields, templateOperations } from "./descriptions/template.description";
import { utilsFields, utilsOperations } from "./descriptions/utils.description";
import { workspaceFields, workspaceOperations } from "./descriptions/workspace.description";

const subnotoDescriptionBase: Omit<INodeTypeDescription, "credentials"> = {
    displayName: "Subnoto",
    name: "subnoto",
    icon: "file:Subnoto.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    description: "Manage envelopes, templates, contacts, and workspaces via the Subnoto API",
    defaults: {
        name: "Subnoto",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
        {
            displayName: "Resource",
            name: "resource",
            type: "options",
            options: [
                { name: "Contact", value: "contact" },
                { name: "Envelope", value: "envelope" },
                { name: "Template", value: "template" },
                { name: "Util", value: "utils" },
                { name: "Workspace", value: "workspace" },
            ],
            default: "envelope",
            noDataExpression: true,
            required: true,
        },
        ...envelopeOperations,
        ...workspaceOperations,
        ...templateOperations,
        ...contactOperations,
        ...utilsOperations,
        ...envelopeFields,
        ...workspaceFields,
        ...templateFields,
        ...contactFields,
        ...utilsFields,
    ],
};

export const subnotoDescription: INodeTypeDescription = {
    ...subnotoDescriptionBase,
    credentials: [
        {
            name: "subnotoApi",
            required: true,
            testedBy: "subnotoApiTest",
        },
    ],
};
