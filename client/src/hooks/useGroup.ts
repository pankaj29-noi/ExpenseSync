import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  groupApi, 
  type Group, 
  type GroupDetails, 
  type CreateGroupData, 
  type UpdateGroupData, 
  type AddMemberData,
  type BalanceData,
} from '../api/groupApi';

// queryKeys
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (filters?: string) => [...groupKeys.lists(), ...(filters ? [{ filters }] : [])] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
  balance: (id: string) => [...groupKeys.all, 'balance', id] as const,
};


// export const useGroups = () => {
//   return useQuery<Group[], Error>({
//     queryKey: groupKeys.lists(),
//     queryFn: async () => {
//       const groups = await groupApi.getGroups();
      
     
//       const normalGroups = groups.filter(group => !group.isDirectFriendGroup);
      
//       return normalGroups;
//     },

//     // Polling - baad mein isko change krenge  

//     refetchInterval: () =>
//     document.visibilityState === 'visible' ? 8000 : false,
//     refetchIntervalInBackground: true,
//     staleTime: 0,
    
//   });
// };


// useGroups - Polling
export const useGroups = () => {
  return useQuery<Group[], Error>({
    queryKey: groupKeys.lists(),
    queryFn: async () => {
      const groups = await groupApi.getGroups();
      return groups.filter(g => !g.isDirectFriendGroup);
    },

    refetchInterval: () =>
      document.visibilityState === 'visible' ? 20000 : false,

    refetchIntervalInBackground: false,
    staleTime: 15000,
  });
};


// export const useGroupDetails = (groupId: string) => {
//   return useQuery<GroupDetails, Error>({
//     queryKey: groupKeys.detail(groupId),
//     queryFn: async () => {
//       const groupDetails = await groupApi.getGroupDetails(groupId);
//       return groupDetails;
//     },
//     enabled: !!groupId,

//     // Polling - baad mein we have to change this 

//     refetchInterval: 4000,
//     refetchIntervalInBackground: true,
    
//   });
// };


// Polling - useGroupDetails
export const useGroupDetails = (groupId: string) => {
  return useQuery<GroupDetails, Error>({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => groupApi.getGroupDetails(groupId),
    enabled: !!groupId,

    refetchInterval: () =>
      document.visibilityState === 'visible' ? 15000 : false,

    refetchIntervalInBackground: false,
    staleTime: 10000,
  });
};


export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Group, Error, CreateGroupData>({
    mutationFn: async (data: CreateGroupData) => {
      const newGroup = await groupApi.createGroup(data);
      return newGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Group, Error, { groupId: string; data: UpdateGroupData }>({
    mutationFn: async ({ groupId, data }) => {
      const updatedGroup = await groupApi.updateGroup(groupId, data);
      return updatedGroup;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (groupId: string) => {
      await groupApi.deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};


export const useAddMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, { groupId: string; data: AddMemberData }>({
    mutationFn: async ({ groupId, data }) => {
      try {
        const result = await groupApi.addMember(groupId, data);
        return result;
      } catch (error: any) {
      
        if (error.response?.data?.type === 'INVITATION_SENT') {
          return error.response.data;
        }
        
        throw error;
      }
    },
    
    onMutate: async ({ groupId, data }) => {
      
      await queryClient.cancelQueries({ queryKey: groupKeys.lists() });
      await queryClient.cancelQueries({ queryKey: groupKeys.detail(groupId) });


      const previousGroups = queryClient.getQueryData<Group[]>(groupKeys.lists());
      const previousGroupDetails = queryClient.getQueryData<GroupDetails>(groupKeys.detail(groupId));

      
      if (previousGroups) {
        queryClient.setQueryData<Group[]>(groupKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(group => {
            if (group.id === groupId) {
              
              const tempMember = {
                userId: 'temp-' + Date.now(),
                user: {
                  email: data.email,
                  name: data.email.split('@')[0],
                  id: 'temp-user'
                },
                groupId: groupId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              return {
                ...group,
                members: [...(group.members || []), tempMember]
              };
            }
            return group;
          });
        });
      }

     
      if (previousGroupDetails) {
        queryClient.setQueryData<GroupDetails>(groupKeys.detail(groupId), (old) => {
          if (!old) return old;
          
          const tempMember = {
            userId: 'temp-' + Date.now(),
            user: {
              email: data.email,
              name: data.email.split('@')[0],
              id: 'temp-user'
            },
            groupId: groupId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          return {
            ...old,
            members: [...old.members, tempMember]
          };
        });
      }

      return { previousGroups, previousGroupDetails };
    },
    onSuccess: (result, variables) => {
    
      if (result.type === 'MEMBER_ADDED') {
        
        queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
        queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      }
    },
    onError: (err, variables, context) => {
   
      if (context?.previousGroups) {
        queryClient.setQueryData(groupKeys.lists(), context.previousGroups);
      }
      if (context?.previousGroupDetails) {
        queryClient.setQueryData(groupKeys.detail(variables.groupId), context.previousGroupDetails);
      }
    },
    onSettled: (_, __, variables) => {
      
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
    },
  });
};



export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { groupId: string; memberId: string }>({
    mutationFn: async ({ groupId, memberId }) => {
      await groupApi.removeMember(groupId, memberId);
    },
   
    onMutate: async ({ groupId, memberId }) => {
      
      await queryClient.cancelQueries({ queryKey: groupKeys.lists() });
      await queryClient.cancelQueries({ queryKey: groupKeys.detail(groupId) });

      
      const previousGroups = queryClient.getQueryData<Group[]>(groupKeys.lists());
      const previousGroupDetails = queryClient.getQueryData<GroupDetails>(groupKeys.detail(groupId));

    
      if (previousGroups) {
        queryClient.setQueryData<Group[]>(groupKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                members: (group.members || []).filter(member => member.userId !== memberId)
              };
            }
            return group;
          });
        });
      }

     
      if (previousGroupDetails) {
        queryClient.setQueryData<GroupDetails>(groupKeys.detail(groupId), (old) => {
          if (!old) return old;
          return {
            ...old,
            members: old.members.filter(member => member.userId !== memberId)
          };
        });
      }

      return { previousGroups, previousGroupDetails };
    },
    onError: (err, variables, context) => {
     
      if (context?.previousGroups) {
        queryClient.setQueryData(groupKeys.lists(), context.previousGroups);
      }
      if (context?.previousGroupDetails) {
        queryClient.setQueryData(groupKeys.detail(variables.groupId), context.previousGroupDetails);
      }
    },
    onSettled: (_, __, variables) => {
     
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
    },
  });
};

// export const useGroupBalance = (groupId: string) => {
//   return useQuery<BalanceData, Error>({
//     queryKey: groupKeys.balance(groupId),
//     queryFn: async () => {
//       const balance = await groupApi.getGroupBalance(groupId);
//       return balance;
//     },
//     enabled: !!groupId,

//     // Polling - we have change this in future if needed 
//     refetchInterval: 3000,
//     refetchIntervalInBackground: true,
//   });
// };

// useGroupBalance - Polling
export const useGroupBalance = (groupId: string) => {
  return useQuery<BalanceData, Error>({
    queryKey: groupKeys.balance(groupId),
    queryFn: () => groupApi.getGroupBalance(groupId),
    enabled: !!groupId,

    refetchInterval: () =>
      document.visibilityState === "visible" ? 10000 : false,

    refetchIntervalInBackground: false,
    staleTime: 5000,
  });
};






export default {
  useGroups,
  useGroupDetails,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useAddMember,
  useRemoveMember,
  useGroupBalance,
};
