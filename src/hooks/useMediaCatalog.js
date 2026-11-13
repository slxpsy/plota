import { useState, useEffect } from 'react';
import { INITIAL_MEDIA } from '../data/mockMedia';

export const useMediaCatalog = ({
  searchQuery = '',
  selectedGenre = 'All',
  selectedYear = 'All',
  minRating = 0,
  sortBy = 'default'
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        await new Promise((res) => setTimeout(res, 250));
        if (!isMounted) return;

        let filtered = [...INITIAL_MEDIA];

        // 1. Пошук за назвою або оригінальною назвою
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.originalTitle.toLowerCase().includes(q) ||
              item.genres.some((g) => g.toLowerCase().includes(q))
          );
        }

        // 2. Фільтрація за жанром
        if (selectedGenre !== 'All') {
          filtered = filtered.filter((item) =>
            item.genres.includes(selectedGenre)
          );
        }

        // 3. Фільтрація за періодом/роком
        if (selectedYear !== 'All') {
          if (selectedYear === '2020s') filtered = filtered.filter((i) => i.year >= 2020);
          else if (selectedYear === '2010s') filtered = filtered.filter((i) => i.year >= 2010 && i.year < 2020);
          else if (selectedYear === '2000s') filtered = filtered.filter((i) => i.year >= 2000 && i.year < 2010);
          else if (selectedYear === 'older') filtered = filtered.filter((i) => i.year < 2000);
        }

        // 4. Фільтрація за мінімальним рейтингом
        if (minRating > 0) {
          filtered = filtered.filter((item) => item.rating >= minRating);
        }

        // 5. Сортування
        if (sortBy === 'rating_desc') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'year_desc') {
          filtered.sort((a, b) => b.year - a.year);
        } else if (sortBy === 'year_asc') {
          filtered.sort((a, b) => a.year - b.year);
        } else if (sortBy === 'title_asc') {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        setData(filtered);
      } catch (err) {
        if (isMounted) setError("Не вдалося завантажити каталог медіа.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedGenre, selectedYear, minRating, sortBy]);

  return { data, loading, error };
};