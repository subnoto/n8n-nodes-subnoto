import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

function mapContactFields(c: IDataObject): IDataObject {
    const contact: IDataObject = {
        email: c.email,
        firstname: c.firstname ?? "",
        lastname: c.lastname ?? "",
    };
    if (c.phone) {
        contact.phone = c.phone;
    }
    if (c.language) {
        contact.language = c.language;
    }
    if (c.jobTitle) {
        contact.jobTitle = c.jobTitle;
    }
    if (c.company) {
        contact.company = c.company;
    }
    if (c.addressLine1) {
        contact.addressLine1 = c.addressLine1;
    }
    if (c.addressLine2) {
        contact.addressLine2 = c.addressLine2;
    }
    if (c.zipCode) {
        contact.zipCode = c.zipCode;
    }
    if (c.city) {
        contact.city = c.city;
    }
    if (c.country) {
        contact.country = c.country;
    }
    return contact;
}

export async function executeContactCreate(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const contactsCollection = this.getNodeParameter("contacts", i) as {
        contact?: IDataObject[];
    };
    const contactList = contactsCollection?.contact ?? [];
    const contacts = contactList.map(mapContactFields);

    await callSubnotoPost(this, client, "/public/contact/create", {
        body: withOptionalWorkspace({ contacts }, workspaceUuid),
    });

    return {
        success: true,
        contactCount: contacts.length,
        json: items[i].json,
    };
}
