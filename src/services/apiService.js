import axios from 'axios';

const api = axios.create({
  baseURL: '/api/hospitals/indonesia',
  headers: { 'x-api-co-id': import.meta.env.VITE_API_KEY }
});

export const apiService = {
  async getHospitals(params = {}) {
    const p = {};
    if (params.search)        p.name          = params.search;
    if (params.type)          p.type          = params.type;
    if (params.class)         p.class         = params.class;
    if (params.blu_status)    p.blu_status    = params.blu_status;
    if (params.ownership)     p.ownership     = params.ownership;
    if (params.province_code) p.province_code = params.province_code;
    if (params.regency_code)  p.regency_code  = params.regency_code;
    p.page = params.page || 1;
    p.size = params.size || 12;
    const { data } = await api.get('/', { params: p });
    return { data: data.data, paging: data.paging };
  },

  async getHospitalByCode(code) {
    const { data } = await api.get(`/${code}`);
    return data.data;
  },
};