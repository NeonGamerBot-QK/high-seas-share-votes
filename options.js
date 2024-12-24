(async () => {
  const anon = document.getElementById("anon");
  const send_to_user = document.getElementById("sent_to_user");
  anon.addEventListener("change", (e) => {
    // save via chrome
    chrome.storage.sync.set({ anon: e.target.checked });
  });
  send_to_user.addEventListener("change", (e) => {
    chrome.storage.sync.set({ send_to_user: e.target.checked });
  });
  console.log(await chrome.storage.sync.get("anon"));
  anon.checked =
    (await chrome.storage.sync.get("anon").then((d) => d.anon)) || false;
  send_to_user.checked =
    (await chrome.storage.sync
      .get("send_to_user")
      .then((d) => d.send_to_user)) || false;
  if (!(await chrome.storage.sync.get(`is_authed`).then((d) => d.is_authed))) {
    const h1 = document.querySelector("h1");
    h1.innerText = `Authorize with slack to share your votes!`;
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://api.saahild.com/api/highseasships/slack/oauth";
    a.innerText = "Authorize, then ";
    const btn = document.createElement("button");
    btn.innerText = "click here once you have to get rid of this popup";
    btn.addEventListener("click", async (e) => {
      chrome.storage.sync.set({ is_authed: true });
      document.querySelector("#noauth").remove();
    });

    document.querySelector("#noauth").appendChild(h1);
    document.querySelector("#noauth").appendChild(a);
    document.querySelector("#noauth").appendChild(btn);
  }
})();
