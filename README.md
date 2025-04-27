# NavigatorTests 📝

Welcome to the **NavigatorTests** repository! 🚀  
This project contains **automated Playwright smoke tests** for validating key functionalities of [Navigator.ba](https://www.navigator.ba/).

## Project Structure

```
NavigatorTests/
│
├── navigator-smoke.spec.js            # Main Playwright test file
├── README.md                          # Project documentation
└── package.json                       # Node.js dependencies and scripts
└── Navigator_App_Testing_Plan.pdf     # Test case documentation (smoke tests, positive/negative tests, bugs)
```

---

## Prerequisites

Before running the tests, make sure you have the following installed:

- **Visual Studio Code** (Recommended editor)  
  ➔ [Download VS Code](https://code.visualstudio.com/)

- **Node.js**  
  ➔ [Download Node.js](https://nodejs.org/)

- **npm** (Node package manager)  
  (Comes automatically with Node.js)

- **Playwright** installed in the project.

You can check if Node.js and npm are installed:

```bash
node -v
npm -v
```

---

## Setup Instructions

### 1. Clone the Repository using VS Code Terminal

- Open **VS Code**.
- Open a **terminal** in VS Code (`Ctrl + ~`).
- Navigate to the folder where you want to clone the project.
- Clone the repository with:

```bash
git clone https://github.com/acato2/NavigatorTests.git
```

- Navigate to the cloned directory:

```bash
cd NavigatorTests
```

- After cloning, you can open the project in VS Code by running:

```bash
code .
```

---

### 2. Install Dependencies

Once inside the project folder in VS Code:

- Open a terminal (`Ctrl + ~`).
- Run:

```bash
npm install -D @playwright/test
```

Install required browsers (only needed once):

```bash
npx playwright install
```

---

## Running Tests

### Run All Tests (Headless mode)

```bash
npx playwright test
```

### Run Specific Test File (Headless mode)

```bash
npx playwright test navigator-smoke.spec.js
```

### Run Tests with Browser Window (Headed mode)

```bash
npx playwright test navigator-smoke.spec.js --headed
```

---


## About the Tests

The smoke tests currently cover:

- Homepage loading
- Map rendering and interaction (zoom, drag)
- Geolocation testing
- Search functionality
- Filtering by category
- Place details view
- Creating new places
- Language switching
- Mobile responsiveness
- Browser compatibility

## Additional Documentation

In addition to the automated tests, you can find detailed documentation regarding the **test cases, smoke tests, positive/negative test cases, and reported bugs** in the file:

*   **[Navigator_App_Testing_Plan.pdf](Navigator_App_Testing_Plan.pdf)**

This PDF contains:

*   **Test Cases** for key functionalities of the Navigator app.
*   **Smoke Tests** that cover the most critical user interactions.
*   **Positive and Negative Test Cases** 
*   **Reported Bugs** with detailed steps to reproduce.

