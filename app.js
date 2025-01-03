let currentsong = new Audio();
let songs = [];
let folder ="";
async function getSongs() {
  songs=[];
  let a = await fetch( `http://127.0.0.1:5500/songs/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a"); 
  const songslist = document.querySelector(".songslist ul");
  songslist.innerHTML="";
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

async function getalbums(){
  let albumresponse =await (await fetch("http://127.0.0.1:5500/songs/")).text();
  // console.log(albumresponse);
  let div = document.createElement("div");
  div.innerHTML = albumresponse;
  let as = div.getElementsByTagName("a"); 
  const albumlist = document.querySelector(".cardcontainer");
  let cardsHTML = '';
for (let index = 0; index < as.length; index++) {
  const element = as[index];
  
  if (element.href.startsWith("http://127.0.0.1:5500/songs/") && !element.href.endsWith(".mp3") ) {
    let name = element.querySelector(".name").innerHTML;
    cardsHTML += `
      <div class="cards">
        <div class="play">
          <img src="https://cdn-icons-png.flaticon.com/512/4211/4211344.png" alt="" />
        </div>
        <img src="https://i.scdn.co/image/ab67616d00001e02aad3f4b601ae8763b3fc4e88" alt="" />
        <h3>${name}</h3>
      </div>`;
      console.log(name);
    
  }
}
albumlist.innerHTML += cardsHTML;

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
  currentsong.src = `/songs/${folder}/` + track + ".mp3";
  currentsong.play();
  play.src = "icons/pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function listsongs() {
  songs = await getSongs(folder);
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

}
async function main() {
  await getalbums();
  await listsongs();

  let play = document.getElementById("play");
  let left = document.querySelector(".left");
  

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
    // console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentsong.currentTime
    )}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".searchbox").addEventListener("click", () => {
    document.querySelector(".search input").focus();
  });
  document.getElementById("hamburger").addEventListener("click", () => {
    left.style.left = 0;
  });
  document.getElementById("cross").addEventListener("click", () => {
    left.style.left = "-100%";
  });
  document.getElementById("prev").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);
    if (index > 0) {
      let prev = songs[index - 1].split("/").splice(-1);
      prev = prev[0].replaceAll("%20", " ");
      prev = prev.replace(".mp3", "");
      playmusic(prev);
    }
  });
  document.getElementById("next").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);
    if (index <songs.length -1) {
      let  next= songs[index + 1].split("/").splice(-1);
      next = next[0].replaceAll("%20", " ");
      next = next.replace(".mp3", "");
      playmusic(next);
    }
  });
  document.querySelector(".volumerange input").addEventListener("change",(e)=>{
    // console.log(e.target.value);
    currentsong.volume= parseInt(e.target.value)/100;
    let icon = document.querySelector(".volume>img");
    if(e.target.value==0){
      icon.src= "icons/mute.svg";
    }
    else if(e.target.value>60){
      icon.src ="icons/volume-high.svg";
    }
    else{
      icon.src="icons/volume.svg";
    }
  })
  Array.from(document.querySelectorAll(".cards .play")).forEach(element => {
    element.addEventListener("click",async ()=>{
      // console.log("clicked");
      folder = element.parentElement.querySelector("h3").innerHTML;
      // console.log(folder);
      await listsongs();
      let firstsong= songs[0].split("/").splice(-1)[0];
      firstsong = firstsong.replaceAll("%20"," ");
      firstsong = firstsong.replace(".mp3","");
      playmusic(firstsong);
    })
  });
}

main();
