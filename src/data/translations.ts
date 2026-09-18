import type { Localized } from '../types';

/**
 * Translation dictionary. Scope is deliberate: navigation, screen titles, labels,
 * buttons, statuses, validation and advisory copy. Farmer names and place names
 * stay as they are.
 */
export const translations: Record<string, Localized> = {
  'app.name': { en: 'KhedutMitra', hi: 'खेडूतमित्र', gu: 'ખેડૂતમિત્ર' },
  'app.tagline': {
    en: 'Your farm. Your weather. Your market.',
    hi: 'आपका खेत। आपका मौसम। आपका बाज़ार।',
    gu: 'તમારું ખેતર. તમારું હવામાન. તમારું બજાર.'
  },

  'nav.home': { en: 'Home', hi: 'होम', gu: 'હોમ' },
  'nav.prices': { en: 'Prices', hi: 'भाव', gu: 'ભાવ' },
  'nav.sell': { en: 'Sell', hi: 'बेचें', gu: 'વેચો' },
  'nav.listings': { en: 'Listings', hi: 'मेरी सूची', gu: 'મારી યાદી' },
  'nav.marketplace': { en: 'Market', hi: 'बाज़ार', gu: 'બજાર' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल', gu: 'પ્રોફાઇલ' },

  'action.getStarted': { en: 'Get Started', hi: 'शुरू करें', gu: 'શરૂ કરો' },
  'action.browseMarketplace': { en: 'Browse Marketplace', hi: 'बाज़ार देखें', gu: 'બજાર જુઓ' },
  'action.login': { en: 'Log in', hi: 'लॉग इन', gu: 'લૉગ ઇન' },
  'action.signup': { en: 'Create account', hi: 'खाता बनाएँ', gu: 'ખાતું બનાવો' },
  'action.logout': { en: 'Sign out', hi: 'साइन आउट', gu: 'સાઇન આઉટ' },
  'action.retry': { en: 'Try again', hi: 'फिर कोशिश करें', gu: 'ફરી પ્રયાસ કરો' },
  'action.viewPrices': { en: 'View all mandi prices', hi: 'सभी मंडी भाव देखें', gu: 'બધા મંડી ભાવ જુઓ' },
  'action.manageListings': { en: 'Manage listings', hi: 'सूची देखें', gu: 'યાદી જુઓ' },
  'action.publish': { en: 'Publish Listing', hi: 'सूची प्रकाशित करें', gu: 'યાદી પ્રકાશિત કરો' },
  'action.contactFarmer': { en: 'Contact Farmer', hi: 'किसान से संपर्क करें', gu: 'ખેડૂતનો સંપર્ક કરો' },
  'action.backHome': { en: 'Back to Home', hi: 'होम पर जाएँ', gu: 'હોમ પર જાઓ' },
  'action.viewInMarketplace': { en: 'View in Marketplace', hi: 'बाज़ार में देखें', gu: 'બજારમાં જુઓ' },
  'action.markSold': { en: 'Mark as sold', hi: 'बिक गया', gu: 'વેચાઈ ગયું' },
  'action.withdraw': { en: 'Withdraw', hi: 'वापस लें', gu: 'પાછું ખેંચો' },
  'action.editPrice': { en: 'Edit price', hi: 'भाव बदलें', gu: 'ભાવ બદલો' },
  'action.relist': { en: 'List again', hi: 'फिर से सूचीबद्ध करें', gu: 'ફરી યાદીમાં મૂકો' },
  'action.save': { en: 'Save', hi: 'सहेजें', gu: 'સાચવો' },
  'action.cancel': { en: 'Cancel', hi: 'रद्द करें', gu: 'રદ કરો' },
  'action.clearFilters': { en: 'Clear filters', hi: 'फ़िल्टर हटाएँ', gu: 'ફિલ્ટર દૂર કરો' },
  'action.copy': { en: 'Copy number', hi: 'नंबर कॉपी करें', gu: 'નંબર કૉપી કરો' },
  'action.copied': { en: 'Copied', hi: 'कॉपी हो गया', gu: 'કૉપી થયું' },
  'action.back': { en: 'Back', hi: 'वापस', gu: 'પાછા' },
  'action.sellProduce': { en: 'Sell produce', hi: 'उपज बेचें', gu: 'પાક વેચો' },

  'greeting.morning': { en: 'Good morning', hi: 'सुप्रभात', gu: 'સુપ્રભાત' },
  'greeting.afternoon': { en: 'Good afternoon', hi: 'नमस्कार', gu: 'નમસ્કાર' },
  'greeting.evening': { en: 'Good evening', hi: 'शुभ संध्या', gu: 'શુભ સાંજ' },

  'weather.title': { en: 'Weather now', hi: 'अभी का मौसम', gu: 'અત્યારનું હવામાન' },
  'weather.feelsLike': { en: 'Feels like', hi: 'महसूस', gu: 'અનુભવ' },
  'weather.humidity': { en: 'Humidity', hi: 'नमी', gu: 'ભેજ' },
  'weather.wind': { en: 'Wind', hi: 'हवा', gu: 'પવન' },
  'weather.rainToday': { en: 'Rain chance today', hi: 'आज बारिश की संभावना', gu: 'આજે વરસાદની શક્યતા' },
  'weather.forecast': { en: 'Next 5 days', hi: 'अगले 5 दिन', gu: 'આગામી 5 દિવસ' },
  'weather.saved': {
    en: 'Showing saved forecast — live weather is unavailable.',
    hi: 'सहेजा हुआ पूर्वानुमान दिख रहा है — लाइव मौसम उपलब्ध नहीं है।',
    gu: 'સાચવેલ આગાહી બતાવાય છે — લાઇવ હવામાન ઉપલબ્ધ નથી.'
  },
  'weather.errorTitle': { en: 'Weather unavailable', hi: 'मौसम उपलब्ध नहीं', gu: 'હવામાન ઉપલબ્ધ નથી' },
  'weather.errorBody': {
    en: 'We could not reach the weather service. Check your connection and try again.',
    hi: 'मौसम सेवा से संपर्क नहीं हो सका। कनेक्शन जाँचें और फिर कोशिश करें।',
    gu: 'હવામાન સેવા સાથે સંપર્ક થયો નથી. કનેક્શન તપાસો અને ફરી પ્રયાસ કરો.'
  },
  'weather.noLocationTitle': { en: 'Set your district', hi: 'अपना ज़िला चुनें', gu: 'તમારો જિલ્લો પસંદ કરો' },
  'weather.noLocationBody': {
    en: 'Weather and mandi prices need your district to be useful.',
    hi: 'मौसम और मंडी भाव के लिए आपका ज़िला ज़रूरी है।',
    gu: 'હવામાન અને મંડી ભાવ માટે તમારો જિલ્લો જરૂરી છે.'
  },
  'weather.setLocation': { en: 'Set district', hi: 'ज़िला चुनें', gu: 'જિલ્લો પસંદ કરો' },
  'weather.updated': { en: 'Updated {time}', hi: '{time} पर अपडेट', gu: '{time} વાગ્યે અપડેટ' },

  'advisory.title': { en: "Today's advice", hi: 'आज की सलाह', gu: 'આજની સલાહ' },
  'advisory.more': { en: 'Also keep in mind', hi: 'यह भी ध्यान रखें', gu: 'આ પણ ધ્યાનમાં રાખો' },
  'advisory.urgent': { en: 'Act today', hi: 'आज ही करें', gu: 'આજે જ કરો' },
  'advisory.caution': { en: 'Be careful', hi: 'सावधानी', gu: 'સાવચેતી' },
  'advisory.good': { en: 'Good conditions', hi: 'अच्छी स्थिति', gu: 'સારી સ્થિતિ' },

  'adv.delaySpray.title': { en: 'Delay pesticide spraying', hi: 'दवा का छिड़काव टालें', gu: 'દવાનો છંટકાવ મુલતવી રાખો' },
  'adv.delaySpray.reason': {
    en: 'Rain expected in {hours} hours — it may wash the spray away.',
    hi: '{hours} घंटे में बारिश की संभावना — छिड़काव बह सकता है।',
    gu: '{hours} કલાકમાં વરસાદની શક્યતા — છંટકાવ ધોવાઈ શકે છે.'
  },
  'adv.skipIrrigation.title': { en: 'Skip irrigation today', hi: 'आज सिंचाई न करें', gu: 'આજે પિયત ટાળો' },
  'adv.skipIrrigation.reason': {
    en: 'About {mm} mm of rain is expected — the soil will get enough water.',
    hi: 'लगभग {mm} मिमी बारिश की संभावना — खेत को पर्याप्त पानी मिल जाएगा।',
    gu: 'આશરે {mm} મિમી વરસાદની શક્યતા — ખેતરને પૂરતું પાણી મળી જશે.'
  },
  'adv.coverHarvest.title': { en: 'Cover harvested produce', hi: 'कटी उपज ढँक दें', gu: 'કાપેલો પાક ઢાંકી દો' },
  'adv.coverHarvest.reason': {
    en: 'Heavy rain is likely — open produce can spoil or lose weight.',
    hi: 'तेज़ बारिश की संभावना — खुली उपज खराब हो सकती है।',
    gu: 'ભારે વરસાદની શક્યતા — ખુલ્લો પાક બગડી શકે છે.'
  },
  'adv.goodSpray.title': { en: 'Good day for spraying', hi: 'छिड़काव के लिए अच्छा दिन', gu: 'છંટકાવ માટે સારો દિવસ' },
  'adv.goodSpray.reason': {
    en: 'No rain expected for two days and the wind is calm.',
    hi: 'दो दिन बारिश की संभावना नहीं और हवा शांत है।',
    gu: 'બે દિવસ વરસાદની શક્યતા નથી અને પવન શાંત છે.'
  },
  'adv.windy.title': { en: 'Avoid spraying in this wind', hi: 'तेज़ हवा में छिड़काव न करें', gu: 'આ પવનમાં છંટકાવ ટાળો' },
  'adv.windy.reason': {
    en: 'Wind is {wind} km/h — the spray will drift away from the crop.',
    hi: 'हवा {wind} किमी/घंटा — दवा फसल से दूर उड़ जाएगी।',
    gu: 'પવન {wind} કિમી/કલાક — દવા પાકથી દૂર ઉડી જશે.'
  },
  'adv.heat.title': { en: 'Irrigate early in the morning', hi: 'सुबह जल्दी सिंचाई करें', gu: 'વહેલી સવારે પિયત આપો' },
  'adv.heat.reason': {
    en: 'It will reach {temp}°C — midday watering evaporates before it helps.',
    hi: 'तापमान {temp}°C तक जाएगा — दोपहर का पानी भाप बनकर उड़ जाता है।',
    gu: 'તાપમાન {temp}°C સુધી જશે — બપોરનું પાણી બાષ્પ થઈ જાય છે.'
  },
  'adv.irrigate.title': { en: 'Irrigation may be needed', hi: 'सिंचाई की ज़रूरत हो सकती है', gu: 'પિયતની જરૂર પડી શકે' },
  'adv.irrigate.reason': {
    en: 'No rain expected for the next 5 days.',
    hi: 'अगले 5 दिन बारिश की संभावना नहीं है।',
    gu: 'આગામી 5 દિવસ વરસાદની શક્યતા નથી.'
  },
  'adv.clear.title': { en: 'Normal field work is fine', hi: 'सामान्य खेत का काम ठीक है', gu: 'સામાન્ય ખેતીકામ બરાબર છે' },
  'adv.clear.reason': {
    en: 'Weather is steady today with nothing to work around.',
    hi: 'आज मौसम स्थिर है, कोई परेशानी नहीं।',
    gu: 'આજે હવામાન સ્થિર છે, કોઈ મુશ્કેલી નથી.'
  },

  'market.title': { en: 'Mandi Prices', hi: 'मंडी भाव', gu: 'મંડી ભાવ' },
  'market.selectCrop': { en: 'Crop', hi: 'फसल', gu: 'પાક' },
  'market.market': { en: 'Market', hi: 'मंडी', gu: 'મંડી' },
  'market.searchCrop': { en: 'Search crop', hi: 'फसल खोजें', gu: 'પાક શોધો' },
  'market.bestToday': { en: 'Best price today', hi: 'आज का सबसे अच्छा भाव', gu: 'આજનો શ્રેષ્ઠ ભાવ' },
  'market.bestPrice': { en: 'Best price', hi: 'सबसे अच्छा भाव', gu: 'શ્રેષ્ઠ ભાવ' },
  'market.perQuintal': { en: 'per quintal', hi: 'प्रति क्विंटल', gu: 'પ્રતિ ક્વિન્ટલ' },
  'market.modal': { en: 'Modal', hi: 'सामान्य', gu: 'સામાન્ય' },
  'market.min': { en: 'Min', hi: 'न्यूनतम', gu: 'ન્યૂનતમ' },
  'market.max': { en: 'Max', hi: 'अधिकतम', gu: 'મહત્તમ' },
  'market.compare': { en: 'All markets near you', hi: 'आपके पास की सभी मंडियाँ', gu: 'તમારી નજીકની બધી મંડીઓ' },
  'market.asOf': { en: 'Prices as of {date}', hi: '{date} के भाव', gu: '{date} ના ભાવ' },
  'market.cached': {
    en: 'Live mandi feed is unavailable. Showing the last saved prices.',
    hi: 'लाइव मंडी फ़ीड उपलब्ध नहीं। पिछले सहेजे भाव दिख रहे हैं।',
    gu: 'લાઇવ મંડી ફીડ ઉપલબ્ધ નથી. છેલ્લા સાચવેલા ભાવ બતાવાય છે.'
  },
  'market.emptyTitle': { en: 'No price data for this crop', hi: 'इस फसल का भाव उपलब्ध नहीं', gu: 'આ પાકનો ભાવ ઉપલબ્ધ નથી' },
  'market.emptyBody': {
    en: '{crop} is not traded in {district} right now. Try another crop.',
    hi: '{district} में अभी {crop} की खरीद-बिक्री नहीं हो रही। दूसरी फसल देखें।',
    gu: '{district} માં અત્યારે {crop} નો વેપાર થતો નથી. બીજો પાક જુઓ.'
  },
  'market.errorTitle': { en: 'Could not load prices', hi: 'भाव लोड नहीं हो सके', gu: 'ભાવ લોડ થઈ શક્યા નથી' },
  'market.errorBody': {
    en: 'The mandi price service did not respond. Please try again.',
    hi: 'मंडी भाव सेवा ने जवाब नहीं दिया। फिर कोशिश करें।',
    gu: 'મંડી ભાવ સેવાએ જવાબ આપ્યો નથી. ફરી પ્રયાસ કરો.'
  },
  'market.trend7': { en: '7-day trend', hi: '7 दिन का रुझान', gu: '7 દિવસનો વલણ' },
  'market.trendUp': { en: 'Up {amount} over 7 days', hi: '7 दिन में {amount} बढ़ा', gu: '7 દિવસમાં {amount} વધ્યો' },
  'market.trendDown': { en: 'Down {amount} over 7 days', hi: '7 दिन में {amount} घटा', gu: '7 દિવસમાં {amount} ઘટ્યો' },
  'market.trendFlat': { en: 'Steady over 7 days', hi: '7 दिन से स्थिर', gu: '7 દિવસથી સ્થિર' },
  'market.up': { en: 'Up', hi: 'बढ़ा', gu: 'વધ્યો' },
  'market.down': { en: 'Down', hi: 'घटा', gu: 'ઘટ્યો' },
  'market.flat': { en: 'Steady', hi: 'स्थिर', gu: 'સ્થિર' },
  'market.snapshot': { en: 'Market snapshot', hi: 'बाज़ार की झलक', gu: 'બજારની ઝલક' },
  'market.away': { en: '{km} km away', hi: '{km} किमी दूर', gu: '{km} કિમી દૂર' },
  'market.vsYesterday': { en: 'vs yesterday', hi: 'कल के मुकाबले', gu: 'ગઈકાલની સરખામણીએ' },

  'listing.crop': { en: 'Crop', hi: 'फसल', gu: 'પાક' },
  'listing.quantity': { en: 'Quantity', hi: 'मात्रा', gu: 'જથ્થો' },
  'listing.price': { en: 'Asking price', hi: 'माँगा गया भाव', gu: 'માંગેલ ભાવ' },
  'listing.total': { en: 'Total value', hi: 'कुल मूल्य', gu: 'કુલ કિંમત' },
  'listing.status': { en: 'Status', hi: 'स्थिति', gu: 'સ્થિતિ' },
  'listing.created': { en: 'Created', hi: 'बनाया', gu: 'બનાવ્યું' },
  'listing.active': { en: 'Active', hi: 'चालू', gu: 'ચાલુ' },
  'listing.sold': { en: 'Sold', hi: 'बिका', gu: 'વેચાયું' },
  'listing.withdrawn': { en: 'Withdrawn', hi: 'वापस लिया', gu: 'પાછું ખેંચ્યું' },
  'listing.myTitle': { en: 'My Listings', hi: 'मेरी सूची', gu: 'મારી યાદી' },
  'listing.activeCount': { en: '{count} active listings', hi: '{count} चालू सूचियाँ', gu: '{count} ચાલુ યાદીઓ' },
  'listing.activeCountOne': { en: '1 active listing', hi: '1 चालू सूची', gu: '1 ચાલુ યાદી' },
  'listing.emptyActive': { en: 'No active listings yet', hi: 'अभी कोई चालू सूची नहीं', gu: 'હજી કોઈ ચાલુ યાદી નથી' },
  'listing.emptyActiveBody': {
    en: 'Publish your produce and buyers near you can contact you directly.',
    hi: 'अपनी उपज सूचीबद्ध करें, पास के खरीदार सीधे संपर्क करेंगे।',
    gu: 'તમારો પાક યાદીમાં મૂકો, નજીકના ખરીદદારો સીધો સંપર્ક કરશે.'
  },
  'listing.emptySold': { en: 'Nothing sold yet', hi: 'अभी कुछ बिका नहीं', gu: 'હજી કંઈ વેચાયું નથી' },
  'listing.emptySoldBody': {
    en: 'Listings you mark as sold will appear here.',
    hi: 'जिन्हें आप बिका हुआ चिह्नित करेंगे, वे यहाँ दिखेंगी।',
    gu: 'તમે વેચાયેલ તરીકે ચિહ્નિત કરેલી યાદીઓ અહીં દેખાશે.'
  },
  'listing.emptyWithdrawn': { en: 'Nothing withdrawn', hi: 'कुछ वापस नहीं लिया', gu: 'કંઈ પાછું ખેંચ્યું નથી' },
  'listing.emptyWithdrawnBody': {
    en: 'Listings you take off the marketplace will appear here.',
    hi: 'बाज़ार से हटाई गई सूचियाँ यहाँ दिखेंगी।',
    gu: 'બજારમાંથી હટાવેલી યાદીઓ અહીં દેખાશે.'
  },
  'listing.errorTitle': { en: 'Could not load your listings', hi: 'आपकी सूची लोड नहीं हुई', gu: 'તમારી યાદી લોડ થઈ નથી' },
  'listing.markedSold': { en: 'Listing marked as sold', hi: 'सूची बिका हुआ चिह्नित', gu: 'યાદી વેચાયેલ તરીકે ચિહ્નિત' },
  'listing.withdrawnToast': { en: 'Listing withdrawn', hi: 'सूची वापस ले ली', gu: 'યાદી પાછી ખેંચી' },
  'listing.relistedToast': { en: 'Listing is active again', hi: 'सूची फिर चालू है', gu: 'યાદી ફરી ચાલુ છે' },
  'listing.priceUpdated': { en: 'Price updated', hi: 'भाव अपडेट हुआ', gu: 'ભાવ અપડેટ થયો' },

  'sell.title': { en: 'Sell Produce', hi: 'उपज बेचें', gu: 'પાક વેચો' },
  'sell.subtitle': {
    en: 'Three details and your produce is visible to buyers.',
    hi: 'तीन जानकारी दें और आपकी उपज खरीदारों को दिखेगी।',
    gu: 'ત્રણ વિગતો આપો અને તમારો પાક ખરીદદારોને દેખાશે.'
  },
  'sell.cropLabel': { en: 'Which crop?', hi: 'कौन सी फसल?', gu: 'કયો પાક?' },
  'sell.quantityLabel': { en: 'Quantity (kg)', hi: 'मात्रा (किलो)', gu: 'જથ્થો (કિલો)' },
  'sell.priceLabel': { en: 'Asking price per kg (₹)', hi: 'प्रति किलो भाव (₹)', gu: 'પ્રતિ કિલો ભાવ (₹)' },
  'sell.estimated': { en: 'Estimated total value', hi: 'अनुमानित कुल मूल्य', gu: 'અંદાજિત કુલ કિંમત' },
  'sell.estimatedHelp': {
    en: 'Buyers see this total on your listing.',
    hi: 'खरीदार आपकी सूची पर यह कुल देखेंगे।',
    gu: 'ખરીદદારો તમારી યાદી પર આ કુલ જોશે.'
  },
  'sell.successTitle': { en: 'Your listing is live', hi: 'आपकी सूची प्रकाशित हो गई', gu: 'તમારી યાદી પ્રકાશિત થઈ' },
  'sell.successBody': {
    en: 'Buyers near you can now see it and call you directly.',
    hi: 'पास के खरीदार अब इसे देख सकते हैं और सीधे कॉल कर सकते हैं।',
    gu: 'નજીકના ખરીદદારો હવે તે જોઈ શકે છે અને સીધો ફોન કરી શકે છે.'
  },
  'sell.buyersSee': { en: 'What buyers will see', hi: 'खरीदार क्या देखेंगे', gu: 'ખરીદદારો શું જોશે' },
  'sell.errorTitle': { en: 'Listing could not be published', hi: 'सूची प्रकाशित नहीं हो सकी', gu: 'યાદી પ્રકાશિત થઈ શકી નથી' },
  'sell.errorBody': {
    en: 'Your details are still here. Please publish again.',
    hi: 'आपकी जानकारी सुरक्षित है। फिर से प्रकाशित करें।',
    gu: 'તમારી વિગતો સચવાયેલી છે. ફરી પ્રકાશિત કરો.'
  },

  'validation.selectCrop': { en: 'Please select a crop.', hi: 'कृपया फसल चुनें।', gu: 'કૃપા કરી પાક પસંદ કરો.' },
  'validation.quantity': {
    en: 'Quantity must be greater than 0.',
    hi: 'मात्रा 0 से अधिक होनी चाहिए।',
    gu: 'જથ્થો 0 થી વધુ હોવો જોઈએ.'
  },
  'validation.price': {
    en: 'Asking price must be greater than 0.',
    hi: 'भाव 0 से अधिक होना चाहिए।',
    gu: 'ભાવ 0 થી વધુ હોવો જોઈએ.'
  },
  'validation.name': { en: 'Please enter your name.', hi: 'कृपया अपना नाम भरें।', gu: 'કૃપા કરી તમારું નામ ભરો.' },
  'validation.phone': {
    en: 'Please enter a valid 10-digit phone number.',
    hi: 'कृपया सही 10 अंकों का नंबर भरें।',
    gu: 'કૃપા કરી સાચો 10 અંકનો નંબર ભરો.'
  },
  'validation.password': {
    en: 'Password must be at least 6 characters.',
    hi: 'पासवर्ड कम से कम 6 अक्षर का हो।',
    gu: 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.'
  },
  'validation.state': { en: 'Please select your state.', hi: 'कृपया राज्य चुनें।', gu: 'કૃપા કરી રાજ્ય પસંદ કરો.' },
  'validation.district': { en: 'Please select your district.', hi: 'कृपया ज़िला चुनें।', gu: 'કૃપા કરી જિલ્લો પસંદ કરો.' },
  'validation.fixErrors': {
    en: 'Please check the highlighted fields.',
    hi: 'कृपया चिह्नित जानकारी जाँचें।',
    gu: 'કૃપા કરી ચિહ્નિત વિગતો તપાસો.'
  },

  'marketplace.title': { en: 'Marketplace', hi: 'बाज़ार', gu: 'બજાર' },
  'marketplace.subtitle': {
    en: 'Produce listed directly by farmers.',
    hi: 'किसानों द्वारा सीधे सूचीबद्ध उपज।',
    gu: 'ખેડૂતો દ્વારા સીધો યાદીબદ્ધ પાક.'
  },
  'marketplace.search': { en: 'Search crop or farmer', hi: 'फसल या किसान खोजें', gu: 'પાક કે ખેડૂત શોધો' },
  'marketplace.allCrops': { en: 'All crops', hi: 'सभी फसलें', gu: 'બધા પાક' },
  'marketplace.allDistricts': { en: 'All districts', hi: 'सभी ज़िले', gu: 'બધા જિલ્લા' },
  'marketplace.results': { en: '{count} listings', hi: '{count} सूचियाँ', gu: '{count} યાદીઓ' },
  'marketplace.emptyTitle': { en: 'No listings match', hi: 'कोई सूची नहीं मिली', gu: 'કોઈ યાદી મળી નથી' },
  'marketplace.emptyBody': {
    en: 'Try a different crop or clear the filters.',
    hi: 'दूसरी फसल देखें या फ़िल्टर हटाएँ।',
    gu: 'બીજો પાક જુઓ અથવા ફિલ્ટર દૂર કરો.'
  },
  'marketplace.errorTitle': { en: 'Could not load listings', hi: 'सूचियाँ लोड नहीं हुईं', gu: 'યાદીઓ લોડ થઈ નથી' },
  'marketplace.new': { en: 'New', hi: 'नया', gu: 'નવું' },
  'marketplace.notFound': { en: 'Listing not found', hi: 'सूची नहीं मिली', gu: 'યાદી મળી નથી' },
  'marketplace.notFoundBody': {
    en: 'This listing may have been sold or withdrawn.',
    hi: 'यह सूची बिक चुकी या वापस ली जा चुकी है।',
    gu: 'આ યાદી વેચાઈ ગઈ છે અથવા પાછી ખેંચાઈ છે.'
  },

  'detail.postedOn': { en: 'Posted on', hi: 'प्रकाशित', gu: 'પ્રકાશિત' },
  'detail.farmer': { en: 'Farmer', hi: 'किसान', gu: 'ખેડૂત' },
  'detail.location': { en: 'Location', hi: 'स्थान', gu: 'સ્થળ' },
  'detail.phoneLabel': { en: 'Phone number', hi: 'फ़ोन नंबर', gu: 'ફોન નંબર' },
  'detail.pickupNote': {
    en: 'Call the farmer to agree on quantity, price and pickup. KhedutMitra does not handle payment or delivery.',
    hi: 'मात्रा, भाव और उठाव के लिए किसान को कॉल करें। खेडूतमित्र भुगतान या डिलीवरी नहीं करता।',
    gu: 'જથ્થો, ભાવ અને ઉપાડ માટે ખેડૂતને ફોન કરો. ખેડૂતમિત્ર ચુકવણી કે ડિલિવરી કરતું નથી.'
  },

  'auth.loginTitle': { en: 'Welcome back', hi: 'फिर से स्वागत है', gu: 'ફરી સ્વાગત છે' },
  'auth.loginSubtitle': {
    en: 'Log in with the phone number you registered.',
    hi: 'पंजीकृत फ़ोन नंबर से लॉग इन करें।',
    gu: 'નોંધાયેલ ફોન નંબરથી લૉગ ઇન કરો.'
  },
  'auth.signupTitle': { en: 'Create your account', hi: 'अपना खाता बनाएँ', gu: 'તમારું ખાતું બનાવો' },
  'auth.roleQuestion': { en: 'I am a', hi: 'मैं हूँ', gu: 'હું છું' },
  'auth.farmer': { en: 'Farmer', hi: 'किसान', gu: 'ખેડૂત' },
  'auth.farmerDesc': {
    en: 'Get weather advice, mandi prices and sell produce.',
    hi: 'मौसम सलाह, मंडी भाव और उपज बेचें।',
    gu: 'હવામાન સલાહ, મંડી ભાવ અને પાક વેચો.'
  },
  'auth.buyer': { en: 'Buyer', hi: 'खरीदार', gu: 'ખરીદદાર' },
  'auth.buyerDesc': {
    en: 'Browse farmer listings and contact them directly.',
    hi: 'किसानों की सूची देखें और सीधे संपर्क करें।',
    gu: 'ખેડૂતોની યાદી જુઓ અને સીધો સંપર્ક કરો.'
  },
  'auth.name': { en: 'Your name', hi: 'आपका नाम', gu: 'તમારું નામ' },
  'auth.phone': { en: 'Phone number', hi: 'फ़ोन नंबर', gu: 'ફોન નંબર' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', gu: 'પાસવર્ડ' },
  'auth.state': { en: 'State', hi: 'राज्य', gu: 'રાજ્ય' },
  'auth.district': { en: 'District', hi: 'ज़िला', gu: 'જિલ્લો' },
  'auth.haveAccount': { en: 'Already have an account?', hi: 'पहले से खाता है?', gu: 'પહેલેથી ખાતું છે?' },
  'auth.noAccount': { en: 'New to KhedutMitra?', hi: 'खेडूतमित्र पर नए हैं?', gu: 'ખેડૂતમિત્ર પર નવા છો?' },
  'auth.demoNote': {
    en: 'Demo: any phone number and password will log you in.',
    hi: 'डेमो: कोई भी नंबर और पासवर्ड चलेगा।',
    gu: 'ડેમો: કોઈ પણ નંબર અને પાસવર્ડ ચાલશે.'
  },
  'auth.selectStateFirst': { en: 'Select a state first', hi: 'पहले राज्य चुनें', gu: 'પહેલા રાજ્ય પસંદ કરો' },

  'profile.title': { en: 'Profile', hi: 'प्रोफ़ाइल', gu: 'પ્રોફાઇલ' },
  'profile.account': { en: 'Account', hi: 'खाता', gu: 'ખાતું' },
  'profile.language': { en: 'Language', hi: 'भाषा', gu: 'ભાષા' },
  'profile.viewAs': { en: 'View as', hi: 'इस रूप में देखें', gu: 'આ રૂપે જુઓ' },
  'profile.viewAsHelp': {
    en: 'Switch between the farmer and buyer experience without signing out.',
    hi: 'साइन आउट किए बिना किसान और खरीदार अनुभव बदलें।',
    gu: 'સાઇન આઉટ કર્યા વિના ખેડૂત અને ખરીદદાર અનુભવ બદલો.'
  },
  'profile.demoTitle': { en: 'Demo states', hi: 'डेमो स्थितियाँ', gu: 'ડેમો સ્થિતિઓ' },
  'profile.demoHelp': {
    en: 'Force a state to show how the app behaves on a weak connection.',
    hi: 'कमज़ोर कनेक्शन पर ऐप का व्यवहार दिखाने के लिए स्थिति चुनें।',
    gu: 'નબળા કનેક્શન પર ઍપ કેવી વર્તે છે તે બતાવવા સ્થિતિ પસંદ કરો.'
  },
  'profile.weatherState': { en: 'Weather', hi: 'मौसम', gu: 'હવામાન' },
  'profile.priceState': { en: 'Mandi prices', hi: 'मंडी भाव', gu: 'મંડી ભાવ' },
  'profile.stateNormal': { en: 'Normal', hi: 'सामान्य', gu: 'સામાન્ય' },
  'profile.stateLoading': { en: 'Loading', hi: 'लोड हो रहा', gu: 'લોડ થાય છે' },
  'profile.stateError': { en: 'Error', hi: 'त्रुटि', gu: 'ભૂલ' },
  'profile.stateFallback': { en: 'Saved data', hi: 'सहेजा डेटा', gu: 'સાચવેલ ડેટા' },
  'profile.stateEmpty': { en: 'No data', hi: 'डेटा नहीं', gu: 'ડેટા નથી' },

  'landing.heroBody': {
    en: 'Make better farming and selling decisions with live weather, market prices, and direct buyer connections.',
    hi: 'लाइव मौसम, मंडी भाव और सीधे खरीदारों से जुड़कर बेहतर निर्णय लें।',
    gu: 'લાઇવ હવામાન, મંડી ભાવ અને સીધા ખરીદદારો સાથે જોડાઈને વધુ સારા નિર્ણય લો.'
  },
  'landing.value1': { en: 'Weather-based farm advice', hi: 'मौसम आधारित खेती सलाह', gu: 'હવામાન આધારિત ખેતી સલાહ' },
  'landing.value1Body': {
    en: 'See the forecast for your district and what to do about it today.',
    hi: 'अपने ज़िले का पूर्वानुमान और आज क्या करना है, देखें।',
    gu: 'તમારા જિલ્લાની આગાહી અને આજે શું કરવું તે જુઓ.'
  },
  'landing.value2': { en: 'Live mandi prices', hi: 'लाइव मंडी भाव', gu: 'લાઇવ મંડી ભાવ' },
  'landing.value2Body': {
    en: 'Compare nearby markets and find where your crop earns the most.',
    hi: 'पास की मंडियों की तुलना करें और सबसे अच्छा भाव पाएँ।',
    gu: 'નજીકની મંડીઓની સરખામણી કરો અને શ્રેષ્ઠ ભાવ મેળવો.'
  },
  'landing.value3': { en: 'Direct farmer-to-buyer listings', hi: 'किसान से खरीदार तक सीधी सूची', gu: 'ખેડૂતથી ખરીદદાર સુધી સીધી યાદી' },
  'landing.value3Body': {
    en: 'List your produce in three steps and let buyers call you.',
    hi: 'तीन चरणों में उपज सूचीबद्ध करें और खरीदारों की कॉल पाएँ।',
    gu: 'ત્રણ પગલાંમાં પાક યાદીબદ્ધ કરો અને ખરીદદારોના ફોન મેળવો.'
  },
  'landing.loopTitle': { en: 'How a day looks', hi: 'एक दिन ऐसा दिखता है', gu: 'એક દિવસ આવો દેખાય છે' },
  'landing.loop1': { en: 'Check the weather', hi: 'मौसम देखें', gu: 'હવામાન જુઓ' },
  'landing.loop2': { en: 'Read today’s advice', hi: 'आज की सलाह पढ़ें', gu: 'આજની સલાહ વાંચો' },
  'landing.loop3': { en: 'Compare mandi prices', hi: 'मंडी भाव तुलना करें', gu: 'મંડી ભાવ સરખાવો' },
  'landing.loop4': { en: 'Decide where to sell', hi: 'कहाँ बेचना है तय करें', gu: 'ક્યાં વેચવું તે નક્કી કરો' },

  'common.loading': { en: 'Loading', hi: 'लोड हो रहा है', gu: 'લોડ થાય છે' },
  'common.today': { en: 'Today', hi: 'आज', gu: 'આજે' },
  'common.kg': { en: 'kg', hi: 'किलो', gu: 'કિલો' },
  'common.perKg': { en: 'per kg', hi: 'प्रति किलो', gu: 'પ્રતિ કિલો' },
  'common.offline': { en: 'You are offline', hi: 'आप ऑफ़लाइन हैं', gu: 'તમે ઑફલાઇન છો' },
  'common.required': { en: 'Required', hi: 'ज़रूरी', gu: 'જરૂરી' }
};