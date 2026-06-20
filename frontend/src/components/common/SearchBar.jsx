import Icon from '../../assets/icons/Icon';

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
    return (
        <div className="eg-search">
      <span className="eg-search-icon">
        <Icon name="search" size={16} />
      </span>
            <input
                type="text"
                className="eg-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={placeholder}
            />
        </div>
    );
}