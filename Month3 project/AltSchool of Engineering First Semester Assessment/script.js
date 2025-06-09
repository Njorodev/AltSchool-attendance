let history = [];
let historyIndex = 0;
let historyMode = false;

// Keyboard input listener
document.addEventListener("keydown", function(event) {
    if (historyMode) {
        if (event.altKey && event.key === "+") {
            console.log("Alt + '+' pressed: Navigating to newer history");
            nextHistory();
        } else if (event.altKey && event.key === "-") {
            console.log("Alt + '-' pressed: Navigating to older history");
            prevHistory();
        }
    } else {
        if (/[\d\+\-\×\÷\^\.\%]/.test(event.key)) {
            console.log(`Key pressed: ${event.key}`);
            appendValue(event.key);
        } else if (event.key === "Backspace") {
            console.log("Backspace key pressed");
            deleteLast();
        } else if (event.key === "Enter") {
            console.log("Enter key pressed: Calculate triggered");
            calculate();
        }
    }
});

function appendValue(value) {
    const display = document.getElementById("display");
    console.log(`Appending value: ${value}`);
    
    if (value === "^") {
        display.value += "^";
    } else if (value === "×") {
        display.value += "×";
    } else if (value === "÷") {
        display.value += "÷";
    } else {
        display.value += value;
    }
}

function deleteLast() {
    if (historyMode) {
        console.log("Delete ignored: In history mode");
        return;
    }
    const display = document.getElementById("display");
    console.log(`Deleting last character from: ${display.value}`);
    display.value = display.value.slice(0, -1);
}

function clearDisplay() {
    if (historyMode) {
        console.log("Clear ignored: In history mode");
        return;
    }
    console.log("Clearing display");
    document.getElementById("display").value = "";
}

function calculate() {
    if (historyMode) {
        console.log("Calculate ignored: In history mode");
        return;
    }

    let expression = document.getElementById("display").value;
    let processedExpression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**")
        .replace(/(\d+)\s*\%\s*/g, "($1/100)");

    console.log(`Evaluating: ${expression} → ${processedExpression}`);

    try {
        let result = eval(processedExpression);
        history.unshift(expression + " = " + result);
        historyIndex = 0;
        document.getElementById("display").value = result;
        console.log(`Result: ${result} | Added to history`);
    } catch (error) {
        document.getElementById("display").value = "Error";
        console.error("Evaluation failed:", error);
    }
}

function toggleHistory() {
    historyMode = !historyMode;
    const display = document.getElementById("display");
    const historyDisplay = document.getElementById("history-display");

    if (historyMode) {
        console.log("History mode ON");
        display.style.display = "none";
        historyDisplay.style.display = "block";
        updateHistoryDisplay();
    } else {
        console.log("History mode OFF");
        display.style.display = "block";
        historyDisplay.style.display = "none";
    }
}

function updateHistoryDisplay() {
    const historyDisplay = document.getElementById("history-display");
    const message = history.length > 0 ? history[historyIndex] : "No history yet";
    console.log(`Displaying history[${historyIndex}]: ${message}`);
    historyDisplay.textContent = message;
}

function prevHistory() {
    if (historyMode && historyIndex < history.length - 1) {
        historyIndex++;
        console.log(`Navigated to older history: index ${historyIndex}`);
        updateHistoryDisplay();
    } else {
        console.log("No older history to show");
    }
}

function nextHistory() {
    if (historyMode && historyIndex > 0) {
        historyIndex--;
        console.log(`Navigated to newer history: index ${historyIndex}`);
        updateHistoryDisplay();
    } else {
        console.log("No newer history to show");
    }
}

function handlePlusMinus(operation) {
    if (historyMode) {
        if (operation === "-" && historyIndex < history.length - 1) {
            console.log("History: '-' pressed");
            prevHistory();
        } else if (operation === "+" && historyIndex > 0) {
            console.log("History: '+' pressed");
            nextHistory();
        } else {
            console.log("History navigation limit reached");
        }
    } else {
        console.log(`Handling normal operation: ${operation}`);
        appendValue(operation);
    }
}
