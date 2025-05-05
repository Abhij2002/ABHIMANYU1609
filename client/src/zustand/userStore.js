// zustand/usersStore.js
import { create } from "zustand";

export const useUsersStore = create((set) => ({
	users: [], // List of users in current conversation
	setUsers: (users) => set({ users }),
}));
