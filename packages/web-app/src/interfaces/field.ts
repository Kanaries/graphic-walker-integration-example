/**
 * The `IResponse` type represents a response object that can be either successful or unsuccessful.
 * 
 * If the response is successful, it will have a `success` property set to `true` and a `data` property containing the response data of type `T`.
 * 
 * If the response is unsuccessful, it will have a `success` property set to `false`, a `message` property containing an error message, and an optional `error` property. The `error` property, if present, is an object that contains a `code` property and an optional `options` property. The `code` property is a string that starts with "ERR_" and is followed by an uppercase string. The `options` property, if present, is a record of string key-value pairs.
 * 
 * @template T The type of the `data` property in a successful response.
 */
export type IResponse<T> = (
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        message: string;
        error?: {
            code: `ERR_${Uppercase<string>}`;
            options?: Record<string, string>;
        };
    }
);

/**
 * Represents a row in the original data stored in a row-based format. Each key-value pair represents a field in the row.
 */
export type IRow = Record<string, string | number | boolean | null | undefined>;

/**
 * Represents the semantic type of a field in visualization.
 * + `quantitative`: quantitative data, e.g. numbers
 * + `ordinal`: ordinal data, e.g. ranks
 * + `nominal`: nominal data, e.g. names, categories
 * + `temporal`: temporal data, e.g. dates, times
 */
export type ISemanticType = (
    | 'quantitative' | 'ordinal' | 'nominal' | 'temporal'
);

/**
 * Represents the analytic type of a field when participating in algebraic calculations in _GraphicWalker_.
 */
export type IAnalyticType = 'dimension' | 'measure';

/**
 * Represents the specific meaning of a field that can fully identify the geographic information of a record.
 */
export type IGeoRoleFeatureKey = string;

export type IGeoRole = (
    | 'none' | IGeoRoleFeatureKey
);

export type IExpParameter = (
    | {
        type: 'field';
        value: string;
    }
    | {
        type: 'value';
        value: any;
    }
    | {
        type: 'expression';
        value: IExpression;
    }
    | {
        type: 'constant';
        value: any;
    }
);

export interface IExpression {
    op: 'bin' | 'log2' | 'log10' | 'one' | 'binCount';
    params: IExpParameter[];
    as: string;
}

/**
 * The minimum structure of a field.
 */
export interface IDataField {
    /**
     * fid: key in data record
     */
    fid: string;
    /**
     * display name of field
     */
    name: string;
    desc: string;
    semanticType: ISemanticType;
}

/**
 * The field definition in _GraphicWalker_.
 */
export interface IField extends IDataField {
    /**
     * aggregator's name
     */
    aggName?: string;
    analyticType: IAnalyticType;
    cmp?: (a: any, b: any) => number;
    computed?: boolean;
    expression?: IExpression;
}

/**
 * Represents a field under the edit view of _GraphicWalker_.
 */
export interface IViewField extends IField {
    dragId: string;
    sort?: 'none' | 'ascending' | 'descending';
}

export type IFilterRule = (
    | {
        type: 'range';
        value: readonly [number, number];
    }
    | {
        type: 'temporal range';
        value: readonly [number, number];
    }
    | {
        type: 'one of';
        value: Set<string | number>;
    }
);

/**
 * Represents a project that is bound with a filter rule in _GraphicWalker_.
 */
export interface IFilterField extends IViewField {
    rule: IFilterRule | null;
}

/**
 * Represents an aggregation method supported by _GraphicWalker_.
 */
export type IAggregator = 'sum' | 'count' | 'max' | 'min' | 'mean' | 'median' | 'variance' | 'stdev';

export interface IAggQuery {
    op: 'aggregate';
    groupBy: string[];
    measures: { field: string; agg: IAggregator; asFieldKey: string }[];
}

export interface IFoldQuery {
    op: 'fold';
    foldBy: string[];
    newFoldKeyCol: string;
    newFoldValueCol: string;
}

export interface IBinQuery {
    op: 'bin';
    binBy: string;
    newBinCol: string;
    binSize: number;
}


export interface IRawQuery {
    op: 'raw';
    fields: string[];
}

export type IViewQuery = IAggQuery | IFoldQuery | IBinQuery | IRawQuery;

export interface IFilterWorkflowStep {
    type: 'filter';
    filters: {
        [key in keyof Pick<IFilterField, 'fid' | 'rule'>]: NonNullable<IFilterField[key]>;
    }[];
}

export interface ITransformWorkflowStep {
    type: 'transform';
    transform: {
        [key in keyof Pick<IViewField, 'fid' | 'expression'>]-?: NonNullable<IViewField[key]>;
    }[];
}

export interface IViewWorkflowStep {
    type: 'view';
    query: IViewQuery[];
}

export type IDataQueryWorkflowStep = IFilterWorkflowStep | ITransformWorkflowStep | IViewWorkflowStep;
