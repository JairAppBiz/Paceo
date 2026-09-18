// @ts-nocheck
import { useState } from "react";

export function useMedalDetails(userId) {
  const [selectedMedalType, setSelectedMedalType] = useState(null);
  const [detailedMedals, setDetailedMedals] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalFilter, setModalFilter] = useState("all"); // 'all', 'monthly', 'weekly'
  const [modalSort, setModalSort] = useState("date"); // 'date' or 'rank'

  const fetchDetailedMedals = async (medalType) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `/api/medals/list?userId=${userId}&medalType=${medalType}`,
      );
      if (response.ok) {
        const data = await response.json();
        setDetailedMedals(data.medals || []);
      }
    } catch (error) {
      console.error("Error fetching detailed medals:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openMedalDetails = (medalType) => {
    setSelectedMedalType(medalType);
    setModalFilter("all");
    setModalSort("date");
    fetchDetailedMedals(medalType);
  };

  const closeMedalDetails = () => {
    setSelectedMedalType(null);
    setDetailedMedals([]);
  };

  // Filter and sort medals for modal
  const getFilteredMedals = () => {
    let filtered = [...detailedMedals];

    if (modalFilter === "monthly") {
      filtered = filtered.filter((m) =>
        m.period.toLowerCase().includes("month"),
      );
    } else if (modalFilter === "weekly") {
      filtered = filtered.filter((m) =>
        m.period.toLowerCase().includes("week"),
      );
    }

    if (modalSort === "rank") {
      filtered.sort((a, b) => a.rank_achieved - b.rank_achieved);
    } else {
      filtered.sort(
        (a, b) => new Date(b.awarded_date) - new Date(a.awarded_date),
      );
    }

    return filtered;
  };

  return {
    selectedMedalType,
    detailedMedals,
    loadingDetails,
    modalFilter,
    modalSort,
    setModalFilter,
    setModalSort,
    getFilteredMedals,
    openMedalDetails,
    closeMedalDetails,
  };
}
