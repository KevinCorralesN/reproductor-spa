const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlist = document.getElementById('playlist');

const fileInput = document.getElementById('fileInput');
let tracks = [];
let currentTrack = 0;

// Cuando el usuario selecciona archivos
fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files);
  playlist.innerHTML = "";
  tracks = files.map((file, index) => {
    const url = URL.createObjectURL(file);
    const li = document.createElement('li');
    li.textContent = file.name.replace(/\.[^/.]+$/, "");
    li.classList.add('track-item');
    li.addEventListener('click', () => playTrack(index));
    playlist.appendChild(li);
    return { file: url, name: file.name, element: li };
  });

  if (tracks.length > 0) playTrack(0);
});

let isShuffle = false;

tracks.forEach((track, index) => {
  const li = document.createElement('li');
  li.textContent = track.name;
  li.classList.add('track-item');
  playlist.appendChild(li);
  track.element = li;

  const tempAudio = new Audio(track.file);
  tempAudio.addEventListener('loadedmetadata', () => {
    track.duration = formatTime(tempAudio.duration);
    li.textContent = `${track.name} (${track.duration})`;
  });

  li.addEventListener('click', () => playTrack(index));
});

function formatFileName(file) {
  return file
    .replace(".mp3", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

function playTrack(index) {
  currentTrack = index;
  audio.src = tracks[index].file;
  audio.play();
  highlightCurrentTrack();

  const cover = document.getElementById('album-cover');
  const baseName = tracks[index].file.split('/').pop().replace('.mp3', '');
  const imagePath = `img/albums/${baseName}.png`;

  cover.src = imagePath;
  cover.onerror = () => {
    cover.src = 'img/albums/default.png';
  };
}

function highlightCurrentTrack() {
  tracks.forEach((track, i) => {
    track.element.classList.toggle('playing', i === currentTrack);
  });
}

playBtn.addEventListener('click', () => audio.play());
pauseBtn.addEventListener('click', () => audio.pause());

prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack(currentTrack);
});

nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentTrack = Math.floor(Math.random() * tracks.length);
  } else {
    currentTrack = (currentTrack + 1) % tracks.length;
  }
  playTrack(currentTrack);
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

audio.addEventListener('ended', () => {
  nextBtn.click();
});

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}