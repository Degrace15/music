// @ts-nocheck

import plugin from "../plugin.json";

const audio = new Audio();

class MusicPlayer {

    constructor() {
        this.playlist = [];
        this.currentIndex = 0;

        this.panel = null;
        this.bubble = null;

        this.isOpen = false;
    }

    init() {

        const style = document.createElement("style");

        style.textContent = `

        .music-player-bubble {

            position: fixed;

            right: 20px;
            bottom: 25px;

            width: 62px;
            height: 62px;

            border-radius: 50%;

            background: #0B1F3A;

            color: white;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 28px;

            z-index: 99999;

            box-shadow:
                0 5px 20px rgba(0,0,0,.45);

            cursor: pointer;

            user-select: none;

            transition:
                transform .2s,
                box-shadow .2s;

        }

        .music-player-bubble:active {
            transform: scale(.9);
        }

        .music-player-bubble.playing {
            animation: musicPulse 1.5s infinite;
        }

        @keyframes musicPulse {

            0% {
                box-shadow:
                    0 5px 20px rgba(0,0,0,.45);
            }

            50% {
                box-shadow:
                    0 5px 30px rgba(30,144,255,.8);
            }

            100% {
                box-shadow:
                    0 5px 20px rgba(0,0,0,.45);
            }

        }

        .music-player {

            position: fixed;

            right: 20px;
            bottom: 100px;

            width: 310px;

            max-width: calc(100vw - 40px);

            padding: 15px;

            background: #0B1F3A;

            color: white;

            border-radius: 18px;

            z-index: 99998;

            font-family: sans-serif;

            box-shadow:
                0 8px 30px rgba(0,0,0,.5);

        }

        .music-player.hidden {
            display: none;
        }

        .music-player-header {

            display: flex;

            justify-content: space-between;

            align-items: center;

            margin-bottom: 10px;

        }

        .music-player-title {

            font-size: 18px;

            font-weight: bold;

        }

        .music-player-close {

            cursor: pointer;

            font-size: 19px;

        }

        .music-player-greeting {

            font-size: 14px;

            line-height: 1.5;

            margin-bottom: 12px;

        }

        .music-player-message {

            background:
                rgba(255,255,255,.08);

            border-radius: 10px;

            padding: 9px;

            margin-bottom: 10px;

            font-size: 13px;

        }

        .music-player-file {

            width: 100%;

            box-sizing: border-box;

            margin-bottom: 10px;

        }

        .music-player-song {

            padding: 10px;

            background:
                rgba(255,255,255,.08);

            border-radius: 10px;

            margin-bottom: 10px;

        }

        .music-player-song-title {

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;

        }

        #progress,
        #volume {

            width: 100%;

        }

        .music-player-controls {

            display: flex;

            justify-content: center;

            gap: 8px;

            margin: 8px 0;

        }

        .music-player-controls button {

            border: none;

            border-radius: 9px;

            padding: 8px 12px;

            cursor: pointer;

        }

        .music-player-section {

            margin-top: 12px;

        }

        .music-player-section-title {

            font-weight: bold;

            margin-bottom: 7px;

        }

        .music-player-list {

            max-height: 110px;

            overflow-y: auto;

        }

        .music-player-item {

            padding: 7px;

            border-radius: 7px;

            cursor: pointer;

        }

        .music-player-item:hover {

            background:
                rgba(255,255,255,.1);

        }

        .music-player-soft {

            max-height: 100px;

            overflow-y: auto;

        }

        .music-player-status {

            font-size: 12px;

            opacity: .7;

            margin-top: 5px;

        }

        `;

        document.head.appendChild(style);

        this.createBubble();
        this.createUI();
        this.setupViewport();
        this.updateGreeting();

    }


    getGreeting() {

        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Good morning";
        }

        if (hour >= 12 && hour < 18) {
            return "Good afternoon";
        }

        if (hour >= 18 && hour < 22) {
            return "Good evening";
        }

        return "Good night";

    }


    createBubble() {

        this.bubble =
            document.createElement("div");

        this.bubble.className =
            "music-player-bubble";

        this.bubble.textContent = "🎵";

        this.bubble.title =
            "Music Player";

        document.body.appendChild(
            this.bubble
        );

        this.bubble.onclick = () => {
            this.toggle();
        };

    }


    createUI() {

        this.panel =
            document.createElement("div");

        this.panel.className =
            "music-player hidden";

        this.panel.innerHTML = `

        <div class="music-player-header">

            <div class="music-player-title">
                🎵 Music Player
            </div>

            <div
                class="music-player-close">
                ✖
            </div>

        </div>


        <div
            id="music-greeting"
            class="music-player-greeting">
        </div>


        <div
            class="music-player-message">

            What music would you like
            to listen to? 🎧

        </div>


        <input
            class="music-player-file"
            type="file"
            id="music-file"
            accept="audio/*"
            multiple
        >


        <div class="music-player-song">

            <div
                id="song-title"
                class="music-player-song-title">

                No music selected

            </div>

            <div
                id="music-status"
                class="music-player-status">

                Waiting...

            </div>

        </div>


        <input
            type="range"
            id="progress"
            min="0"
            max="100"
            value="0"
        >


        <div class="music-player-controls">

            <button id="prev">
                ⏮️
            </button>

            <button id="play">
                ▶️
            </button>

            <button id="next">
                ⏭️
            </button>

        </div>


        <label>
            🔊 Volume
        </label>


        <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value="1"
        >


        <div class="music-player-section">

            <div
                class="music-player-section-title">

                🎧 Soft Sounds

            </div>

            <div
                id="soft-sounds"
                class="music-player-soft">

                No soft sounds available.

            </div>

        </div>


        <div class="music-player-section">

            <div
                class="music-player-section-title">

                🎵 Playlist

            </div>

            <div
                id="playlist"
                class="music-player-list">

            </div>

        </div>

        `;

        document.body.appendChild(
            this.panel
        );

        this.events();

    }


    events() {

        const fileInput =
            this.panel.querySelector(
                "#music-file"
            );

        const playBtn =
            this.panel.querySelector(
                "#play"
            );

        const nextBtn =
            this.panel.querySelector(
                "#next"
            );

        const prevBtn =
            this.panel.querySelector(
                "#prev"
            );

        const volume =
            this.panel.querySelector(
                "#volume"
            );

        const progress =
            this.panel.querySelector(
                "#progress"
            );

        const closeBtn =
            this.panel.querySelector(
                ".music-player-close"
            );


        closeBtn.onclick = () => {
            this.close();
        };


        fileInput.onchange = (e) => {

            const files =
                [...e.target.files];

            if (!files.length)
                return;

            this.playlist = files;

            this.currentIndex = 0;

            this.renderPlaylist();
            this.renderSoftSounds();

            this.loadSong();

        };


        playBtn.onclick = () => {

            if (!audio.src)
                return;

            if (audio.paused) {

                audio.play();

            } else {

                audio.pause();

            }

        };


        nextBtn.onclick = () => {
            this.next();
        };


        prevBtn.onclick = () => {
            this.previous();
        };


        volume.oninput = (e) => {

            audio.volume =
                Number(e.target.value);

        };


        audio.ontimeupdate = () => {

            if (!audio.duration)
                return;

            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

        };


        progress.oninput = () => {

            if (!audio.duration)
                return;

            audio.currentTime =
                (
                    Number(progress.value) /
                    100
                ) * audio.duration;

        };


        audio.onplay = () => {

            playBtn.textContent =
                "⏸️";

            this.bubble.classList.add(
                "playing"
            );

            this.setStatus(
                "Playing 🎵"
            );

        };


        audio.onpause = () => {

            playBtn.textContent =
                "▶️";

            this.bubble.classList.remove(
                "playing"
            );

            this.setStatus(
                "Paused"
            );

        };


        audio.onended = () => {
            this.next();
        };

    }


    renderPlaylist() {

        const list =
            this.panel.querySelector(
                "#playlist"
            );

        list.innerHTML = "";


        if (!this.playlist.length) {

            list.textContent =
                "No music loaded.";

            return;

        }


        this.playlist.forEach(
            (song, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "music-player-item";

                item.textContent =
                    "🎵 " + song.name;


                item.onclick = () => {

                    this.currentIndex =
                        index;

                    this.loadSong();

                };


                list.appendChild(item);

            }
        );

    }


    renderSoftSounds() {

        const container =
            this.panel.querySelector(
                "#soft-sounds"
            );

        container.innerHTML = "";


        const keywords = [

            "soft",
            "calm",
            "relax",
            "relaxing",
            "sleep",
            "piano",
            "lofi",
            "lo-fi",
            "ambient",
            "nature",
            "rain"

        ];


        const softSounds =
            this.playlist.filter(
                song => {

                    const name =
                        song.name.toLowerCase();

                    return keywords.some(
                        keyword =>
                            name.includes(keyword)
                    );

                }
            );


        if (!softSounds.length) {

            container.textContent =
                "No soft sounds available.";

            return;

        }


        softSounds.forEach(
            song => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "music-player-item";

                item.textContent =
                    "🎧 " + song.name;


                item.onclick = () => {

                    this.currentIndex =
                        this.playlist.indexOf(
                            song
                        );

                    this.loadSong();

                };


                container.appendChild(
                    item
                );

            }
        );

    }


    loadSong() {

        const song =
            this.playlist[
                this.currentIndex
            ];

        if (!song)
            return;


        if (audio.src) {

            URL.revokeObjectURL(
                audio.src
            );

        }


        audio.src =
            URL.createObjectURL(song);


        const title =
            this.panel.querySelector(
                "#song-title"
            );

        title.textContent =
            "🎵 " + song.name;


        audio.play()
            .catch(() => {

                this.setStatus(
                    "Press ▶️ to start playback."
                );

            });

    }


    next() {

        if (!this.playlist.length)
            return;


        this.currentIndex++;


        if (
            this.currentIndex >=
            this.playlist.length
        ) {

            this.currentIndex = 0;

        }


        this.loadSong();

    }


    previous() {

        if (!this.playlist.length)
            return;


        this.currentIndex--;


        if (this.currentIndex < 0) {

            this.currentIndex =
                this.playlist.length - 1;

        }


        this.loadSong();

    }


    setStatus(text) {

        const status =
            this.panel.querySelector(
                "#music-status"
            );

        if (status) {
            status.textContent = text;
        }

    }


    updateGreeting() {

        const greeting =
            this.panel.querySelector(
                "#music-greeting"
            );

        if (!greeting)
            return;


        greeting.textContent =
            `${this.getGreeting()} 👋
I'm Music Player 🎵
What would you like to listen to?`;

    }


    open() {

        this.isOpen = true;

        this.panel.classList.remove(
            "hidden"
        );

        this.updateGreeting();
        this.renderSoftSounds();

    }


    close() {

        this.isOpen = false;

        this.panel.classList.add(
            "hidden"
        );

    }


    toggle() {

        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }

    }


    show() {

        if (this.bubble) {

            this.bubble.style.display =
                "flex";

        }

    }


    setupViewport() {

        window.visualViewport?.addEventListener(
            "resize",
            () => {

                if (!this.bubble)
                    return;


                const offset =
                    window.innerHeight -
                    window.visualViewport.height;


                this.bubble.style.bottom =
                    (25 + offset) + "px";


                if (this.panel) {

                    this.panel.style.bottom =
                        (100 + offset) + "px";

                }

            }
        );

    }


    destroy() {

        audio.pause();

        if (audio.src) {

            URL.revokeObjectURL(
                audio.src
            );

        }

        audio.src = "";


        if (this.bubble) {

            this.bubble.remove();

            this.bubble = null;

        }


        if (this.panel) {

            this.panel.remove();

            this.panel = null;

        }

    }

}


let player;


function init() {

    player =
        new MusicPlayer();

    player.init();


    const commands =
        acode.require("commands");


    commands.addCommand({

        name: "music-player",

        description:
            "Open Music Player",

        exec: () => {

            player.show();
            player.open();

        }

    });

}


function unmount() {

    const commands =
        acode.require("commands");


    commands.removeCommand(
        "music-player"
    );


    if (player) {

        player.destroy();

        player = null;

    }

}


acode.setPluginInit(
    plugin.id,
    init
);


acode.setPluginUnmount(
    plugin.id,
    unmount
);
