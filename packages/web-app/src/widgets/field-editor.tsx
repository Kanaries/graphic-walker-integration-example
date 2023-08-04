import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMainStore } from "../store/mainStore";
import type { IRow, ISemanticType } from "../interfaces";
import { getDatasetPreview } from "../services/dataset";
import { useNotification } from "../notify";


const defaultPreviewLimit = 100;
const previewLimitStorageKey = 'previewLimit';

const SemanticTypes = [
    'quantitative',
    'nominal',
    'ordinal',
    'temporal',
] satisfies ISemanticType[];

const FieldEditor = observer(function FieldEditor() {
    const mainStore = useMainStore();
    const { dataset, writableFields } = mainStore;
    const { notify } = useNotification();
    const [limit, setLimit] = useState(defaultPreviewLimit);
    const [limitInput, setLimitInput] = useState(`${defaultPreviewLimit}`);
    const [previewData, setPreviewData] = useState<IRow[]>([]);
    const [previewLoading, setPreviewLoading] = useState(false);

    useEffect(() => {
        const storedLimit = localStorage.getItem(previewLimitStorageKey);
        localStorage.removeItem(previewLimitStorageKey);
        if (storedLimit) {
            const val = parseInt(storedLimit);
            if (!Number.isNaN(val)) {
                setLimit(val);
            }
        }
    }, []);

    useEffect(() => {
        setLimitInput(`${limit}`);
        if (limit !== defaultPreviewLimit) {
            localStorage.setItem(previewLimitStorageKey, limit.toString());
        }
    }, [limit]);

    const fetchPreviewData = useCallback(async () => {
        if (!dataset) {
            return;
        }
        try {
            setPreviewLoading(true);
            const data = await getDatasetPreview(dataset.datasetId, limit);
            setPreviewData(data);
        } catch (error) {
            notify({
                type: 'error',
                title: 'Error',
                message: `${error}`,
            }, 3_000);
        } finally {
            setPreviewLoading(false);
        }
    }, [limit, dataset, notify]);

    useEffect(() => {
        fetchPreviewData();
    }, [fetchPreviewData]);

    if (!dataset) {
        return null;
    }

    return (
        <div className="w-full p-8 bg-white shadow-md rounded-md space-y-4">
            <div className="flex space-x-2 items-stretch">
                <input
                    type="number"
                    className="border-2 border-gray-200 rounded-md p-2 w-20"
                    value={limitInput}
                    onChange={e => setLimitInput(e.target.value)}
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-default disabled:!bg-blue-500 disabled:!text-white hover:bg-blue-600 transition-colors duration-200"
                    disabled={previewLoading || !Number.isInteger(Number(limitInput)) || limitInput === `${limit}`}
                    onClick={() => setLimit(parseInt(limitInput))}
                >
                    Preview
                </button>
            </div>

            <div className="w-full max-h-[80vh] overflow-auto relative">
                <table className="table-auto">
                    <thead className="sticky top-0 z-40 bg-white border-b-2 border-gray-200">
                        <tr>
                            {writableFields.map(field => (
                                <th key={field.fid} className="px-4 py-2">
                                    <div className="flex space-x-2 items-center">
                                        <span className="whitespace-nowrap">{field.name || field.fid}</span>
                                        <select
                                            value={field.semanticType}
                                            onChange={e => mainStore.updateFieldProperty(field.fid, 'semanticType', e.target.value as ISemanticType)}
                                        >
                                            {/* Render options for property1 */}
                                            {SemanticTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {previewData.length === 0 && (
                            <tr>
                                <td colSpan={writableFields.length}>
                                    No data
                                </td>
                            </tr>
                        )}
                        {previewData.length !== 0 && (
                            // Render data rows
                            previewData.map((row, i) => (
                                <tr key={i}>
                                    {writableFields.map(field => {
                                        const val = row[field.fid];
                                        return (
                                            <td key={field.fid} className="px-4 py-2">
                                                {typeof val === 'number' && val.toLocaleString()}
                                                {typeof val !== 'number' && `${val}`}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {previewLoading && (
                    <div className="absolute z-10 inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-brightness-150">
                        <p className="text-2xl font-bold">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
});


export default FieldEditor;
