import { useCombineProviders } from "./store/utils";
import { useMainStoreProvider } from "./store/mainStore";
import NotificationWrapper from "./notify";
import FieldEditor from "./widgets/field-editor";
import DatasetHandle from "./widgets/dataset-handle";
import Playground from "./widgets/playground";


const App = () => {
    const ViewStoreProvider = useMainStoreProvider();
    const CombinedProvider = useCombineProviders(ViewStoreProvider);

    return (
        <CombinedProvider>
            <NotificationWrapper>
                <div className="relative m-0 p-0 border-none w-screen h-screen overflow-auto bg-gray-100 flex flex-col items-center">
                    <main className="flex flex-col items-center w-screen max-w-7xl h-screen overflow-y-auto p-6 sm:p-12 md:p-18 divide-y divide-gray-200 divide-dashed">
                        <div className="w-full p-8 bg-white shadow-md rounded-md space-y-4">
                            <DatasetHandle />
                        </div>
                        {/*<FieldEditor />*/}
                        <Playground />
                    </main>
                </div>
            </NotificationWrapper>
        </CombinedProvider>
    );
};


export default App;
