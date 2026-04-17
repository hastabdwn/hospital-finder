import { SlidersHorizontal, X } from 'lucide-react';
import { PROVINCES } from '../data/provinces';

const CLASSES = ['A', 'B', 'C', 'D', 'D PRATAMA'];
const PAGE_SIZES = [12, 24, 48];

export default function FilterSidebar({ filters, onChange, paging, loading, types, ownership, bluStatus }) {
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });

  const activeCount = ['type', 'class', 'blu_status', 'ownership', 'province_code']
    .filter(k => filters[k]).length;

  const clearAll = () => onChange({ page: 1, size: filters.size || 12 });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {activeCount > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            <X size={12} /> Hapus ({activeCount})
          </button>
        )}
      </div>

      <div className="filter-group">
        <label>Provinsi</label>
        <select value={filters.province_code || ''} onChange={e => set('province_code', e.target.value)}>
          <option value="">Semua Provinsi</option>
          {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Tipe Rumah Sakit</label>
        <select value={filters.type || ''} onChange={e => set('type', e.target.value)}>
          <option value="">Semua Tipe</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Kelas</label>
        <div className="radio-group">
          {CLASSES.map(k => (
            <label key={k} className={`radio-item ${filters.class === k ? 'active' : ''}`}>
              <input type="radio" name="kelas" value={k}
                checked={filters.class === k}
                onChange={() => set('class', filters.class === k ? '' : k)}
              />
              Kelas {k}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Kepemilikan</label>
        <select value={filters.ownership || ''} onChange={e => set('ownership', e.target.value)}>
          <option value="">Semua</option>
          {ownership.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Status BLU</label>
        <select value={filters.blu_status || ''} onChange={e => set('blu_status', e.target.value)}>
          <option value="">Semua</option>
          {bluStatus.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Tampilkan per halaman</label>
        <div className="radio-group">
          {PAGE_SIZES.map(s => (
            <label key={s} className={`radio-item ${(filters.size || 12) === s ? 'active' : ''}`}>
              <input type="radio" name="size" value={s}
                checked={(filters.size || 12) === s}
                onChange={() => onChange({ ...filters, size: s, page: 1 })}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="result-count">
        {loading ? 'Memuat...' : `${(paging.total_item || 0).toLocaleString('id-ID')} rumah sakit ditemukan`}
      </div>
    </aside>
  );
}
