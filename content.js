let repo_url, demo_url

async function main() {
    const textEl = document.querySelector("#voting-reason-container")
    if(!textEl) return;
    if(textEl.getAttribute("data-touched")) return;
    textEl.setAttribute("data-touched", true)
    let word = textEl.children[1].value
    textEl.children[1].addEventListener('input', async (e) => {
        console.debug(`word...`)
        const value = e.target.value
        word = value
    })

    let button = document.querySelector("#submit-vote")
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        console.debug(`button`)
        // send a req to webhook.site for now cuz its dev
       // find the matchup thats being voted for??
       const matchupRepoUrl =repo_url
        const matchupDemoUrl =  demo_url
        console.debug(`matchupRepoUrl`, matchupRepoUrl)
        console.debug(`matchupDemoUrl`, matchupDemoUrl)
       await fetch("https://api.saahild.com/api/highseasships/send_vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": JSON.parse(localStorage.getItem("cache.session")).value.slackId
            },
            body: JSON.stringify({
                
            vote: word,
            send_it_to_user: false, // for now
            anon: true, // for now
            repo: matchupRepoUrl,
            demo: matchupDemoUrl
            })
        })
        // will have to rebind somehow
    })
}
setInterval(() => {
if(window.location.pathname.includes("/wonderdome")) {
    Array.from(document.querySelectorAll("#vote-button")).filter(d=>!d.getAttribute("data-touched")).forEach(d => {
        d.setAttribute("data-touched", true)
        d.addEventListener('click', async (e) => {
            repo_url = d.parentElement.parentElement.parentElement.querySelector("#repository-link").href
            demo_url = d.parentElement.parentElement.parentElement.querySelector("#live-demo-link").href
            console.debug(`repo_url`, repo_url)
            console.debug(`demo_url`, demo_url)
        })
    })
    main()
    
} else {
}
}, 150)