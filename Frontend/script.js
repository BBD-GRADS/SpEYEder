document.addEventListener("DOMContentLoaded", async function () {
  //On website load check if the user is logged in to determine what screen to show
  let isUserLoggedIn = await checkIfLoggedIn();
  if (isUserLoggedIn) {
    showMainContent();
  } else {
    showLoginScreen();
  }

  //Create listeners for all the buttons
  document
    .getElementById("checkPwnedButton")
    .addEventListener("click", displayPwnedInfo);
  document.getElementById("logoutButton").addEventListener("click", logOut);
  document.getElementById("googleLoginButton").addEventListener("click", login);
});

//Performs the login
function login() {
  const backendUrl = "http://localhost:8080/auth/google";
  window.location.href = backendUrl;
}

//Makes API call to logout + show the login screen
async function logOut() {
  const apiUrl = "http://localhost:8080/auth/logout";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      showLoginScreen();
    }
  } catch (error) {
    console.error("Failed to fetch Pwned data:", error);
  }
}

//Calls the refresh endpoint to check if the user is logged in
async function checkIfLoggedIn() {
  const apiUrl = "http://localhost:8080/auth/refresh";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to fetch Pwned data:", error);
    return false;
  }
}

//Shows the login screen + hides the main content
function showLoginScreen() {
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("logoutButton").style.display = "none";
}

//Shows the main content and hides hte login screen
function showMainContent() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("mainContent").style.display = "flex";
  document.getElementById("logoutButton").style.display = "flex";
}

//Loads in the the PWNed information cards
function displayPwnedInfo() {
  const apiUrl = "http://localhost:8080/pwned/pwnedemail";

  fetch(apiUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach(renderPwnedCard);
      document.getElementById("checkPwnedButton").style.display = "none";
    })
    .catch((error) => console.error("Failed to fetch Pwned data:", error));
}

function renderPwnedCard(data) {
  const dataBreachCard = document.createElement("section");
  dataBreachCard.classList.add("dataBreachCard");

  const dataBreachCardText = document.createElement("section");
  dataBreachCardText.classList.add("dataBreachCardText");

  const dataClassesArray = Array.isArray(data.DataClasses)
    ? data.DataClasses
    : [data.DataClasses];

  const dataClassesHTML = dataClassesArray
    .map((dataClass) => `<h6> - ${dataClass}</h6>`)
    .join("");

  dataBreachCardText.innerHTML = `
  <div class="nameAndLogoContainer">
    <h4>${data.Name}</h4>
  </div>
  <h5>Breach Date:</h5>
  <h6>${data.BreachDate}</h6>
  <h5>What was leaked:</h5>
  ${dataClassesHTML}
`;

  const logoImage = document.createElement("img");
  logoImage.classList.add("dataBreachCardLogo");
  logoImage.src = data.LogoPath;
  logoImage.alt = "Company Logo";

  const nameAndLogoContainer = dataBreachCardText.querySelector(
    ".nameAndLogoContainer"
  );
  nameAndLogoContainer.appendChild(logoImage);

  dataBreachCard.appendChild(dataBreachCardText);

  document.getElementById("dataBreachContainer").appendChild(dataBreachCard);
}
