import type { GovernmentScheme } from '../types';

export const schemes: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    title: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
      gu: 'પીએમ-કિસાન (પ્રધાનમંત્રી કિસાન સન્માન નિધિ)',
    },
    description: {
      en: 'Direct income support of ₹6,000 per year for all landholding farmer families.',
      hi: 'सभी भूमिधारक किसान परिवारों के लिए प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
      gu: 'તમામ જમીન ધારક ખેડૂત પરિવારો માટે પ્રતિ વર્ષ ₹6,000 ની સીધી આવક સહાય.',
    },
    category: 'financial',
    officialUrl: 'https://pmkisan.gov.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'pmfby',
    title: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      hi: 'पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)',
      gu: 'પીએમએફબીવાય (પ્રધાનમંત્રી પાક વીમા યોજના)',
    },
    description: {
      en: 'Comprehensive crop insurance against non-preventable natural risks.',
      hi: 'गैर-निवार्य प्राकृतिक जोखिमों के खिलाफ व्यापक फसल बीमा।',
      gu: 'અટકાવી ન શકાય તેવા કુદરતી જોખમો સામે વ્યાપક પાક વીમો.',
    },
    category: 'insurance',
    officialUrl: 'https://pmfby.gov.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'kcc',
    title: {
      en: 'KCC (Kisan Credit Card)',
      hi: 'केसीसी (किसान क्रेडिट कार्ड)',
      gu: 'કેસીસી (કિસાન ક્રેડિટ કાર્ડ)',
    },
    description: {
      en: 'Provides farmers with timely access to credit for agricultural expenses.',
      hi: 'किसानों को कृषि खर्चों के लिए समय पर ऋण तक पहुंच प्रदान करता है।',
      gu: 'ખેડૂતોને કૃષિ ખર્ચ માટે સમયસર ધિરાણની પહોંચ પૂરી પાડે છે.',
    },
    category: 'credit',
    officialUrl: 'https://www.pmkisan.gov.in/KCC.aspx',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'shc',
    title: {
      en: 'Soil Health Card Scheme',
      hi: 'मृदा स्वास्थ्य कार्ड योजना',
      gu: 'જમીન આરોગ્ય કાર્ડ યોજના',
    },
    description: {
      en: 'Provides field-specific soil test reports and fertilizer recommendations.',
      hi: 'क्षेत्र-विशिष्ट मृदा परीक्षण रिपोर्ट और उर्वरक सिफारिशें प्रदान करता है।',
      gu: 'ક્ષેત્ર-વિશિષ્ટ જમીન પરીક્ષણ અહેવાલો અને ખાતર ભલામણો પ્રદાન કરે છે.',
    },
    category: 'soil',
    officialUrl: 'https://soilhealth.dac.gov.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'enam',
    title: {
      en: 'e-NAM (National Agriculture Market)',
      hi: 'ई-नाम (राष्ट्रीय कृषि बाजार)',
      gu: 'ઈ-નામ (રાષ્ટ્રીય કૃષિ બજાર)',
    },
    description: {
      en: 'Pan-India electronic trading portal networking APMC mandis to create a unified national market.',
      hi: 'एक एकीकृत राष्ट्रीय बाजार बनाने के लिए एपीएमसी मंडियों को जोड़ने वाला अखिल भारतीय इलेक्ट्रॉनिक ट्रेडिंग पोर्टल।',
      gu: 'એકીકૃત રાષ્ટ્રીય બજાર બનાવવા માટે એપીએમસી મંડીઓને જોડતું અખિલ ભારતીય ઇલેક્ટ્રોનિક ટ્રેડિંગ પોર્ટલ.',
    },
    category: 'market',
    officialUrl: 'https://enam.gov.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'pmksy',
    title: {
      en: 'PMKSY (Pradhan Mantri Krishi Sinchai Yojana)',
      hi: 'पीएमकेएसवाई (प्रधानमंत्री कृषि सिंचाई योजना)',
      gu: 'પીએમકેએસવાય (પ્રધાનમંત્રી કૃષિ સિંચાઈ યોજના)',
    },
    description: {
      en: 'Focuses on improving water use efficiency and expanding cultivable area under assured irrigation.',
      hi: 'जल उपयोग दक्षता में सुधार और सुनिश्चित सिंचाई के तहत खेती योग्य क्षेत्र के विस्तार पर ध्यान केंद्रित करता है।',
      gu: 'પાણીના ઉપયોગની કાર્યક્ષમતામાં સુધારો કરવા અને ખાતરીપૂર્વકની સિંચાઈ હેઠળ ખેતીલાયક વિસ્તારના વિસ્તરણ પર ધ્યાન કેન્દ્રિત કરે છે.',
    },
    category: 'irrigation',
    officialUrl: 'https://pmksy.gov.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'pmkmdy',
    title: {
      en: 'PM Kisan Maandhan Yojana',
      hi: 'पीएम किसान मानधन योजना',
      gu: 'પીએમ કિસાન માનધન યોજના',
    },
    description: {
      en: 'Pension scheme providing ₹3,000 monthly for eligible small and marginal farmers after age 60.',
      hi: '60 वर्ष की आयु के बाद पात्र छोटे और सीमांत किसानों के लिए ₹3,000 मासिक प्रदान करने वाली पेंशन योजना।',
      gu: '60 વર્ષની વય પછી લાયક નાના અને સીમાંત ખેડૂતો માટે માસિક ₹3,000 પૂરી પાડતી પેન્શન યોજના.',
    },
    category: 'support',
    officialUrl: 'https://maandhan.in/',
    verifiedAt: '2024-01-15',
  },
  {
    id: 'rkvy',
    title: {
      en: 'RKVY (Rashtriya Krishi Vikas Yojana)',
      hi: 'आरकेवीवाई (राष्ट्रीय कृषि विकास योजना)',
      gu: 'આરકેવીવાય (રાષ્ટ્રીય કૃષિ વિકાસ યોજના)',
    },
    description: {
      en: 'Ensures holistic development of agriculture and allied sectors by empowering states to choose local initiatives.',
      hi: 'राज्यों को स्थानीय पहल चुनने का अधिकार देकर कृषि और संबद्ध क्षेत्रों का समग्र विकास सुनिश्चित करता है।',
      gu: 'રાજ્યોને સ્થાનિક પહેલ પસંદ કરવાની સત્તા આપીને કૃષિ અને સંલગ્ન ક્ષેત્રોનો સર્વગ્રાહી વિકાસ સુનિશ્ચિત કરે છે.',
    },
    category: 'support',
    officialUrl: 'https://rkvy.nic.in/',
    verifiedAt: '2024-01-15',
  },
];
