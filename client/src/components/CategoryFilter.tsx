interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="form-group" style={{ maxWidth: 340, marginBottom: 24 }}>
      <input
        className="form-input"
        type="search"
        placeholder="Rechercher un bon d'achat…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
