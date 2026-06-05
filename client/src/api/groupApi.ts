import { axiosInstance } from '../lib/axiosInstance';

export interface GroupMember {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Group {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  isDirectFriendGroup?: boolean;
  members?: GroupMember[];
  _count?: {
    expenses: number;
    members: number;
  };
}

export interface GroupDetails extends Group {
  members: GroupMember[];
  expenses?: any[];
  _count?: {
    expenses: number;
    members: number;
  };
}

export interface BalanceData {
  balances: Array<{
    userId: string;
    name: string;
    balance: number;
  }>;
  settlements: Array<{
    from: string;
    to: string;
    fromName: string;
    toName: string;
    amount: number;
  }>;
}


export interface CreateSettlementData {
  groupId: string;
  receiverId: string;
  amount: number;
}

export interface SettlementResponse {
  message: string;
  settlement: any;
}

export const groupApi = {
  createGroup: async (data: { name: string }): Promise<Group> => {
    const response = await axiosInstance.post<{ message: string; group: Group }>('/groups', data);
    return response.data.group;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await axiosInstance.get<Group[]>('/groups');
    return response.data;
  },

  getGroupDetails: async (groupId: string): Promise<GroupDetails> => {
    const response = await axiosInstance.get<GroupDetails>(`/groups/${groupId}`);
    return response.data;
  },

  updateGroup: async (groupId: string, data: { name: string }): Promise<Group> => {
    const response = await axiosInstance.put<{ message: string; group: Group }>(`/groups/${groupId}`, data);
    return response.data.group;
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await axiosInstance.delete(`/groups/${groupId}`);
  },

  addMember: async (groupId: string, data: { email: string }): Promise<any> => {
    const response = await axiosInstance.post<{ message: string; member: any }>(`/groups/${groupId}/members`, data);
    return response.data.member;
    // return response.data; // We also commit this after adding domain | for more fine working 
  },

  removeMember: async (groupId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(`/groups/${groupId}/members/${memberId}`);
  },

  getGroupBalance: async (groupId: string): Promise<BalanceData> => {
    const response = await axiosInstance.get<BalanceData>(`/groups/${groupId}/balance`);
    return response.data;
  },

  
  createSettlement: async (data: CreateSettlementData): Promise<SettlementResponse> => {
    const response = await axiosInstance.post<SettlementResponse>('/settlements', data);
    return response.data;
  },
};
