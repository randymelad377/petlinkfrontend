import  MyRouter  from "./routers/MyRoute";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {

    const queryClient = new QueryClient();

    return (

        <QueryClientProvider client={queryClient}>
            <RouterProvider router={MyRouter}></RouterProvider>
        </QueryClientProvider>
    )

}

export default App