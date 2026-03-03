document.addEventListener("DOMContentLoaded", () => {

  // ===== PLAYER =====
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");

 playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

  audio.addEventListener("loadedmetadata", () => {
    progress.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    progress.style.background = `linear-gradient(to right, white ${(audio.currentTime / audio.duration) * 100}%, #555 ${(audio.currentTime / audio.duration) * 100}%)`;
    progress.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
  });

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  // ===== CAROUSEL =====
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let index = 0;

  function updateCarousel() {
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;

    document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
    document.querySelectorAll(".dot")[index].classList.add("active");
  }

  // Criar dots automaticamente
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Autoplay
  setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4000);

  // Swipe
  let startX = 0;

  slidesContainer.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slidesContainer.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) {
      index = (index + 1) % slides.length;
    } else if (diff < -50) {
      index = (index - 1 + slides.length) % slides.length;
    }

    updateCarousel();
  });

});
