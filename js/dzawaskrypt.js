const aboutmeButton = document.getElementById("aboutme_button")
const linksButton = document.getElementById("links_button")
const linkList = document.getElementById("links")

function select(page) {
    aboutmeButton.setAttribute("enabled", page === "aboutme" ? "true" : "false")
    linksButton.setAttribute("enabled", page === "links" ? "true" : "false")

    aboutme.style.display = page === "aboutme" ? "block" : "none"
    linkList.style.display = page === "links" ? "block" : "none"
}

function goTo(id) {
    linksButton.dispatchEvent(new Event("click"))
    document.getElementById(id).style.backgroundColor = "#202225"

    setTimeout(() => {
        document.getElementById(id).style.backgroundColor = "transparent"
    }, 300)
}

const links = {
    youtube: "https://www.youtube.com/channel/UCIINaeuHEOTmzEk0RvIprNQ",
    github: "https://github.com/CZUBIX",
    poligonteam: "https://github.com/PoligonTeam",
    discord: "https://discord.com/users/636096693712060416",
    discord_poligon: "https://discord.gg/DFyFhtESq9",
    fembot: "https://cenzura.poligon.lgbt",
    steam: "https://steamcommunity.com/id/czub1x",
    roblox: "https://www.roblox.com/users/2480082516/profile",
    korrumzthegame: "https://ktg.poligon.lgbt"
}

for (let key in links) {
    document.getElementById(key).addEventListener("click", () => {
        open(links[key], "_blank").focus()
    })
}
