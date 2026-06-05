import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  groupApi,
  type CreateSettlementData,
  type SettlementResponse,
} from "../api/groupApi";
import { groupKeys } from "./useGroup";

export const useCreateSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation<SettlementResponse, Error, CreateSettlementData>({
    mutationFn: async (settlementData) => {
      return await groupApi.createSettlement(settlementData);
    },

    onSuccess: (_, vars) => {
     
      queryClient.invalidateQueries({
        queryKey: groupKeys.detail(vars.groupId),
      });

      // Optional: update dashboard stats silently
      queryClient.invalidateQueries(["dashboard-stats"]);
    },

    retry: 1,
  });
};
