const LASTFM_API_KEY = "2c223bda2fe846bd5c24f9a5d2da834e"
const LASTFM_USERNAME = "czub1x"
const LASTFM_API_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

async function fetchLastFmTrack() {
    try {
        const response = await fetch(LASTFM_API_URL);
        const data = await response.json();

        if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
            const track = data.recenttracks.track[0];
            const isNowPlaying = track["@attr"] && track["@attr"].nowplaying;

            if (isNowPlaying) {
                const artist = track.artist["#text"] || track.artist;
                const trackName = track.name;
                const trackInfo = `${artist} - ${trackName}`;

                updateLastFmStatus(`Now playing: ${trackInfo}`);
            } else {
                const artist = track.artist["#text"] || track.artist;
                const trackName = track.name;
                const trackInfo = `${artist} - ${trackName}`;

                updateLastFmStatus(`Last played: ${trackInfo}`);
            }
        } else {
            updateLastFmStatus("Not playing anything");
        }
    } catch (error) {
        console.error("Error fetching Last.fm data:", error);
        updateLastFmStatus("Not playing anything");
    }
}

function updateLastFmStatus(status) {
    const trackElement = document.getElementById("lastfm-track");
    if (trackElement) {
        trackElement.textContent = status;
    }
}

function initLastFm() {
    fetchLastFmTrack();
    setInterval(fetchLastFmTrack, 5000);
}

document.addEventListener("DOMContentLoaded", initLastFm);