import WelcomePage from "./WelcomePage"
import Meet from "./Meet";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <WelcomePage />,
    },
    {
      path: "/meet",
      element: <Meet />,
    }
  ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
