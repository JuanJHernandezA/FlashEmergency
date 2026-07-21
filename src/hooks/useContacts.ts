import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllContacts, saveContact, deleteContact } from '../lib/db';
import type { IEmergencyContact } from '../types';

const CONTACTS_KEY = ['contacts'] as const;

function useContacts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: getAllContacts,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: (contact: IEmergencyContact) => saveContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (contact: IEmergencyContact) => saveContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
    },
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    addContact: addMutation.mutateAsync,
    updateContact: updateMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useContacts;
