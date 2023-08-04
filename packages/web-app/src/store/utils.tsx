import {
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useRef,
    type Context,
    type FC,
    type PropsWithChildren,
    type ReactElement,
} from 'react';


export type StoreProviderHook<P extends any[]> = (...args: P) => FC<PropsWithChildren>;

export type StoreType<T extends Record<keyof any, any>> = (
    & Omit<T, 'init' | 'destroy'>
    & {
        init?(): void | Promise<void>;
        destroy?(): void;
    }
);

export const createStoreProviderHook = <
    S extends { new (...args: any[]): StoreType<any> } = { new (...args: any[]): StoreType<any> },
    T extends InstanceType<S> = InstanceType<S>,
>(
    StoreClass: S, StoreContext: Context<StoreType<T>>
): StoreProviderHook<ConstructorParameters<S>> => {
    const funcName = `use${StoreClass.name}Provider`;
    const data = {
        [funcName](...args: ConstructorParameters<S>): FC<PropsWithChildren> {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const store = useMemo(() => new StoreClass(...args), args);

            useEffect(() => {
                store.init?.();
                return () => {
                    store.destroy?.();
                };
            }, [store]);

            return useCallback<FC<PropsWithChildren>>(function StoreProvider ({ children }) {
                return (
                    <StoreContext.Provider value={store}>
                        {children}
                    </StoreContext.Provider>
                );
            }, [store]);
        },
    };
    
    return data[funcName];
};

export type StoreContextHook<T extends Record<keyof any, any>> = () => StoreType<T>;

export const createStoreContextHook = <
    S extends { new (...args: any[]): StoreType<any> } = { new (...args: any[]): StoreType<any> },
    T extends InstanceType<S> = InstanceType<S>,
>(
    StoreClass: S, StoreContext: Context<StoreType<T>>
): StoreContextHook<T> => {
    const funcName = `use${StoreClass.name}Context`;
    const data = {
        [funcName](): StoreType<T> {
            const ctx = useContext(StoreContext);
            if (!ctx || !(ctx instanceof StoreClass)) {
                throw new Error(`Cannot access ${StoreClass.name} context outside of its provider.`);
            }
            return ctx;
        },
    };
    
    return data[funcName];
};

export type StoreSelectorHook<T extends Record<keyof any, any>> = <S>(selector: (state: StoreType<T>) => S) => Readonly<S>;

export const createStoreSelectorHook = <
    S extends { new (...args: any[]): StoreType<any> } = { new (...args: any[]): StoreType<any> },
    T extends InstanceType<S> = InstanceType<S>,
>(
    StoreClass: S, StoreContext: Context<StoreType<T>>
): StoreSelectorHook<T> => {
    const funcName = `use${StoreClass.name}Selector`;
    const data = {
        [funcName]<S>(selector: (state: StoreType<T>) => S): Readonly<S> {
            return selector(useContext(StoreContext));
        },
    };
    
    return data[funcName];
};

export const useCombineProviders = (...providers: ReturnType<StoreProviderHook<unknown[]>>[]): ReturnType<StoreProviderHook<unknown[]>> => {
    const providersRef = useRef(providers);
    providersRef.current = providers;

    return useCallback<ReturnType<StoreProviderHook<unknown[]>>>(function CombinedProvider ({ children }) {
        return providersRef.current.reduce<ReactElement>((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, <>{children}</>);
    }, []);
};
