window.addEventListener("load", () => {
  // Website has loaded and will run the code inside this function

  const downloadImageBtnRef = document.getElementById("download-image-btn");
  downloadImageBtnRef.addEventListener("click", downloadCalender);

  // Render calendar, todo: move to function
  const today = new Date();

  const monthNameRef = document.getElementById("month-name");
  monthNameRef.innerHTML = getMonthNameFromDate(today);
  const weeksWithDates = generate2dArrayOfDays(today);

  const tbodyRef = document.getElementById("table-body");
  tbodyRef.innerHTML = "";

  for (const week of weeksWithDates) {
    const tableRowString = getTableRow(week);
    tbodyRef.innerHTML += tableRowString;
  }

  // TODO: Change src of "#background-image" on input change of "#background-url-inp"
  const backgroundUrlnpRef = document.getElementById("background-url-inp");
  const backgroundImageRef = document.getElementById("background-image");
  backgroundUrlnpRef.addEventListener("input", (e) => {
    const url = e.target.value;
    backgroundImageRef.src = url;
    console.debug("settingImageSourceTo");
  });

  const imgUploadInpRef = document.getElementById("img-upload-inp");
  console.dir(imgUploadInpRef);
  imgUploadInpRef.addEventListener("change", (inp) => {
    if (inp.target.files && inp.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        backgroundImageRef.src = e.target.result;
      };
      reader.readAsDataURL(inp.target.files[0]);
    }
  });
});

// TODO: Import font types
function downloadCalender() {
  // Use dom to image to convert preview to image
  console.debug("Start to download");
  domtoimage.toPng(document.getElementById("preview")).then(function (dataUrl) {
    domtoimage
      .toPng(document.getElementById("preview"), {
        quality: 1.0,
      })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "Your's truly backdrop.jpeg";
        link.href = dataUrl;
        link.click();
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

    if (!dateArray[week - firstWeekOfMonth]) {
      // list of dates in this week does not exist
      dateArray[week - firstWeekOfMonth] = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
    }
    dateArray[week - firstWeekOfMonth][0] = week;
    if (day === 0) {
      // It is sunday, place date at last index, week will start at monday
      dateArray[week - firstWeekOfMonth][day + 7] = date;
    } else {
      dateArray[week - firstWeekOfMonth][day] = date;
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

/**
 * @param {Date} date
 * @return {string}
 */
function getMonthNameFromDate(date) {
  const monthNum = date.getMonth();
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
  return monthNames[monthNum];
}
