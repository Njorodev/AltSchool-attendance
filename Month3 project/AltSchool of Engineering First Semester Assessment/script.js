const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const equals = document.getElementById("equals");
const backspace = document.getElementById("backspace");

let expression = "";

function updateDisplay() {
  display.textContent = expression || "0";
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;

    if (val === "=") return;
    if (val === "←") return;

    if (val === "×") expression += "*";
    else if (val === "÷") expression += "/";
    else if (val === "^") expression += "**";
    else expression += val;

    updateDisplay();
  });
});

equals.addEventListener("click", () => {
  try {
    expression = eval(expression).toString();
  } catch {
    expression = "Error";
  }
  updateDisplay();
});

backspace.addEventListener("click", () => {
  expression = expression.slice(0, -1);
  updateDisplay();
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if ("0123456789.+-*/()%".includes(key)) {
    expression += key;
  } else if (key === "Enter") {
    try {
      expression = eval(expression).toString();
    } catch {
      expression = "Error";
    }
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
  } else if (key.toLowerCase() === "c") {
    expression = "";
  }

  updateDisplay();
});

updateDisplay();
