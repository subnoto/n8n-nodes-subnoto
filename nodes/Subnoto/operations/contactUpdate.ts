import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeContactUpdate(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const email = this.getNodeParameter("email", i) as string;
    const firstname = this.getNodeParameter("firstname", i) as string;
    const lastname = this.getNodeParameter("lastname", i) as string;
    const phone = this.getNodeParameter("phone", i, "") as string;
    const language = this.getNodeParameter("language", i, "") as string;
    const jobTitle = this.getNodeParameter("jobTitle", i, "") as string;
    const company = this.getNodeParameter("company", i, "") as string;
    const addressLine1 = this.getNodeParameter("addressLine1", i, "") as string;
    const addressLine2 = this.getNodeParameter("addressLine2", i, "") as string;
    const zipCode = this.getNodeParameter("zipCode", i, "") as string;
    const city = this.getNodeParameter("city", i, "") as string;
    const country = this.getNodeParameter("country", i, "") as string;

    const contact: Record<string, unknown> = {
        email,
        firstname,
        lastname,
        phone: phone.trim() || null,
    };
    if (language) {
        contact.language = language;
    }
    if (jobTitle.trim()) {
        contact.jobTitle = jobTitle.trim();
    }
    if (company.trim()) {
        contact.company = company.trim();
    }
    if (addressLine1.trim()) {
        contact.addressLine1 = addressLine1.trim();
    }
    if (addressLine2.trim()) {
        contact.addressLine2 = addressLine2.trim();
    }
    if (zipCode.trim()) {
        contact.zipCode = zipCode.trim();
    }
    if (city.trim()) {
        contact.city = city.trim();
    }
    if (country.trim()) {
        contact.country = country.trim();
    }

    await callSubnotoPost(this, client, "/public/contact/update", {
        body: withOptionalWorkspace({ contact }, workspaceUuid),
    });

    return {
        email,
        success: true,
        json: items[i].json,
    };
}
