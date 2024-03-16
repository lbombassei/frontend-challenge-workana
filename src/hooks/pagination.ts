import { useEffect, useState } from "react";

export function usePagination(itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function getFullData() {
      const response = await fetch(
        "https://backend-workana.onrender.com/transactions"
      );
      const totalItemsFull = await response.json();
      const totalPagesCount = Math.ceil(totalItemsFull / itemsPerPage);
      setTotalPages(totalPagesCount);
    }
    getFullData();
  }, [itemsPerPage]);

  return { currentPage, setCurrentPage, totalPages };
}
