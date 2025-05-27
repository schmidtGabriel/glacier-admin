// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import localStorage from "redux-persist/es/storage";
import AppRoutes from "./components/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import StoreProvider from "./providers/StoreProvider";
import { createReducer } from "./store/store";

function App() {
  const { persistor, store } = createReducer(localStorage, "admin");

  return (
    <Router>
      <StoreProvider persistor={persistor} store={store}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </StoreProvider>
    </Router>
  );
}

export default App;
