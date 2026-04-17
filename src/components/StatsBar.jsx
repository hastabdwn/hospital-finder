import { Building2, BedDouble, Users, Award } from 'lucide-react';

export default function StatsBar({ hospitals }) {
  if (!hospitals.length) return null;

  const byClass = hospitals.reduce((acc, h) => {
    if (h.class) acc[h.class] = (acc[h.class] || 0) + 1;
    return acc;
  }, {});

  const totalBeds = hospitals.reduce((sum, h) => sum + (h.facilities?.total_beds || 0), 0);
  const bluCount  = hospitals.filter(h => h.blu_status === 'BLUD').length;

  return (
    <div className="stats-bar">
      <div className="stat-pill">
        <Building2 size={13} />
        <span>Halaman ini: <strong>{hospitals.length}</strong> RS</span>
      </div>
      <div className="stat-pill">
        <BedDouble size={13} />
        <span>Total TT: <strong>{totalBeds.toLocaleString('id-ID')}</strong></span>
      </div>
      <div className="stat-pill">
        <Award size={13} />
        <span>BLU: <strong>{bluCount}</strong></span>
      </div>
      <div className="class-pills">
        {['A','B','C','D'].map(k => byClass[k] ? (
          <span key={k} className={`class-pill class-${k.toLowerCase()}`}>
            {k}: {byClass[k]}
          </span>
        ) : null)}
      </div>
    </div>
  );
}
