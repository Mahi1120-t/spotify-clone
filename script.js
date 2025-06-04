
console.log("Let's play song");

const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const audio = new Audio('songs/Ilahi.mp3'); // Replace with your song path
let isPlaying = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = '❚❚';
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶';
}

playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

progress.addEventListener('input', () => {
  const { duration } = audio;
  audio.currentTime = (progress.value / 100) * duration;
});

// Implement next and previous functionality as needed
prevBtn.addEventListener('click', () => {
  // Add logic for previous song
});

nextBtn.addEventListener('click', () => {
  // Add logic for next song
});

async function getSongs() {
  // 1. Fetch directory listing
  const res = await fetch("http://127.0.0.1:5500/songs/");
  const html = await res.text();

  // 2. Parse links out of the listing
  const div = document.createElement("div");
  div.innerHTML = html;

  const links = div.getElementsByTagName("a");
  const songs = [];

  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute("href");
    if (href && href.endsWith(".mp3")) {
      // Prefix path if needed – adjust to match your directory structure
      songs.push(href);
    }
  }
  return songs;
}

async function main() {
  const songs = await getSongs();
  console.log("Found songs:", songs);

  if (!songs.length) {
    console.error("No .mp3 files found in /songs/");
    return;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = new Audio();
  let currentSongIndex = 0;
  const songCards = document.querySelectorAll('.card');
  const playButton = document.getElementById('play');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const progressBar = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');

  const songs = Array.from(songCards).map(card => card.getAttribute('data-song'));

  function loadSong(index) {
    if (index < 0 || index >= songs.length) return;
    audioPlayer.src = songs[index];
    audioPlayer.load();
    audioPlayer.play();
    updatePlayButton();
  }

  function updatePlayButton() {
    playButton.innerHTML = audioPlayer.paused ? '&#9654;' : '&#10074;&#10074;';
  }

  songCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
    });
  });

  playButton.addEventListener('click', () => {
    if (audioPlayer.src) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
      updatePlayButton();
    }
  });

  prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
  });

  nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = progressPercent;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      durationEl.textContent = formatTime(audioPlayer.duration);
    }
  });

  progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
      const seekTime = (progressBar.value / 100) * audioPlayer.duration;
      audioPlayer.currentTime = seekTime;
    }
  });

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
});
main();

