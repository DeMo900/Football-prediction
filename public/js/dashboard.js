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
    name: "FA Cup",
    id: 45,
    logo: "https://media.api-sports.io/football/leagues/45.png",
    country: "England",
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
const liveMatchesContainer = document.getElementById("live-matches");
const upcomingMatchesContainer = document.getElementById("upcoming-matches");
const userCoins = document.getElementById("user-coins").querySelector("h4");
const getUser = async () => {
    try {
        const res = await fetch("/user");
        const data = await res.json();
        userCoins.textContent = `${data.coins} Coins`;
    } catch (err) {
        console.error(err);
    }
}
getUser();

function createMatchCard(data) {
  const matchCard = document.createElement("div");
  matchCard.className = "w-[90%] mx-auto rounded-xl p-6 h-80 bg-dbPrimary hover:opacity-80 cursor-pointer transition-opacity duration-150";
  
  const homeTeam = data.teams.home;
  const awayTeam = data.teams.away;
  const homeLogo = data.teamLogos.home
  const awayLogo = data.teamLogos.away
  const homeGoals = data.goals.home;
  const awayGoals = data.goals.away;
  const leagueName = data.league.name || "LEAGUE";
  
  matchCard.innerHTML = `
    <div class="flex w-full justify-between items-center mt-[-15px] mb-6">
      <span class="text-dashboardfont text-xs font-bold tracking-wider uppercase">${leagueName}</span>
    </div>

    <div class="flex w-full justify-between sm:justify-center items-center gap-2 sm:gap-16 px-2 sm:px-8">
      <div class="flex flex-col items-center gap-3">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#060F06] flex justify-center items-center">
          <img src="${homeLogo}" alt="${homeTeam}" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </div>
        <span class="text-white font-bold tracking-wide text-xs sm:text-sm lg:text-base uppercase">${homeTeam}</span>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-4xl sm:text-5xl font-black text-white tracking-widest whitespace-nowrap">${homeGoals} - ${awayGoals}</span>
        <span class="text-font text-[10px] sm:text-xs font-bold mt-2 tracking-widest whitespace-nowrap">LIVE</span>
      </div>

      <div class="flex flex-col items-center gap-3">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#060F06] flex justify-center items-center">
          <img src="${awayLogo}" alt="${awayTeam}" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </div>
        <span class="text-white font-bold tracking-wide text-xs sm:text-sm lg:text-base uppercase">${awayTeam}</span>
      </div>
    </div>

    <div class="flex w-full justify-between gap-3 sm:gap-4 mt-8">
      <div class="flex flex-1 flex-col items-center justify-center bg-[#060F06] rounded-xl py-3 hover:opacity-75 cursor-pointer transition-opacity duration-200">
        <span class="text-dashboardfont text-[10px] sm:text-xs mb-1 uppercase">HOME</span>
        <span class="text-font font-bold text-base sm:text-lg">1.85</span>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center bg-[#060F06] rounded-xl py-3 hover:opacity-75 cursor-pointer transition-opacity duration-200">
        <span class="text-dashboardfont text-[10px] sm:text-xs mb-1 uppercase">DRAW</span>
        <span class="text-font font-bold text-base sm:text-lg">3.40</span>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center bg-[#060F06] rounded-xl py-3 hover:opacity-75 cursor-pointer transition-opacity duration-200">
        <span class="text-dashboardfont text-[10px] sm:text-xs mb-1 uppercase">AWAY</span>
        <span class="text-font font-bold text-base sm:text-lg">4.20</span>
      </div>
    </div>
  `;

  return matchCard;
}

function createUpcomingMatchCard(data) {
  const date = new Date(data.startsAt * 1000);
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  const upcomingCard = document.createElement("div");
  upcomingCard.className = "flex items-center p-6 justify-between w-[90%] h-10 rounded-lg border-l-2 border-font bg-dbPrimary mx-auto hover:opacity-80 cursor-pointer transition-opacity duration-200";
  
  upcomingCard.innerHTML = `
          <div>
            <p class="text-sm text-slate-50">${time}</p>
          </div>
          <div>
            <p class="text-lg text-slate-50">${data.teams.home} vs ${data.teams.away}</p>
          </div>
          <div class="flex gap-2">
            <div class="bg-primary w-10 h-8 text-center py-1 rounded-lg">
              <p class="text-sm text-slate-50">1.85</p>
            </div>
            <div class="bg-primary w-10 h-8 text-center py-1 rounded-lg">
              <p class="text-sm text-slate-50">3.40</p>
            </div>
            <div class="bg-primary w-10 h-8 text-center py-1 rounded-lg">
              <p class="text-sm text-slate-50">4.20</p>
            </div>
          </div>
  `;
  return upcomingCard;
}

const li = document.querySelectorAll("li");
li.forEach((el) => {
  el.addEventListener("click", async () => {
    const leagueId = el.dataset.id;
    try {
      // Live Matches
      const res = await fetch(`/fixtures/live?league=${leagueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data) {
        
      console.log(data);
      liveMatchesContainer.innerHTML = "";
      data.forEach((match) => {
        console.log(match);
        const card = createMatchCard(match);
        liveMatchesContainer.appendChild(card);
      });
    }
      // Upcoming Matches
      const upcomingRes = await fetch(`/fixtures/upcoming?league=${leagueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const upcomingData = await upcomingRes.json();
      upcomingMatchesContainer.innerHTML = "";
      upcomingData.forEach((match) => {
        const card = createUpcomingMatchCard(match);
        upcomingMatchesContainer.appendChild(card);
      });
    } catch (err) {
      console.error(err);
    }
  });
});
//checking for reward
const rewardBtn = document.getElementById("claim-reward");

rewardBtn.addEventListener("click", async () => {
  rewardBtn.disabled = true; // prevent multiple clicks
  try {
    const claimResponse = await fetch("/claimReward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const claimData = await claimResponse.json();
    if (claimResponse.ok && claimData.message === "reward claimed") {
      rewardBtn.classList.add("hidden");
    }
    console.log(claimData.message || claimData.msg);
  } catch (err) {
    console.error("Error claiming reward:", err);
  } finally {
    rewardBtn.disabled = false;
  }
});

const checkReward = async () => {
  try {
    const response = await fetch("/checkReward", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.message === true) {
      console.log("Daily reward available!");
      rewardBtn.classList.remove("hidden");
    }
  } catch (err) {
    console.error("Error checking reward:", err);
  }
};
checkReward();

/* 
<li class="text-dashboardfont font-sans text-sm h-12 w-full flex items-center gap-2 pl-4 cursor-pointer hover:bg-white/5 transition duration-200 hover:border-l-4 hover:border-font">
                        <img src="/icons/ball.svg" alt="ball">
                        <p>Serie A </p>
                    </li>
                    */
