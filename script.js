const songs = [
    "Aadat - From Kalyug - Atif Aslam.mp3",
    "Agar Tu Hota - Ankit Tiwari.mp3",
    "Baarish - Mohammed Irfan.mp3",
    "Be Intehaan - Atif Aslam.mp3",
    "Bhula Dena - Mustafa Zahid.mp3",
    "Bol Do Na Zara - Armaan Malik.mp3",
    "Chahun Main Ya Naa - Palak Muchhal.mp3",
    "Hasi - Male Version - Ami Mishra.mp3",
    "Hoshwalon Ko Khabar Kya - Jagjit Singh.mp3",
    "Humsafar (From Badrinath Ki Dulhania) - Akhil Sachdeva.mp3",
    "Jeena Jeena - Sachin-Jigar.mp3",
    "Kabhi Jo Baadal Barse - Arijit Singh.mp3",
    "Labon Ko - Pritam.mp3",
    "Maine Royaan (Lofi Remix) - Tanveer Evan.mp3",
    "Mujhe Peene Do 2.0 - Darshan Raval.mp3",
    "Such Keh Raha Hai - KK.mp3",
    "Tere Liye - Atif Aslam.mp3",
    "Tu Hai Ki Nahi - Ankit Tiwari.mp3",
    "Tu Jaane Na - Atif Aslam.mp3",
    "Tujhe Bhula Diya - Vishal-Shekhar.mp3",
    "Tum Hi Aana (From Marjaavaan) - Payal Dev.mp3",
    "Tum Hi Ho - Mithoon.mp3",
    "Woh Lamhe Woh Baatein - From Zeher - Atif Aslam.mp3",
    "Zara Sa - Pritam.mp3",
];

const audio = new Audio();
let currentSongIndex = 0;
let isShuffle = false;
let shuffledIndices = [];

const songTitle = document.querySelector('.song-title');
const thumbnailImg = document.getElementById('thumbnail');
const playBtn = document.querySelector('.play');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const timeline = document.querySelector('.timeline');
const volume = document.querySelector('.volume');
const songListContainer = document.querySelector('.song-list');
const searchtxt = document.getElementById('searchbox');

function loadSong(index) {
    const songFile = songs[index];
    const thumbnailSrc = `assets/thumbnails/${songFile.replace(".mp3", ".jpg")}`;

    audio.src = `assets/audio/${songFile}`;
    songTitle.textContent = songFile.replace(".mp3", "");
    thumbnailImg.src = thumbnailSrc;
    setFavicon(thumbnailSrc);
    document.title = songFile.replace('.mp3','');

    document.body.style.backgroundImage = "linear-gradient(45deg, #9dfcf7ff, #fda6c2ff)";
    timeline.value = 0;
    audio.load();
}

function setFavicon(iconURL) {
  let link = document.querySelector("link[rel~='icon']");
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  link.href = iconURL;
}

function playPause() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
}

function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸';
}

function nextSong() {
    if (isShuffle) {
        playRandomSong();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

function playRandomSong() {
    if (shuffledIndices.length === 0) {
        shuffledIndices = [...Array(songs.length).keys()].filter(i => i !== currentSongIndex);
        shuffleArray(shuffledIndices);
    }

    const nextIndex = shuffledIndices.shift();
    playSong(nextIndex);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTimeline() {
    timeline.value = (audio.currentTime / audio.duration) * 100 || 0;
}

function seekAudio() {
    audio.currentTime = (timeline.value / 100) * audio.duration;
}

function setVolume() {
    audio.volume = volume.value;
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    shuffleBtn.textContent = isShuffle ? '✧₊' : 'Off';

    if (isShuffle) {
        shuffledIndices = [...Array(songs.length).keys()].filter(i => i !== currentSongIndex);
        shuffleArray(shuffledIndices);
    } else {
        shuffledIndices = [];
    }
}

function populateSongList(list = songs) {
    songListContainer.innerHTML = '';
    list.forEach(song => {
        const div = document.createElement('div');
        div.classList.add('song-item');
        div.innerHTML = `
            <img src="assets/thumbnails/${song.replace('.mp3', '.jpg')}" alt="${song}" height="50">
            <span class="innertext">${song.replace('.mp3', '')}</span>
        `;
        div.addEventListener('click', () => playSong(songs.indexOf(song)));
        songListContainer.appendChild(div);
    });
}

searchtxt.addEventListener('input', function () {
    const query = searchtxt.value.trim().toLowerCase();

    const sorted = songs
        .filter(song => song.toLowerCase().includes(query))
        .sort((a, b) => a.toLowerCase().indexOf(query) - b.toLowerCase().indexOf(query));

    populateSongList(sorted);
});

playBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
shuffleBtn.addEventListener('click', toggleShuffle);
audio.addEventListener('timeupdate', updateTimeline);
audio.addEventListener('ended', nextSong);
timeline.addEventListener('input', seekAudio);
volume.addEventListener('input', setVolume);

populateSongList();
loadSong(currentSongIndex);
volume.value = audio.volume = 1;
timeline.value = 0;
shuffleBtn.textContent = 'Off';
