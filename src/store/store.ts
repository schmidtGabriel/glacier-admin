import {
  type AnyAction,
  combineReducers,
  configureStore,
  type Dispatch,
  type EnhancedStore,
  type ThunkDispatch,
  Tuple,
} from "@reduxjs/toolkit";

import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  type WebStorage,
} from "redux-persist";
import session from "./reducers/session";

const reducers = () => ({
  session,
});

function createReducer(storage: WebStorage, key = "admin", isDev = false) {
  const persistedReducer = persistReducer(
    {
      key,
      storage,
      whitelist: ["session"], // only auth will be persisted
    },
    combineReducers(reducers())
  );

  const store = configureStore({
    devTools: isDev,
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
      [
        ...getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
      ] as Tuple,
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

export { createReducer };

type StoreType = EnhancedStore<
  ReturnType<ReturnType<typeof combineReducers<typeof reducers>>>
>;

export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch<AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
