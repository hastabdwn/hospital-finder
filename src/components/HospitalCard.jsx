import { MapPin, Phone, BedDouble, Users, ChevronRight } from 'lucide-react';

const classColors = {
  A: { bg: '#0f172a', text: '#f1f5f9' },
  B: { bg: '#1e3a5f', text: '#bfdbfe' },
  C: { bg: '#14532d', text: '#bbf7d0' },
  D: { bg: '#431407', text: '#fed7aa' },
};

function highlight(text, keyword) {
  if (!keyword || !text) return text;
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fef08a', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + keyword.length)}
      </mark>
      {text.slice(idx + keyword.length)}
    </>
  );
}

export default function HospitalCard({ hospital, onClick, searchKeyword }) {
  const cls = classColors[hospital.class] || classColors.D;

  return (
    <div className="hospital-card" onClick={() => onClick(hospital)}>
      <div className="card-header">
        <div className="badges">
          {hospital.class && (
            <span className="badge-class" style={{ background: cls.bg, color: cls.text }}>
              Kelas {hospital.class}
            </span>
          )}
          <span className="badge-type">{hospital.type}</span>
          {hospital.blu_status === 'BLUD' && <span className="badge-blu">BLU</span>}
        </div>
        <ChevronRight size={16} className="card-arrow" />
      </div>

      <h3 className="card-title">{highlight(hospital.name, searchKeyword)}</h3>
      <div className="card-meta">
        <span className="ownership-tag">{hospital.ownership || '-'}</span>
      </div>

      <div className="card-info">
        {hospital.address && (
          <div className="info-row">
            <MapPin size={13} />
            <span>{hospital.address}</span>
          </div>
        )}
        {hospital.phone && (
          <div className="info-row">
            <Phone size={13} />
            <span>{hospital.phone}</span>
          </div>
        )}
      </div>

      <div className="card-stats">
        <div className="stat">
          <BedDouble size={14} />
          <div>
            <span className="stat-value">{(hospital.facilities?.total_beds || 0).toLocaleString('id-ID')}</span>
            <span className="stat-label">Tempat Tidur</span>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <Users size={14} />
          <div>
            <span className="stat-value">{(hospital.staff?.total || 0).toLocaleString('id-ID')}</span>
            <span className="stat-label">Total SDM</span>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <Users size={14} />
          <div>
            <span className="stat-value">
              {Math.round((hospital.staff?.general_practitioner || 0) + (hospital.staff?.basic_specialist || 0))}
            </span>
            <span className="stat-label">Dokter</span>
          </div>
        </div>
      </div>

      {hospital.services?.list?.length > 0 && (
        <div className="card-facilities">
          {hospital.services.list.slice(0, 3).map(s => (
            <span key={s} className="facility-chip">{s}</span>
          ))}
          {hospital.services.list.length > 3 && (
            <span className="facility-more">+{hospital.services.list.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
