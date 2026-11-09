const gift = document.getElementById("gift");
const title = document.getElementById("title");
const intro = document.getElementById("intro");
const gallery = document.getElementById("gallery");

gift.addEventListener("click", () => {
  if (gift.classList.contains("open")) return;   // захист від повторного кліку
  for (let i = 0; i < 40; i++) spawnHeart(Math.random() * 1.2);
  gift.classList.add("open");
  title.textContent = "З днем народження, моє сонечко";
  title.classList.add("show");

  setTimeout(() => intro.classList.add("out"), 3000);   // згасання
  setTimeout(() => {                                    // зміна екранів
    intro.hidden = true;
    gallery.hidden = false;
    createCards();
    update();
  }, 3800);
});

const DATA = [
  { photo: "photos/1.jpg", caption: "Наш початок", text: "Чим більше часу ми разом, тим дужче я тебе люблю" },
  { photo: "photos/2.jpg", caption: "Ти і я",      text: "Ти моя радість і мій дім" },
  { photo: "photos/3.jpg", caption: "Мрії",        text: "Попереду ще стільки всього гарного" },
    { photo: "photos/3.jpg", caption: "фвфвфвв",        text: "фвфвц" }
];

const stage = document.getElementById("stage");
const cards = [];
let active = 0;

function createCards() {
  DATA.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="inner">
        <div class="face front"><img src="${c.photo}" alt=""><span>${c.caption}</span></div>
        <div class="face back">${c.text}</div>
      </div>`;
    el.addEventListener("click", () => onCardClick(i, el));
    stage.appendChild(el);
    cards.push(el);
  });
}

function update() {
  const n = cards.length;
  cards.forEach((el, i) => {
    let d = i - active;                 // відстань до активної картки
    if (d > n / 2)  d -= n;             // найкоротший шлях по колу
    if (d < -n / 2) d += n;
    const a = Math.abs(d);

    el.style.transform =
      `translate(-50%, -50%) translateX(${d * 58}%) translateZ(${-a * 140}px) rotateY(${-d * 32}deg)`;
    el.style.zIndex = 10 - a;
    el.style.opacity = a > 2 ? 0 : 1;
    el.style.pointerEvents = a > 2 ? "none" : "auto";
    if (d !== 0) el.classList.remove("flipped");   // неактивні картки повертаються лицем
  });
  document.getElementById("count").textContent = `${active + 1} / ${n}`;
}

function go(i) {
  active = (i + cards.length) % cards.length;   // коло: після останньої йде перша
  update();
}

document.getElementById("prev").addEventListener("click", () => go(active - 1));
document.getElementById("next").addEventListener("click", () => go(active + 1));

document.addEventListener("keydown", e => {
  if (gallery.hidden) return;
  if (e.key === "ArrowLeft")  go(active - 1);
  if (e.key === "ArrowRight") go(active + 1);
});

// свайп пальцем
let startX = null, swiped = false;
stage.addEventListener("pointerdown", e => { startX = e.clientX; swiped = false; });
stage.addEventListener("pointerup", e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 40) {
    swiped = true;
    go(active + (dx < 0 ? 1 : -1));
    setTimeout(() => (swiped = false), 0);   // щоб свайп не вважався кліком
  }
});

function onCardClick(i, el) {
  if (swiped) return;
  if (i === active) el.classList.toggle("flipped");   // активну перевертаємо
  else go(i);                                         // бічну виводимо в центр
}

const SYMBOLS = ["💖", "💗", "💕", "❤️"];

function spawnHeart(delay = 0) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  h.style.left = Math.random() * 100 + "%";
  h.style.fontSize = 12 + Math.random() * 20 + "px";
  h.style.setProperty("--r", (Math.random() * 360 - 180) + "deg");
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  h.style.animationDelay = delay + "s";
  h.addEventListener("animationend", () => h.remove());   // прибираємо, щоб не копичились
  document.getElementById("hearts").appendChild(h);
}

setInterval(() => spawnHeart(), 700);   // постійно по сердечку
