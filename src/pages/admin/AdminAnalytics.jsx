import storage from '../../utils/storage';

export default function AdminAnalytics() {
  const analytics = storage.getAnalytics();
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 86400000;
  const recentViews = analytics.views.filter(v => v.ts > thirtyDaysAgo);
  const recentClicks = analytics.clicks.filter(c => c.ts > thirtyDaysAgo);

  // Views by day
  const viewsByDay = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().split('T')[0];
    viewsByDay[d] = 0;
  }
  recentViews.forEach(v => { if (v.date in viewsByDay) viewsByDay[v.date]++; });
  const maxViews = Math.max(...Object.values(viewsByDay), 1);

  // Top clicks
  const clickCounts = {};
  recentClicks.forEach(c => {
    const key = c.label || c.target;
    clickCounts[key] = (clickCounts[key] || 0) + 1;
  });
  const topClicks = Object.entries(clickCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <>
      <div className="admin-header"><h1>Analytics</h1></div>

      <div className="analytics-stats">
        <div className="stat-card"><div className="stat-number">{recentViews.length}</div><div className="stat-label">Page Views (30d)</div></div>
        <div className="stat-card"><div className="stat-number">{recentClicks.length}</div><div className="stat-label">Clicks (30d)</div></div>
        <div className="stat-card"><div className="stat-number">{analytics.views.length}</div><div className="stat-label">Total Views</div></div>
        <div className="stat-card"><div className="stat-number">{storage.getProjects().length}</div><div className="stat-label">Projects</div></div>
      </div>

      <div className="chart-container">
        <h3>Page Views — Last 30 Days</h3>
        <div className="chart">
          {Object.entries(viewsByDay).map(([date, count]) => (
            <div key={date} className="chart-bar-wrap" title={`${date}: ${count} views`}>
              <div className="chart-bar" style={{ height: `${(count / maxViews) * 100}%` }} />
              <span className="chart-label">{date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h3>Top Clicked Items</h3>
        {topClicks.length ? (
          <table className="analytics-table">
            <thead><tr><th>Item</th><th>Clicks</th></tr></thead>
            <tbody>{topClicks.map(([label, count]) => <tr key={label}><td>{label}</td><td>{count}</td></tr>)}</tbody>
          </table>
        ) : <p className="empty">No click data yet.</p>}
      </div>
    </>
  );
}
