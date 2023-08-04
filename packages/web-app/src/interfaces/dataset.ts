import type { ISemanticType } from "./field";


/**
 * the type given in the original data (if exists)
 */
export type IDataType = string;

export interface IDatasetFieldMeta {
    fid: string;
    name: string;
    semanticType: ISemanticType;
}

export interface IDatasetInfo {
    datasetId: string;
    name: string;
}

export interface IDataset extends IDatasetInfo {
    fieldsMeta: IDatasetFieldMeta[];
}
