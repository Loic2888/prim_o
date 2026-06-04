interface Props {
  balance: number;
}

export default function TotalTokenBalance({ balance }: Props) {
  return (
    <div className="stat-card">
      <p className="stat-label">Budget distribution</p>
      <p className="stat-value">{balance}</p>
      <p className="stat-sub">tokens à allouer</p>
    </div>
  );
}
