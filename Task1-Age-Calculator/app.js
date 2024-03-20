// Selecting Elements
const dayIn = document.getElementById("dayIn");
const monthIn = document.getElementById("monthIn");
const yearIn = document.getElementById("yearIn");
const calculateBtn = document.getElementById("calculateBtn");

// Validation functions for each input
const validators = {
  dayIn: validDay,
  monthIn: validMonth,
  yearIn: validYear,
};

// Calculate Button
calculateBtn.addEventListener("click", validateAndCalculate);

// Function to reset error styles
function resetError(inputId) {
  const inputElement = document.getElementById(inputId);
  const errorMessageElement = inputElement.nextElementSibling;
  errorMessageElement.textContent = "";
  errorMessageElement.style.color = "var(--Off-black)";
  inputElement.style.border = "1px solid var(--Light-grey)";
}

// Validation function for day
function validDay(input) {
  return validateInput(
    input,
    1,
    getMonthDays(parseInt(monthIn.value), parseInt(yearIn.value)),
    "Must be a valid day"
  );
}

// Validation function for month
function validMonth(input) {
  return validateInput(input, 1, 12, "Must be a valid month");
}

// Validation function for year
function validYear(input) {
  return validateInput(
    input,
    1900,
    new Date().getFullYear(),
    "Must be in the past"
  );
}

// Display error message and style
function displayError(inputId, errorMessage) {
  const inputElement = document.getElementById(inputId);
  const errorMessageElement = inputElement.nextElementSibling;
  errorMessageElement.textContent = errorMessage;
  errorMessageElement.style.color = "var(--Light-red)";
  inputElement.style.border = "1px solid var(--Light-red)";
}

// Validate input and display error if not valid
function validateInput(input, min, max, errorMessage) {
  const value = parseInt(input.value);
  if (value < min || value > max) {
    displayError(input.id, errorMessage);
    return false;
  }
  return true;
}

// Determines the number of days in a given month and year
function getMonthDays(month, year) {
  if (month === 2) {
    return daysInFebruary(year);
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return 31;
  }
}

// Determines the number of days in February based on leap year rules
function daysInFebruary(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
}

// Validates inputs and calculates age if valid
function validateAndCalculate() {
  // Clear previous error messages and styles
  const errorMessages = document.querySelectorAll(".error");
  errorMessages.forEach((message) => {
    message.textContent = "";
    message.style.color = "var(--Off-black)";
  });

  // Reset error styles
  Object.keys(validators).forEach(resetError);

  let isValid = true;

  // Check if inputs are empty and validate them
  Object.entries(validators).forEach(([inputId, validator]) => {
    const input = document.getElementById(inputId);
    if (!input.value.trim()) {
      displayError(inputId, "This field is required");
      isValid = false;
    } else if (!validator(input)) {
      isValid = false;
    }
  });

  // If all inputs are valid, calculate the age
  if (isValid) {
    const bDay = parseInt(dayIn.value);
    const bMonth = parseInt(monthIn.value);
    const bYear = parseInt(yearIn.value);
    checkAge(bDay, bMonth, bYear);
  }
}

// Calculates the difference in years, months, and days between two dates
function checkAge(bDay, bMonth, bYear) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  let years = currentYear - bYear;
  let months = currentMonth - bMonth;
  let days = currentDay - bDay;

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const daysInPreviousMonth = getMonthDays(
      currentMonth - 1 === 0 ? 12 : currentMonth - 1,
      currentYear
    );
    days += daysInPreviousMonth;
    months--;
  }

  document.getElementById("yearOut").textContent = years;
  document.getElementById("monthOut").textContent = months;
  document.getElementById("dayOut").textContent = days;
}
