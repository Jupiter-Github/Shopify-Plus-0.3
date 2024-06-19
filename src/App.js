import "./App.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import Main from "./Components/Main";
import { ToastContainer } from "react-toastify";

function App() {
  const customToastClassName = {
    "@media (max-width: 768px)": {
      "min-width": "100px",
      "max-width": "200px",
      "font-size": "14px",
    },
  };
  return (
    <Provider store={store}>
      <Main />
      <ToastContainer
        toastClassName={customToastClassName}
        position="top-center"
      />
    </Provider>
  );
}

export default App;
