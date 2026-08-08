var r={$schema:"https://acode.app/schema/plugin/v0.1.0.json",id:"com.degrace.musicplay",name:"Music Player",main:"dist/main.js",version:"2.1.0",icon:"icon.png",minVersionCode:290,license:"MIT",repository:"https://github.com/Degrace15/music",price:0,keywords:["music","audio","player","mp3","coding","focus"],author:{name:"Hacker2.0",email:"kiminoudegrace64@gmail.com",github:"Degrace15"},description:"Play music and ambient sounds while coding in Acode.",files:["readme.md","CHANGELOG.md"]};var e=new Audio,c=class{constructor(){this.playlist=[],this.currentIndex=0,this.panel=null,this.minimized=!1}init(){let t=document.createElement("style");t.textContent=`

.music-player {

    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    padding: 15px;
    background: #0B1F3A;
    color: white;
    border-radius: 12px;
    z-index: 9999;
    font-family: sans-serif;
    box-shadow:0 0 15px rgba(0,0,0,.4);

}



.music-player.minimized {

    width:60px;
    height:60px;
    padding:10px;
    border-radius:50%;
    overflow:hidden;

}



.music-player.minimized .player-content {

    display:none;

}



.music-player h3 {

    text-align:center;
    margin:0;

}



.music-player button {

    padding:8px;
    margin:4px;
    border:none;
    border-radius:8px;

}



.controls {

    text-align:center;

}



#playlist {

    max-height:120px;
    overflow:auto;

}



#playlist li {

    cursor:pointer;
    padding:5px;

}



#volume,
#progress {

    width:100%;

}



.close-btn,
.min-btn {

    cursor:pointer;
    font-size:18px;

}


.header {

    display:flex;
    justify-content:space-between;

}


`,document.head.appendChild(t),this.createUI(),window.visualViewport?.addEventListener("resize",()=>{this.panel&&(this.panel.style.bottom=window.innerHeight-window.visualViewport.height+20+"px")})}createUI(){this.panel=document.createElement("div"),this.panel.className="music-player",this.panel.innerHTML=`

<div class="header">

<span class="min-btn">\u2796</span>

<span class="close-btn">\u2716</span>

</div>


<div class="player-content">


<h3>\u{1F3B5} Music Player</h3>


<p id="song-title">
No music selected
</p>



<input
type="file"
id="music-file"
accept="audio/*"
multiple>



<input
type="range"
id="progress"
min="0"
max="100"
value="0">



<div class="controls">


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
value="1">



<ul id="playlist"></ul>


</div>

`,document.body.appendChild(this.panel),this.panel.style.display="none",this.events()}events(){let t=this.panel.querySelector("#music-file"),i=this.panel.querySelector("#play"),l=this.panel.querySelector("#next"),n=this.panel.querySelector("#prev"),u=this.panel.querySelector("#volume"),o=this.panel.querySelector("#progress"),m=this.panel.querySelector(".close-btn"),h=this.panel.querySelector(".min-btn");m.onclick=()=>{this.panel.style.display="none"},h.onclick=()=>{this.minimized=!this.minimized,this.minimized?this.panel.classList.add("minimized"):this.panel.classList.remove("minimized")},t.onchange=a=>{let p=[...a.target.files];p.length&&(this.playlist=p,this.currentIndex=0,this.renderPlaylist(),this.loadSong())},i.onclick=()=>{e.src&&(e.paused?(e.play(),i.textContent="\u23F8\uFE0F"):(e.pause(),i.textContent="\u25B6\uFE0F"))},l.onclick=()=>{this.playlist.length&&(this.currentIndex++,this.currentIndex>=this.playlist.length&&(this.currentIndex=0),this.loadSong())},n.onclick=()=>{this.playlist.length&&(this.currentIndex--,this.currentIndex<0&&(this.currentIndex=this.playlist.length-1),this.loadSong())},u.oninput=a=>{e.volume=Number(a.target.value)},e.ontimeupdate=()=>{e.duration&&(o.value=e.currentTime/e.duration*100)},o.oninput=()=>{e.duration&&(e.currentTime=o.value/100*e.duration)},e.onended=()=>{this.playlist.length&&(this.currentIndex++,this.currentIndex>=this.playlist.length&&(this.currentIndex=0),this.loadSong())}}renderPlaylist(){let t=this.panel.querySelector("#playlist");t.innerHTML="",this.playlist.forEach((i,l)=>{let n=document.createElement("li");n.textContent="\u{1F3B5} "+i.name,n.onclick=()=>{this.currentIndex=l,this.loadSong()},t.appendChild(n)})}loadSong(){let t=this.playlist[this.currentIndex];if(!t)return;e.src=URL.createObjectURL(t),this.panel.querySelector("#song-title").textContent="\u{1F3B5} "+t.name;let i=this.panel.querySelector("#play");e.play(),i.textContent="\u23F8\uFE0F"}show(){this.panel&&(this.panel.style.display="block")}destroy(){e.pause(),e.src="",this.panel&&this.panel.remove()}},s;function g(){s=new c,s.init(),acode.require("commands").addCommand({name:"music-player",description:"Open Music Player",exec:()=>{s.show()}})}function x(){acode.require("commands").removeCommand("music-player"),s&&s.destroy()}acode.setPluginInit(r.id,g);acode.setPluginUnmount(r.id,x);
