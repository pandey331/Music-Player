const prevButton=document.getElementById("prev")
const nextButton=document.getElementById("next")
const repeatButton=document.getElementById("repeat")
const shuffleButton=document.getElementById("shuffle")
const audio=document.getElementById("audio")
const songName=document.getElementById("song-name")
const songA=document.getElementById("song-a")
const songImg=document.getElementById("song-image")
const pauseButton=document.getElementById("pause")
const playButton=document.getElementById("play")
const playlistButton=document.getElementById("playlist")
const maxduration=document.getElementById("max-duration")
const currtime=document.getElementById("current-time")
const progressBar=document.getElementById("progress-bar")
const currprogress=document.getElementById("current-progress")
const playlistContainer=document.getElementById("playlist-container")
const closeButton=document.getElementById("close-button")
const playlistSongs=document.getElementById("playlist-song")
const input=document.getElementById('search-bar')

//index for songs
let index;
//start
//if loop is true means song will play line by line
let loop = true;
const songsList=[
    {
        name: "On & On",
        link: "./Data/on-on.mp3",
        artist: "Cartoon",
        image: "./Data/on-on.jpg"
    },
    {
        name: "Need You Now",
        link: "./Data/need-you-now.mp3",
        artist: "Venemy",
        image: "./Data/need-you-now.jpg"
    },
    {
        name: "Throne",
        link: "./Data/throne.mp3",
        artist: "Rival",
        image: "./Data/throne.jpg"
    },
    {
        name: "Where We Started",
        link: "./Data/where-we-started.mp3",
        artist: "Lost Sky",
        image: "./Data/where-we-started.jpg"
    },
    {
        name:"Faded",
        link:"./Data/Faded(PagalWorld.com.se).mp3",
        artist:"Alan Waker",
        image:"./Data/faded.jpg"
    },
    {
        name:"Bairiya",
        link:"./Data/Bairiya(PagalWorld.com.se).mp3",
        artist:"Arijit Singh",
        image:"./Data/bairiya.jpg"
    },
    {
        name:"Tere-Mere",
        link:"./Data/_Tere Mere(PagalWorld.com.se).mp3",
        artist:"Arijit Singh",
        image:"./Data/tere-mere.jpg"
    },
]
//event object
let events= {
    //if user uses desktop
    mouse:{
         click:"click",
    },
     //if user uses phone
    touch:{
         click:"touchstart",
    },
};
let devicetype='';
//detect device type
const isTouchDevice=()=>{
    try{
        document.createEvent("TouchEvent")
        devicetype='touch'
        return true
    }
    catch(e){
        devicetype='mouse'
        return false
    }
}
//format time ----------------------------------
const timeFormater=(time)=>{
    let m = Math.floor(time/60);
    m=m < 10 ?"0" + m : m
    let s = Math.floor(time%60);
    s= s < 10 ? '0' + s: s
    return `${m}:${s}`
}
// ----------------------------------------------------

//set song
const setsong=(i)=>{
    let{name,link,artist,image}=songsList[i];
    audio.src=link
    songName.innerHTML=name
    songA.innerHTML=artist
    songImg.src=image
    //load time stamp metadata
    audio.onloadedmetadata=()=>{
        maxduration.innerHTML=timeFormater(audio.duration);
    }
};
//play song
const playAudio=()=>{
    audio.play();
pauseButton.classList.remove('hide')
playButton.classList.add('hide')
};
//repeat button
repeatButton.addEventListener('click',()=>{
    if(repeatButton.classList.contains("active")){
        repeatButton.classList.remove("active");
        //song will play randomly not line by line
        audio.loop=false
    }
    else{
        repeatButton.classList.add("active")
        audio.loop=true
    }
});
//next song
const nextsong=()=>{
    //if loop is true then it continue in order 
    if(loop){
        if(index==songsList.length-1){
            index=0;
        }else{
            index +=1;
        }
        setsong(index);
        playAudio();
    }else{
        //else find a random index and play song
        let randIndex=Math.floor(Math.random() * songsList.length);
        setsong(randIndex);
        playAudio();
    }
}
//pause song 
const pauseAudio=()=>{
    audio.pause();
pauseButton.classList.add('hide')
playButton.classList.remove('hide')
}
//previous song
const previoussong=()=>{
    if(index>0)
    {
        pauseAudio();
        index-=1;
    }else{
        index=songsList.length-1;
    }
    setsong(index)
    playAudio();
}
//next song will play automatically when current song will end
audio.onended=()=>{
    nextsong();
}
//shuffle song
shuffleButton.addEventListener('click',()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop=true;
    }else{
        shuffleButton.classList.add('active')
        loop=false
    }
})
//play button
playButton.addEventListener('click',playAudio);
//next button
nextButton.addEventListener('click',nextsong);
//previous button
prevButton.addEventListener('click',previoussong);
//pause button
pauseButton.addEventListener('click',pauseAudio);

//if user click on progress bar..........................
isTouchDevice();
progressBar.addEventListener(events[devicetype].click,(event)=>{
    //start the progress bar
    let coordstart=progressBar.getBoundingClientRect().left;
    //mouse click position
    let coordEnd=!isTouchDevice()?event.clientX:event.touch[0].clientX;
    let progress=(coordEnd-coordstart)/progressBar.offsetWidth
    //set eidth to progress
    currprogress.style.width=progress *100 + "%";
    //set time
    audio.currentTime=progress* audio.duration;

    //play
    audio.play();
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

//update progress every sec
setInterval(()=>{
    currtime.innerHTML=timeFormater(audio.currentTime);
    currprogress.style.width=(audio.currentTime/audio.duration.toFixed(3))*100 + "%";
});

//update time
audio.addEventListener("timeupdate",()=>{
    currtime.innerHTML=timeFormater(audio.currentTime);
    
})
//.......................................................

//play song when  click on playlist
const playSongPlaylist=(i)=>{
    setsong(i);
    playlistContainer.classList.add('hide')
    playAudio();
    input.value=''
    initialPlaylist()
    
}
//create playlist
const initialPlaylist=()=>{
    for( let i in songsList){
        playlistSongs.innerHTML+= 
        `
        <li class='playlistSong' onclick='playSongPlaylist(${i})'>
        <div class ="playlist-image-container">
        <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">
        ${songsList[i].name}
        </span>
        <span id="playlist-song-a">
        ${songsList[i].artist}
        </span>
        </div>
        </li>
        `
       
    }
}
//display playlist
playlistButton.addEventListener("click",()=>{
    playlistContainer.classList.remove('hide')
});
//hide playlist
closeButton.addEventListener("click",()=>{
    playlistContainer. classList.add('hide')
})

window.onload=()=>{
    index =0;
    setsong(index);
    initialPlaylist();
}
///search bar

function search_song(){
    let i=input.value 
    i = i.toLowerCase();
    let x = document.getElementsByClassName('playlistSong');
for (j=0;j<x.length;j++)
{
    if(!x[j].innerHTML.toLowerCase().includes(i)){
        x[j].style.display="none";
    }
    else{
        x[j].style.display='lists';
    }
}
}