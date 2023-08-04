import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMainStore } from "../store/mainStore";
import { getDataset, updateDatasetMeta } from "../services/dataset";
import { useNotification } from "../notify";
import { cn } from "../utils/cn";
import Confirm from "../components/confirm";


const DatasetHandle = observer(function DatasetHandle() {
    const mainStore = useMainStore();
    const { dataset, hasUnsavedChanges, writableFields } = mainStore;
    const { notify } = useNotification();
    const [datasetId, setDatasetId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const submitDatasetId = useCallback(async (id: string) => {
        setDatasetId(id);
        try {
            setLoading(true);
            const res = await getDataset(id);
            mainStore.openDataset(res);
        } catch (error) {
            notify({
                type: 'error',
                title: 'Error',
                message: `${error}`,
            }, 3_000);
        } finally {
            setLoading(false);
        }
    }, [mainStore, notify]);

    const handleWillCloseDataset = () => {
        if (hasUnsavedChanges) {
            setShowCloseConfirm(true);
        } else {
            mainStore.closeDataset();
        }
    };

    useEffect(() => {
        setShowCloseConfirm(false);
        setDatasetId('');
    }, [dataset]);

    useEffect(() => {
        const datasetId = new URLSearchParams(window.location.search).get('datasetId');
        if (datasetId) {
            submitDatasetId(datasetId);
        }
    }, [submitDatasetId]);

    const handleSubmitChanges = async () => {
        if (!dataset) {
            return;
        }
        try {
            setSubmitting(true);
            const nextFields = await updateDatasetMeta(dataset.datasetId, writableFields);
            // refresh dataset
            mainStore.openDataset({
                ...dataset,
                fieldsMeta: nextFields,
            });
        } catch (error) {
            console.error(error);
            notify({
                type: 'error',
                title: 'Error',
                message: `${error}`,
            }, 3_000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <label htmlFor="dataset-id" className="font-medium text-gray-700">
                Dataset ID
            </label>
            <div className="flex space-x-2 items-stretch">
                <input
                    id="dataset-id"
                    type="text"
                    className={cn(
                        'border-2 border-gray-200 rounded-md p-2 w-64',
                        loading && 'bg-gray-100 cursor-default opacity-50',
                    )}
                    placeholder="Enter dataset ID"
                    readOnly={loading || Boolean(dataset)}
                    value={dataset?.datasetId ?? datasetId}
                    onChange={e => !dataset && !loading && setDatasetId(e.target.value)}
                />
                <button
                    className={cn(
                        'px-4 py-2 rounded-md w-24',
                        loading && 'bg-gray-50 cursor-default flex items-center justify-center',
                        loading || 'bg-blue-500 text-white hover:bg-blue-600 disabled:!bg-gray-500 disabled:cursor-default disabled:opacity-20',
                    )}
                    disabled={loading || Boolean(dataset) || !datasetId.trim()}
                    onClick={() => !dataset && !loading && submitDatasetId(datasetId)}
                >
                    {loading || 'Submit'}
                    {loading && (
                        <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-25"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    )}
                </button>
            </div>
            {Boolean(dataset) && (
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:!bg-gray-500 disabled:cursor-default disabled:opacity-20"
                        onClick={() => handleSubmitChanges()}
                        disabled={submitting || !hasUnsavedChanges}
                    >
                        Submit Changes
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:!bg-gray-500 disabled:cursor-default disabled:opacity-20"
                        onClick={() => handleWillCloseDataset()}
                        disabled={submitting}
                    >
                        Close Dataset
                    </button>
                </div>
            )}
            <Confirm
                open={showCloseConfirm}
                title="Close Dataset"
                message="Are you sure you want to close this dataset? All unsaved changes will be lost."
                onCancel={() => setShowCloseConfirm(false)}
                onConfirm={() => mainStore.closeDataset()}
            />
        </div>
    );
});


export default DatasetHandle;
