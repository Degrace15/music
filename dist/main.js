var c={$schema:"https://acode.app/schema/plugin/v0.1.0.json",id:"com.degrace.musicplay",name:"Music Player",main:"dist/main.js",version:"2.1.1",icon:"icon.png",minVersionCode:290,license:"MIT",repository:"https://github.com/Degrace15/music.git",price:0,keywords:["music","audio","player","mp3","coding","focus"],author:{name:"Hacker2.0",email:"kiminoudegrace64@gmail.com",github:"Degrace15"},description:"Play music and ambient sounds while coding in Acode.",files:["readme.md","CHANGELOG.md"]};var t=new Audio,u=class{constructor(){this.playlist=[],this.currentIndex=0,this.panel=null,this.bubble=null,this.isOpen=!1}init(){let e=document.createElement("style");e.textContent=`

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

        `,document.head.appendChild(e),this.createBubble(),this.createUI(),this.setupViewport(),this.updateGreeting()}getGreeting(){let e=new Date().getHours();return e>=5&&e<12?"Good morning":e>=12&&e<18?"Good afternoon":e>=18&&e<22?"Good evening":"Good night"}createBubble(){this.bubble=document.createElement("div"),this.bubble.className="music-player-bubble",this.bubble.textContent="\u{1F3B5}",this.bubble.title="Music Player",document.body.appendChild(this.bubble),this.bubble.onclick=()=>{this.toggle()}}createUI(){this.panel=document.createElement("div"),this.panel.className="music-player hidden",this.panel.innerHTML=`

        <div class="music-player-header">

            <div class="music-player-title">
                \u{1F3B5} Music Player
            </div>

            <div
                class="music-player-close">
                \u2716
            </div>

        </div>


        <div
            id="music-greeting"
            class="music-player-greeting">
        </div>


        <div
            class="music-player-message">

            What music would you like
            to listen to? \u{1F3A7}

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
                \u23EE\uFE0F
            </button>

            <button id="play">
                \u25B6\uFE0F
            </button>

            <button id="next">
                \u23ED\uFE0F
            </button>

        </div>


        <label>
            \u{1F50A} Volume
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

                \u{1F3A7} Soft Sounds

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

                \u{1F3B5} Playlist

            </div>

            <div
                id="playlist"
                class="music-player-list">

            </div>

        </div>

        `,document.body.appendChild(this.panel),this.events()}events(){let e=this.panel.querySelector("#music-file"),i=this.panel.querySelector("#play"),l=this.panel.querySelector("#next"),s=this.panel.querySelector("#prev"),n=this.panel.querySelector("#volume"),a=this.panel.querySelector("#progress"),m=this.panel.querySelector(".music-player-close");m.onclick=()=>{this.close()},e.onchange=r=>{let d=[...r.target.files];d.length&&(this.playlist=d,this.currentIndex=0,this.renderPlaylist(),this.renderSoftSounds(),this.loadSong())},i.onclick=()=>{t.src&&(t.paused?t.play():t.pause())},l.onclick=()=>{this.next()},s.onclick=()=>{this.previous()},n.oninput=r=>{t.volume=Number(r.target.value)},t.ontimeupdate=()=>{t.duration&&(a.value=t.currentTime/t.duration*100)},a.oninput=()=>{t.duration&&(t.currentTime=Number(a.value)/100*t.duration)},t.onplay=()=>{i.textContent="\u23F8\uFE0F",this.bubble.classList.add("playing"),this.setStatus("Playing \u{1F3B5}")},t.onpause=()=>{i.textContent="\u25B6\uFE0F",this.bubble.classList.remove("playing"),this.setStatus("Paused")},t.onended=()=>{this.next()}}renderPlaylist(){let e=this.panel.querySelector("#playlist");if(e.innerHTML="",!this.playlist.length){e.textContent="No music loaded.";return}this.playlist.forEach((i,l)=>{let s=document.createElement("div");s.className="music-player-item",s.textContent="\u{1F3B5} "+i.name,s.onclick=()=>{this.currentIndex=l,this.loadSong()},e.appendChild(s)})}renderSoftSounds(){let e=this.panel.querySelector("#soft-sounds");e.innerHTML="";let i=["soft","calm","relax","relaxing","sleep","piano","lofi","lo-fi","ambient","nature","rain"],l=this.playlist.filter(s=>{let n=s.name.toLowerCase();return i.some(a=>n.includes(a))});if(!l.length){e.textContent="No soft sounds available.";return}l.forEach(s=>{let n=document.createElement("div");n.className="music-player-item",n.textContent="\u{1F3A7} "+s.name,n.onclick=()=>{this.currentIndex=this.playlist.indexOf(s),this.loadSong()},e.appendChild(n)})}loadSong(){let e=this.playlist[this.currentIndex];if(!e)return;t.src&&URL.revokeObjectURL(t.src),t.src=URL.createObjectURL(e);let i=this.panel.querySelector("#song-title");i.textContent="\u{1F3B5} "+e.name,t.play().catch(()=>{this.setStatus("Press \u25B6\uFE0F to start playback.")})}next(){this.playlist.length&&(this.currentIndex++,this.currentIndex>=this.playlist.length&&(this.currentIndex=0),this.loadSong())}previous(){this.playlist.length&&(this.currentIndex--,this.currentIndex<0&&(this.currentIndex=this.playlist.length-1),this.loadSong())}setStatus(e){let i=this.panel.querySelector("#music-status");i&&(i.textContent=e)}updateGreeting(){let e=this.panel.querySelector("#music-greeting");e&&(e.textContent=`${this.getGreeting()} \u{1F44B}
I'm Music Player \u{1F3B5}
What would you like to listen to?`)}open(){this.isOpen=!0,this.panel.classList.remove("hidden"),this.updateGreeting(),this.renderSoftSounds()}close(){this.isOpen=!1,this.panel.classList.add("hidden")}toggle(){this.isOpen?this.close():this.open()}show(){this.bubble&&(this.bubble.style.display="flex")}setupViewport(){window.visualViewport?.addEventListener("resize",()=>{if(!this.bubble)return;let e=window.innerHeight-window.visualViewport.height;this.bubble.style.bottom=25+e+"px",this.panel&&(this.panel.style.bottom=100+e+"px")})}destroy(){t.pause(),t.src&&URL.revokeObjectURL(t.src),t.src="",this.bubble&&(this.bubble.remove(),this.bubble=null),this.panel&&(this.panel.remove(),this.panel=null)}},o;function b(){o=new u,o.init(),acode.require("commands").addCommand({name:"music-player",description:"Open Music Player",exec:()=>{o.show(),o.open()}})}function y(){acode.require("commands").removeCommand("music-player"),o&&(o.destroy(),o=null)}acode.setPluginInit(c.id,b);acode.setPluginUnmount(c.id,y);
