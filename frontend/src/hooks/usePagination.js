import { useState, useCallback } from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';

/**
 * Manages page/size/sort state for endpoints backed by Spring's Page<T>.
 * fetchFn(params) must return a Spring Page object:
 * { content, totalElements, totalPages, number, size }
 */
export const usePagination = (fetchFn, initialParams = {}) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(initialParams.size || PAGE_SIZE_OPTIONS[1]);
    const [sortBy, setSortBy] = useState(initialParams.sortBy || 'name');
    const [content, setContent] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(
        async (overrides = {}) => {
            setLoading(true);
            setError(null);
            const nextPage = overrides.page ?? page;
            const nextSize = overrides.size ?? size;
            const nextSortBy = overrides.sortBy ?? sortBy;
            try {
                const result = await fetchFn({ page: nextPage, size: nextSize, sortBy: nextSortBy });
                setContent(result.content || []);
                setTotalElements(result.totalElements ?? 0);
                setTotalPages(result.totalPages ?? 0);
                setPage(result.number ?? nextPage);
                setSize(result.size ?? nextSize);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        },
        [fetchFn, page, size, sortBy]
    );

    const goToPage = (newPage) => load({ page: newPage });
    const changeSize = (newSize) => load({ page: 0, size: newSize });
    const changeSort = (newSortBy) => {
        setSortBy(newSortBy);
        load({ page: 0, sortBy: newSortBy });
    };

    return {
        content,
        page,
        size,
        sortBy,
        totalElements,
        totalPages,
        loading,
        error,
        load,
        goToPage,
        changeSize,
        changeSort,
        setContent,
    };
};

export default usePagination;