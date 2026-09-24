// Globo da seção Destinos: continentes clicáveis, cada um com uma galeria de alguns
// países. As fotos são do Wikimedia Commons (licenças livres): o crédito tem de
// aparecer junto da foto. Trocar uma foto = trocar public/images/globo/<iso>.jpg e o
// crédito aqui. Contornos em public/data/globo.json (Natural Earth 110m).

export type Pais = {
  iso: string;
  nome: string;
  /** Ponto vermelho no globo. */
  lat: number;
  lon: number;
  lugar: string;
  foto: string;
  credito: { autor: string; licenca: string; fonte: string };
};

export type Continente = {
  id: "sul" | "norte" | "europa" | "africa" | "asia" | "oceania";
  nome: string;
  /** Centro usado para girar o globo até o continente. */
  lat: number;
  lon: number;
  cta: string;
  /** Completa "quero planejar ..." na mensagem do WhatsApp. */
  viagem: string;
  /** Os primeiros aparecem com foto; o resto, só pelo nome. */
  paises: Pais[];
};

const pais = (iso: string, nome: string, lat: number, lon: number, lugar: string, credito: Pais["credito"]): Pais => ({
  iso,
  nome,
  lat,
  lon,
  lugar,
  foto: `/images/globo/${iso.toLowerCase()}.jpg`,
  credito,
});

export const continentes: Continente[] = [
  {
    id: "sul",
    nome: "América do Sul",
    lat: -15,
    lon: -60,
    cta: "Quero viajar pela América do Sul",
    viagem: "uma viagem pela América do Sul",
    paises: [
      pais("BRA", "Brasil", -12, -50, "Rio de Janeiro e o Pão de Açúcar", { autor: "Wilfredor", licenca: "CC0", fonte: "https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro_skyline_and_Sugarloaf_Mountain_at_sunset,_Brazil_3.jpg" }),
      pais("ARG", "Argentina", -35, -65, "Glaciar Perito Moreno, na Patagônia", { autor: "Fernando", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Trekking_at_Perito_Moreno_Glacier.jpg" }),
      pais("CHL", "Chile", -35, -71, "Torres del Paine, na Patagônia", { autor: "Pedro Szekely from Los Angeles, USA", licenca: "CC BY-SA 2.0", fonte: "https://commons.wikimedia.org/wiki/File:Cuernos_del_Paine_in_Torres_del_Paine_National_Park.jpg" }),
      pais("PER", "Peru", -9.5, -75, "Machu Picchu", { autor: "Diego Delso", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Machu_Picchu,_Per%C3%BA,_2015-07-30,_DD_47.JPG" }),
      pais("URY", "Uruguai", -32.8, -56, "Casapueblo, em Punta Ballena", { autor: "Talkingheads", licenca: "CC BY-SA 3.0", fonte: "https://commons.wikimedia.org/wiki/File:Casapueblo.JPG" }),
    ],
  },
  {
    id: "norte",
    nome: "América do Norte e Caribe",
    lat: 32,
    lon: -92,
    cta: "Quero viajar pela América do Norte",
    viagem: "uma viagem pela América do Norte ou pelo Caribe",
    paises: [
      pais("USA", "Estados Unidos", 39, -98, "Grand Canyon, no Arizona", { autor: "Tuxyso", licenca: "CC BY-SA 3.0", fonte: "https://commons.wikimedia.org/wiki/File:Grand_Canyon_Hopi_Point_with_rainbow_2013.jpg" }),
      pais("MEX", "México", 23, -102, "Tulum, na Riviera Maya", { autor: "Carlos Delgado", licenca: "CC BY-SA 3.0", fonte: "https://commons.wikimedia.org/wiki/File:Tulum_-_01.jpg" }),
      pais("CAN", "Canadá", 57, -100, "Moraine Lake, em Banff", { autor: "Gorgo", licenca: "Public domain", fonte: "https://commons.wikimedia.org/wiki/File:Moraine_Lake_17092005.jpg" }),
      pais("DOM", "República Dominicana", 18.2, -68.7, "Ilha Saona", { autor: "Danu Widjajanto", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Saona_Island_December_2020.jpg" }),
    ],
  },
  {
    id: "europa",
    nome: "Europa",
    lat: 50,
    lon: 12,
    cta: "Quero viajar pela Europa",
    viagem: "uma viagem pela Europa",
    paises: [
      pais("ITA", "Itália", 42.8, 12.5, "Positano, na Costa Amalfitana", { autor: "Bernard Gagnon", licenca: "CC BY 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Positano_(Italy)_02.jpg" }),
      pais("PRT", "Portugal", 39.6, -8, "Ribeira do Porto e os barcos rabelos", { autor: "Jakub Hałun", licenca: "CC BY 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Rabelo_boats_and_Ribeira_seen_from_Cais_de_Gaia,_20250605_1623_9879.jpg" }),
      pais("FRA", "França", 46.6, 2.4, "Mont-Saint-Michel, na Normandia", { autor: "Lynx1211", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Mont_St_Michel_at_sunrise.jpg" }),
      pais("ESP", "Espanha", 40.2, -3.6, "Plaza de España, em Sevilha", { autor: "Carlos Delgado", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Plaza_de_Espa%C3%B1a_(Sevilla)_-_01.jpg" }),
      pais("GRC", "Grécia", 39.3, 22, "Oia, em Santorini", { autor: "Giles Laurent", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg" }),
      pais("CHE", "Suíça", 46.8, 8.2, "Matterhorn, em Zermatt", { autor: "Liridon", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Matterhorn,_March_2019_(01).jpg" }),
      pais("GBR", "Reino Unido", 53, -2, "Londres e o Palácio de Westminster", { autor: "Colin", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg" }),
      pais("IRL", "Irlanda", 53.2, -8, "Falésias de Moher", { autor: "Berthold Werner", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Ireland_Cliffs_of_Moher_BW_2025-09-11_14-27-51.jpg" }),
      pais("ISL", "Islândia", 64.9, -18.6, "Kirkjufell, na península de Snæfellsnes", { autor: "Jakub Hałun", licenca: "CC BY 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Kirkjufell,_Iceland,_20240714_1631_0713.jpg" }),
      pais("NOR", "Noruega", 62, 10, "Geirangerfjord", { autor: "Ximonic (Simo Räsänen)", licenca: "CC BY-SA 3.0", fonte: "https://commons.wikimedia.org/wiki/File:Geirangerfjord_from_%C3%98rnesvingen,_2013_June.jpg" }),
    ],
  },
  {
    id: "africa",
    nome: "África",
    lat: 4,
    lon: 22,
    cta: "Quero viajar pela África",
    viagem: "uma viagem pela África",
    paises: [
      pais("EGY", "Egito", 26.8, 30, "Pirâmides de Gizé", { autor: "Ricardo Liberato", licenca: "CC BY-SA 2.0", fonte: "https://commons.wikimedia.org/wiki/File:All_Gizah_Pyramids.jpg" }),
      pais("MAR", "Marrocos", 31.8, -7, "Chefchaouen, a cidade azul", { autor: "Fbrandao.1963", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:2018_01_(Blue)_-_Chaouen.jpg" }),
      pais("ZAF", "África do Sul", -29, 24.7, "Camps Bay, na Cidade do Cabo", { autor: "Der Berzerker from Washington, DC, USA", licenca: "CC BY-SA 2.0", fonte: "https://commons.wikimedia.org/wiki/File:Camps_bay_(53460319478)_(cropped).jpg" }),
      pais("KEN", "Quênia", -1.5, 35.1, "Reserva Maasai Mara", { autor: "Danijel Mihajlovic", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Masai_Mara_at_Sunset.jpg" }),
    ],
  },
  {
    id: "asia",
    nome: "Ásia",
    lat: 30,
    lon: 85,
    cta: "Quero viajar pela Ásia",
    viagem: "uma viagem pela Ásia",
    paises: [
      pais("JPN", "Japão", 36.5, 138, "Monte Fuji", { autor: "Romain Guy from San Francisco, USA", licenca: "CC0", fonte: "https://commons.wikimedia.org/wiki/File:Mount_Fuji_at_sunset,_March_2025.jpg" }),
      pais("THA", "Tailândia", 15.5, 101, "Ilhas Phi Phi", { autor: "Diego Delso", licenca: "CC BY-SA 3.0", fonte: "https://commons.wikimedia.org/wiki/File:Isla_Phi_Phi_Lay,_Tailandia,_2013-08-19,_DD_04.JPG" }),
      pais("ARE", "Emirados Árabes", 24, 54, "Dubai Marina", { autor: "Norlando Pobre", licenca: "CC BY 2.0", fonte: "https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg" }),
      pais("MDV", "Maldivas", 3.2, 73.2, "Bangalôs sobre a água", { autor: "Martin Falbisoner", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Diamonds_Thudufushi_Beach_and_Water_Villas,_May_2017_-09.jpg" }),
      pais("TUR", "Turquia", 38.6, 34.8, "Capadócia", { autor: "Arian Zwegers from Brussels, Belgium", licenca: "CC BY 2.0", fonte: "https://commons.wikimedia.org/wiki/File:Cappadocia_balloon_trip,_Ortahisar_Castle_(11893715185).jpg" }),
    ],
  },
  {
    id: "oceania",
    nome: "Oceania",
    lat: -24,
    lon: 145,
    cta: "Quero viajar pela Oceania",
    viagem: "uma viagem pela Oceania",
    paises: [
      pais("AUS", "Austrália", -25.5, 134, "Opera House, em Sydney", { autor: "Thomas Adams", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Sydneyoperahouse_at_night.jpg" }),
      pais("NZL", "Nova Zelândia", -41.5, 172.5, "Milford Sound, em Fiordland", { autor: "Krzysztof Golik", licenca: "CC BY-SA 4.0", fonte: "https://commons.wikimedia.org/wiki/File:Milford_Sound_in_Fiordland_National_Park_01.jpg" }),
      pais("PYF", "Polinésia Francesa", -17.5, -149.8, "Moorea", { autor: "DANIEL JULIE from Paris, France", licenca: "CC BY 2.0", fonte: "https://commons.wikimedia.org/wiki/File:DSC00042_Polyn%C3%A9sia_Moor%C3%A9a_Island_Motu_Mo%C3%A9a_Lagoon_and_transportation_Boat_(8076082190).jpg" }),
    ],
  },
];
