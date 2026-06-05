// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "../lib/axiosInstance";

// interface DashboardStats {
//   totalGroups: number;
//   totalExpenses: number;
//   pendingSettlements: number;
// }

// export const useDashboardStats = () => {
//   return useQuery<DashboardStats, Error>({
//     queryKey: ["dashboard-stats"],

//     queryFn: async () => {
//       const response = await axiosInstance.get<DashboardStats>(
//         "/dashboard/stats"
//       );
//       return response.data;
//     },

//     // cache+performance
//     staleTime: 1000 * 60 * 2, 
//     cacheTime: 1000 * 60 * 5, 

//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,

//     retry: 1, 
//   });
// };




// // export const useDashboardStats = () => {
// //   return useQuery<DashboardStats, Error>({
// //     queryKey: ["dashboard-stats"],

// //     queryFn: async () => {
// //       const { data } = await axiosInstance.get<DashboardStats>(
// //         "/dashboard/stats"
// //       );
// //       return data;
// //     },

// //     // dashboard = aggregate data (not real-time)
// //     staleTime: 1000 * 60 * 2,   // 2 min fresh
// //     gcTime: 1000 * 60 * 5,      // cache for 5 min

// //     refetchOnWindowFocus: false,
// //     refetchOnReconnect: false,
// //     refetchOnMount: false,

// //     retry: 1,
// //   });
// // };




import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axiosInstance";

interface DashboardStats {
  totalGroups: number;
  totalExpenses: number;
  pendingSettlements: number;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard-stats"],

    queryFn: async () => {
      const response = await axiosInstance.get<DashboardStats>("/dashboard/stats");
      return response.data;
    },

    // cache+performance
    staleTime: 0, // data is immediately stale so it will refetch
    cacheTime: 1000 * 60 * 5, 

    refetchOnWindowFocus: true,  // optional, fetch when tab is focused
    refetchOnReconnect: true,
    refetchOnMount: true,

    retry: 1,

    // ✅ polling every 10 seconds
    refetchInterval: 10000, // 10,000ms = 10 seconds
  });
};
