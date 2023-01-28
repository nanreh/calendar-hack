import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider, Backends } from "react-dnd-multi-backend";
import { TouchTransition, MouseTransition } from "react-dnd-multi-backend";
import "./css/reset.css";

const CustomHTML5toTouch: Backends = {
  backends: [
    {
      backend: HTML5Backend as any,
      transition: MouseTransition,
      // by default, will dispatch a duplicate `mousedown` event when this backend is activated
      //preview: true,
    },
    {
      backend: TouchBackend as any,
      // Note that you can call your backends with options
      options: {
        enableMouseEvents: true,
        skipDispatchOnTransition: true, // will not dispatch a duplicate `touchstart` event when this backend is activated
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

ReactDOM.render(
  <React.StrictMode>
    {/* <DndProvider backend={TouchBackend} options={{ "enableMouseEvents": true }}> */}
    <DndProvider options={CustomHTML5toTouch}>
      <App />
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
