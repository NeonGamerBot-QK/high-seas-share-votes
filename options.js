(async () => {
// Function to determine which storage API to use
const storage = typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined' 
    ? chrome.storage 
    : typeof browser !== 'undefined' && typeof browser.storage !== 'undefined'
    ? browser.storage
    : null;

if (!storage) {
  console.error("Neither Chrome nor Firefox storage APIs are available.");
}

// Elements
const anon = document.getElementById("anon");
const send_to_user = document.getElementById("sent_to_user");

// Event listeners for storing data
anon.addEventListener("change", (e) => {
  storage.sync.set({ anon: e.target.checked });
});
send_to_user.addEventListener("change", (e) => {
  storage.sync.set({ send_to_user: e.target.checked });
});

// Retrieve and set the values for the checkboxes
const loadStorageValues = async () => {
  try {
    const anonData = await storage.sync.get("anon");
    const sendToUserData = await storage.sync.get("send_to_user");

    anon.checked = anonData.anon || false;
    send_to_user.checked = sendToUserData.send_to_user || false;
  } catch (error) {
    console.error("Error loading values from storage:", error);
  }
};

// Load the stored values
loadStorageValues();

// Check if the user is authorized
const checkAuthStatus = async () => {
  try {
    const authData = await storage.sync.get("is_authed");
    if (!authData.is_authed) {
      const h1 = document.querySelector("h1");
      h1.innerText = `Authorize with slack to share your votes!`;

      const a = document.createElement("a");
      a.target = "_blank";
      a.href = "https://api.saahild.com/api/highseasships/slack/oauth";
      a.innerText = "Authorize, then ";

      const btn = document.createElement("button");
      btn.innerText = "click here once you have to get rid of this popup";
      btn.addEventListener("click", async () => {
        await storage.sync.set({ is_authed: true });
        document.querySelector("#noauth").remove();
      });

      const noAuthDiv = document.querySelector("#noauth");
      noAuthDiv.appendChild(h1);
      noAuthDiv.appendChild(a);
      noAuthDiv.appendChild(btn);
    }
  } catch (error) {
    console.error("Error checking authorization status:", error);
  }
};

// Check if the user is authorized
checkAuthStatus();
})();
