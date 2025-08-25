import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import About from "@pages/about";
import Index from "@pages/index";

import "./index.css";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "about",
    element: <About />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={Router} />
);
