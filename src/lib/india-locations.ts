// States/UTs and major cities for the address forms' suggestion dropdowns.
// Suggestions only for cities (a town that isn't listed can still be typed in),
// but the state must be one of `indianStates` (checked in the form and on the
// server).

export const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

const citiesByState: Record<string, string[]> = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati",
    "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole", "Vizianagaram", "Machilipatnam",
    "Srikakulam", "Chittoor", "Amaravati", "Proddatur", "Nandyal", "Adoni", "Tenali",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu"],
  Bihar: [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah",
    "Begusarai", "Katihar", "Munger", "Chhapra", "Samastipur", "Hajipur", "Sasaram", "Dehri", "Siwan", "Motihari", "Bettiah",
  ],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  Delhi: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Janakpuri", "Pitampura"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Calangute"],
  Gujarat: [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar",
    "Anand", "Nadiad", "Morbi", "Mehsana", "Bharuch", "Navsari", "Vapi", "Porbandar", "Gandhidham",
    "Surendranagar", "Bhuj", "Palanpur", "Valsad", "Ankleshwar", "Godhra", "Patan", "Amreli",
  ],
  Haryana: [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal",
    "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal",
  ],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Baddi", "Nahan", "Palampur", "Una"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Udhampur", "Kathua"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chaibasa"],
  Karnataka: [
    "Bengaluru", "Mysuru", "Hubballi", "Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari",
    "Vijayapura", "Shivamogga", "Tumakuru", "Davanagere", "Raichur", "Bidar", "Hosapete", "Udupi",
    "Hassan", "Mandya", "Chitradurga", "Chikkamagaluru", "Kolar", "Gadag", "Bagalkot", "Karwar", "Madikeri",
  ],
  Kerala: [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad",
    "Malappuram", "Kannur", "Kasaragod", "Kottayam", "Pathanamthitta", "Idukki", "Wayanad", "Muvattupuzha",
  ],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti"],
  "Madhya Pradesh": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
    "Katni", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Mandsaur", "Neemuch", "Hoshangabad",
  ],
  Maharashtra: [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati",
    "Navi Mumbai", "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur",
    "Parbhani", "Ichalkaranji", "Jalna", "Ambernath", "Bhiwandi", "Nanded", "Panvel", "Kalyan", "Dombivli",
    "Vasai-Virar", "Mira-Bhayandar", "Ulhasnagar", "Satara", "Beed", "Yavatmal", "Gondia", "Wardha", "Ratnagiri",
    "Pimpri-Chinchwad", "Osmanabad", "Buldhana", "Bhusawal", "Nandurbar", "Baramati", "Lonavala", "Alibag",
  ],
  Manipur: ["Imphal", "Thoubal", "Churachandpur", "Bishnupur"],
  Meghalaya: ["Shillong", "Tura", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  Odisha: [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak",
    "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Angul", "Paradip",
  ],
  Puducherry: ["Puducherry", "Karaikal", "Yanam", "Mahe"],
  Punjab: [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur",
    "Batala", "Moga", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Firozpur", "Kapurthala", "Rajpura", "Zirakpur", "Sangrur",
  ],
  Rajasthan: [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur",
    "Sikar", "Pali", "Sri Ganganagar", "Kishangarh", "Baran", "Dhaulpur", "Tonk", "Beawar", "Hanumangarh",
    "Chittorgarh", "Jaisalmer", "Mount Abu", "Pushkar", "Barmer", "Jhunjhunu", "Bundi",
  ],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Tirunelveli",
    "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Hosur", "Nagercoil", "Kancheepuram", "Karur",
    "Cuddalore", "Kumbakonam", "Tiruvannamalai", "Pollachi", "Rajapalayam", "Sivakasi", "Pudukkottai",
    "Namakkal", "Ooty", "Krishnagiri", "Tambaram", "Avadi", "Ambattur", "Kanyakumari", "Karaikudi", "Nagapattinam", "Virudhunagar", "Ambur", "Kodaikanal",
  ],
  Telangana: [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar",
    "Nalgonda", "Adilabad", "Siddipet", "Suryapet", "Miryalaguda", "Secunderabad", "Medak", "Sangareddy",
  ],
  Tripura: ["Agartala", "Dharmanagar", "Kailasahar"],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh",
    "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura",
    "Greater Noida", "Rampur", "Shahjahanpur", "Farrukhabad", "Ayodhya", "Maunath Bhanjan", "Hapur",
    "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai",
    "Sitapur", "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras", "Banda", "Pilibhit",
    "Barabanki", "Mainpuri", "Budaun", "Vrindavan", "Sultanpur", "Deoria", "Basti", "Azamgarh", "Ballia",
  ],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital", "Mussoorie", "Pithoragarh", "Almora", "Kotdwar"],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur",
    "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar",
    "Nabadwip", "Medinipur", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Darjeeling", "Cooch Behar", "Purulia", "Barasat", "Kalyani", "Salt Lake",
  ],
};

export type IndianCity = { city: string; state: string };

export const indianCities: IndianCity[] = Object.entries(citiesByState).flatMap(([state, cities]) =>
  cities.map((city) => ({ city, state }))
);

// city (lower-cased) -> state, for filling the state in once a city is picked.
// A name shared by two states keeps its first entry; the shopper can still
// change the state afterwards.
const stateByCity = new Map<string, string>();
for (const { city, state } of indianCities) {
  const key = city.toLowerCase();
  if (!stateByCity.has(key)) stateByCity.set(key, state);
}

export function stateForCity(city: string): string | null {
  return stateByCity.get(city.trim().toLowerCase()) ?? null;
}

// The state list's own spelling for whatever was typed ("maharashtra" ->
// "Maharashtra"), or null if it isn't a state/UT.
export function canonicalState(input: string): string | null {
  const wanted = input.trim().toLowerCase();
  return indianStates.find((s) => s.toLowerCase() === wanted) ?? null;
}

export function citiesInState(state: string): string[] {
  const canonical = canonicalState(state);
  return canonical ? (citiesByState[canonical] ?? []) : [];
}

export const allCityNames: string[] = Array.from(new Set(indianCities.map((c) => c.city))).sort();
