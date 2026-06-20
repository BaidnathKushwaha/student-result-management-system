import Icon from '../../assets/icons/Icon';
import { PAGE_SIZE_OPTIONS } from '../../utils/constants';

export default function Pagination({
                                       page,
                                       size,
                                       totalElements,
                                       totalPages,
                                       onPageChange,
                                       onSizeChange,
                                   }) {
    if (totalElements === 0) return null;

    const from = page * size + 1;
    const to = Math.min((page + 1) * size, totalElements);

    return (
        <div className="eg-pagination">
      <span className="eg-pagination-info">
        Showing {from}–{to} of {totalElements}
      </span>
            <div className="eg-pagination-controls">
                {onSizeChange && (
                    <select
                        className="eg-select"
                        style={{ width: 'auto', padding: '6px 10px' }}
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        aria-label="Rows per page"
                    >
                        {PAGE_SIZE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt} / page
                            </option>
                        ))}
                    </select>
                )}
                <button
                    type="button"
                    className="eg-btn eg-btn-secondary eg-btn-sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 0}
                    aria-label="Previous page"
                >
                    <Icon name="chevron-left" size={16} />
                </button>
                <span className="eg-page-indicator">
          {page + 1} / {Math.max(totalPages, 1)}
        </span>
                <button
                    type="button"
                    className="eg-btn eg-btn-secondary eg-btn-sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    aria-label="Next page"
                >
                    <Icon name="chevron-right" size={16} />
                </button>
            </div>
        </div>
    );
}