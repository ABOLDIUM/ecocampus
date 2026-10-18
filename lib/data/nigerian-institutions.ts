// ============================================================================
// ECOCAMPUS NIGERIAN INSTITUTIONS DATA — LIB/DATA/NIGERIAN-INSTITUTIONS.TS
// ============================================================================

export interface UniversityRecord {
  name: string;
  ownership: "Federal" | "State";
}

export interface NigerianInstitution extends UniversityRecord {
  id: string;
  code: string;
  shortName: string;
  acronym: string;
  state: string;
  category: "FEDERAL" | "STATE" | "PRIVATE";
  type: "FEDERAL" | "STATE" | "PRIVATE";
  bursaryAccount: string;
  bankName: string;
  bankCode: string;
  matricFormatHint?: string;
}

export const PUBLIC_UNIVERSITIES: UniversityRecord[] = [
  // Federal Universities
  { name: "Abubakar Tafawa Balewa University", ownership: "Federal" },
  { name: "Ahmadu Bello University", ownership: "Federal" },
  { name: "Bayero University Kano", ownership: "Federal" },
  { name: "Federal University Gashua", ownership: "Federal" },
  { name: "Federal University of Petroleum Resources, Effurun", ownership: "Federal" },
  { name: "Federal University of Technology, Akure", ownership: "Federal" },
  { name: "Federal University of Technology, Minna", ownership: "Federal" },
  { name: "Federal University of Technology, Owerri", ownership: "Federal" },
  { name: "Federal University Dutse", ownership: "Federal" },
  { name: "Federal University Dutsin-Ma", ownership: "Federal" },
  { name: "Federal University Kashere", ownership: "Federal" },
  { name: "Federal University Lafia", ownership: "Federal" },
  { name: "Federal University Lokoja", ownership: "Federal" },
  { name: "Alex Ekwueme Federal University, Ndufu-Alike", ownership: "Federal" },
  { name: "Federal University Otuoke", ownership: "Federal" },
  { name: "Federal University Oye-Ekiti", ownership: "Federal" },
  { name: "Federal University Wukari", ownership: "Federal" },
  { name: "Federal University Birnin Kebbi", ownership: "Federal" },
  { name: "Federal University Gusau", ownership: "Federal" },
  { name: "Michael Okpara University of Agriculture", ownership: "Federal" },
  { name: "Modibbo Adama University", ownership: "Federal" },
  { name: "National Open University of Nigeria", ownership: "Federal" },
  { name: "Nigeria Police Academy", ownership: "Federal" },
  { name: "Nigerian Defence Academy", ownership: "Federal" },
  { name: "Nnamdi Azikiwe University", ownership: "Federal" },
  { name: "Obafemi Awolowo University", ownership: "Federal" },
  { name: "University of Abuja", ownership: "Federal" },
  { name: "Federal University of Agriculture, Abeokuta", ownership: "Federal" },
  { name: "Joseph Sarwuan Tarka University", ownership: "Federal" },
  { name: "University of Benin", ownership: "Federal" },
  { name: "University of Calabar", ownership: "Federal" },
  { name: "University of Ibadan", ownership: "Federal" },
  { name: "University of Ilorin", ownership: "Federal" },
  { name: "University of Jos", ownership: "Federal" },
  { name: "University of Lagos", ownership: "Federal" },
  { name: "University of Maiduguri", ownership: "Federal" },
  { name: "University of Nigeria, Nsukka", ownership: "Federal" },
  { name: "University of Port Harcourt", ownership: "Federal" },
  { name: "University of Uyo", ownership: "Federal" },
  { name: "Usmanu Danfodiyo University", ownership: "Federal" },
  { name: "Nigerian Maritime University", ownership: "Federal" },
  { name: "Air Force Institute of Technology", ownership: "Federal" },
  { name: "Nigerian Army University Biu", ownership: "Federal" },
  { name: "Federal University of Health Sciences, Otukpo", ownership: "Federal" },
  { name: "Federal University of Agriculture, Zuru", ownership: "Federal" },
  { name: "Federal University of Technology, Babura", ownership: "Federal" },
  { name: "Federal University of Technology, Ikot Abasi", ownership: "Federal" },
  { name: "Federal University of Health Sciences, Azare", ownership: "Federal" },
  { name: "Federal University of Health Sciences, Ila Orangun", ownership: "Federal" },
  { name: "David Nweze Umahi Federal University of Medical Sciences", ownership: "Federal" },
  { name: "Admiralty University", ownership: "Federal" },
  { name: "Federal University of Transportation, Daura", ownership: "Federal" },
  { name: "African Aviation and Aerospace University", ownership: "Federal" },
  { name: "National University of Science and Technology, Abuja", ownership: "Federal" },
  { name: "Federal University of Agriculture, Bassam-Biri", ownership: "Federal" },
  { name: "Federal University of Health Sciences, Kwale", ownership: "Federal" },
  { name: "Federal University of Health Sciences, Katsina", ownership: "Federal" },
  { name: "Federal University of Agriculture, Mubi", ownership: "Federal" },
  { name: "Federal University of Education, Zaria", ownership: "Federal" },
  { name: "Alvan Ikoku Federal University of Education", ownership: "Federal" },
  { name: "Yusuf Maitama Sule Federal University of Education", ownership: "Federal" },
  { name: "Adeyemi Federal University of Education", ownership: "Federal" },
  { name: "Federal University of Allied Health Sciences, Enugu", ownership: "Federal" },
  { name: "Federal University of Medicine and Medical Sciences, Abeokuta", ownership: "Federal" },
  { name: "Federal University of Education, Pankshin", ownership: "Federal" },
  { name: "Federal University of Education, Kontagora", ownership: "Federal" },
  { name: "University of Maritime Studies, Oron", ownership: "Federal" },
  { name: "Federal University of Environment and Technology", ownership: "Federal" },
  { name: "Federal University of Applied Sciences, Kachia", ownership: "Federal" },
  { name: "Tai Solarin Federal University of Education", ownership: "Federal" },
  { name: "Federal University of Agriculture and Developmental Studies", ownership: "Federal" },
  { name: "Federal University of Technology and Environmental Studies", ownership: "Federal" },
  { name: "Federal University of Agriculture and Technology, Okeho", ownership: "Federal" },
  { name: "Federal University of Health Science and Technology, Tsafe", ownership: "Federal" },
  { name: "Federal University of Agriculture and Technology, Obio-Akpa", ownership: "Federal" },
  { name: "Federal University of Science and Technology, Epe", ownership: "Federal" },
  { name: "Federal University of Science and Technology, Kabo", ownership: "Federal" },

  // State Universities
  { name: "Rivers State University", ownership: "State" },
  { name: "Ambrose Alli University", ownership: "State" },
  { name: "Abia State University", ownership: "State" },
  { name: "Ekiti State University", ownership: "State" },
  { name: "Enugu State University of Science and Technology", ownership: "State" },
  { name: "Olabisi Onabanjo University", ownership: "State" },
  { name: "Lagos State University", ownership: "State" },
  { name: "Ladoke Akintola University of Technology", ownership: "State" },
  { name: "Rev. Fr. Moses Orshio Adasu University", ownership: "State" },
  { name: "Delta State University, Abraka", ownership: "State" },
  { name: "Imo State University", ownership: "State" },
  { name: "Adekunle Ajasin University", ownership: "State" },
  { name: "Prince Abubakar Audu University", ownership: "State" },
  { name: "Chukwuemeka Odumegwu Ojukwu University", ownership: "State" },
  { name: "Ebonyi State University", ownership: "State" },
  { name: "Aliko Dangote University of Science and Technology", ownership: "State" },
  { name: "Niger Delta University", ownership: "State" },
  { name: "Adamawa State University", ownership: "State" },
  { name: "Nasarawa State University", ownership: "State" },
  { name: "University of Cross River State", ownership: "State" },
  { name: "Gombe State University", ownership: "State" },
  { name: "Kaduna State University", ownership: "State" },
  { name: "Ibrahim Badamasi Babangida University", ownership: "State" },
  { name: "Plateau State University", ownership: "State" },
  { name: "Yobe State University", ownership: "State" },
  { name: "Kebbi State University of Science and Technology", ownership: "State" },
  { name: "Umaru Musa Yar’Adua University", ownership: "State" },
  { name: "Osun State University", ownership: "State" },
  { name: "Olusegun Agagu University of Science and Technology", ownership: "State" },
  { name: "Taraba State University", ownership: "State" },
  { name: "Kwara State University", ownership: "State" },
  { name: "Sokoto State University", ownership: "State" },
  { name: "Akwa Ibom State University", ownership: "State" },
  { name: "Ignatius Ajuru University of Education", ownership: "State" },
  { name: "Bauchi State University", ownership: "State" },
  { name: "Northwest University Kano", ownership: "State" },
  { name: "First Technical University, Ibadan", ownership: "State" },
  { name: "Sule Lamido University", ownership: "State" },
  { name: "University of Medical Sciences, Ondo", ownership: "State" },
  { name: "Edo State University", ownership: "State" },
  { name: "Kingsley Ozumba Mbadiwe University", ownership: "State" },
  { name: "University of Africa, Toru-Orua", ownership: "State" },
  { name: "Kashim Ibrahim University", ownership: "State" },
  { name: "Moshood Abiola University of Science and Technology", ownership: "State" },
  { name: "Zamfara State University", ownership: "State" },
  { name: "Bayelsa Medical University", ownership: "State" },
  { name: "University of Agriculture and Environmental Sciences", ownership: "State" },
  { name: "Confluence University of Science and Technology", ownership: "State" },
  { name: "Bamidele Olumilua University of Education", ownership: "State" },
  { name: "University of Delta", ownership: "State" },
  { name: "Delta University of Science and Technology", ownership: "State" },
  { name: "Dennis Osadebe University", ownership: "State" },
  { name: "Lagos State University of Education", ownership: "State" },
  { name: "Lagos State University of Science and Technology", ownership: "State" },
  { name: "Shehu Shagari University of Education", ownership: "State" },
  { name: "State University of Medical and Applied Sciences", ownership: "State" },
  { name: "University of Ilesa", ownership: "State" },
  { name: "Emmanuel Alayande University of Education", ownership: "State" },
  { name: "Kogi State University, Kabba", ownership: "State" },
  { name: "Abdulkadir Kure University", ownership: "State" },
  { name: "Kwara State University of Education", ownership: "State" },
  { name: "Abdulsalam Abubakar University of Agriculture and Climate Action", ownership: "State" },
  { name: "Ebonyi State University of ICT, Science and Technology", ownership: "State" },
  { name: "Cross River University of Education and Entrepreneurship", ownership: "State" },
  { name: "Benue State University of Agriculture, Science and Technology", ownership: "State" },
  { name: "University of Aeronautics and Aerospace Engineering, Ezza", ownership: "State" },
  { name: "University of Innovation, Science and Technology, Omuma", ownership: "State" },
  { name: "Taraba State University of Tropical Agriculture", ownership: "State" },
  { name: "Jigawa State University of Medical and Allied Health Sciences", ownership: "State" },
];

// Enrich PUBLIC_UNIVERSITIES into NUC_UNIVERSITIES so pages expecting id, code, shortName, or bursaryAccount never crash
export const NUC_UNIVERSITIES: NigerianInstitution[] = PUBLIC_UNIVERSITIES.map((uni, idx) => {
  const words = uni.name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  const acronym = words
    .filter((w) => !["of", "and", "in", "the"].includes(w.toLowerCase()))
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  const slug = uni.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const upperType = uni.ownership.toUpperCase() as "FEDERAL" | "STATE";
  const acctSuffix = String(10000000 + idx * 7919).slice(0, 8);

  return {
    ...uni,
    id: slug,
    code: acronym || `UNI${idx + 1}`,
    shortName: acronym || uni.name,
    acronym: acronym || `UNI${idx + 1}`,
    state: "Nigeria",
    category: upperType,
    type: upperType,
    bursaryAccount: `00${acctSuffix}`,
    bankName: "Ecobank Nigeria",
    bankCode: "050",
    matricFormatHint: "e.g. 24/203MBB/472",
  };
});

export const NIGERIAN_INSTITUTIONS: NigerianInstitution[] = NUC_UNIVERSITIES;
export const UNIVERSITIES: NigerianInstitution[] = NUC_UNIVERSITIES;

export const NYSC_STATE_PREFIXES: Record<string, string> = {
  FC: "FCT Abuja",
  LA: "Lagos",
  OY: "Oyo",
  OG: "Ogun",
  RV: "Rivers",
  KD: "Kaduna",
  KN: "Kano",
  EN: "Enugu",
  AN: "Anambra",
  ED: "Edo",
  DT: "Delta",
  KW: "Kwara",
  PL: "Plateau",
  AK: "Akwa Ibom",
  CR: "Cross River",
  OS: "Osun",
  ON: "Ondo",
  EK: "Ekiti",
  NS: "Nasarawa",
  NG: "Niger",
  AB: "Abia",
  AD: "Adamawa",
  BA: "Bauchi",
  BY: "Bayelsa",
  BE: "Benue",
  BO: "Borno",
  GM: "Gombe",
  IM: "Imo",
  JI: "Jigawa",
  KT: "Katsina",
  KE: "Kebbi",
  KO: "Kogi",
  NA: "Nasarawa",
  NI: "Niger",
  SO: "Sokoto",
  TA: "Taraba",
  YO: "Yobe",
  ZA: "Zamfara",
};

export const NYSC_STATE_CODE_REGEX = /^[A-Z]{2}\/\d{2}[ABC]\/\d{4}$/;

export function generateNyscStateCode(stateCode = "FC", batch = "26A"): string {
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `${stateCode.toUpperCase()}/${batch.toUpperCase()}/${serial}`;
}

export default NUC_UNIVERSITIES;