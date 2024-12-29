let currentsong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  const songslist = document.querySelector(".songslist ul");
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
      let name = element.querySelector(".name").innerHTML;
      name = name.replace(".mp3", "");
      songslist.innerHTML =
        songslist.innerHTML +
        `
            <li>
                <img src="icons/music.svg" alt="">
                <div class="info">
                  <div class="songname">
                    ${name}
                  </div>
                  <div class="artist">
                    sonu nigam
                  </div>
                </div>
                <img src="icons/play.svg" class="playsong" alt="">
            </li>
        `;
      // console.log(name);
    }
  }

  // console.log(songs)
  return songs;
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60); // Calculate the number of minutes.
  const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds.

  // Ensure seconds are displayed as two digits (e.g., "01" instead of "1").
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

const playmusic = (track) => {
  currentsong.src = "/songs/" + track + ".mp3";
  currentsong.play();
  play.src = "icons/pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
async function main() {
  let songs = await getSongs();
  console.log(songs);

  Array.from(document.querySelectorAll(".songslist ul li")).forEach((e) => {
    e.querySelector(".playsong").addEventListener("click", () => {
      let name = e.querySelector(".songname");
      playmusic(name.innerHTML.trim()); // Assuming playmusic is a predefined function.

      // Reset styles for all list items.
      Array.from(document.querySelectorAll(".songslist ul li")).forEach((m) => {
        m.style.backgroundColor = "transparent";
        m.style.filter = "none";
      });

      // Apply styles to the clicked item.
      e.style.backgroundColor = "black"; // Highlight clicked item (example: yellow).
      e.style.filter = "invert(1)"; // Invert the clicked item.
    });
  });
  let play = document.getElementById("play");

  play.addEventListener("click", () => {
    if (!currentsong.src) {
      console.log("No song loaded.");
      return; // Exit if no song is loaded.
    }

    if (currentsong.paused) {
      currentsong.play();
      play.src = "icons/pause.svg";
    } else {
      currentsong.pause();
      play.src = "icons/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 +"%";
  });


  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent= (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent+"%";
    currentsong.currentTime = currentsong.duration * percent /100;
  })
}
main();
