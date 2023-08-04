import request, { resolveServiceUrl, unwrap } from "./utils";
import type { IDataQueryWorkflowStep, IDataset, IRow } from "../interfaces";


interface IGetDatasetPayload {
    datasetId: string;
}

export const getDataset = async (datasetId: string): Promise<IDataset> => {
    const url = resolveServiceUrl('/meta/query');
    const res = unwrap(await request.get<IGetDatasetPayload, IDataset>(url, { datasetId }));
    return res;
};

interface IUpdateDatasetMetaPayload {
    datasetId: string;
    fieldsMeta: IDataset['fieldsMeta'];
}

export const updateDatasetMeta = async (datasetId: string, fieldsMeta: IDataset['fieldsMeta']): Promise<IDataset['fieldsMeta']> => {
    const url = resolveServiceUrl('/meta/update');
    const res = unwrap(await request.post<IUpdateDatasetMetaPayload, Pick<IDataset, 'fieldsMeta'>>(url, { datasetId, fieldsMeta }));
    return res.fieldsMeta;
};

interface IGetDatasetPreviewPayload {
    datasetId: string;
    payload: {
        workflow: IDataQueryWorkflowStep[];
        limit: number;
        offset: number;
    };
}

// interface IGetDatasetPreviewResult {
//     compiledSQL: string;
//     data: IRow[];
// }

export const getDatasetPreview = async (datasetId: string, limit: number): Promise<IRow[]> => {
    const url = resolveServiceUrl('/dsl/query');
    const res = unwrap(await request.post<IGetDatasetPreviewPayload, IRow[]>(url, {
        datasetId,
        payload: {
            workflow: [{
                type: 'view',
                query: [{
                    op: 'raw',
                    fields: ['*'],
                }],
            }],
            limit,
            offset: 0,
        },
    }));
    return res;
};

export const queryData = async (args: any): Promise<IRow[]> => {
    const url = resolveServiceUrl('/dsl/query');
    const res = unwrap(await request.post<any, IRow[]>(url, {
        datasetId: args.datasetId,
        payload: args.query,
    }));
    return res;
};
