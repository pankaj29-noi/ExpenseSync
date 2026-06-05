import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  expenseApi,
  type Expense,
  type CreateExpenseData,
  type CreateFriendExpenseData,
  type UpdateExpenseData,
} from "../api/expenseApi";
import { axiosInstance } from "../lib/axiosInstance";

// Query keys
export const expenseKeys = {
  all: ["expenses"] as const,
  group: (groupId: string) => [...expenseKeys.all, "group", groupId] as const,
  friend: (friendId?: string) =>
    [...expenseKeys.all, "friend", ...(friendId ? [friendId] : [])] as const,
  detail: (id: string) => [...expenseKeys.all, "detail", id] as const,
};





// export const useGroupExpenses = (groupId: string) => {
//   return useQuery<Expense[], Error>({
//     queryKey: expenseKeys.group(groupId),
//     queryFn: async () => {
//       const expenses = await expenseApi.getGroupExpenses(groupId);
//       return expenses; // No console logs for speed
//     },
//     enabled: !!groupId,

//     // Polling

//      refetchInterval: () =>
//      document.visibilityState === "visible" ? 4000 : false,
//      refetchIntervalInBackground: true,

   
//     staleTime: 0,

    
//   });
// };

// useGroupExpenses - polling 
export const useGroupExpenses = (groupId: string) => {
  return useQuery<Expense[], Error>({
    queryKey: expenseKeys.group(groupId),
    queryFn: () => expenseApi.getGroupExpenses(groupId),
    enabled: !!groupId,

    // ✅ SMART POLLING
    refetchInterval: () =>
      document.visibilityState === "visible" ? 15000 : false,

    refetchIntervalInBackground: false,
    staleTime: 10000,
  });
};





// export const useFriendExpenses = (friendId?: string) => {
//   return useQuery<Expense[], Error>({
//     queryKey: expenseKeys.friend(friendId),
//     queryFn: async () => {
//       if (!friendId) return [];
//       const res = await axiosInstance.get<Expense[]>(
//         `/expenses/friend/${friendId}`
//       );
//       return res.data;
//     },
//     enabled: !!friendId,


//     refetchInterval: () =>
//     document.visibilityState === "visible" ? 5000 : false,
//     refetchIntervalInBackground: true,

//     staleTime: 0,
    
//   });
// };

// useFriendExpenses - Polling
export const useFriendExpenses = (friendId?: string) => {
  return useQuery<Expense[], Error>({
    queryKey: expenseKeys.friend(friendId),
    queryFn: async () => {
      if (!friendId) return [];
      const { data } = await axiosInstance.get<Expense[]>(
        `/expenses/friend/${friendId}`
      );
      return data;
    },
    enabled: !!friendId,

    refetchInterval: () =>
      document.visibilityState === "visible" ? 20000 : false,

    refetchIntervalInBackground: false,
    staleTime: 15000,
  });
};




export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, Error, CreateExpenseData>({
    mutationFn: async (data) => await expenseApi.createExpense(data),

    onSuccess: (expense) => {
      // invalidate group expenses
      queryClient.invalidateQueries({
        queryKey: expenseKeys.group(expense.groupId),
      });

      // Update dashboard stats lightly
      queryClient.invalidateQueries(["dashboard-stats"]);
    },
  });
};




export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, Error, { expenseId: string; data: UpdateExpenseData }>({
    mutationFn: async ({ expenseId, data }) =>
      await expenseApi.updateExpense(expenseId, data),

    onSuccess: (expense) => {
      // Only 1 invalidate needed
      queryClient.invalidateQueries({
        queryKey: expenseKeys.group(expense.groupId),
      });
    },
  });
};




export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { expenseId: string; groupId: string }>({
    mutationFn: async ({ expenseId }) => {
      await expenseApi.deleteExpense(expenseId);
    },

    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.group(groupId),
      });

      queryClient.invalidateQueries(["dashboard-stats"]);
    },
  });
};




export const useCreateFriendExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, Error, CreateFriendExpenseData>({
    mutationFn: async (data) => await expenseApi.createFriendExpense(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.friend(variables.friendId),
      });

      queryClient.invalidateQueries(["dashboard-stats"]);
    },
  });
};


 // this - may be use in Future 

export const useExpenseDetails = (expenseId: string) => {
  return useQuery<Expense, Error>({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: async () => {
      throw new Error("GET expense by ID not implemented yet");
    },
    enabled: !!expenseId,
  });
};

export default {
  useGroupExpenses,
  useFriendExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useCreateFriendExpense,
  useExpenseDetails,
};
