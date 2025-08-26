import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Index from "@pages/index";

import "./index.css";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Index />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <div className="antialised">
        <RouterProvider router={Router} />
    </div>
);
