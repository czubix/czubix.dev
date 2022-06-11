const aboutmeButton = document.getElementById("aboutme_button")
const linksButton = document.getElementById("links_button")
const aboutme = document.getElementById("aboutme")
const links = document.getElementById("links")

const youtube = document.getElementById("youtube")
const github = document.getElementById("github")
const discord = document.getElementById("discord")
const discordPoligon = document.getElementById("discord_poligon")
const cenzura = document.getElementById("cenzura")
const steam = document.getElementById("steam")
const roblox = document.getElementById("roblox")
const korrumzthegame = document.getElementById("korrumzthegame")
const onlyfans = document.getElementById("onlyfans")

aboutmeButton.addEventListener("click", () => {
    aboutmeButton.setAttribute("enabled", "true")
    linksButton.setAttribute("enabled", "false")

    aboutme.style.display = "block"
    links.style.display = "none"
})

linksButton.addEventListener("click", () => {
    links_button.setAttribute("enabled", "true")
    aboutme_button.setAttribute("enabled", "false")

    links.style.display = "block"
    aboutme.style.display = "none"
})

youtube.addEventListener("click", () => {
    open("https://www.youtube.com/channel/UCIINaeuHEOTmzEk0RvIprNQ", "_blank").focus()
})

github.addEventListener("click", () => {
    open("https://github.com/CZUBIX", "_blank").focus()
})

discord.addEventListener("click", () => {
    open("https://discord.com/users/636096693712060416", "_blank").focus()
})

discordPoligon.addEventListener("click", () => {
    open("https://discord.gg/DFyFhtESq9", "_blank").focus()
})

cenzura.addEventListener("click", () => {
    open("https://cenzurabot.com", "_blank").focus()
})

steam.addEventListener("click", () => {
    open("https://steamcommunity.com/id/czub1x", "_blank").focus()
})

roblox.addEventListener("click", () => {
    open("https://www.roblox.com/users/2480082516/profile", "_blank").focus()
})

korrumzthegame.addEventListener("click", () => {
    open("https://korrumzthegame.wtf", "_blank").focus()
})

onlyfans.addEventListener("click", () => {
    open("https://onlyfans.com/czubix", "_blank").focus()
})

function poligonFunc() {
    linksButton.dispatchEvent(new Event("click"))
    discordPoligon.style.backgroundColor = "#202225"

    setTimeout(() => {
        discordPoligon.style.backgroundColor = "transparent"
    }, 300)
}

function cenzuraFunc() {
    linksButton.dispatchEvent(new Event("click"))
    cenzura.style.backgroundColor = "#202225"

    setTimeout(() => {
        cenzura.style.backgroundColor = "transparent"
    }, 300)
}

function robloxFunc() {
    linksButton.dispatchEvent(new Event("click"))
    roblox.style.backgroundColor = "#202225"

    setTimeout(() => {
        roblox.style.backgroundColor = "transparent"
    }, 300)
}
