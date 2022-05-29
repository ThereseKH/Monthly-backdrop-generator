window.addEventListener("load", () => {
  // Website has loaded and will run the code inside this function

  // Dowload calendar on buttton click
  const downloadImageBtnRef = document.getElementById("download-image-btn");
  downloadImageBtnRef.addEventListener("click", downloadCalender);

  // Listen react on image/url change
  // TODO: Change src of "#background-image" on input change of "#background-url-inp"
  initializeImageListeners();

  // Listen react on selcted date or year
  initializeMonthAndYearListeners();

  // Populate font selector
  initializeFontSelector();

  // Render calendar based on today's date
  const today = new Date();
  renderCalendar(today);
});

let currentStep = 1;

function nextStep(incromentCount) {
  const steps = document.getElementsByClassName("wizard-step");
  currentStep += incromentCount;
  // Hide all steps
  for (const step of steps) {
    step.style.display = "none";
  }
  // Show current step
  steps[currentStep - 1].style.display = "block";
}

function initializeImageListeners() {
  const backgroundImageRef = document.getElementById("background-image");

  const imgUploadInpRef = document.getElementById("img-upload-inp");
  imgUploadInpRef.addEventListener("change", (inp) => {
    if (inp.target.files && inp.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        backgroundImageRef.src = e.target.result;
      };
      reader.readAsDataURL(inp.target.files[0]);
    }
  });
}

function initializeMonthAndYearListeners() {
  const yearSelectRef = document.getElementById("year-input");
  const monthSelectRef = document.getElementById("month-input");

  let selectedYear = (yearSelectRef.value = new Date().getFullYear());
  let selectedMonth = (monthSelectRef.value =
    monthNames[new Date().getMonth()]);

  yearSelectRef.addEventListener("input", (event) => {
    selectedYear = event.target.value;
    const selectedDate = new Date(
      `${selectedYear}/${
        monthNames.findIndex((month) => selectedMonth == month) + 1
      }/01`
    );
    renderCalendar(selectedDate);
  });

  monthSelectRef.addEventListener("change", (event) => {
    selectedMonth = event.target.value;
    const selectedDate = new Date(
      `${selectedYear}/${
        monthNames.findIndex((month) => selectedMonth == month) + 1
      }/01`
    );

    renderCalendar(selectedDate);
  });
}

function initializeFontSelector() {
  const fontStyleSelectorRef = document.getElementById("font-style-selector");
  fontStyleSelectorRef.innerHTML = "";

  fontOptions.forEach((font) => {
    const option = document.createElement("option");
    option.innerHTML = font;

    fontStyleSelectorRef.appendChild(option);
  });

  const monthNameRef = document.getElementById("month-name");
  fontStyleSelectorRef.addEventListener("change", (event) => {
    monthNameRef.style.fontFamily = event.target.value;
  });

  monthNameRef.style.fontFamily = monthNameRef.value = fontOptions[0];
}

/**
 * Renders calender over desired month based on argument
 * @param {Date} date
 */
function renderCalendar(date) {
  console.debug("Rendering calendar based on date:", date);
  const monthNameRef = document.getElementById("month-name");
  monthNameRef.innerHTML = getMonthNameFromDate(date);
  const weeksWithDates = generate2dArrayOfDays(date);
  console.debug(weeksWithDates);
  const tbodyRef = document.getElementById("table-body");
  tbodyRef.innerHTML = "";

  for (const week of weeksWithDates) {
    const tableRowString = getTableRow(week);
    tbodyRef.innerHTML += tableRowString;
  }
}

function downloadCalender() {
  // Use dom to image to convert preview to image
  console.debug("Start to download");
  document.documentElement.style.setProperty("--scale-factor", 2);
  domtoimage.toPng(document.getElementById("preview")).then(function () {
    // Call it twice to fix bug where image is black on ios
    domtoimage
      .toPng(document.getElementById("preview"), {
        quality: 1.0,
      })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "Your's truly backdrop";
        link.href = dataUrl;
        link.click();
        document.documentElement.style.setProperty("--scale-factor", 0.7);
      });
  });
}

/**
 * Generates a 2d array where week number is on idx 0, monday on 1 , tuesday on 2 etc.
 * @param {Date} date
 * @return {number[][]}
 */
function generate2dArrayOfDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDateOfMonth = new Date(year, month, 1);
  const firstWeekOfMonth = dayjs(firstDateOfMonth).isoWeek();

  // iterate over dates in month
  let currentDate = firstDateOfMonth;
  const dateArray = [];
  while (currentDate.getMonth() == month) {
    const week = dayjs(currentDate).isoWeek();
    const day = currentDate.getDay();
    const date = currentDate.getDate();

    // Edge case when current week is 52
    const weekIdx =
      week - firstWeekOfMonth < 0 ? week : week - firstWeekOfMonth;

    if (!dateArray[weekIdx]) {
      // list of dates in this week does not exist
      dateArray[weekIdx] = [null, null, null, null, null, null, null, null];
    }
    dateArray[weekIdx][0] = week;
    if (day === 0) {
      // It is sunday, place date at last index, week will start at monday
      dateArray[weekIdx][day + 7] = date;
    } else {
      dateArray[weekIdx][day] = date;
    }

    currentDate.setDate(date + 1);
  }

  return dateArray;
}

/**
 * Generate html table row from a list of numbers
 * @param {Number[]} numberArr list of numbers to add to tableRow `tr`
 * @returns {string} string representation of a table row where each el in numberArr is enclosed in a table cell `td`
 */
function getTableRow(numberArr) {
  // example numberArr = [44, 5, 6, 7, 8]

  let tableCellsString = "";
  for (const num of numberArr) {
    tableCellsString += `<td>${num === null ? "" : num}</td>`;
  }
  return `<tr>${tableCellsString}</tr>`;
}

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];
/**
 * @param {Date} date
 * @return {string}
 */
function getMonthNameFromDate(date) {
  const monthNum = date.getMonth();
  return monthNames[monthNum];
}

const fontOptions = [
  "Amatic SC",
  "Dancing Script",
  "Licorice",
  "Oooh Baby",
  "Roboto",
  "The Nautigal",
];
