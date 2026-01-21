const lamp = document.getElementById("lamp");
const cord = document.getElementById("cord");
const knob = document.getElementById("knob");
const loginBox = document.getElementById("loginBox");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegisterBtn = document.getElementById("showRegister");
const showLoginBtn = document.getElementById("showLogin");

const strng = cord.querySelector(".string");

let pulling = false;
let startY = 0;
let isDragging = false;

function setOn(on) {
  if (on) {
    lamp.classList.remove("off");
    lamp.classList.add("on");
    loginBox.classList.add("visible");
  } else {
    lamp.classList.remove("on");
    lamp.classList.add("off");
    loginBox.classList.remove("visible");
  }
}

function toggleLamp() {
  const isOn = lamp.classList.contains("on");
  setOn(!isOn);

  if (!isOn) {
    if (!registerForm.classList.contains("hidden")) {
      registerForm.querySelector("input[name='email']").focus();
    } else {
      loginForm.querySelector("input[name='username']").focus();
    }
  }
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


showRegisterBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

showLoginBtn.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  if (data.username && data.password) {
    console.log("Login Data:", data);
    alert("No account found");
  } else {
    shakeBox();
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(data.email)) {
    alert("Please enter a valid email address.");
    shakeBox();
    return;
  }

  if (data.password.length < 6) {
    alert("Password must be at least 6 characters.");
    shakeBox();
    return;
  }

  if (data.email && data.username && data.password) {
    console.log("Register Data:", data);
    alert("Registration Successful!");
    window.location.href = "index.html";
  } else {
    shakeBox();
  }
});

function shakeBox() {
  loginBox.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 200, iterations: 1 }
  );
}

setOn(false);
