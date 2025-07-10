import { AppRoutes } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./services/api/api";


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
