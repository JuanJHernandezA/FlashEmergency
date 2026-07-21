import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllHistory,
  saveHistoryEntry,
  deleteHistoryEntry,
  clearHistory,
} from '../lib/db';
import type { IHistoryEntry } from '../types';

const HISTORY_KEY = ['history'] as const;

function useHistory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: HISTORY_KEY,
    queryFn: getAllHistory,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: (entry: IHistoryEntry) => saveHistoryEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    addEntry: addMutation.mutateAsync,
    deleteEntry: deleteMutation.mutateAsync,
    clearAll: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
  };
}

export default useHistory;
