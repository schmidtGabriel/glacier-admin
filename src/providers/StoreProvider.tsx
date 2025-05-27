import type { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import type { createReducer } from "../store/store";

type Props = ReturnType<typeof createReducer>;

function StoreProvider({
  store,
  persistor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
}

export default StoreProvider;
