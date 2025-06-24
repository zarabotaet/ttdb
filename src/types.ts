export enum PlyMaterial {
  // Натуральные породы дерева
  HINOKI = "Hinoki",
  KOTO = "Koto",
  LIMBA = "Limba",
  AYOUS = "Ayous",
  BASSWOOD = "Basswood",
  ANIGRE = "Anigre",
  SPRUCE = "Spruce",
  WALNUT = "Walnut",
  MAHOGANY = "Mahogany",
  CYPRESS = "Cypress",
  ROSEWOOD = "Rosewood",
  KIRI = "Kiri",
  FIR = "Fir",
  BALSA = "Balsa",
  CEDAR = "Cedar",
  RED_CEDAR = "Red Cedar",
  WILLOW = "Willow",
  EBONY = "Ebony",
  FINELINE = "Fineline",
  PLANCHONELLO = "Planchonello",
  AWAN = "Awan",
  MERANTI = "Meranti",
  LARCH = "Larch",
  STONE_PINE = "Stone Pine",
  RESONANCE_SPRUCE = "Resonance Spruce",
  NORWAY_SPRUCE = "Norway spruce",
  WHITE_ASH = "White Ash",
  TUNG = "Tung",
  BLUE_AYOUS = "Blue Ayous",
  RED_SAMBA = "Red Samba (Ayous)",
  OVENGKOLE = "Ovengkole",
  BLACK_LOCUST = "Black Locust",
  BAMBOO = "Bamboo",

  // Синтетические материалы - Carbon
  CARBON = "Carbon",
  CARBON_FLEECE = "Carbon Fleece",
  CARBON_KEVLAR = "Carbon Kevlar™",
  RX_CARBON = "RX Carbon",

  // Синтетические материалы - Специальные слои
  ALC = "ALC",
  SALC = "SALC",
  ZLC = "ZLC",
  SZLC = "SZLC",
  ZLF = "ZLF",
  ULC = "ULC",
  T5000 = "T5000",
  CNF = "CNF",
  CAF = "CAF",

  // Синтетические материалы - Другие
  ARYLATE = "Arylate",
  KEVLAR = "Kevlar™",
  ARAMID = "Aramid",
  ARAMID_CARBON = "Aramid Carbon",
  TEXALIUM = "Texalium™",
  BLUE_TEXALIUM = "Blue Texalium™",
  GLASS_FIBRE = "Glass fibre",

  // Специальные композиты
  BALSA_AYOUS = "Balsa + Ayous",
  CARBOTOX = "Carbotox",
  ARATOX = "Aratox",
  DOTEC = "Dotec",
  FLAX_CLOTH_BF3 = "Flax Cloth BF3",
  BLACK_CLOTH = "Black Cloth",
  BALSA_ARATOX = "Balsa + Aratox",
}

export enum Brand {
  ADIDAS = "Adidas",
  ALSER = "Alsér",
  ANDRO = "Andro",
  ANIMUS = "Animus",
  ARBALEST = "Arbalest",
  ARMSTRONG = "Armstrong",
  ARTENGO = "Artengo",
  ARTTE = "ARTTE",
  AVALOX = "Avalox",
  BANCO = "Banco",
  BANDA = "Banda",
  BUTTERFLY = "Butterfly",
  CORNILLEAU = "Cornilleau",
  DARKER = "Darker",
  DAWEI = "Dawei",
  DHS = "DHS",
  DONIC = "Donic",
  DOPPELGANGER = "DoppelGanger",
  DR_NEUBAUER = "Dr. Neubauer",
  FRIENDSHIP = "Friendship",
  GEWO = "GEWO",
  GLOBE = "Globe",
  HALLMARK = "Hallmark",
  JOOLA = "JOOLA",
  KILLERSPIN = "Killerspin",
  KOGYO = "Kogyo",
  NITTAKU = "Nittaku",
  PALIO = "Palio",
  SANWEI = "Sanwei",
  SPINLORD = "SpinLord",
  STIGA = "Stiga",
  SUNFLEX = "Sunflex",
  TELAIGAL = "TelaiGAL",
  TIBHAR = "Tibhar",
  TSP = "TSP",
  ULMO = "Ulmo",
  VICTAS = "Victas",
  VODAK = "Vodak",
  XIOM = "Xiom",
  XVT = "XVT",
  YASAKA = "Yasaka",
  YINHE = "Yinhe (Galaxy/Milkyway)",
}

export type BladeData = {
  Brand: Brand;
  Model: string;
  "Nb plies": string;
  "Weight (g)": string;
  "Thick. (mm)": string;
  "Ply 1": PlyMaterial;
  "Ply 2": PlyMaterial;
  "Ply 3": PlyMaterial;
  "Ply 4": PlyMaterial;
  "Ply 5": PlyMaterial;
  "Ply 6": PlyMaterial;
  "Ply 7": PlyMaterial;
  "Ply 8": PlyMaterial;
  "Ply 9": PlyMaterial;
};

export type Blade = {
  brand: Brand;
  model: string;
  pliesNumber: number;
  weight: number;
  thick: number;
  plies: PlyMaterial[];
};
