import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

export function useHospitals(filters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hospitals', filters],
    queryFn: () => apiService.getHospitals(filters),
    placeholderData: (prev) => prev,
  });

  return {
    hospitals: data?.data || [],
    paging: data?.paging || { page: 1, size: 12, total_item: 0, total_page: 1 },
    loading: isLoading,
    error: error?.message || null,
  };
}

export function useHospitalDetail(code) {
  const { data, isLoading } = useQuery({
    queryKey: ['hospital', code],
    queryFn: () => apiService.getHospitalByCode(code),
    enabled: !!code,
  });

  return {
    hospital: data || null,
    loading: isLoading,
  };
}

export function useMetadata() {
  return {
    types: [
      'Rumah Sakit Umum',
      'Rumah Sakit Khusus Bedah',
      'Rumah Sakit Khusus Gigi dan Mulut',
      'Rumah Sakit Khusus Ibu dan Anak',
      'Rumah Sakit Khusus Jiwa',
    ],
    ownership: [
      'BUMN', 'Kementerian Lain', 'Organisasi Sosial',
      'POLRI', 'Pemkab', 'Pemkot', 'Pemprop',
      'Perorangan', 'Perusahaan', 'SWASTA/LAINNYA',
      'TNI AD', 'TNI AL',
    ],
    bluStatus: ['BLU', 'BLUD', 'Non BLU/BLUD'],
  };
}