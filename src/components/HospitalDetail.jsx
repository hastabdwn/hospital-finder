import { X, MapPin, Phone, BedDouble, Users, Building2, Loader2 } from 'lucide-react';
import { useHospitalDetail } from '../hooks/useHospitals';

function BedBar({ beds, total }) {
  if (!beds || !total) return null;
  const segments = [
    { label: 'Kelas I',        value: beds.class_i || 0,             color: '#3b82f6' },
    { label: 'Kelas II',       value: beds.class_ii || 0,            color: '#8b5cf6' },
    { label: 'Kelas III',      value: beds.class_iii || 0,           color: '#10b981' },
    { label: 'HCU',            value: beds.hcu || 0,                 color: '#f59e0b' },
    { label: 'Perinatologi',   value: beds.perinatology || 0,        color: '#ec4899' },
    { label: 'ICU+Ventilator', value: beds.icu_with_ventilator || 0, color: '#ef4444' },
  ].filter(s => s.value > 0);

  if (segments.length === 0) return null;

  return (
    <div className="bed-section">
      <div className="detail-label">Distribusi Tempat Tidur</div>
      <div className="bed-total">{total.toLocaleString('id-ID')} total tempat tidur</div>
      <div className="bed-bar">
        {segments.map(s => (
          <div key={s.label} className="bed-segment"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${s.value}`} />
        ))}
      </div>
      <div className="bed-legend">
        {segments.map(s => (
          <div key={s.label} className="bed-legend-item">
            <span className="bed-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="bed-count">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffSection({ staff }) {
  if (!staff) return null;
  const gp    = Math.round(staff.general_practitioner || 0);
  const basic = Math.round(staff.basic_specialist || 0);
  const other = Math.round(staff.other_specialist || 0);
  const total = staff.total || 0;
  const hasBreakdown = gp + basic + other > 0;
  const items = [
    { label: 'Dokter Umum',       value: gp,    color: '#3b82f6' },
    { label: 'Spesialis Dasar',   value: basic, color: '#8b5cf6' },
    { label: 'Spesialis Lainnya', value: other, color: '#10b981' },
  ];
  const max = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="staff-section">
      <div className="detail-label">Tenaga Kesehatan</div>
      {hasBreakdown ? (
        <div className="staff-grid">
          {items.map(i => (
            <div key={i.label} className="staff-item">
              <div className="staff-info">
                <span className="staff-name">{i.label}</span>
                <span className="staff-val" style={{ color: i.color }}>{i.value}</span>
              </div>
              <div className="staff-bar-bg">
                <div className="staff-bar-fill" style={{ width: `${(i.value / max) * 100}%`, background: i.color }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 8 }}>
          Detail breakdown tidak tersedia di data SIRS.
        </p>
      )}
      <div className="staff-total">Total SDM: <strong>{total.toLocaleString('id-ID')}</strong></div>
    </div>
  );
}

const classColors = {
  A: { bg: '#0f172a', text: '#f1f5f9' },
  B: { bg: '#1e3a5f', text: '#bfdbfe' },
  C: { bg: '#14532d', text: '#bbf7d0' },
  D: { bg: '#431407', text: '#fed7aa' },
};

function CompareRow({ label, a, b }) {
  return (
    <tr>
      <td style={{ padding: '6px 8px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ padding: '6px 8px', fontSize: 12, textAlign: 'center' }}>{a ?? '-'}</td>
      <td style={{ padding: '6px 8px', fontSize: 12, textAlign: 'center' }}>{b ?? '-'}</td>
    </tr>
  );
}

export default function HospitalDetail({ hospital: listData, onClose, compareWith }) {
  // Fetch full detail from API
  const { hospital: detail, loading } = useHospitalDetail(listData?.code);
  const h = detail || listData; // fallback ke list data saat loading

  if (!listData) return null;

  const cls = classColors[h.class] || classColors.D;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        {loading && (
          <div className="modal-loading">
            <Loader2 size={20} className="spin" />
            <span>Memuat detail...</span>
          </div>
        )}

        <div className="modal-header">
          <div className="modal-badges">
            {h.class && (
              <span className="badge-kelas" style={{ background: cls.bg, color: cls.text }}>
                Kelas {h.class}
              </span>
            )}
            <span className="badge-tipe">{h.type}</span>
            {h.blu_status === 'BLUD' && <span className="badge-blu">BLU</span>}
          </div>
          <h2 className="modal-title">{h.name}</h2>
          <p className="modal-code">Kode RS: {h.code}</p>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-label">Informasi Umum</div>
            <div className="detail-rows">
              {h.director && (
                <div className="detail-row"><Building2 size={14} /><span>Direktur: <strong>{h.director}</strong></span></div>
              )}
              <div className="detail-row"><Building2 size={14} /><span>Kepemilikan: {h.ownership || '-'}</span></div>
              <div className="detail-row"><Building2 size={14} /><span>Status BLU: {h.blu_status || '-'}</span></div>
              {h.address && (
                <div className="detail-row"><MapPin size={14} /><span>{h.address}</span></div>
              )}
              {h.phone && (
                <div className="detail-row"><Phone size={14} /><a href={`tel:${h.phone}`}>{h.phone}</a></div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Fasilitas</div>
            <div className="detail-rows">
              <div className="detail-row">
                <BedDouble size={14} />
                <span>Total Tempat Tidur: <strong>{h.facilities?.total_beds || 0}</strong></span>
              </div>
              {h.facilities?.land_area && h.facilities.land_area !== '-' && (
                <div className="detail-row"><Building2 size={14} /><span>Luas Lahan: {h.facilities.land_area}</span></div>
              )}
              {h.facilities?.building_area && h.facilities.building_area !== '-' && (
                <div className="detail-row"><Building2 size={14} /><span>Luas Bangunan: {h.facilities.building_area}</span></div>
              )}
            </div>
          </div>

          <BedBar beds={h.beds} total={h.facilities?.total_beds} />
          <StaffSection staff={h.staff} />

          {h.services?.list?.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">Layanan ({h.services.count})</div>
              <div className="chips-grid">
                {h.services.list.map(s => (
                  <span key={s} className="chip-layanan">{s}</span>
                ))}
              </div>
            </div>
          )}

          {compareWith && (
            <div className="detail-section">
              <div className="detail-label">Perbandingan dengan {compareWith.name}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '6px 8px', fontSize: 11, textAlign: 'left', color: 'var(--text-hint)' }}></th>
                    <th style={{ padding: '6px 8px', fontSize: 11, textAlign: 'center', color: 'var(--text-muted)' }}>{h.name}</th>
                    <th style={{ padding: '6px 8px', fontSize: 11, textAlign: 'center', color: 'var(--text-muted)' }}>{compareWith.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Kelas" a={h.class} b={compareWith.class} />
                  <CompareRow label="Tempat Tidur" a={h.facilities?.total_beds} b={compareWith.facilities?.total_beds} />
                  <CompareRow label="Total SDM" a={h.staff?.total} b={compareWith.staff?.total} />
                  <CompareRow label="Layanan" a={h.services?.count} b={compareWith.services?.count} />
                  <CompareRow label="Status BLU" a={h.blu_status} b={compareWith.blu_status} />
                </tbody>
              </table>
            </div>
          )}

          <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>
            Kode Provinsi: {h.province_code} · Kode Kabupaten: {h.regency_code}
          </div>
        </div>
      </div>
    </div>
  );
}
