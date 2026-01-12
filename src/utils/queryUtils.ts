import { QueryClient } from '@tanstack/react-query';

type InvalidateOptions = {
  exact?: boolean;
};

export function invalidateQueries(
  queryClient: QueryClient,
  queryKey: string | string[],
  options: InvalidateOptions = {}
) {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    ...options
  });
}
