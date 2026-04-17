import { useState, useCallback, useEffect } from 'react';
import { Search, Stethoscope, AlertCircle, ArrowUpDown } from 'lucide-react';
import { useHospitals, useMetadata } from './hooks/useHospitals';
import FilterSidebar from './components/FilterSidebar';
import HospitalCard from './components/HospitalCard';
import HospitalDetail from './components/HospitalDetail';
import StatsBar from './components/StatsBar';
import './App.css';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
  { value: 'beds_desc', label: 'Tempat Tidur ↓' },
  { value: 'staff_desc', label: 'Total SDM ↓' },
];

function sortHospitals(list, sort) {
  if (!sort) return list;
  const sorted = [...list];
  switch (sort) {
    case 'name_asc':   return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':  return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'beds_desc':  return sorted.sort((a, b) => (b.facilities?.total_beds || 0) - (a.facilities?.total_beds || 0));
    case 'staff_desc': return sorted.sort((a, b) => (b.staff?.total || 0) - (a.staff?.total || 0));
    default: return sorted;
  }
}

// Sync filters ke URL params
function filtersToUrl(filters) {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 1 && !(k === 'size' && v === 12)) {
      p.set(k, String(v));
    }
  });
  return p.toString();
}

function urlToFilters() {
  const p = new URLSearchParams(window.location.search);
  const f = { page: 1, size: 12 };
  p.forEach((v, k) => {
    f[k] = k === 'page' || k === 'size' ? Number(v) : v;
  });
  return f;
}

export default function App() {
  const [filters, setFilters] = useState(urlToFilters);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [sort, setSort] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [compareWith, setCompareWith] = useState(null);

  const { hospitals, paging, loading, error } = useHospitals(filters);
  const { types, ownership, bluStatus } = useMetadata();

  const displayedHospitals = sortHospitals(hospitals, sort);

  // Sync URL saat filter berubah
  useEffect(() => {
    const qs = filtersToUrl(filters);
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput.trim() || undefined, page: 1 }));
  }, [searchInput]);

  const handleCardClick = useCallback((hospital) => {
    if (compareWith && compareWith.code !== hospital.code) {
      setSelectedHospital({ ...hospital, _compareMode: true });
    } else {
      setSelectedHospital(hospital);
      setCompareWith(null);
    }
  }, [compareWith]);

  const handleCloseDetail = useCallback(() => {
    setSelectedHospital(null);
    setCompareWith(null);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <Stethoscope size={22} />
          <div>
            <h1>Hospital Finder</h1>
            <p>Data Rumah Sakit Indonesia · SIRS{paging.total_item ? ` · ${paging.total_item.toLocaleString('id-ID')} RS` : ''}</p>
          </div>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama rumah sakit..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Cari</button>
        </form>
      </header>

      <div className="app-body">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          paging={paging}
          loading={loading}
          types={types}
          ownership={ownership}
          bluStatus={bluStatus}
        />

        <main className="main-content">
          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>Gagal memuat data: {error}</span>
            </div>
          )}

          {!loading && hospitals.length > 0 && (
            <div className="toolbar">
              <StatsBar hospitals={hospitals} paging={paging} />
              <div className="sort-control">
                <ArrowUpDown size={14} />
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: filters.size || 12 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : hospitals.length === 0 ? (
            <div className="empty-state">
              <Stethoscope size={48} style={{ opacity: 0.2 }} />
              <p>Tidak ada rumah sakit yang sesuai filter</p>
              <button onClick={() => { setFilters({ page: 1, size: 12 }); setSearchInput(''); }}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="hospital-grid">
              {displayedHospitals.map(h => (
                <HospitalCard
                  key={h.code}
                  hospital={h}
                  onClick={handleCardClick}
                  searchKeyword={filters.search}
                />
              ))}
            </div>
          )}

          {paging.total_page > 1 && (
            <div className="pagination">
              <button
                disabled={paging.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
                ← Sebelumnya
              </button>
              <span>Halaman {paging.page} dari {paging.total_page}</span>
              <button
                disabled={paging.page >= paging.total_page}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
                Berikutnya →
              </button>
            </div>
          )}
        </main>
      </div>

      {selectedHospital && (
        <HospitalDetail
          hospital={selectedHospital}
          onClose={handleCloseDetail}
          compareWith={selectedHospital._compareMode ? compareWith : null}
        />
      )}
    </div>
  );
}
