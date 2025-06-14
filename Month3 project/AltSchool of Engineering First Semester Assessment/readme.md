# Calculator Web App Using Javascript, CSS and HTML.

## Table of Contents
1. [Overview](#overview)
2. [UI Design](#ui-design)
   - [Color Scheme](#color-scheme)
3. [Functionalities](#functionalities)
   - [Right Panel (Input Parameters)](#right-panel-input-parameters)
   - [Left Panel (Operators & Extras)](#left-panel-operators--extras)
4. [Responsiveness](#responsiveness)
5. [Keyboard Support](#keyboard-support)
6. [Live Demo](#live-demo)
7. [Console Logging (For Debugging)](#console-logging-for-debugging)
 

## Overview
This calculator features **two screens**:
- **Input Screen** (default): Displays user-entered numbers and operations.
- **History Screen** (hidden by default): Shows previous calculations and can be toggled using the **History** button (`display: none;` by default).

The layout consists of **three grids**, divided into two main sections:
- **Right Section** (Number Input Grid)
- **Left Section** (Operators & Extras Grid)

## UI Design
### **Color Scheme**
- **Background Colors**
  - **Calculator body:** Deep shade of blue (`#3A3F77`)
  - **Input buttons:** Very dark grayish blue (`#404258`)
  - **Operator buttons:** Vivid orange (`#F49D1A`)
  - **Extras buttons (`C`, `⟲`, `=`):** Grey (`#B2B2B2`)
- **Hover Effects**
  - **Numbers & DEL:** Light grey (`#ccc`)
  - **Operators:** Warm shade of orange (`#E16A0F`)
  - **Extras:** Vibrant shade of green (`#76cc0d`)

## Functionalities
### **Right Panel (Input Parameters)**
- **Buttons:** `0-9`, `.`, `DEL`
- **DEL:(⌫)** Removes the last entered digit from the screen.

### **Left Panel (Operators & Extras)**
#### **Operators Grid**
- `×`: Multiplication (`*`)
- `÷`: Division (`/`)
- `-`: Subtraction
- `+`: Addition
- `%`: Percentage (`a% → a/100`)
- `^`: Power operation (`a^b → a**b`)

#### **Extras Grid**
- **C:** Clears the entire screen.
- **⟲ History Navigation**
  - **Navigation Options**:
    - `+` or `ALT +` (Linux): Navigate **next** (latest).
    - `-` or `ALT -` (Linux): Navigate **previous** (earliest).
  - Sequential navigation; skipping entries is **not** possible.
- **=**: Triggers evaluation and adds the calculation to history.

## Responsiveness
This calculator supports **all screen types**, including:
- **Large screens**
- **Tablets**
- **Phones**
- **Smartwatches**

## Keyboard Support
The calculator accepts **numeric (`0-9`) and operational inputs**, except `×` and `÷`, as their representations are unavailable on standard keyboards. Also **DEL(⌫)** can be achieved using backpase.

## Live Demo
Try out the calculator here: [Calculator Web App](https://njorodev.github.io/AltSchool-attendance/Month3%20project/AltSchool%20of%20Engineering%20First%20Semester%20Assessment/index.html)

## Console Logging (For Debugging)
If running the script locally, logs can be viewed in the console:
```plaintext
index.html:87 Live reload enabled.
script.js:31 Appending value: 1
script.js:31 Appending value: ×
script.js:31 Appending value: 3
script.js:76 Evaluating: 1×3 → 1*3
script.js:83 Result: 3 | Added to history
script.js:59 Clearing display
script.js:31 Appending value: 1
script.js:31 Appending value: 2
script.js:31 Appending value: 5
script.js:31 Appending value: %
script.js:31 Appending value: ×
script.js:31 Appending value: 5
script.js:31 Appending value: 6
script.js:76 Evaluating: 125%×56 → (125/100)*56
script.js:83 Result: 70 | Added to history
script.js:96 History mode ON
script.js:110 Displaying history[0]: 125%×56 = 70
script.js:143 History navigation limit reached
script.js:137 History: '-' pressed
script.js:117 Navigated to older history: index 1
script.js:110 Displaying history[1]: 1×3 = 3
script.js:143 History navigation limit reached
