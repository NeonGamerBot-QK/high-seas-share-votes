let repo_url, demo_url, matchup_title, matchup_author;
let do_not_event_bother_running = false;

async function main() {
  if (do_not_event_bother_running) return;
  const textEl = document.querySelector("#voting-reason-container");
  if (!textEl) return;
  if (textEl.getAttribute("data-touched")) return;
  textEl.setAttribute("data-touched", true);
  let word = textEl.children[1].value;
  textEl.children[1].addEventListener("input", async (e) => {
    const value = e.target.value;
    word = value;
  });

  let button = document.querySelector("#submit-vote");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    // send a req to webhook.site for now cuz its dev
    // find the matchup thats being voted for??
    const matchupRepoUrl = repo_url;
    const matchupDemoUrl = demo_url;
    const anon =
      (await chrome.storage.sync.get("anon").then((d) => d.anon)) || false;
    const send_it_to_user =
      (await chrome.storage.sync
        .get("send_to_user")
        .then((d) => d.send_to_user)) || false;
    await fetch("https://api.saahild.com/api/highseasships/send_vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": JSON.parse(localStorage.getItem("cache.session")).value
          .slackId,
      },
      body: JSON.stringify({
        vote: word,
        send_it_to_user, // for now
        anon,
        repo: matchupRepoUrl,
        demo: matchupDemoUrl,
        title: matchup_title,
        author: matchup_author,
        mathchup_against: Array.from(
          document.querySelectorAll(
            `h2[class="font-heading text-2xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4`,
          ),
        ).find(
          (e) =>
            !e.innerText.toLowerCase().includes(matchup_title.toLowerCase()),
        ),
      }),
    });
    // will have to rebind somehow
    // future neon: wdym rebind
  });
}
setInterval(() => {
  if (window.location.pathname.includes("/wonderdome")) {
    Array.from(document.querySelectorAll("#vote-button"))
      .filter((d) => !d.getAttribute("data-touched"))
      .forEach((d) => {
        d.setAttribute("data-touched", true);
        d.addEventListener("click", async (e) => {
          repo_url =
            d.parentElement.parentElement.parentElement.querySelector(
              "#repository-link",
            ).href;
          demo_url =
            d.parentElement.parentElement.parentElement.querySelector(
              "#live-demo-link",
            ).href;
          matchup_title = d.parentElement.parentElement.parentElement
            .querySelector(
              `h2[class="font-heading text-2xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4`,
            )
            .innerText.replace(`\nThis is a project update`, ``)
            .trim();
          matchup_author = d.parentElement.parentElement.parentElement
            .querySelector(
              `span[class="inline-flex items-center gap-1 rounded-full px-2 border text-sm leading-none text-purple-600 bg-purple-50 border-purple-500/10 "`,
            )
            .parentElement.href.split("?channel=")[1];
          console.debug(`repo_url`, repo_url);
          console.debug(`demo_url`, demo_url);
        });
      });
    main();
  }
}, 500);
window.onload = async () => {
  const isAuthed = await chrome.storage.sync
    .get("is_authed")
    .then((d) => d.is_authed);
  if (!isAuthed) {
    alert(
      `You are not authed! please go to the options page for the chrome extension "High Seas Share Votes"`,
    );
    do_not_event_bother_running = true;
  }
};
