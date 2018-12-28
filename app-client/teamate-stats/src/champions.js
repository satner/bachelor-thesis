const champions = [
  {
    name: "Annie"
  },
  {
    name: "Olaf"
  },
  {
    name: "Galio"
  },
  {
    name: "TwistedFate"
  },
  {
    name: "XinZhao"
  },
  {
    name: "Urgot"
  },
  {
    name: "Leblanc"
  },
  {
    name: "Vladimir"
  },
  {
    name: "Fiddlesticks"
  },
  {
    name: "Kayle"
  },
  {
    name: "MasterYi"
  },
  {
    name: "Alistar"
  },
  {
    name: "Ryze"
  },
  {
    name: "Sion"
  },
  {
    name: "Sivir"
  },
  {
    name: "Soraka"
  },
  {
    name: "Teemo"
  },
  {
    name: "Tristana"
  },
  {
    name: "Warwick"
  },
  {
    name: "Nunu"
  },
  {
    name: "MissFortune"
  },
  {
    name: "Ashe"
  },
  {
    name: "Tryndamere"
  },
  {
    name: "Jax"
  },
  {
    name: "Morgana"
  },
  {
    name: "Zilean"
  },
  {
    name: "Singed"
  },
  {
    name: "Evelynn"
  },
  {
    name: "Twitch"
  },
  {
    name: "Karthus"
  },
  {
    name: "Chogath"
  },
  {
    name: "Amumu"
  },
  {
    name: "Rammus"
  },
  {
    name: "Anivia"
  },
  {
    name: "Shaco"
  },
  {
    name: "DrMundo"
  },
  {
    name: "Sona"
  },
  {
    name: "Kassadin"
  },
  {
    name: "Irelia"
  },
  {
    name: "Janna"
  },
  {
    name: "Gangplank"
  },
  {
    name: "Corki"
  },
  {
    name: "Karma"
  },
  {
    name: "Taric"
  },
  {
    name: "Veigar"
  },
  {
    name: "Trundle"
  },
  {
    name: "Swain"
  },
  {
    name: "Caitlyn"
  },
  {
    name: "Blitzcrank"
  },
  {
    name: "Malphite"
  },
  {
    name: "Katarina"
  },
  {
    name: "Nocturne"
  },
  {
    name: "Maokai"
  },
  {
    name: "Renekton"
  },
  {
    name: "JarvanIV"
  },
  {
    name: "Elise"
  },
  {
    name: "Orianna"
  },
  {
    name: "MonkeyKing"
  },
  {
    name: "Brand"
  },
  {
    name: "LeeSin"
  },
  {
    name: "Vayne"
  },
  {
    name: "Rumble"
  },
  {
    name: "Cassiopeia"
  },
  {
    name: "Skarner"
  },
  {
    name: "Heimerdinger"
  },
  {
    name: "Nasus"
  },
  {
    name: "Nidalee"
  },
  {
    name: "Udyr"
  },
  {
    name: "Poppy"
  },
  {
    name: "Gragas"
  },
  {
    name: "Pantheon"
  },
  {
    name: "Ezreal"
  },
  {
    name: "Mordekaiser"
  },
  {
    name: "Yorick"
  },
  {
    name: "Akali"
  },
  {
    name: "Kennen"
  },
  {
    name: "Garen"
  },
  {
    name: "Leona"
  },
  {
    name: "Malzahar"
  },
  {
    name: "Talon"
  },
  {
    name: "Riven"
  },
  {
    name: "KogMaw"
  },
  {
    name: "Shen"
  },
  {
    name: "Lux"
  },
  {
    name: "Xerath"
  },
  {
    name: "Shyvana"
  },
  {
    name: "Ahri"
  },
  {
    name: "Graves"
  },
  {
    name: "Fizz"
  },
  {
    name: "Volibear"
  },
  {
    name: "Rengar"
  },
  {
    name: "Varus"
  },
  {
    name: "Nautilus"
  },
  {
    name: "Viktor"
  },
  {
    name: "Sejuani"
  },
  {
    name: "Fiora"
  },
  {
    name: "Ziggs"
  },
  {
    name: "Lulu"
  },
  {
    name: "Draven"
  },
  {
    name: "Hecarim"
  },
  {
    name: "Khazix"
  },
  {
    name: "Darius"
  },
  {
    name: "Jayce"
  },
  {
    name: "Lissandra"
  },
  {
    name: "Diana"
  },
  {
    name: "Quinn"
  },
  {
    name: "Syndra"
  },
  {
    name: "AurelionSol"
  },
  {
    name: "Kayn"
  },
  {
    name: "Zoe"
  },
  {
    name: "Zyra"
  },
  {
    name: "Kaisa"
  },
  {
    name: "Gnar"
  },
  {
    name: "Zac"
  },
  {
    name: "Yasuo"
  },
  {
    name: "Velkoz"
  },
  {
    name: "Taliyah"
  },
  {
    name: "Camille"
  },
  {
    name: "Braum"
  },
  {
    name: "Jhin"
  },
  {
    name: "Kindred"
  },
  {
    name: "Jinx"
  },
  {
    name: "TahmKench"
  },
  {
    name: "Lucian"
  },
  {
    name: "Zed"
  },
  {
    name: "Kled"
  },
  {
    name: "Ekko"
  },
  {
    name: "Vi"
  },
  {
    name: "Aatrox"
  },
  {
    name: "Nami"
  },
  {
    name: "Azir"
  },
  {
    name: "Thresh"
  },
  {
    name: "Illaoi"
  },
  {
    name: "RekSai"
  },
  {
    name: "Ivern"
  },
  {
    name: "Kalista"
  },
  {
    name: "Bard"
  },
  {
    name: "Rakan"
  },
  {
    name: "Xayah"
  },
  {
    name: "Ornn"
  },
  {
    name: "Neeko"
  },
  {
    name: "Pyke"
  }
];

export default champions;
