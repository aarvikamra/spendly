import { useMemo } from "react";
import { useStore } from "../store/useStore.js";
import { todayISO } from "../utils/helpers.js";

// Derived data (useMemo) shared by Dashboard, Analytics, Budgets and the print report
export default function useStats() {
  const transactions = useStore((state) => state.transactions);

  return useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id
    );
    const month = todayISO().slice(0, 7);
    const byCategory = {};
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthExpenses = 0;

    for (const item of sorted) {
      const amount = Number(item.amount);
      if (item.type === "income") {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        byCategory[item.category] = (byCategory[item.category] || 0) + amount;
        if (item.date.startsWith(month)) monthExpenses += amount;
      }
    }

    const categoryTotals = Object.entries(byCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return { sorted, totalIncome, totalExpenses, balance, savingsRate, monthExpenses, categoryTotals };
  }, [transactions]);
}
