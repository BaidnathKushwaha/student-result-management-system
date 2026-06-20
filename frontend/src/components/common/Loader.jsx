export default function Loader({ inline = false, label = 'Loading…' }) {
    return (
        <div className={`eg-loader ${inline ? 'eg-loader-inline' : ''}`}>
            <div className={`eg-spinner ${inline ? 'eg-spinner-sm' : ''}`} role="status" aria-label={label} />
            <span style={{ fontSize: inline ? 13 : 14 }}>{label}</span>
        </div>
    );
}