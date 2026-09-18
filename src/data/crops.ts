import type { Crop } from '../types';

export const crops: Crop[] = [
{
  id: 'cotton',
  name: { en: 'Cotton', hi: 'कपास', gu: 'કપાસ' },
  states: ['gujarat', 'maharashtra', 'madhya-pradesh', 'punjab', 'rajasthan'],
  basePricePerQuintal: 7400
},
{
  id: 'wheat',
  name: { en: 'Wheat', hi: 'गेहूँ', gu: 'ઘઉં' },
  states: ['gujarat', 'madhya-pradesh', 'punjab', 'rajasthan', 'uttar-pradesh'],
  basePricePerQuintal: 2450
},
{
  id: 'groundnut',
  name: { en: 'Groundnut', hi: 'मूंगफली', gu: 'મગફળી' },
  states: ['gujarat', 'rajasthan', 'madhya-pradesh'],
  basePricePerQuintal: 6100
},
{
  id: 'castor',
  name: { en: 'Castor Seed', hi: 'अरंडी', gu: 'દિવેલા' },
  states: ['gujarat', 'rajasthan'],
  basePricePerQuintal: 5900
},
{
  id: 'soybean',
  name: { en: 'Soybean', hi: 'सोयाबीन', gu: 'સોયાબીન' },
  states: ['madhya-pradesh', 'maharashtra', 'rajasthan'],
  basePricePerQuintal: 4600
},
{
  id: 'onion',
  name: { en: 'Onion', hi: 'प्याज', gu: 'ડુંગળી' },
  states: ['gujarat', 'maharashtra', 'madhya-pradesh', 'uttar-pradesh'],
  basePricePerQuintal: 1780
},
{
  id: 'potato',
  name: { en: 'Potato', hi: 'आलू', gu: 'બટાટા' },
  states: ['gujarat', 'uttar-pradesh', 'punjab', 'madhya-pradesh'],
  basePricePerQuintal: 1320
},
{
  id: 'tomato',
  name: { en: 'Tomato', hi: 'टमाटर', gu: 'ટામેટાં' },
  states: ['gujarat', 'maharashtra', 'madhya-pradesh', 'uttar-pradesh'],
  basePricePerQuintal: 1640
},
{
  id: 'cumin',
  name: { en: 'Cumin', hi: 'जीरा', gu: 'જીરું' },
  states: ['gujarat', 'rajasthan'],
  basePricePerQuintal: 24500
},
{
  id: 'bajra',
  name: { en: 'Bajra (Pearl Millet)', hi: 'बाजरा', gu: 'બાજરી' },
  states: ['gujarat', 'rajasthan', 'uttar-pradesh', 'maharashtra'],
  basePricePerQuintal: 2280
},
{
  id: 'paddy',
  name: { en: 'Paddy', hi: 'धान', gu: 'ડાંગર' },
  states: ['punjab', 'uttar-pradesh', 'maharashtra', 'madhya-pradesh'],
  basePricePerQuintal: 2180
},
{
  id: 'mustard',
  name: { en: 'Mustard', hi: 'सरसों', gu: 'રાઈ' },
  states: ['rajasthan', 'uttar-pradesh', 'madhya-pradesh', 'punjab'],
  basePricePerQuintal: 5450
}];


export function findCrop(cropId: string): Crop | undefined {
  return crops.find((c) => c.id === cropId);
}