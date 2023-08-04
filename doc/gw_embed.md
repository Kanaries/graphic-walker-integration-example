### Embed GraphicWalker

View [full version](https://github.com/Kanaries/graphic-walker/blob/feat-computation-ks-0805/README.md) of GraphicWalker readme.

Using GraphicWalker can be extremely easy. It provides a single React component which allows you to easily embed it in your app.

```bash
yarn add @kanaries/graphic-walker

# or

npm i --save @kanaries/graphic-walker
```

In your app:

```tsx
import { GraphicWalker } from '@kanaries/graphic-walker';

const YourEmbeddingApp: React.FC<IYourEmbeddingAppProps> = props => {
    const { dataSource, fields } = props;
    return <GraphicWalker
        dataSource={dataSource}
        rawFields={fields}
        spec={graphicWalkerSpec}
        i18nLang={langStore.lang}
    />;
};

export default YourEmbeddingApp;
```

If you have a configuration of GraphicWalker chart, you can use the `PureRenderer` component to make a single chart without controls UI.

```tsx
import { PureRenderer } from '@kanaries/graphic-walker';

const YourChart: React.FC<IYourChartProps> = props => {
    const { rawData, visualState, visualConfig } = props;
    return <PureRenderer
        rawData={rawData}
        visualState={visualState}
        visualConfig={visualConfig}
    />;
};

export default YourChart;
```


### I18n

If you need i18n support to cover languages not supported currently, or to totally rewrite the content of any built-in resource(s), you can also provide your resource(s) as `props.i18nResources` to GraphicWalker like this.

```tsx
const yourResources = {
    'de-DE': {
        'key': 'value',
        ...
    },
    'fr-FR': {
        ...
    },
};

const YourApp = props => {
    // ...

    const curLang = /* get your i18n language */;

    return <GraphicWalker
        dataSource={dataSource}
        rawFields={fields}
        i18nLang={curLang}
        i18nResources={yourResources}
    />;
}
```


### GraphicWalker API

Graphic Walker Props & Ref interface

**Props**

```tsx
export interface IGWProps {
	dataSource?: IRow[];
	rawFields?: IMutField[];
	spec?: Specification;
	hideDataSourceConfig?: boolean;
	i18nLang?: string;
	i18nResources?: { [lang: string]: Record<string, string | any> };
	keepAlive?: boolean | string;
    fieldKeyGuard?: boolean;
    themeKey?: IThemeKey;
    dark?: IDarkMode;
    storeRef?: React.MutableRefObject<IGlobalStore | null>;
    computation?: IComputationConfig;
    datasetId?: string;
    toolbar?: {
        extra?: ToolbarItemProps[];
        exclude?: string[];
    };
}
```

- **`dataSource`**: optional _{ `Array<{[key: string]: any}>` }_

  Array of key-value object data. Provide this prop with `rawFields` prop together.

- **`rawFields`**: optional _{ `IMutField` }_

  Array of fields(columns) of the data. Provide this prop with `dataSource` prop together.

- **`~~spec`**: optional _{ `Specification` }_~~

  Visualization specification. This is an internal prop, you should not provide this prop directly. If you want to control the visualization specification, you can use `storeRef` prop.

- **`hideDataSourceConfig`**: optional _{ `boolean = false` }_

  Data source control at the top of graphic walker, you can import or upload dataset files. If you want to use graphic-walker as a controlled component, you can hide those component by setting this prop to `true`.

- **`i18nLang`**: optional _{ `string = 'en-US'` }_

  Graphic Walker support i18n, you can set the language of the component by this prop. Currently, we support `en-US`, `zh-CN`, `ja-JP` with built-in locale resources. If you want to use other languages, you can provide your own locale resources by `i18nResources` [prop](https://www.notion.so/README-968eecbb5aa64f52a1cddec169639684?pvs=21).

- **`i18nResources`**: optional _{ `{ [lang: string]: Record<string, string | any> }` }_

  Customize locale resources. See Customize I18n for more details.

- **`keepAlive`**: optional _{ `boolean | string = false` }_

  Whether to keep the component state when it is unmounted. If provided, after you unmount the graphic-walker component, the state will still be stored, and will be restored when the component is mount again. If you need to enable `keepAlive` for multiple graphic-walker components, you can provide a unique string value for each component to distinguish them.

- **`fieldKeyGuard`**: optional _{ `boolean = true` }_

  Whether to use the field key guard. If enabled, the field `fid` will be transformed to ensure that it is safe to use as a reference in Vega-Lite. Otherwise, the `fid` provided in `rawFields` will be used directly.

- **`themeKey`**: optional _{ `IThemeKey = "vega"` }_

  Specify the chart theme to use.

- **`dark`**: optional _{ `IDarkMode = "media"` }_

  Specify the dark mode preference. There're three valid values:

    - `"media"`: Use the system dark mode preference.
    - `"dark"`: Always use dark mode.
    - `"light"`: Always use light mode.
- **`storeRef`**: optional _{ `React.MutableRefObject<IGlobalStore | null>` }_

  If you want to control the visualization specification, you can provide a `React.MutableRefObject<IGlobalStore | null>` to this prop. The `IGlobalStore` is the combined store context of Graphic Walker, you can use it to control the visualization specification.

- **`computation`**: optional _{ `IComputationConfig` `= "client"` }_

  Specify the computation configuration. See Computation for more details. There're two valid modes for it:

    1. Client-side computation (default)

       Provide `"client"` or `{ mode: "client" }` to use client-side computation. In this mode, the computation will be done in the browser (mainly use WebWorker).

    2. Server-side computation

       The configuration should be


```tsx
declare const config: {
    mode: "server";
    server: string;
    APIPath?: string | undefined;
};
```

to specify an HTTP server to handle the computation. The server should accept POST request with JSON body of `IDataQueryPayload`. An another case is that you can implement a custom computation service - this is useful when you want to use a different computation engine such as WebAssembly. The configuration should be

```tsx
declare const config: {
    mode: "server";
    service: IComputationFunction;
};
```

- **`datasetId`**: optional _{ `string` }_

  When using server-side computation, you should provide a dataset ID to identify the dataset.

- **`toolbar`**: optional _{ `ToolbarProps` }_

  Customize the toolbar.


**Ref**

```tsx
export interface IGWHandler {
    chartCount: number;
    chartIndex: number;
    openChart: (index: number) => void;
    get renderStatus(): IRenderStatus;
    onRenderStatusChange: (cb: (renderStatus: IRenderStatus) => void) => (() => void);
    exportChart: IExportChart;
    exportChartList: IExportChartList;
}
```

- **`chartCount`**: _{ `number` }_

  Length of the "chart" tab list.

- **`chartIndex`**: _{ `number` }_

  Current selected chart index.

- **`openChart`**: _{ `(index: number) => void` }_

  Switches to the specified chart.

- **`renderStatus`**: _{ `IRenderStatus` }_

  Returns the status of the current chart. It may be one of the following values:

    - `"computing"`: _GraphicWalker_ is computing the data view.
    - `"rendering"`: _GraphicWalker_ is rendering the chart.
    - `"idle"`: Rendering is finished.
    - `"error"`: An error occurs during the process above.
- **`onRenderStatusChange`**: _{ `(cb: (renderStatus: IRenderStatus) => void) => (() => void)` }_

  Registers a callback function to listen to the status change of the current chart. It returns a dispose function to remove this callback.

- **`exportChart`**: _{ `IExportChart` }_

  Exports the current chart.

- **`exportChartList`**: _{ `IExportChartList` }_

  Exports all charts. It returns an async generator to iterate over all charts. For example:


```tsx
for await (const chart of gwRef.current.exportChartList()) {
    console.log(chart);
}
```
