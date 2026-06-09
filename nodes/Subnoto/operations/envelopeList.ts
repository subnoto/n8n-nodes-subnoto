import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

const ENVELOPE_STATUSES = [
    "uploading",
    "draft",
    "approving",
    "signing",
    "complete",
    "declined",
    "canceled",
    "expired",
] as const;

export async function executeEnvelopeList(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
): Promise<IDataObject[]> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const page = this.getNodeParameter("page", i, 1) as number;
    const tagsRaw = this.getNodeParameter("tags", i, "") as string;
    const statusFilter = this.getNodeParameter("status", i, []) as string[];

    const body: Record<string, unknown> = { page };
    if (tagsRaw.trim()) {
        body.tags = tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }
    if (statusFilter.length > 0) {
        body.status = statusFilter.filter((s) =>
            (ENVELOPE_STATUSES as readonly string[]).includes(s),
        );
    }

    const data = await callSubnotoPost(this, client, "/public/envelope/list", {
        body: withOptionalWorkspace(body, workspaceUuid),
    });
    const envelopes = (data as { envelopes?: IDataObject[] }).envelopes ?? [];
    return envelopes.map((e) => e as IDataObject);
}
