const lamp = document.getElementById("lamp");
const cord = document.getElementById("cord");
const knob = document.getElementById("knob");
const login = document.getElementById("loginBox");
const username = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");



const strng = cord.querySelector(".string");

let pulling = false;
let startY = 0;
let isDragging = false;

function setOn(on) {
  if (on) {
    lamp.classList.remove("off");
    lamp.classList.add("on");
    login.classList.add("visible");
  } else {
    lamp.classList.remove("on");
    lamp.classList.add("off");
    login.classList.remove("visible");
  }
}

function toggleLamp() {
  const isOn = lamp.classList.contains("on");

  setOn(!isOn);
  if (!isOn) username.focus();
}
function startPull(y) {
  pulling = true;
  isDragging = false;
  startY = y;
  cord.classList.add("pulling");
}

function movePull(y) {
  if (!pulling) return;
  const delta = Math.max(0, y - startY);
  if (delta > 5) isDragging = true;
  const scale = 1 + (delta / 40);
  knob.style.transform = `translateY(${Math.min(delta, 34)}px)`;
  strng.style.transform = `scaleY(${scale})`;
  if (delta > 40) { pulling = false; finishPull(true); }
}

function finishPull(trigger) {
  pulling = false;
  cord.classList.remove("pulling");
  knob.style.transform = "";
  strng.style.transform = "";
  if (trigger) toggleLamp();
}

cord.addEventListener("mousedown", e => startPull(e.clientY));
window.addEventListener("mousemove", e => movePull(e.clientY));
window.addEventListener("mouseup", () => finishPull(false));
cord.addEventListener("touchstart", e => startPull(e.touches[0].clientY), { passive: true });
window.addEventListener("touchmove", e => movePull(e.touches[0].clientY), { passive: true });
window.addEventListener("touchend", () => finishPull(false));


setOn(false);

loginBtn.addEventListener("click", () => {
  const u = username.value.trim();
  const p = document.getElementById("password").value.trim();
  if (!u || !p) {
    login.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
      { duration: 200, iterations: 1 }
    );
  }
});
