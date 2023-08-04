import { createContext } from 'react';
import { makeAutoObservable, observable, reaction } from 'mobx';
import { produce } from 'immer';
import { createStoreContextHook, createStoreProviderHook, createStoreSelectorHook, type StoreType } from './utils';
import type { IDataset, IDatasetFieldMeta } from '../interfaces';


class MainStore {

    public dataset: IDataset | null = null;
    public writableFields: IDatasetFieldMeta[] = [];

    public get hasUnsavedChanges(): boolean {
        if (!this.dataset) {
            return false;
        }
        for (const field of this.dataset.fieldsMeta) {
            const next = this.writableFields.find(f => f.fid === field.fid);
            if (next && (Object.keys(next) as (keyof IDatasetFieldMeta)[]).some(key => next[key] !== field[key])) {
                return true;
            }
        }
        return false;
    }
    
    protected effects: (() => void)[] = [];

    constructor() {
        makeAutoObservable(this, {
            dataset: observable.ref,
            writableFields: observable.ref,
            // @ts-expect-error - non-public fields
            effects: false,
        });
    }

    /** Ensure this method to be called in browser */
    public async init() {
        this.dataset = null;
        this.writableFields = [];
        this.effects = [
            reaction(() => this.dataset, dataset => {
                if (dataset) {
                    this.writableFields = [...dataset.fieldsMeta];
                } else {
                    this.writableFields = [];
                }
            }),
        ];
    }

    public destroy() {
        this.effects.splice(0).forEach(dispose => dispose());
    }

    public openDataset(dataset: IDataset) {
        this.dataset = dataset;
    }

    public closeDataset() {
        this.dataset = null;
    }

    public updateFieldProperty<K extends keyof IDatasetFieldMeta, V extends IDatasetFieldMeta[K]>(
        fid: IDatasetFieldMeta['fid'],
        key: K,
        value: V,
    ) {
        const index = this.writableFields.findIndex(field => field.fid === fid);
        if (index === -1) {
            throw new Error(`Field ${fid} not found`);
        }
        this.writableFields = produce(this.writableFields, draft => {
            draft[index][key] = value;
        });
    }

    public updateFieldProperties(fid: IDatasetFieldMeta['fid'], props: Partial<IDatasetFieldMeta>) {
        const index = this.writableFields.findIndex(field => field.fid === fid);
        if (index === -1) {
            throw new Error(`Field ${fid} not found`);
        }
        this.writableFields = produce(this.writableFields, draft => {
            draft[index] = {
                ...draft[index],
                ...props,
            };
        });
    }

}

const MainStoreContext = createContext<StoreType<MainStore>>(null!);

export const useMainStoreProvider = createStoreProviderHook<typeof MainStore>(MainStore, MainStoreContext);
export const useMainStore = createStoreContextHook<typeof MainStore>(MainStore, MainStoreContext);
export const useMainStoreSelector = createStoreSelectorHook<typeof MainStore>(MainStore, MainStoreContext);
