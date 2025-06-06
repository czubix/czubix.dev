const aboutmeButton = document.getElementById("aboutme_button")
const linksButton = document.getElementById("links_button")
const femscriptButton = document.getElementById("femscript_button")
const linkList = document.getElementById("links")

function select(page) {
    aboutmeButton.setAttribute("enabled", page === "aboutme" ? "true" : "false")
    linksButton.setAttribute("enabled", page === "links" ? "true" : "false")
    femscriptButton.setAttribute("enabled", page === "femscript" ? "true" : "false")

    aboutme.style.display = page === "aboutme" ? "block" : "none"
    linkList.style.display = page === "links" ? "grid" : "none"
    femscript.style.display = page === "femscript" ? "block" : "none"

    if (page === "femscript") {
        femscript.style.visibility = "visible"
        femscript.style.position = "relative"
        editor.layout()
    }
}

function goTo(id) {
    linksButton.dispatchEvent(new Event("click"))
    document.getElementById(id).style.backgroundColor = "#202225"

    setTimeout(() => {
        document.getElementById(id).style.backgroundColor = "transparent"
    }, 300)
}

const links = {
    lastfm: "https://last.fm/user/czub1x",
    github: "https://github.com/czubix",
    poligonteam: "https://github.com/PoligonTeam",
    x: "https://x.com/@czubix6",
    discord_cwele: "https://discord.gg/v8aKGy4Pkz",
    fembot: "https://cenzura.poligon.lgbt",
    steam: "https://steamcommunity.com/id/czub1x",
    roblox: "https://www.roblox.com/users/2480082516/profile",
    anilist: "https://anilist.co/user/czubix"
}

for (let key in links) {
    document.getElementById(key).addEventListener("click", () => {
        open(links[key], "_blank").focus()
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("age").innerText = Math.floor((Date.now() - 1151798400000) / 1000 / 60 / 60 / 24 / 365)

    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const femscriptButton = document.getElementById("femscript_button")

    function handleBreakpointChange(e) {
        if (e.matches) {
            femscriptButton.style.display = "inline-block"
        } else {
            femscriptButton.style.display = "none"
            if (femscriptButton.getAttribute("enabled") === "true") {
                select("aboutme")
            }
        }
    }

    handleBreakpointChange(mediaQuery)

    mediaQuery.addEventListener("change", handleBreakpointChange)

    const username = document.querySelector(".username")
    const avatar = document.querySelector(".avatar > .avatar-container > img")
    const icon = document.querySelector(".status-icon > img")
    const discord_icon = document.querySelector("#discord_cwele > img")
    const server_name = document.querySelector("#discord_cwele > div")

    const now = Date.now()

    if (!localStorage.getItem("avatarUrl") || (parseInt(now - localStorage.getItem("lastFetch")) > 5 * 60 * 1000)) {
        const data = await (await fetch("https://discord.com/api/invites/v8aKGy4Pkz")).json()

        localStorage.setItem("username", data.inviter.username)
        localStorage.setItem("avatarUrl", "https://cdn.discordapp.com/avatars/" + data.inviter.id + "/" + data.inviter.avatar + ".png?size=1024")
        data.inviter.primary_guild && (
            localStorage.setItem("clanTag", data.inviter.primary_guild.tag),
            localStorage.setItem("clanIcon", `https://cdn.discordapp.com/clan-badges/${data.inviter.primary_guild.identity_guild_id}/${data.inviter.primary_guild.badge}.png?size=1024`)
        )
        data.inviter.avatar_decoration_data && localStorage.setItem("decorationUrl", "https://cdn.discordapp.com/avatar-decoration-presets/" + data.inviter.avatar_decoration_data.asset + ".png?size=1024&passthrough=true")

        localStorage.setItem("serverName", data.guild.name)
        localStorage.setItem("iconUrl", "https://cdn.discordapp.com/icons/" + data.guild.id + "/" + data.guild.icon + ".png")

        localStorage.setItem("lastFetch", now)
    }

    username.innerHTML = localStorage.getItem("username")
    avatar.src = localStorage.getItem("avatarUrl")

    const decorationUrl = localStorage.getItem("decorationUrl")
    const clanTag = localStorage.getItem("clanTag")

    if (decorationUrl) {
        const avatarContainer = document.querySelector(".avatar > .avatar-container")
        const avatarDecoration = document.createElement("img")
        avatarDecoration.src = decorationUrl
        avatarDecoration.className = "avatar-decoration"
        avatarDecoration.width = 240
        avatarDecoration.height = 240
        avatarDecoration.alt = "avatar decoration"
        avatarDecoration.ondragstart = () => false
        avatarDecoration.ondrop = () => false
        avatarContainer.appendChild(avatarDecoration)
    }

    if (clanTag) {
        const clanIcon = localStorage.getItem("clanIcon")
        const clanTagElement = document.getElementById("clanTag")
        clanTagElement.style.display = "inline-block"
        const clanIconElement = document.createElement("img")
        clanIconElement.src = clanIcon
        clanIconElement.style.verticalAlign = "middle"
        clanIconElement.style.width = "32px"
        clanIconElement.style.height = "32px"
        clanTagElement.appendChild(clanIconElement)
        clanTagElement.appendChild(document.createTextNode(" " + clanTag))
    }

    icon.src = localStorage.getItem("iconUrl")
    discord_icon.src = localStorage.getItem("iconUrl")
    server_name.innerText = localStorage.getItem("serverName")
})