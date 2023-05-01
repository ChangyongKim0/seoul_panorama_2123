import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { IP_URI, API_URI } from "./shortcut";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", vh + "px");
document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
document.documentElement.style.setProperty("--newvh", vh + "px");
document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");

axios.get(API_URI).then((res, req) => {
  console.log(res);
});

window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
  document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
  document.documentElement.style.setProperty("--newvh", vh + "px");
  document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");
});

window.addEventListener("scroll", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
  document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
  document.documentElement.style.setProperty("--newvh", vh + "px");
  document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");
});

window.addEventListener("locationchange", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
  document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
  document.documentElement.style.setProperty("--newvh", vh + "px");
  document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");
});

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
