import { QueryClient } from "@tanstack/react-query";
import { createIDBPersister } from "../persister/persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 30, 
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnWindowFocus: false,      
        }
    }
});

const persister = createIDBPersister('bioradar-cache');

persistQueryClient({
    queryClient,
    persister,
    maxAge:  1000 * 60 * 30,
})

export default queryClient; 