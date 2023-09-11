import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { GraphicWalker } from "@kanaries/graphic-walker";
import type { IMutField } from "@kanaries/graphic-walker/dist/interfaces";
import { useMainStore } from "../store/mainStore";
import { queryData } from "../services/dataset";
import request, {resolveServiceUrl, unwrap} from "../services/utils";
import {IRow} from "../interfaces";


const computationOptions = {
    mode: 'server',
    service: queryData,
} as const;

const fakeDataSource = [{}];

const Playground = observer(function Playground() {
    const mainStore = useMainStore();
    const { dataset } = mainStore;
    const fields = useMemo<IMutField[]>(() => {
        if (!dataset?.fieldsMeta) {
            return [];
        }
        return dataset.fieldsMeta.map(f => ({
            ...f,
            analyticType: f.semanticType === 'quantitative' ? 'measure' : 'dimension',
        }));
    }, [dataset?.fieldsMeta]);

    const service = useMemo(() => getService(dataset?.datasetId), [dataset?.datasetId])

    if (!dataset) {
        return null;
    }

    const geoList = [
        { name: 'World Countries', type: 'TopoJSON', url: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json' },
        {
            name: 'World Cities',
            type: 'GeoJSON',
            url: 'https://raw.githubusercontent.com/drei01/geojson-world-cities/f2a988af4bc15463df55586afbbffbd3068b7218/cities.geojson',
        },
    ];

    return (
        <div className="w-full p-8 bg-white shadow-md rounded-md space-y-4">
            <div className="flex space-x-2 items-stretch">
                <GraphicWalker
                    hideDataSourceConfig
                    computation={service}
                    dark="light"
                    dataSource={fakeDataSource}
                    rawFields={fields}
                    fieldKeyGuard={false}
                    geoList={geoList}
                />
            </div>
        </div>
    );
});


export function getService(datasetId?: string) {
    if (!datasetId) return async () => [];
    return async function httpComputationService(payload:any) {
        const url = resolveServiceUrl('/dsl/query');
        const res = unwrap(await request.post<any, IRow[]>(url, {
            datasetId: datasetId,
            payload: payload,
        }));
        return res;
    };
}


export default Playground;
