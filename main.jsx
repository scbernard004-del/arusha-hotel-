import React, {useEffect, useMemo, useState} from 'react';
import { createClient } from '@supabase/supabase-js';
import { createRoot } from 'react-dom/client';
import { Menu, X, Star, MapPin, Phone, Mail, CalendarDays, BedDouble, Wifi, Car, ShieldCheck, ChevronRight, Moon, Sun, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const unsplash = (id, w=1600, h=1050) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`;

const img = {
  homeHero: unsplash('photo-1566073771259-6a8506099945', 1900, 1100),
  lobby: unsplash('photo-1551882547-ff40c63fe5fa', 1500, 1000),
  roomsHero: unsplash('photo-1582719478250-c89cae4dc85b', 1900, 1100),
  room1: unsplash('photo-1578683010236-d716f9a3f461', 1200, 850),
  room2: unsplash('photo-1590490360182-c33d57733427', 1200, 850),
  room3: unsplash('photo-1560448204-e02f11c3d0e2', 1200, 850),
  room4: unsplash('photo-1598928506311-c55ded91a20c', 1200, 850),
  diningHero: unsplash('photo-1414235077428-338989a2e8c0', 1900, 1100),
  dining1: unsplash('photo-1551218808-94e220e084d2', 1200, 850),
  dining2: unsplash('photo-1504674900247-0877df9cc836', 1200, 850),
  expHero: unsplash('photo-1516426122078-c23e76319801', 1900, 1100),
  safari: unsplash('photo-1547471080-7cc2caa01a7e', 1200, 850),
  mountain: unsplash('photo-1464822759023-fed622ff2c3b', 1200, 850),
  city: unsplash('photo-1500530855697-b586d89ba3ee', 1200, 850),
  galleryHero: unsplash('photo-1520250497591-112f2f40a3f4', 1900, 1100),
  pool: unsplash('photo-1542314831-068cd1dbfeeb', 1200, 850),
  spa: unsplash('photo-1540555700478-4be289fbecef', 1200, 850),
  bar: unsplash('photo-1572116469696-31de0f17cc34', 1200, 850),
  aboutHero: unsplash('photo-1476514525535-07fb3b4ae5f1', 1900, 1100),
  contactHero: unsplash('photo-1500534314209-a25ddb2bd429', 1900, 1100),
  bookingHero: unsplash('photo-1564501049412-61c2a3083791', 1900, 1100)
};



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const supabaseReady = Boolean(supabase);

const roomToRow = (room) => ({
  id: room.id,
  available: Boolean(room.available),
  quantity: Number(room.quantity) || 0,
  offer: room.offer || {},
  name: room.name || {},
  price: room.price || '',
  image: room.image || '',
  size: room.size || '',
  bed: room.bed || {},
  text: room.text || {},
  tags: room.tags || {},
  updated_at: new Date().toISOString()
});

const normalizeRoom = (row) => ({
  id: row.id,
  available: row.available !== false,
  quantity: Number(row.quantity) || 0,
  offer: row.offer || {en:'', sw:''},
  name: row.name || {en: row.id, sw: row.id},
  price: row.price || '$0',
  image: row.image || img.room1,
  size: row.size || '',
  bed: row.bed || {en:'', sw:''},
  text: row.text || {en:'', sw:''},
  tags: row.tags || {en:[], sw:[]}
});

const copy = {
  en:{
    brand:'Arusha Grand Safari Hotel', logo:'AG', tagline:'Luxury • Nature • Hospitality', location:'Arusha • Tanzania', bookNow:'Book Now', reserve:'Reserve Your Stay', exploreRooms:'Explore Rooms', checkIn:'Check-in', checkOut:'Check-out', guests:'Guests', checkAvail:'Check Availability', viewAll:'View all', roomsSuites:'Rooms & Suites', featuredRooms:'Choose your perfect room', premium:'Premium comfort', homeTitle:'Luxury Stay in the Heart of Arusha', homeSub:'A polished safari-gateway hotel for calm nights, business comfort, and unforgettable Northern Tanzania adventures.', homeH2:'Designed for travelers who want Arusha to feel effortless.', homeP:'From airport transfers to safari lunch boxes, every detail is tuned for guests heading to Serengeti, Ngorongoro, Tarangire, Mount Meru, or Kilimanjaro routes.', wifi:'High-speed Wi-Fi', transfer:'Airport transfer', security:'24/7 security', roomsTitle:'Rooms with quiet luxury', roomsSub:'Soft beds, generous layouts, and service that understands safari schedules.', diningTitle:'Dining with local soul', diningSub:'Fresh breakfasts, elegant dinners, Tanzanian flavors, and safari-ready meals.', dining1:'Meru Terrace Restaurant', dining1Text:'Continental, Swahili, vegetarian, and chef specials served in a warm open setting.', dining2:'Safari Lunch Boxes', dining2Text:'Prepared early for guests leaving for national parks, trekking, or airport runs.', expTitle:'Safari begins from here', expSub:'Let the hotel be your calm base for Tanzania’s northern circuit.', safariTitle:'National Park Safaris', safariText:'Tarangire, Lake Manyara, Ngorongoro, and Serengeti trip support.', climbTitle:'Mount Meru & Kilimanjaro', climbText:'Rest before and after climbs with luggage support and early meals.', cultureTitle:'Arusha City Culture', cultureText:'Markets, coffee tours, museums, local crafts, and private drivers.', galleryTitle:'Gallery', gallerySub:'A visual taste of comfort, cuisine, spaces, and safari energy.', aboutTitle:'Hospitality with Arusha warmth', aboutSub:'Built for international travelers, business visitors, families, and safari explorers.', why:'Why Meru Haven?', whyText:'We combine premium rooms, practical travel help, fresh dining, and local knowledge. The tone is calm, professional, and deeply connected to Arusha’s role as Tanzania’s adventure capital.', statsRooms:'38 Rooms', statsDesk:'24/7 Desk', statsRating:'4.8 Rating', review:'“Elegant, clean, peaceful, and perfectly located before safari.”', guest:'Guest Review', contactTitle:'Contact us', contactSub:'Call, message, or send an inquiry. Our team is ready.', getTouch:'Get in touch', map:'Google Map Placeholder\nArusha, Tanzania', bookingTitle:'Book your stay', bookingSub:'Send your booking request and our reservations team will confirm availability.', benefits:'Direct booking benefits', benefitsText:'Best available room guidance, airport pickup coordination, safari timing support, and flexible arrival notes.', b1:'No complicated checkout', b2:'WhatsApp-friendly confirmation', b3:'Fast response from reservations', cta:'Ready for a polished Arusha stay?', footer:'Luxury hotel in Arusha for safari, business, and leisure.', name:'Full name', phone:'Phone / WhatsApp', email:'Email address', roomType:'Room type', message:'Message / dates / special request', send:'Send Request', night:'/night', bookThis:'Book this room', learnMore:'Book / Ask more'
  },
  sw:{
    brand:'Hoteli ya Arusha Grand Safari', logo:'AG', tagline:'Kifahari • Asili • Ukarimu', location:'Arusha • Tanzania', bookNow:'Weka Nafasi', reserve:'Weka Nafasi Yako', exploreRooms:'Tazama Vyumba', checkIn:'Siku ya Kuingia', checkOut:'Siku ya Kutoka', guests:'Wageni', checkAvail:'Angalia Upatikanaji', viewAll:'Tazama vyote', roomsSuites:'Vyumba & Suti', featuredRooms:'Chagua chumba kinachokufaa', premium:'Faraja ya Kifahari', homeTitle:'Mapumziko ya Kifahari Katikati ya Arusha', homeSub:'Hoteli tulivu kwa wageni wa safari, biashara na mapumziko ya kipekee Tanzania Kaskazini.', homeH2:'Imeundwa kufanya ukaaji wako Arusha uwe rahisi na wa kifahari.', homeP:'Kuanzia usafiri wa uwanja wa ndege hadi chakula cha safari, kila huduma imepangwa kwa wageni wanaokwenda Serengeti, Ngorongoro, Tarangire, Mlima Meru au njia za Kilimanjaro.', wifi:'Intaneti ya kasi', transfer:'Usafiri wa uwanja wa ndege', security:'Ulinzi saa 24/7', roomsTitle:'Vyumba vyenye utulivu wa kifahari', roomsSub:'Vitanda laini, nafasi nzuri na huduma inayojali ratiba za safari.', diningTitle:'Chakula chenye ladha ya nyumbani', diningSub:'Kifungua kinywa safi, chakula cha jioni cha kifahari, ladha za Kitanzania na milo ya safari.', dining1:'Mgahawa wa Meru Terrace', dining1Text:'Vyakula vya kimataifa, Kiswahili, mboga mboga na mapishi maalumu ya mpishi mkuu kwenye mazingira ya kupendeza.', dining2:'Milo ya Safari', dining2Text:'Huandaliwa mapema kwa wageni wanaokwenda hifadhi za taifa, kupanda milima au safari za uwanja wa ndege.', expTitle:'Safari inaanzia hapa', expSub:'Ifanye hoteli iwe kituo chako tulivu cha safari za kaskazini mwa Tanzania.', safariTitle:'Safari za Hifadhi za Taifa', safariText:'Msaada wa safari za Tarangire, Lake Manyara, Ngorongoro na Serengeti.', climbTitle:'Mlima Meru & Kilimanjaro', climbText:'Pumzika kabla na baada ya kupanda mlima, pamoja na msaada wa mizigo na milo ya mapema.', cultureTitle:'Utamaduni wa Jiji la Arusha', cultureText:'Masoko, ziara za kahawa, makumbusho, kazi za mikono na madereva binafsi.', galleryTitle:'Matunzio', gallerySub:'Mwonekano wa faraja, vyakula, maeneo ya hoteli na nguvu ya safari.', aboutTitle:'Ukarimu wenye joto la Arusha', aboutSub:'Imejengwa kwa watalii wa kimataifa, wafanyabiashara, familia na wapenzi wa safari.', why:'Kwa nini Makazi ya Meru?', whyText:'Tunaunganisha vyumba vya kifahari, msaada wa safari, chakula safi na maarifa ya wenyeji. Huduma yetu ni tulivu, ya kitaalamu na imeunganishwa na nafasi ya Arusha kama mji mkuu wa safari za Tanzania.', statsRooms:'Vyumba 38', statsDesk:'Mapokezi 24/7', statsRating:'Ukadiriaji 4.8', review:'“Kifahari, safi, tulivu na eneo bora kabla ya safari.”', guest:'Maoni ya Mgeni', contactTitle:'Wasiliana nasi', contactSub:'Piga simu, tuma ujumbe au uliza maswali. Timu yetu ipo tayari.', getTouch:'Tupate kwa urahisi', map:'Sehemu ya Ramani ya Google\nArusha, Tanzania', bookingTitle:'Weka nafasi ya ukaaji', bookingSub:'Tuma ombi lako la booking na timu yetu itathibitisha upatikanaji.', benefits:'Faida za kuweka nafasi moja kwa moja', benefitsText:'Ushauri wa chumba bora kilichopo, uratibu wa usafiri wa uwanja wa ndege, msaada wa muda wa safari na maelezo ya kuwasili.', b1:'Hakuna mchakato mgumu', b2:'Uthibitisho kupitia WhatsApp', b3:'Majibu ya haraka kutoka mapokezi', cta:'Uko tayari kwa ukaaji bora Arusha?', footer:'Hoteli ya kifahari Arusha kwa safari, biashara na mapumziko.', name:'Jina kamili', phone:'Simu / WhatsApp', email:'Barua pepe', roomType:'Aina ya chumba', message:'Ujumbe / tarehe / ombi maalumu', send:'Tuma Ombi', night:'/usiku', bookThis:'Weka nafasi ya chumba', learnMore:'Weka nafasi / Uliza'
  }
};

const navItems = [
  {key:'home', en:'Home', sw:'Mwanzo'}, {key:'rooms', en:'Rooms', sw:'Vyumba'}, {key:'dining', en:'Dining', sw:'Chakula'}, {key:'experiences', en:'Experiences', sw:'Safari'}, {key:'gallery', en:'Gallery', sw:'Matunzio'}, {key:'about', en:'About', sw:'Kuhusu'}, {key:'contact', en:'Contact', sw:'Mawasiliano'}, {key:'availability', en:'Available Rooms', sw:'Vyumba Vilivyopo'}, {key:'booking', en:'Booking', sw:'Nafasi'}
];

const defaultRooms = [
  {id:'deluxe-meru', available:true, quantity:8, offer:{en:'Free breakfast today',sw:'Kifungua kinywa bure leo'}, name:{en:'Deluxe Meru Room',sw:'Chumba cha Deluxe Meru'}, price:'$145', image:img.room1, size:'32 sqm', bed:{en:'King / Twin',sw:'King / Twin'}, text:{en:'Quiet comfort for business or safari stopovers.',sw:'Faraja tulivu kwa biashara au mapumziko ya safari.'}, tags:{en:['Breakfast','Fast Wi-Fi','City view'],sw:['Kifungua kinywa','Wi-Fi ya kasi','Muonekano wa jiji']}},
  {id:'executive-garden', available:true, quantity:5, offer:{en:'10% off this week',sw:'Punguzo 10% wiki hii'}, name:{en:'Executive Garden Suite',sw:'Suti ya Executive Garden'}, price:'$230', image:img.room2, size:'48 sqm', bed:{en:'King bed',sw:'Kitanda cha King'}, text:{en:'Elegant living space with garden-facing calm.',sw:'Nafasi ya kifahari yenye utulivu wa bustani.'}, tags:{en:['Lounge','Work desk','Airport help'],sw:['Sebule','Meza ya kazi','Msaada wa airport']}},
  {id:'family-safari', available:true, quantity:3, offer:{en:'Family package available',sw:'Ofa ya familia ipo'}, name:{en:'Family Safari Room',sw:'Chumba cha Familia Safari'}, price:'$265', image:img.room3, size:'55 sqm', bed:{en:'2 Queen beds',sw:'Vitanda 2 vya Queen'}, text:{en:'Spacious, bright, and designed for family travel.',sw:'Kikubwa, chenye mwanga na kimefaa kwa familia.'}, tags:{en:['Family setup','Smart TV','Extra storage'],sw:['Mpangilio wa familia','Smart TV','Nafasi ya ziada']}},
  {id:'presidential-kili', available:true, quantity:1, offer:{en:'VIP airport pickup',sw:'Usafiri wa VIP uwanja wa ndege'}, name:{en:'Presidential Kilimanjaro Suite',sw:'Suti ya Rais Kilimanjaro'}, price:'$420', image:img.room4, size:'78 sqm', bed:{en:'Super King',sw:'Super King'}, text:{en:'Premium suite for honeymoons, VIP stays, and long escapes.',sw:'Suti ya hali ya juu kwa fungate, wageni maalumu na ukaaji mrefu.'}, tags:{en:['Private balcony','Mini bar','Concierge'],sw:['Balkoni binafsi','Mini bar','Huduma maalumu']}}
];

function getStoredRooms(){
  try{
    const saved = JSON.parse(localStorage.getItem('hotelRooms') || '[]');
    return defaultRooms.map(room => ({...room, ...(saved.find(x => x.id === room.id) || {})}));
  }catch(e){return defaultRooms;}
}
function saveStoredRooms(rooms){ localStorage.setItem('hotelRooms', JSON.stringify(rooms)); }

const tx = (lang,key)=>copy[lang][key] || key;
const hiddenPages = ['owner-login','worker-login','owner-panel','worker-panel'];
const initialPage = () => {
  const hash = window.location.hash.replace('#','');
  return hiddenPages.includes(hash) ? hash : 'home';
};
const ownerEmail = import.meta.env.VITE_OWNER_EMAIL || 'owner@arushagrandsafarihotel.com';
const workerEmail = import.meta.env.VITE_WORKER_EMAIL || 'worker@arushagrandsafarihotel.com';
const defaultStaff = {
  owner:{username:'owner', password:'1234567890', email:ownerEmail},
  worker:{username:'worker', password:'123456789', email:workerEmail}
};

const defaultPermissions = {
  view_reservations:true,
  receive_orders:true,
  create_bookings:true,
  edit_room_status:true,
  confirm_payments:false
};
const ownerPermissions = {
  view_reservations:true,
  receive_orders:true,
  create_bookings:true,
  edit_room_status:true,
  confirm_payments:true,
  manage_content:true,
  manage_workers:true
};
const defaultStaffProfiles = [
  {id:'owner-profile', username:'owner', role:'owner', full_name:'Hotel Owner', email:ownerEmail, phone:'0746584214', photo_url:img.lobby, active:true, permissions:ownerPermissions},
  {id:'worker-profile', username:'worker', role:'worker', full_name:'Front Desk Worker', email:workerEmail, phone:'0746584214', photo_url:img.room1, active:true, permissions:defaultPermissions}
];
const normalizeStaff = (row)=>({
  id: row.id,
  auth_user_id: row.auth_user_id || '',
  username: row.username || '',
  role: row.role || 'worker',
  full_name: row.full_name || row.username || 'Worker',
  email: row.email || '',
  phone: row.phone || '',
  photo_url: row.photo_url || img.room1,
  active: row.active !== false,
  permissions: row.role === 'owner' ? {...ownerPermissions, ...(row.permissions || {})} : {...defaultPermissions, ...(row.permissions || {})}
});
const staffToRow = (profile)=>({
  id: profile.id && !String(profile.id).includes('profile') ? profile.id : undefined,
  auth_user_id: profile.auth_user_id || null,
  username: profile.username,
  role: profile.role || 'worker',
  full_name: profile.full_name || '',
  email: profile.email || '',
  phone: profile.phone || '',
  photo_url: profile.photo_url || '',
  active: profile.active !== false,
  permissions: profile.permissions || defaultPermissions,
  updated_at: new Date().toISOString()
});
function getStoredStaffProfiles(){try{const saved=JSON.parse(localStorage.getItem('hotelStaffProfiles')||'[]'); return saved.length?saved.map(normalizeStaff):defaultStaffProfiles;}catch(e){return defaultStaffProfiles;}}
function saveStoredStaffProfiles(items){localStorage.setItem('hotelStaffProfiles',JSON.stringify(items));}

const defaultSettings = {
  hotelName:{en:'Arusha Grand Safari Hotel', sw:'Hoteli ya Arusha Grand Safari'},
  tagline:{en:'Luxury • Nature • Hospitality', sw:'Kifahari • Asili • Ukarimu'},
  address:{en:'Arusha City, Tanzania', sw:'Jiji la Arusha, Tanzania'},
  phone:'+255 746 584 214',
  whatsapp:'255746584214',
  email:'reservations@arushagrandsafarihotel.co.tz',
  footer:{en:'Luxury hotel in Arusha for safari, business, and leisure.', sw:'Hoteli ya kifahari Arusha kwa safari, biashara na mapumziko.'},
  mapText:{en:'Google Map Placeholder\nArusha, Tanzania', sw:'Sehemu ya Ramani ya Google\nArusha, Tanzania'}
};
const defaultGallery = [img.pool,img.spa,img.bar,img.lobby,img.room4,img.dining1,img.safari,img.mountain].map((url,i)=>({id:`gallery-${i+1}`,url,title:{en:`Gallery ${i+1}`,sw:`Picha ${i+1}`}}));
function getStoredSettings(){try{return {...defaultSettings,...JSON.parse(localStorage.getItem('hotelSettings')||'{}')}}catch(e){return defaultSettings;}}
function saveStoredSettings(settings){localStorage.setItem('hotelSettings',JSON.stringify(settings));}
function getStoredGallery(){try{const saved=JSON.parse(localStorage.getItem('hotelGallery')||'[]');return saved.length?saved:defaultGallery;}catch(e){return defaultGallery;}}
function saveStoredGallery(gallery){localStorage.setItem('hotelGallery',JSON.stringify(gallery));}
const settingsToRow = (settings)=>({id:'main', data:settings, updated_at:new Date().toISOString()});
const normalizeSettings = (row)=>({...defaultSettings,...(row?.data||{})});
const galleryToRows = (items)=>items.map(item=>({id:item.id, url:item.url, title:item.title||{}, created_at:item.created_at||new Date().toISOString()}));
const normalizeGallery = (row)=>({id:row.id, url:row.url, title:row.title||{en:'Gallery image',sw:'Picha'}, created_at:row.created_at});

function App(){
  const [page,setPage]=useState(initialPage), [open,setOpen]=useState(false), [dark,setDark]=useState(false), [lang,setLang]=useState('en');
  const [rooms,setRooms]=useState(getStoredRooms);
  const [settings,setSettings]=useState(getStoredSettings);
  const [galleryImages,setGalleryImages]=useState(getStoredGallery);
  const [bookings,setBookings]=useState([]);
  const [staffProfiles,setStaffProfiles]=useState(getStoredStaffProfiles);
  const [staffProfile,setStaffProfile]=useState(null);
  const [session,setSession]=useState(null);
  const [staffRole,setStaffRole]=useState(localStorage.getItem('staffRole') || '');
  const [syncNote,setSyncNote]=useState('');

  const loadBookings = async () => {
    if(!supabaseReady) return;
    const {data,error}=await supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(60);
    if(!error) setBookings(data || []);
  };

  const loadStaffProfiles = async (roleHint='') => {
    if(!supabaseReady){ setStaffProfiles(getStoredStaffProfiles()); return; }
    const canReadAll = roleHint === 'owner' || staffRole === 'owner';
    const query = canReadAll ? supabase.from('staff_profiles').select('*').order('created_at',{ascending:true}) : supabase.from('staff_profiles').select('*').limit(20);
    const {data,error}=await query;
    if(!error && data){
      const next=data.map(normalizeStaff);
      setStaffProfiles(next); saveStoredStaffProfiles(next);
      const mine = next.find(x=>x.role===roleHint) || next.find(x=>x.email?.toLowerCase()===session?.user?.email?.toLowerCase());
      if(mine) setStaffProfile(mine);
    }
  };

  useEffect(()=>{
    const onHash=()=>{const h=window.location.hash.replace('#',''); if(hiddenPages.includes(h)) setPage(h);};
    const onKey=(e)=>{
      if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='o'){ e.preventDefault(); setPage('owner-login'); window.location.hash='owner-login'; }
      if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='w'){ e.preventDefault(); setPage('worker-login'); window.location.hash='worker-login'; }
    };
    window.addEventListener('hashchange',onHash);
    window.addEventListener('keydown',onKey);
    return()=>{window.removeEventListener('hashchange',onHash); window.removeEventListener('keydown',onKey);};
  },[]);

  useEffect(()=>{
    let live=true;
    const boot=async()=>{
      if(!supabaseReady){ setSyncNote('Local demo mode. Add Supabase keys to .env for live database.'); return; }
      const {data:{session}}=await supabase.auth.getSession();
      if(live) setSession(session);
      const {data,error}=await supabase.from('rooms').select('*').order('created_at',{ascending:true});
      if(error){ setSyncNote('Supabase connected, but tables are not ready. Run SUPABASE_SETUP.sql.'); return; }
      if(data && data.length){ const next=data.map(normalizeRoom); setRooms(next); saveStoredRooms(next); }
      else { await supabase.from('rooms').upsert(defaultRooms.map(roomToRow)); setRooms(defaultRooms); }
      const {data:settingRows}=await supabase.from('hotel_settings').select('*').eq('id','main').maybeSingle();
      if(settingRows){ const nextSettings=normalizeSettings(settingRows); setSettings(nextSettings); saveStoredSettings(nextSettings); }
      else { await supabase.from('hotel_settings').upsert([settingsToRow(defaultSettings)]); }
      const {data:galleryRows}=await supabase.from('gallery_images').select('*').order('created_at',{ascending:true});
      if(galleryRows && galleryRows.length){ const nextGallery=galleryRows.map(normalizeGallery); setGalleryImages(nextGallery); saveStoredGallery(nextGallery); }
      else { await supabase.from('gallery_images').upsert(galleryToRows(defaultGallery)); }
      await loadBookings();
      await loadStaffProfiles();
      setSyncNote('Connected to Supabase live database.');
    };
    boot();
    let sub;
    if(supabaseReady){ sub=supabase.auth.onAuthStateChange((_event,session)=>setSession(session)); }
    return()=>{live=false; sub?.data?.subscription?.unsubscribe?.();};
  },[]);

  const updateRooms=async(next)=>{
    setRooms(next); saveStoredRooms(next);
    if(supabaseReady){
      const {error}=await supabase.from('rooms').upsert(next.map(roomToRow));
      setSyncNote(error ? 'Could not save to Supabase. Check table policies.' : 'Saved to Supabase.');
    }
  };

  const updateSettings=async(next)=>{
    setSettings(next); saveStoredSettings(next);
    if(supabaseReady){
      const {error}=await supabase.from('hotel_settings').upsert([settingsToRow(next)]);
      setSyncNote(error ? 'Could not save hotel information. Run the updated SQL setup.' : 'Hotel information saved.');
    }
  };

  const updateGallery=async(next)=>{
    setGalleryImages(next); saveStoredGallery(next);
    if(supabaseReady){
      await supabase.from('gallery_images').delete().neq('id','__never__');
      const {error}=await supabase.from('gallery_images').upsert(galleryToRows(next));
      setSyncNote(error ? 'Could not save gallery pictures. Run the updated SQL setup.' : 'Gallery pictures saved.');
    }
  };

  const updateStaffProfiles=async(next)=>{
    const normalized=next.map(normalizeStaff);
    setStaffProfiles(normalized); saveStoredStaffProfiles(normalized);
    if(supabaseReady){
      const rows=normalized.map(staffToRow);
      const {error}=await supabase.from('staff_profiles').upsert(rows,{onConflict:'username'});
      setSyncNote(error ? 'Could not save staff details. Run updated SUPABASE_SETUP.sql and login as owner.' : 'Worker details and permissions saved.');
      await loadStaffProfiles('owner');
    }
  };

  const createBooking=async(payload)=>{
    if(!supabaseReady){
      setBookings([{id:crypto.randomUUID?.() || Date.now().toString(), ...payload, status:'pending', payment_status:'unpaid', created_at:new Date().toISOString()}, ...bookings]);
      setSyncNote('Booking saved locally. Add Supabase keys for live owner/worker panels.');
      return {ok:true, local:true};
    }
    const {error}=await supabase.from('bookings').insert([{...payload, status:'pending', payment_status:'unpaid'}]);
    if(error){ setSyncNote('Booking was not saved. Check Supabase booking policies.'); return {ok:false,error}; }
    await loadBookings();
    setSyncNote('Booking saved as pending. Owner can confirm payment in the panel.');
    return {ok:true};
  };

  const loginStaff=async(role,username,password)=>{
    const clean=username.trim().toLowerCase();
    const expected=defaultStaff[role];
    if(!supabaseReady){
      if(!expected || clean !== expected.username || password !== expected.password){ return {error:{message:'Wrong username or password.'}}; }
      const profile=(getStoredStaffProfiles().find(x=>x.role===role) || defaultStaffProfiles.find(x=>x.role===role));
      setStaffProfile(profile); setStaffRole(role); localStorage.setItem('staffRole',role); setPage(`${role}-panel`); window.location.hash=`${role}-panel`;
      setSyncNote('Demo login active. Connect Supabase for live database and password reset emails.');
      return {data:{role}, error:null};
    }

    let email = clean.includes('@') ? clean : '';
    if(!email && expected && clean === expected.username) email = expected.email;
    if(!email){
      const {data:lookup,error:lookupError}=await supabase.rpc('get_staff_login_email',{p_username:clean});
      if(lookupError || !lookup || !lookup.length) return {error:{message:'Worker not found or inactive. Ask owner to add this worker in the staff manager.'}};
      const match = lookup.find(x=>x.role===role) || lookup[0];
      email = match.email;
    }

    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error) return {data,error};
    const {data:profileRows}=await supabase.from('staff_profiles').select('*').limit(50);
    const profiles=(profileRows || []).map(normalizeStaff);
    const profile=profiles.find(x=>x.email?.toLowerCase()===email.toLowerCase()) || profiles.find(x=>x.role===role);
    if(!profile || profile.active===false){ await supabase.auth.signOut(); return {error:{message:'This staff account is inactive or not linked to a staff profile.'}}; }
    setSession(data.session); setStaffProfile(profile); setStaffRole(profile.role); localStorage.setItem('staffRole',profile.role); setPage(`${profile.role}-panel`); window.location.hash=`${profile.role}-panel`;
    await loadBookings(); await loadStaffProfiles(profile.role);
    return {data,error:null};
  };


  const resetPassword=async(role,contact)=>{
    if(!contact) return {error:{message:'Enter your Gmail/email address or phone number.'}};
    if(!contact.includes('@')) return {error:{message:'Phone reset needs SMS provider/M-Pesa SMS gateway. Use Gmail/email reset for now.'}};
    if(!supabaseReady) return {error:{message:'Connect Supabase first, then email reset links will work.'}};
    const redirectTo = `${window.location.origin}/#${role}-login`;
    const {error}=await supabase.auth.resetPasswordForEmail(contact,{redirectTo});
    return {error};
  };

  const logoutStaff=async()=>{ if(supabaseReady) await supabase.auth.signOut(); setSession(null); setStaffProfile(null); setStaffRole(''); localStorage.removeItem('staffRole'); setPage('home'); window.location.hash=''; };

  const updateBookingStatus=async(booking,patch)=>{
    if(supabaseReady){ await supabase.from('bookings').update(patch).eq('id',booking.id); await loadBookings(); }
    else setBookings(bookings.map(b=>b.id===booking.id?{...b,...patch}:b));
  };

  const markReceived=async(booking)=>updateBookingStatus(booking,{status:'received'});
  const reserveBooking=async(booking)=>updateBookingStatus(booking,{status:'reserved'});

  const toggleRoomStatus=async(room)=>{
    await updateRooms(rooms.map(r=>r.id===room.id?{...r,available:!r.available}:r));
  };

  const confirmBooking=async(booking)=>{
    const room=rooms.find(r=>r.id===booking.room_id);
    if(room && booking.payment_status !== 'paid'){
      const left=Math.max(0,(Number(room.quantity)||0)-1);
      await updateRooms(rooms.map(r=>r.id===booking.room_id?{...r,quantity:left,available:left>0}:r));
    }
    if(supabaseReady){ await supabase.from('bookings').update({status:'confirmed',payment_status:'paid'}).eq('id',booking.id); await loadBookings(); }
    else setBookings(bookings.map(b=>b.id===booking.id?{...b,status:'confirmed',payment_status:'paid'}:b));
  };

  useEffect(()=>{ document.documentElement.lang = lang === 'sw' ? 'sw' : 'en'; document.title = lang === 'sw' ? 'Hoteli ya Arusha Grand Safari' : 'Arusha Grand Safari Hotel'; },[lang]);
  const go=p=>{setPage(p);setOpen(false); if(hiddenPages.includes(p)) window.location.hash=p; else if(window.location.hash) history.pushState('',document.title,window.location.pathname); window.scrollTo({top:0,behavior:'smooth'});};
  const Page=useMemo(()=>({home:Home,rooms:Rooms,dining:Dining,experiences:Experiences,gallery:Gallery,about:About,contact:Contact,booking:Booking,availability:Availability,'owner-login':StaffLogin,'worker-login':StaffLogin,'owner-panel':OwnerPanel,'worker-panel':WorkerPanel}[page] || Home),[page]);
  const loginRole = page.startsWith('worker') ? 'worker' : 'owner';
  return <div className={dark?'app dark':'app'}>
    <Header page={page} go={go} open={open} setOpen={setOpen} dark={dark} setDark={setDark} lang={lang} setLang={setLang} settings={settings}/>
    {syncNote && <div className="syncBar">{syncNote}</div>}
    <AnimatePresence mode="wait"><motion.main key={page+lang} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.28}}><Page go={go} lang={lang} rooms={rooms} setRooms={updateRooms} settings={settings} setSettings={updateSettings} galleryImages={galleryImages} setGalleryImages={updateGallery} staffProfiles={staffProfiles} setStaffProfiles={updateStaffProfiles} staffProfile={staffProfile} createBooking={createBooking} supabaseReady={supabaseReady} session={session} bookings={bookings} staffRole={staffRole} loginRole={loginRole} loginStaff={loginStaff} resetPassword={resetPassword} logoutStaff={logoutStaff} confirmBooking={confirmBooking} markReceived={markReceived} reserveBooking={reserveBooking} toggleRoomStatus={toggleRoomStatus} refreshBookings={loadBookings}/></motion.main></AnimatePresence>
    <Footer go={go} lang={lang} settings={settings}/><a className="whatsapp" href={`https://wa.me/${settings.whatsapp || '255746584214'}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24}/></a>
  </div>;
}

function Header({page,go,open,setOpen,dark,setDark,lang,setLang,settings=defaultSettings}){return <header className="header"><a className="brand" onClick={()=>go('home')} aria-label="Arusha Grand Safari Hotel home"><img className="logoImg" src="/logo.svg" alt="Arusha Grand Safari Hotel logo"/><span><b>{settings.hotelName?.[lang] || tx(lang,'brand')}</b><small>{settings.tagline?.[lang] || tx(lang,'tagline')}</small></span></a><nav className="desktop">{navItems.map(n=><button className={page===n.key?'active':''} onClick={()=>go(n.key)} key={n.key}>{n[lang]}</button>)}</nav><div className="actions"><button onClick={()=>setLang(lang==='en'?'sw':'en')} className="pill">{lang==='en'?'SW':'EN'}</button><button onClick={()=>setDark(!dark)} className="icon" aria-label="Theme">{dark?<Sun/>:<Moon/>}</button><button onClick={()=>go('booking')} className="book">{tx(lang,'bookNow')}</button><button className="mobileBtn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>{open&&<div className="mobileMenu">{navItems.map(n=><button onClick={()=>go(n.key)} key={n.key}>{n[lang]}</button>)}</div>}</header>}
function Hero({title,sub,image,lang,children}){return <section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(0,0,0,.68),rgba(0,0,0,.18)),url(${image})`}}><div className="heroText"><span className="eyebrow">{tx(lang,'location')}</span><h1>{title}</h1><p>{sub}</p>{children}</div></section>}
function Home({go,lang,rooms}){return <><Hero lang={lang} image={img.homeHero} title={tx(lang,'homeTitle')} sub={tx(lang,'homeSub')}><div className="heroBtns"><button onClick={()=>go('booking')}>{tx(lang,'reserve')}</button><button className="ghost" onClick={()=>go('rooms')}>{tx(lang,'exploreRooms')}</button></div></Hero><BookingStrip lang={lang} go={go}/><section className="section split"><div><span className="eyebrow">{tx(lang,'premium')}</span><h2>{tx(lang,'homeH2')}</h2><p>{tx(lang,'homeP')}</p><div className="features"><Feature icon={<Wifi/>} title={tx(lang,'wifi')}/><Feature icon={<Car/>} title={tx(lang,'transfer')}/><Feature icon={<ShieldCheck/>} title={tx(lang,'security')}/></div></div><img loading="lazy" decoding="async" src={img.lobby} alt="Hotel lobby"/></section><RoomsPreview go={go} lang={lang} rooms={rooms}/><CTA go={go} lang={lang}/></>}
function BookingStrip({lang,go}){return <section className="bookingStrip"><label>{tx(lang,'checkIn')}<input type="date"/></label><label>{tx(lang,'checkOut')}<input type="date"/></label><label>{tx(lang,'guests')}<input type="number" min="1" placeholder="2"/></label><button onClick={()=>go('booking')}>{tx(lang,'checkAvail')}</button></section>}
function Feature({icon,title}){return <div className="feature">{icon}<b>{title}</b></div>}
function RoomsPreview({go,lang,rooms}){return <section className="section"><div className="sectionHead"><span className="eyebrow">{tx(lang,'roomsSuites')}</span><h2>{tx(lang,'featuredRooms')}</h2><button onClick={()=>go('rooms')}>{tx(lang,'viewAll')} <ChevronRight size={16}/></button></div><div className="cards">{rooms.slice(0,3).map(r=><RoomCard r={r} go={go} lang={lang} key={r.name.en}/>)}</div></section>}
function RoomCard({r,lang,go}){return <article className="card clickable" onClick={()=>go&&go('booking')} tabIndex="0" onKeyDown={(e)=>{if((e.key==='Enter'||e.key===' ')&&go)go('booking')}}><img loading="lazy" decoding="async" src={r.image} alt={r.name[lang]}/><div className="cardBody"><div className="roomTop"><h3>{r.name[lang]}</h3><div className="price">{r.price}<small>{tx(lang,'night')}</small></div></div><p>{r.text[lang]}</p><div className="meta"><span><BedDouble size={15}/>{r.bed[lang]}</span><span>{r.size}</span></div><div className="tagRow">{r.tags[lang].map(x=><em key={x}>{x}</em>)}</div><button className="cardBtn" onClick={(e)=>{e.stopPropagation();go&&go('booking')}}>{tx(lang,'bookThis')}</button></div></article>}
function Rooms({go,lang,rooms}){return <><Hero lang={lang} image={img.roomsHero} title={tx(lang,'roomsTitle')} sub={tx(lang,'roomsSub')}/><section className="section"><div className="cards four">{rooms.map(r=><RoomCard r={r} go={go} lang={lang} key={r.name.en}/>)}</div></section><CTA go={go} lang={lang}/></>}
function Dining({go,lang}){return <><Hero lang={lang} image={img.diningHero} title={tx(lang,'diningTitle')} sub={tx(lang,'diningSub')}/><section className="section grid2"><InfoCard img={img.dining1} title={tx(lang,'dining1')} text={tx(lang,'dining1Text')} go={go} lang={lang}/><InfoCard img={img.dining2} title={tx(lang,'dining2')} text={tx(lang,'dining2Text')} go={go} lang={lang}/></section></>}
function Experiences({go,lang}){return <><Hero lang={lang} image={img.expHero} title={tx(lang,'expTitle')} sub={tx(lang,'expSub')}/><section className="section grid3"><InfoCard img={img.safari} title={tx(lang,'safariTitle')} text={tx(lang,'safariText')} go={go} lang={lang}/><InfoCard img={img.mountain} title={tx(lang,'climbTitle')} text={tx(lang,'climbText')} go={go} lang={lang}/><InfoCard img={img.city} title={tx(lang,'cultureTitle')} text={tx(lang,'cultureText')} go={go} lang={lang}/></section></>}
function Gallery({lang,galleryImages=defaultGallery}){return <><Hero lang={lang} image={img.galleryHero} title={tx(lang,'galleryTitle')} sub={tx(lang,'gallerySub')}/><section className="gallery">{galleryImages.map((p,i)=><img loading="lazy" decoding="async" src={p.url} key={p.id||i} alt={p.title?.[lang] || `${tx(lang,'galleryTitle')} ${i+1}`}/>)}</section></>}
function About({lang}){return <><Hero lang={lang} image={img.aboutHero} title={tx(lang,'aboutTitle')} sub={tx(lang,'aboutSub')}/><section className="section split"><div><h2>{tx(lang,'why')}</h2><p>{tx(lang,'whyText')}</p><div className="stats"><b>{tx(lang,'statsRooms')}</b><b>{tx(lang,'statsDesk')}</b><b>{tx(lang,'statsRating')}</b></div></div><div className="review"><Star/><p>{tx(lang,'review')}</p><strong>{tx(lang,'guest')}</strong></div></section></>}
function Contact({lang,rooms,setRooms,createBooking,settings=defaultSettings}){return <><Hero lang={lang} image={img.contactHero} title={tx(lang,'contactTitle')} sub={tx(lang,'contactSub')}/><section className="section contact"><div><h2>{tx(lang,'getTouch')}</h2><p><MapPin/> {settings.address?.[lang] || 'Arusha City, Tanzania'}</p><p><Phone/> {settings.phone}</p><p><Mail/> {settings.email}</p><div className="map">{settings.mapText?.[lang] || tx(lang,'map')}</div></div><Form lang={lang} rooms={rooms} setRooms={setRooms} createBooking={createBooking} settings={settings}/></section></>}
function Booking({lang,rooms,setRooms,createBooking,settings=defaultSettings}){return <><Hero lang={lang} image={img.bookingHero} title={tx(lang,'bookingTitle')} sub={tx(lang,'bookingSub')}/><section className="section contact"><Form lang={lang} rooms={rooms} setRooms={setRooms} createBooking={createBooking} settings={settings}/><div className="bookingNote"><CalendarDays/><h2>{tx(lang,'benefits')}</h2><p>{tx(lang,'benefitsText')}</p><ul><li>{tx(lang,'b1')}</li><li>{tx(lang,'b2')}</li><li>{tx(lang,'b3')}</li></ul></div></section></>}
function Form({lang,rooms=defaultRooms,setRooms,createBooking,settings=defaultSettings}){const [selected,setSelected]=useState(''); const [notice,setNotice]=useState(''); const bookAndPay=async(e)=>{e.preventDefault(); const form=e.currentTarget; const room=rooms.find(r=>r.id===selected); const payload={customer_name:form.customer_name.value, phone:form.phone.value, email:form.email.value, room_id:selected || null, room_name:room?.name?.en || 'Any room', check_in:form.check_in.value || null, check_out:form.check_out.value || null, guests:Number(form.guests.value)||1, message:form.message.value}; if(createBooking) await createBooking(payload); else if(room && setRooms){const left=Math.max(0,(Number(room.quantity)||0)-1); await setRooms(rooms.map(r=>r.id===selected?{...r,quantity:left,available:left>0}:r));} setNotice(lang==='sw'?'Ombi limehifadhiwa. Mmiliki atathibitisha malipo kwenye paneli.':'Request saved. The owner will confirm payment in the panel.'); const msg=encodeURIComponent(`Booking request: ${payload.room_name}\nName: ${payload.customer_name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nCheck in: ${payload.check_in}\nCheck out: ${payload.check_out}\nGuests: ${payload.guests}\nMessage: ${payload.message}`); window.open(`https://wa.me/${settings.whatsapp || '255746584214'}?text=${msg}`,'_blank');}; return <form className="form" onSubmit={bookAndPay}><input name="customer_name" required placeholder={tx(lang,'name')}/><input name="phone" required placeholder={tx(lang,'phone')}/><input name="email" type="email" placeholder={tx(lang,'email')}/><div className="formRow"><input name="check_in" type="date"/><input name="check_out" type="date"/></div><input name="guests" type="number" min="1" defaultValue="2"/><select value={selected} onChange={e=>setSelected(e.target.value)} required><option value="">{tx(lang,'roomType')}</option>{rooms.map(r=><option disabled={!r.available || Number(r.quantity)<1} value={r.id} key={r.id}>{r.name[lang]} - {r.available && Number(r.quantity)>0 ? `${r.quantity} ${lang==='sw'?'vipo':'left'}` : (lang==='sw'?'Hakipo':'Unavailable')}</option>)}</select><textarea name="message" placeholder={tx(lang,'message')}></textarea>{notice&&<p className="formNotice">{notice}</p>}<button type="submit">{lang==='sw'?'Tuma Booking':'Send Booking Request'}</button></form>}

function Availability({go,lang,rooms}){return <><Hero lang={lang} image={img.roomsHero} title={lang==='sw'?'Vyumba Vilivyopo Leo':'Available Rooms Today'} sub={lang==='sw'?'Mteja anaweza kuona chumba kipo au hakipo kabla ya kuweka nafasi.':'Guests can quickly see which rooms are available before booking.'}/><section className="section"><div className="availabilityGrid">{rooms.map(r=><article className="availabilityCard" key={r.id}><img src={r.image} alt={r.name[lang]}/><div><span className={r.available&&Number(r.quantity)>0?'status available':'status unavailable'}>{r.available&&Number(r.quantity)>0?(lang==='sw'?'KIPO':'AVAILABLE'):(lang==='sw'?'HAKIPO':'UNAVAILABLE')}</span><h3>{r.name[lang]}</h3><p>{r.text[lang]}</p><b>{r.price}{tx(lang,'night')}</b><small>{lang==='sw'?'Vyumba vilivyobaki':'Rooms left'}: {Math.max(0,Number(r.quantity)||0)}</small><em>{r.offer?.[lang]}</em><button disabled={!r.available||Number(r.quantity)<1} onClick={()=>go('booking')}>{r.available&&Number(r.quantity)>0?tx(lang,'bookThis'):(lang==='sw'?'Hakipatikani':'Unavailable')}</button></div></article>)}</div></section></>}
function StaffLogin({lang,loginRole,loginStaff,resetPassword,go}){
  const [username,setUsername]=useState(loginRole==='owner'?'owner':'worker');
  const [password,setPassword]=useState(loginRole==='owner'?'1234567890':'123456789');
  const [contact,setContact]=useState('');
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const title = loginRole==='owner' ? (lang==='sw'?'Paneli ya Mmiliki':'Owner Login Panel') : (lang==='sw'?'Paneli ya Wafanyakazi':'Worker Login Panel');
  const sub = loginRole==='owner' ? (lang==='sw'?'Sehemu hii haipo kwenye menu ya wateja. Ingia kubadili bei, picha, ofa na vyumba.':'This area is hidden from customer navigation. Login to edit prices, photos, offers, and rooms.') : (lang==='sw'?'Wafanyakazi wanaweza kupokea order na kutengeneza booking.':'Workers can receive orders and create bookings.');
  const doLogin=async(e)=>{e.preventDefault(); setError(''); setNotice(''); const {error}=await loginStaff(loginRole,username,password); if(error) setError(error.message);};
  const doReset=async()=>{setError(''); setNotice(''); const {error}=await resetPassword(loginRole,contact); if(error) setError(error.message); else setNotice(lang==='sw'?'Link ya kubadili password imetumwa kwenye email.':'Password reset link sent to the email address.');};
  return <><Hero lang={lang} image={img.aboutHero} title={title} sub={sub}/><section className="section staffSection"><form className="form ownerLogin" onSubmit={doLogin}><label>{lang==='sw'?'Username':'Username'}<input value={username} onChange={e=>setUsername(e.target.value.toLowerCase())} placeholder={loginRole==='owner'?'owner':'worker'} required/></label><label>{lang==='sw'?'Password':'Password'}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/></label>{error&&<p className="formNotice error">{error}</p>}{notice&&<p className="formNotice">{notice}</p>}<button type="submit">{lang==='sw'?'Ingia':'Login'}</button><div className="resetBox"><b>{lang==='sw'?'Umesahau password?':'Forgot password?'}</b><p>{lang==='sw'?'Weka Gmail/email yako upokee link ya reset. Kutuma kwa simu kunahitaji SMS provider.':'Enter your Gmail/email to receive a reset link. Phone reset needs an SMS provider.'}</p><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="example@gmail.com or phone"/><button type="button" onClick={doReset}>{lang==='sw'?'Tuma Reset Link':'Send Reset Link'}</button></div></form><div className="secretHelp"><h3>{lang==='sw'?'Viungo vya siri':'Hidden panel links'}</h3><p>{lang==='sw'?'Wateja hawazioni kwenye menu. Tumia URL hizi wewe na timu yako pekee.':'Customers do not see these in the menu. Use these URLs only for your team.'}</p><code>#owner-login</code><code>#worker-login</code></div></section></>;
}

function BookingList({lang,bookings,role,permissions={},confirmBooking,markReceived,reserveBooking,refreshBookings}){
  const canReceive = role==='owner' || permissions.receive_orders || permissions.view_reservations;
  const canReserve = role==='owner' || permissions.edit_room_status;
  const canConfirm = role==='owner' || permissions.confirm_payments;
  return <><h2 className="adminTitle">{lang==='sw'?'Reservations na Orders':'Reservations & Orders'}</h2><div className="bookingList">{bookings.length?bookings.map(b=><article className="bookingCard" key={b.id}><b>{b.customer_name || 'Guest'}</b><span>{b.room_name}</span><span>{b.phone} • {b.email}</span><span>{b.check_in || 'No date'} → {b.check_out || 'No date'} • {b.guests || 1} guests</span><em>{lang==='sw'?'Hali':'Status'}: {b.status} / {b.payment_status}</em><div className="bookingActions">{canReceive&&<button disabled={b.status==='received'} onClick={()=>markReceived(b)}>{lang==='sw'?'Pokea Reservation':'Mark Received'}</button>}{canReserve&&<button disabled={b.status==='reserved'} onClick={()=>reserveBooking(b)}>{lang==='sw'?'Weka Reserved':'Mark Reserved'}</button>}{canConfirm&&<button disabled={b.payment_status==='paid'} onClick={()=>confirmBooking(b)}>{lang==='sw'?'Thibitisha Malipo':'Confirm Paid'}</button>}</div></article>):<p>{lang==='sw'?'Hakuna booking bado.':'No bookings yet.'}</p>}</div><button className="smallAction" onClick={refreshBookings}>{lang==='sw'?'Refresh Bookings':'Refresh Bookings'}</button></>;
}

function StaffManager({lang,staffProfiles=[],setStaffProfiles}){
  const updateStaff=(id,key,value)=>setStaffProfiles(staffProfiles.map(s=>s.id===id?{...s,[key]:value}:s));
  const updatePerm=(id,key,value)=>setStaffProfiles(staffProfiles.map(s=>s.id===id?{...s,permissions:{...(s.permissions||{}),[key]:value}}:s));
  const addWorker=()=>{
    const id=`staff-${Date.now()}`;
    setStaffProfiles([...staffProfiles,{id,auth_user_id:'',username:`worker${staffProfiles.length}`,role:'worker',full_name:'New Worker',email:'newworker@example.com',phone:'',photo_url:img.room1,active:true,permissions:defaultPermissions}]);
  };
  const removeWorker=(id)=>{ if(confirm(lang==='sw'?'Ondoa mfanyakazi huyu?':'Remove this worker?')) setStaffProfiles(staffProfiles.filter(s=>s.id!==id)); };
  const permissionLabels={
    view_reservations: lang==='sw'?'Kuona reservations':'View reservations',
    receive_orders: lang==='sw'?'Kupokea orders':'Receive orders',
    create_bookings: lang==='sw'?'Kutengeneza bookings':'Create bookings',
    edit_room_status: lang==='sw'?'Kubadili hali ya vyumba':'Change room status',
    confirm_payments: lang==='sw'?'Kuthibitisha malipo':'Confirm payments'
  };
  return <div className="staffManager"><div className="sectionHead compactHead"><div><span className="eyebrow">{lang==='sw'?'Wafanyakazi':'Workers'}</span><h2>{lang==='sw'?'Dhibiti Wafanyakazi na Ruhusa':'Manage Workers & Permissions'}</h2></div><button onClick={addWorker}>{lang==='sw'?'Ongeza Mfanyakazi':'Add Worker'}</button></div><p className="helperText">{lang==='sw'?'Baada ya kuongeza worker, tengeneza Auth User kwenye Supabase kwa email ileile na password unayotaka. Anaweza kuingia kwa username au email.':'After adding a worker, create a Supabase Auth User with the same email and the password you want. They can login using username or email.'}</p><div className="staffCards">{staffProfiles.filter(s=>s.role!=='owner').map(staff=><article className="staffCard" key={staff.id}><img src={staff.photo_url || img.room1} alt={staff.full_name}/><div className="staffFields"><label>{lang==='sw'?'Jina':'Name'}<input value={staff.full_name||''} onChange={e=>updateStaff(staff.id,'full_name',e.target.value)}/></label><label>Username<input value={staff.username||''} onChange={e=>updateStaff(staff.id,'username',e.target.value.toLowerCase().replace(/\s/g,''))}/></label><label>Email / Gmail<input value={staff.email||''} onChange={e=>updateStaff(staff.id,'email',e.target.value)}/></label><label>{lang==='sw'?'Simu':'Phone'}<input value={staff.phone||''} onChange={e=>updateStaff(staff.id,'phone',e.target.value)}/></label><label>{lang==='sw'?'Picha URL':'Photo URL'}<input value={staff.photo_url||''} onChange={e=>updateStaff(staff.id,'photo_url',e.target.value)}/></label><label className="switchLine"><input type="checkbox" checked={staff.active!==false} onChange={e=>updateStaff(staff.id,'active',e.target.checked)}/>{lang==='sw'?'Akaunti iwe active':'Account active'}</label></div><div className="permissionBox"><b>{lang==='sw'?'Ruhusa za Worker':'Worker permissions'}</b>{Object.entries(permissionLabels).map(([key,label])=><label className="switchLine" key={key}><input type="checkbox" checked={!!staff.permissions?.[key]} onChange={e=>updatePerm(staff.id,key,e.target.checked)}/>{label}</label>)}</div><button className="dangerBtn" onClick={()=>removeWorker(staff.id)}>{lang==='sw'?'Ondoa Worker':'Remove Worker'}</button></article>)}</div></div>;
}

function RoomStatusBoard({lang,rooms=[],toggleRoomStatus,permissions={},role='worker'}){
  const canEdit = role==='owner' || permissions.edit_room_status;
  return <div className="roomStatusBoard"><h2 className="adminTitle">{lang==='sw'?'Hali ya Vyumba':'Room Reserved / Available Status'}</h2><div className="roomStatusGrid">{rooms.map(room=><article className="roomStatusCard" key={room.id}><img src={room.image} alt={room.name?.[lang]}/><div><b>{room.name?.[lang]}</b><span className={room.available && Number(room.quantity)>0 ? 'status available':'status unavailable'}>{room.available && Number(room.quantity)>0 ? (lang==='sw'?'Available':'Available') : (lang==='sw'?'Reserved / Unavailable':'Reserved / Unavailable')}</span><small>{room.quantity} {lang==='sw'?'vyumba vilivyobaki':'rooms left'}</small>{canEdit?<button onClick={()=>toggleRoomStatus(room)}>{room.available?(lang==='sw'?'Weka Reserved':'Mark Reserved'):(lang==='sw'?'Weka Available':'Mark Available')}</button>:<em>{lang==='sw'?'Huna ruhusa ya kubadili':'No permission to change'}</em>}</div></article>)}</div></div>;
}

function OwnerPanel({lang,rooms,setRooms,settings,setSettings,galleryImages,setGalleryImages,supabaseReady,staffRole,staffProfiles=[],setStaffProfiles,bookings=[],logoutStaff,confirmBooking,markReceived,reserveBooking,toggleRoomStatus,refreshBookings,go}){
  if(staffRole!=='owner') return <StaffGate lang={lang} go={go} target="owner-login"/>;
  const update=(id,key,value)=>setRooms(rooms.map(r=>r.id===id?{...r,[key]:value}:r));
  const updateOffer=(id,value)=>setRooms(rooms.map(r=>r.id===id?{...r,offer:{...r.offer,[lang]:value}}:r));
  const updateText=(id,key,value)=>setRooms(rooms.map(r=>r.id===id?{...r,[key]:{...r[key],[lang]:value}}:r));
  const updateSetting=(key,value)=>setSettings({...settings,[key]:value});
  const updateSettingLang=(key,value)=>setSettings({...settings,[key]:{...(settings[key]||{}),[lang]:value}});
  const addRoom=()=>{
    const id=`room-${Date.now()}`;
    setRooms([...rooms,{id,available:true,quantity:1,offer:{en:'New offer',sw:'Ofa mpya'},name:{en:'New Room',sw:'Chumba Kipya'},price:'$120',image:img.room1,size:'30 sqm',bed:{en:'King bed',sw:'Kitanda cha King'},text:{en:'Add room description here.',sw:'Weka maelezo ya chumba hapa.'},tags:{en:['Wi-Fi','Breakfast'],sw:['Wi-Fi','Kifungua kinywa']}}]);
  };
  const removeRoom=(id)=>{ if(confirm(lang==='sw'?'Ondoa chumba hiki?':'Remove this room?')) setRooms(rooms.filter(r=>r.id!==id)); };
  const addGallery=()=>{ const id=`gallery-${Date.now()}`; setGalleryImages([...(galleryImages||[]),{id,url:img.galleryHero,title:{en:'New gallery image',sw:'Picha mpya'}}]); };
  const updateGalleryItem=(id,key,value)=>setGalleryImages(galleryImages.map(g=>g.id===id?{...g,[key]:value}:g));
  const updateGalleryTitle=(id,value)=>setGalleryImages(galleryImages.map(g=>g.id===id?{...g,title:{...(g.title||{}),[lang]:value}}:g));
  const removeGallery=(id)=>setGalleryImages(galleryImages.filter(g=>g.id!==id));
  return <><Hero lang={lang} image={img.aboutHero} title={lang==='sw'?'Paneli ya Mmiliki':'Owner Control Panel'} sub={lang==='sw'?'Badilisha taarifa, picha, wafanyakazi, ruhusa, vyumba, bei, ofa na malipo.':'Edit hotel information, pictures, workers, permissions, rooms, prices, offers, and payments.'}/><section className="section"><div className="adminNotice">{supabaseReady?(lang==='sw'?'Imeunganishwa na Supabase. Mabadiliko yanahifadhiwa live.':'Connected to Supabase. Changes save live.'):(lang==='sw'?'Demo mode. Unganisha Supabase kwa live database.':'Demo mode. Connect Supabase for live database.')}<button className="smallAction" onClick={logoutStaff}>{lang==='sw'?'Toka':'Logout'}</button></div>
  <BookingList lang={lang} bookings={bookings} role="owner" permissions={ownerPermissions} confirmBooking={confirmBooking} markReceived={markReceived} reserveBooking={reserveBooking} refreshBookings={refreshBookings}/>
  <RoomStatusBoard lang={lang} rooms={rooms} role="owner" permissions={ownerPermissions} toggleRoomStatus={toggleRoomStatus}/>
  <StaffManager lang={lang} staffProfiles={staffProfiles} setStaffProfiles={setStaffProfiles}/>
  <h2 className="adminTitle">{lang==='sw'?'Taarifa za Hoteli':'Hotel Information'}</h2>
  <div className="adminGrid settingsGrid"><article className="adminCard wideAdmin"><h3>{lang==='sw'?'Badilisha Maelezo Makuu':'Edit Main Details'}</h3><label>{lang==='sw'?'Jina la hoteli':'Hotel name'}<input value={settings.hotelName?.[lang]||''} onChange={e=>updateSettingLang('hotelName',e.target.value)}/></label><label>{lang==='sw'?'Kauli mbiu':'Tagline'}<input value={settings.tagline?.[lang]||''} onChange={e=>updateSettingLang('tagline',e.target.value)}/></label><label>{lang==='sw'?'Anwani':'Address'}<input value={settings.address?.[lang]||''} onChange={e=>updateSettingLang('address',e.target.value)}/></label><label>{lang==='sw'?'Maelezo ya Footer':'Footer text'}<textarea value={settings.footer?.[lang]||''} onChange={e=>updateSettingLang('footer',e.target.value)}></textarea></label></article><article className="adminCard wideAdmin"><h3>{lang==='sw'?'Mawasiliano':'Contacts'}</h3><label>Phone<input value={settings.phone||''} onChange={e=>updateSetting('phone',e.target.value)}/></label><label>WhatsApp Number<input value={settings.whatsapp||''} onChange={e=>updateSetting('whatsapp',e.target.value.replace(/[^0-9]/g,''))}/></label><label>Email<input value={settings.email||''} onChange={e=>updateSetting('email',e.target.value)}/></label><label>{lang==='sw'?'Ramani / Maelezo ya eneo':'Map / location text'}<textarea value={settings.mapText?.[lang]||''} onChange={e=>updateSettingLang('mapText',e.target.value)}></textarea></label></article></div>
  <h2 className="adminTitle">{lang==='sw'?'Picha za Gallery':'Gallery Pictures'}</h2><button className="smallAction addAction" onClick={addGallery}>{lang==='sw'?'Ongeza Picha':'Add Picture'}</button><div className="adminGrid">{galleryImages.map(g=><article className="adminCard" key={g.id}><img src={g.url} alt={g.title?.[lang]||'Gallery'}/><label>Title<input value={g.title?.[lang]||''} onChange={e=>updateGalleryTitle(g.id,e.target.value)}/></label><label>Image URL<input value={g.url} onChange={e=>updateGalleryItem(g.id,'url',e.target.value)}/></label><button onClick={()=>removeGallery(g.id)}>{lang==='sw'?'Ondoa Picha':'Remove Picture'}</button></article>)}</div>
  <h2 className="adminTitle">{lang==='sw'?'Badilisha Vyumba':'Edit Rooms'}</h2><button className="smallAction addAction" onClick={addRoom}>{lang==='sw'?'Ongeza Chumba':'Add Room'}</button><div className="adminGrid">{rooms.map(r=><article className="adminCard" key={r.id}><img src={r.image} alt={r.name[lang]}/><h3>{r.name[lang]}</h3><label>Name<input value={r.name?.[lang]||''} onChange={e=>updateText(r.id,'name',e.target.value)}/></label><label>Description<textarea value={r.text?.[lang]||''} onChange={e=>updateText(r.id,'text',e.target.value)}></textarea></label><label>Price<input value={r.price} onChange={e=>update(r.id,'price',e.target.value)}/></label><label>{lang==='sw'?'Ukubwa':'Size'}<input value={r.size} onChange={e=>update(r.id,'size',e.target.value)}/></label><label>{lang==='sw'?'Kitanda':'Bed'}<input value={r.bed?.[lang]||''} onChange={e=>updateText(r.id,'bed',e.target.value)}/></label><label>{lang==='sw'?'Vyumba vilivyopo':'Rooms available'}<input type="number" min="0" value={r.quantity} onChange={e=>update(r.id,'quantity',Number(e.target.value))}/></label><label>Image URL<input value={r.image} onChange={e=>update(r.id,'image',e.target.value)}/></label><label>Offer<input value={r.offer?.[lang]||''} onChange={e=>updateOffer(r.id,e.target.value)}/></label><button onClick={()=>update(r.id,'available',!r.available)}>{r.available?(lang==='sw'?'Weka Hakipo':'Mark Unavailable'):(lang==='sw'?'Weka Kipo':'Mark Available')}</button><button className="dangerBtn" onClick={()=>removeRoom(r.id)}>{lang==='sw'?'Ondoa Chumba':'Remove Room'}</button></article>)}</div></section></>;
}

function WorkerPanel({lang,rooms,setRooms,settings=defaultSettings,staffRole,staffProfile,bookings=[],logoutStaff,markReceived,reserveBooking,confirmBooking,toggleRoomStatus,refreshBookings,createBooking,go}){
  if(staffRole!=='worker') return <StaffGate lang={lang} go={go} target="worker-login"/>;
  const permissions=staffProfile?.permissions || defaultPermissions;
  return <><Hero lang={lang} image={img.contactHero} title={lang==='sw'?'Paneli ya Wafanyakazi':'Worker Booking Panel'} sub={lang==='sw'?'Pokea reservations, fuatilia malipo, tengeneza booking na dhibiti hali ya vyumba kulingana na ruhusa.':'Receive reservations, track payments, create bookings, and manage room status based on permissions.'}/><section className="section workerPanelGrid"><div><div className="adminNotice"><b>{staffProfile?.full_name || (lang==='sw'?'Mfanyakazi':'Worker')}</b><br/>{lang==='sw'?'Umeingia kama worker. Kazi utakazoona zinategemea ruhusa ulizopewa na owner.':'Logged in as worker. What you can do depends on owner permissions.'}<button className="smallAction" onClick={logoutStaff}>{lang==='sw'?'Toka':'Logout'}</button></div>{permissions.view_reservations?<BookingList lang={lang} bookings={bookings} role="worker" permissions={permissions} markReceived={markReceived} reserveBooking={reserveBooking} confirmBooking={confirmBooking} refreshBookings={refreshBookings}/>:<div className="adminNotice">{lang==='sw'?'Huna ruhusa ya kuona reservations.':'You do not have permission to view reservations.'}</div>}<RoomStatusBoard lang={lang} rooms={rooms} role="worker" permissions={permissions} toggleRoomStatus={toggleRoomStatus}/></div>{permissions.create_bookings&&<div><h2>{lang==='sw'?'Tengeneza Booking':'Create Booking'}</h2><Form lang={lang} rooms={rooms} setRooms={setRooms} createBooking={createBooking} settings={settings}/></div>}</section></>;
}

function StaffGate({lang,go,target}){return <section className="section"><div className="adminNotice">{lang==='sw'?'Tafadhali ingia kwanza.':'Please login first.'}<button className="smallAction" onClick={()=>go(target)}>{lang==='sw'?'Nenda Login':'Go to Login'}</button></div></section>}

function InfoCard({img,title,text,go,lang}){return <article className="info clickable" onClick={()=>go&&go('booking')} tabIndex="0" onKeyDown={(e)=>{if((e.key==='Enter'||e.key===' ')&&go)go('booking')}}><img loading="lazy" decoding="async" src={img} alt={title}/><div className="infoBody"><h3>{title}</h3><p>{text}</p>{go&&<button className="cardBtn" onClick={(e)=>{e.stopPropagation();go('booking')}}>{tx(lang,'learnMore')}</button>}</div></article>}
function CTA({go,lang}){return <section className="cta"><h2>{tx(lang,'cta')}</h2><button onClick={()=>go('booking')}>{tx(lang,'bookNow')}</button></section>}
function Footer({go,lang,settings=defaultSettings}){return <footer><div><b>{settings.hotelName?.[lang] || tx(lang,'brand')}</b><p>{settings.footer?.[lang] || tx(lang,'footer')}</p><div className="creatorCredit"><span>Made by Isaac Sabuni</span><a href={`tel:${settings.phone || '+255746584214'}`}>Call {settings.phone || '0746584214'}</a><a href={`https://wa.me/${settings.whatsapp || '255746584214'}`} target="_blank" rel="noreferrer">WhatsApp</a></div><div className="staffAccess" aria-label="Staff access"><span>{lang==='sw'?'Kwa timu':'Team'}</span><button onClick={()=>go('owner-login')}>{lang==='sw'?'Mmiliki':'Owner'}</button><button onClick={()=>go('worker-login')}>{lang==='sw'?'Mfanyakazi':'Worker'}</button></div></div><div>{navItems.filter(x=>['rooms','dining','experiences','contact'].includes(x.key)).map(x=><button onClick={()=>go(x.key)} key={x.key}>{x[lang]}</button>)}</div></footer>}
createRoot(document.getElementById('root')).render(<App/>);
