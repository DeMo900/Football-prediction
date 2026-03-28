const leagues = [
  {
    name: "UEFA Champions League",
    id: 2,
    logo: "https://media.api-sports.io/football/leagues/2.png",
    country: "World",
  },
  {
    name: "UEFA Europa League",
    id: 3,
    logo: "https://media.api-sports.io/football/leagues/3.png",
    country: "World",
  },
  {
    name: "UEFA Europa Conference League",
    id: 848,
    logo: "https://media.api-sports.io/football/leagues/848.png",
    country: "World",
  },
  {
    name: "Euro Championship",
    id: 4,
    logo: "https://media.api-sports.io/football/leagues/4.png",
    country: "World",
  },
  {
    name: "World Cup",
    id: 1,
    logo: "https://media.api-sports.io/football/leagues/1.png",
    country: "World",
  },
  {
    name: "Premier League",
    id: 39,
    logo: "https://media.api-sports.io/football/leagues/39.png",
    country: "England",
  },
  {
    name: "La Liga",
    id: 140,
    logo: "https://media.api-sports.io/football/leagues/140.png",
    country: "Spain",
  },
  {
    name: "Serie A",
    id: 135,
    logo: "https://media.api-sports.io/football/leagues/135.png",
    country: "Italy",
  },
  {
    name: "Bundesliga",
    id: 78,
    logo: "https://media.api-sports.io/football/leagues/78.png",
    country: "Germany",
  },
  {
    name: "Ligue 1",
    id: 61,
    logo: "https://media.api-sports.io/football/leagues/61.png",
    country: "France",
  },
  {
    name: "Primeira Liga",
    id: 94,
    logo: "https://media.api-sports.io/football/leagues/94.png",
    country: "Portugal",
  },
  {
    name: "Eredivisie",
    id: 88,
    logo: "https://media.api-sports.io/football/leagues/88.png",
    country: "Netherlands",
  },
  {
    name: "Jupiler Pro League",
    id: 144,
    logo: "https://media.api-sports.io/football/leagues/144.png",
    country: "Belgium",
  },
  {
    name: "Süper Lig",
    id: 203,
    logo: "https://media.api-sports.io/football/leagues/203.png",
    country: "Turkey",
  },
  {
    name: "Premier League",
    id: 235,
    logo: "https://media.api-sports.io/football/leagues/235.png",
    country: "Russia",
  },
  {
    name: "Ekstraklasa",
    id: 106,
    logo: "https://media.api-sports.io/football/leagues/106.png",
    country: "Poland",
  },
  {
    name: "Super League",
    id: 207,
    logo: "https://media.api-sports.io/football/leagues/207.png",
    country: "Switzerland",
  },
  {
    name: "Premiership",
    id: 179,
    logo: "https://media.api-sports.io/football/leagues/179.png",
    country: "Scotland",
  },
  {
    name: "HNL",
    id: 210,
    logo: "https://media.api-sports.io/football/leagues/210.png",
    country: "Croatia",
  },
  {
    name: "Liga I",
    id: 283,
    logo: "https://media.api-sports.io/football/leagues/283.png",
    country: "Romania",
  },
  {
    name: "Super Liga",
    id: 286,
    logo: "https://media.api-sports.io/football/leagues/286.png",
    country: "Serbia",
  },
  {
    name: "Serie A",
    id: 71,
    logo: "https://media.api-sports.io/football/leagues/71.png",
    country: "Brazil",
  },
  {
    name: "Major League Soccer",
    id: 253,
    logo: "https://media.api-sports.io/football/leagues/253.png",
    country: "USA",
  },
  {
    name: "Liga MX",
    id: 262,
    logo: "https://media.api-sports.io/football/leagues/262.png",
    country: "Mexico",
  },
  {
    name: "Primera A",
    id: 239,
    logo: "https://media.api-sports.io/football/leagues/239.png",
    country: "Colombia",
  },
  {
    name: "Primera División",
    id: 265,
    logo: "https://media.api-sports.io/football/leagues/265.png",
    country: "Chile",
  },
  {
    name: "Primera División",
    id: 281,
    logo: "https://media.api-sports.io/football/leagues/281.png",
    country: "Peru",
  },
  {
    name: "J1 League",
    id: 98,
    logo: "https://media.api-sports.io/football/leagues/98.png",
    country: "Japan",
  },
  {
    name: "K League 1",
    id: 292,
    logo: "https://media.api-sports.io/football/leagues/292.png",
    country: "South-Korea",
  },
  {
    name: "Pro League",
    id: 307,
    logo: "https://media.api-sports.io/football/leagues/307.png",
    country: "Saudi-Arabia",
  },
];
const leaguesUl = document.getElementById("leagues");

leagues.forEach((el) => {
  const li = document.createElement("li");
  li.className =
    "text-dashboardfont font-sans text-sm h-12 w-full flex items-center gap-2 pl-4 cursor-pointer hover:bg-white/5 transition duration-200 hover:border-l-4 hover:border-font";
  li.dataset.id = el.id;
  const img = document.createElement("img");
  img.src = el.logo;
  img.alt = "ball";
  img.className = "w-5 h-5";
  const p = document.createElement("p");
  p.textContent = el.name;

  li.appendChild(img);
  li.appendChild(p);
  leaguesUl.appendChild(li);
});
const li = document.querySelectorAll("li");
li.forEach((el) => {
  el.addEventListener("click", () => {
    leagueId = el.dataset.id;
    fetch(`/fixtures/live?league=${leagueId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  });
});
/* 
<li class="text-dashboardfont font-sans text-sm h-12 w-full flex items-center gap-2 pl-4 cursor-pointer hover:bg-white/5 transition duration-200 hover:border-l-4 hover:border-font">
                        <img src="/icons/ball.svg" alt="ball">
                        <p>Serie A </p>
                    </li>
                    */
