import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store = {store}>
  <AuthProvider>
    <App />
  </AuthProvider>
</Provider>
  
);