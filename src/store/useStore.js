import { create } from "zustand";
import { SAMPLE_TRANSACTIONS, readJSON, writeJSON } from "../utils/helpers.js";

const txKey = (email) => `spendly-transactions:${email}`;
const budgetKey = (email) => `spendly-budget:${email}`;

// GLOBAL state (Zustand): transactions + budget, shared by every page.
// LOCAL state (useState) stays inside components: form fields, open dropdowns, etc.
export const useStore = create((set, get) => {
  const commit = (transactions) => {
    set({ transactions });
    writeJSON(txKey(get().email), transactions);
  };

  return {
    email: null,
    transactions: [],
    budget: 20000,

    loadUser: (email) =>
      set({
        email,
        transactions: readJSON(txKey(email), SAMPLE_TRANSACTIONS),
        budget: Number(readJSON(budgetKey(email), 20000)) || 0,
      }),

    addTransaction: (data) => commit([{ id: Date.now(), ...data }, ...get().transactions]),

    updateTransaction: (id, data) =>
      commit(get().transactions.map((item) => (item.id === id ? { ...item, ...data } : item))),

    deleteTransaction: (id) => commit(get().transactions.filter((item) => item.id !== id)),

    clearTransactions: () => commit([]),

    setBudget: (amount) => {
      set({ budget: amount });
      writeJSON(budgetKey(get().email), amount);
    },
  };
});
