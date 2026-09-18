import type { District, StateRegion } from '../types';

export const states: StateRegion[] = [
{
  id: 'gujarat',
  name: 'Gujarat',
  districts: [
  { id: 'anand', name: 'Anand', lat: 22.5645, lon: 72.9289 },
  { id: 'vadodara', name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
  { id: 'rajkot', name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
  { id: 'surat', name: 'Surat', lat: 21.1702, lon: 72.8311 },
  { id: 'mehsana', name: 'Mehsana', lat: 23.588, lon: 72.3693 },
  { id: 'junagadh', name: 'Junagadh', lat: 21.5222, lon: 70.4579 }]

},
{
  id: 'maharashtra',
  name: 'Maharashtra',
  districts: [
  { id: 'pune', name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { id: 'nashik', name: 'Nashik', lat: 19.9975, lon: 73.7898 },
  { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { id: 'jalgaon', name: 'Jalgaon', lat: 21.0077, lon: 75.5626 }]

},
{
  id: 'madhya-pradesh',
  name: 'Madhya Pradesh',
  districts: [
  { id: 'indore', name: 'Indore', lat: 22.7196, lon: 75.8577 },
  { id: 'bhopal', name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { id: 'ujjain', name: 'Ujjain', lat: 23.1765, lon: 75.7885 }]

},
{
  id: 'rajasthan',
  name: 'Rajasthan',
  districts: [
  { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { id: 'kota', name: 'Kota', lat: 25.2138, lon: 75.8648 },
  { id: 'jodhpur', name: 'Jodhpur', lat: 26.2389, lon: 73.0243 }]

},
{
  id: 'punjab',
  name: 'Punjab',
  districts: [
  { id: 'ludhiana', name: 'Ludhiana', lat: 30.901, lon: 75.8573 },
  { id: 'amritsar', name: 'Amritsar', lat: 31.634, lon: 74.8723 },
  { id: 'patiala', name: 'Patiala', lat: 30.3398, lon: 76.3869 }]

},
{
  id: 'uttar-pradesh',
  name: 'Uttar Pradesh',
  districts: [
  { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { id: 'kanpur', name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
  { id: 'varanasi', name: 'Varanasi', lat: 25.3176, lon: 82.9739 }]

}];


export function findState(stateId: string): StateRegion | undefined {
  return states.find((s) => s.id === stateId);
}

export function findDistrict(stateId: string, districtId: string): District | undefined {
  return findState(stateId)?.districts.find((d) => d.id === districtId);
}