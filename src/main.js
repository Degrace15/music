// @ts-nocheck

import plugin from "../plugin.json";


const audio = new Audio();


class MusicPlayer {

    constructor() {

        this.playlist = [];
        this.currentIndex = 0;
        this.panel = null;
        this.minimized = false;

    }



    init() {


        const style = document.createElement("style");


        style.textContent = `

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


`;

        document.head.appendChild(style);



        this.createUI();



        window.visualViewport?.addEventListener(
            "resize",
            () => {

                if(this.panel){

                    this.panel.style.bottom =
                    (window.innerHeight -
                    window.visualViewport.height + 20)
                    + "px";

                }

            }
        );


    }
    createUI() {


        this.panel = document.createElement("div");

        this.panel.className = "music-player";


        this.panel.innerHTML = `

<div class="header">

<span class="min-btn">➖</span>

<span class="close-btn">✖</span>

</div>


<div class="player-content">


<h3>🎵 Music Player</h3>


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
value="1">



<ul id="playlist"></ul>


</div>

`;



        document.body.appendChild(this.panel);



        this.panel.style.display = "none";



        this.events();


    }




    events() {


        const fileInput =
        this.panel.querySelector("#music-file");


        const playBtn =
        this.panel.querySelector("#play");


        const nextBtn =
        this.panel.querySelector("#next");


        const prevBtn =
        this.panel.querySelector("#prev");


        const volume =
        this.panel.querySelector("#volume");


        const progress =
        this.panel.querySelector("#progress");


        const closeBtn =
        this.panel.querySelector(".close-btn");


        const minBtn =
        this.panel.querySelector(".min-btn");



        closeBtn.onclick = () => {


            this.panel.style.display =
            "none";


        };



        minBtn.onclick = () => {


            this.minimized =
            !this.minimized;



            if(this.minimized){

                this.panel.classList.add(
                    "minimized"
                );


            } else {


                this.panel.classList.remove(
                    "minimized"
                );


            }


        };



        fileInput.onchange = (e) => {


            const files =
            [...e.target.files];


            if(!files.length)
            return;



            this.playlist = files;


            this.currentIndex = 0;



            this.renderPlaylist();


            this.loadSong();



        };



        playBtn.onclick = () => {


            if(!audio.src)
            return;



            if(audio.paused){


                audio.play();


                playBtn.textContent =
                "⏸️";


            } else {


                audio.pause();


                playBtn.textContent =
                "▶️";


            }


        };
        nextBtn.onclick = () => {


            if(!this.playlist.length)
            return;



            this.currentIndex++;



            if(this.currentIndex >= this.playlist.length){

                this.currentIndex = 0;

            }



            this.loadSong();


        };




        prevBtn.onclick = () => {


            if(!this.playlist.length)
            return;



            this.currentIndex--;



            if(this.currentIndex < 0){

                this.currentIndex =
                this.playlist.length - 1;

            }



            this.loadSong();


        };




        volume.oninput = (e) => {


            audio.volume =
            Number(e.target.value);


        };




        audio.ontimeupdate = () => {


            if(!audio.duration)
            return;



            progress.value =
            (audio.currentTime /
            audio.duration) * 100;


        };




        progress.oninput = () => {


            if(!audio.duration)
            return;



            audio.currentTime =
            (progress.value / 100)
            * audio.duration;


        };




        audio.onended = () => {


            if(!this.playlist.length)
            return;



            this.currentIndex++;



            if(this.currentIndex >= this.playlist.length){

                this.currentIndex = 0;

            }



            this.loadSong();


        };


    }




    renderPlaylist() {


        const list =
        this.panel.querySelector(
            "#playlist"
        );


        list.innerHTML = "";



        this.playlist.forEach(
            (song,index)=>{


                const li =
                document.createElement("li");



                li.textContent =
                "🎵 " + song.name;



                li.onclick = () => {


                    this.currentIndex =
                    index;



                    this.loadSong();


                };



                list.appendChild(li);


            }
        );


    }
    loadSong() {


        const song =
        this.playlist[this.currentIndex];


        if(!song)
        return;



        audio.src =
        URL.createObjectURL(song);



        this.panel
        .querySelector("#song-title")
        .textContent =
        "🎵 " + song.name;



        const playBtn =
        this.panel.querySelector("#play");



        audio.play();


        playBtn.textContent =
        "⏸️";


    }




    show(){


        if(this.panel){


            this.panel.style.display =
            "block";


        }


    }




    destroy(){


        audio.pause();

        audio.src = "";



        if(this.panel){


            this.panel.remove();


        }


    }


}



let player;



function init(){


    player =
    new MusicPlayer();



    player.init();



    const commands =
    acode.require("commands");



    commands.addCommand({


        name:"music-player",


        description:"Open Music Player",



        exec:()=>{


            player.show();


        }


    });



}




function unmount(){


    const commands =
    acode.require("commands");



    commands.removeCommand(
        "music-player"
    );



    if(player){


        player.destroy();


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
