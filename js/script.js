// console.log("hiii");
let currentsong = new Audio()
let songs;
let n= 0
let currfolder;
let folder;

function sectomin(seconds) {
     var minutes = Math.floor(seconds / 60);
     var remainingSeconds = seconds % 60;
     return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + Math.floor(remainingSeconds);
     
 }


async function getsongs(folder){
     currfolder =folder
let a = await fetch(`http://127.0.0.1:5501/${folder}/`) 
     let response = await a.text();
     // console.log(response)
     let div = document.createElement("div")
     div.innerHTML = response;
     // console.log(div)
     let as = div.getElementsByTagName("a")
     // console.log(as)
     songs = []
     for (let index = 0; index < as.length; index++) {
          const element = as[index];
          if (element.href.endsWith(".mp3")) {
              let b = element.href.split(`/${folder}/`)[1]
              songs.push(b.split(".mp3")[0])
               
          }
          
          
     }
     // show all the songs in the playlist





     // console.log(songs)
       let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
       songul.innerHTML = ""
     //   console.log(songul);
       
       for (const song of songs) {
          //   console.log(song)
            songul.innerHTML = songul.innerHTML + `<li>
            <img width="22px" class="invert songmusic" src="assets/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20"," ")}</div>
                <div>Suraj</div>
            </div>
            <img src="assets/play.svg"" width="22px" class="invert songplay" alt="">
        </li>`
       }
  
       // attach an event listener to each song
  
       Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e)=>{
          //   console.log(e)
            e.addEventListener("click",element=>{
               //   console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
                 playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
            
          //  console.log( songs.length) 
          
            





           
       })
       
       
     



     
}
const playmusic = (track, pause=false)=>{
     // let audio = new Audio("/songs/arijit/" + track+".mp3")
     currentsong.src = `/${currfolder}/`+track+".mp3"
     if(!pause){

          currentsong.play()
          play.src = "assets/pause.svg"
     }
     // console.log(currentsong.src)
     document.querySelector(".songinfo").innerHTML = decodeURI(track)
     // console.log(decodeURI(track))
     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
     
     
     
}
async function displayalbums(){
     let a = await fetch(`http://127.0.0.1:5501/songs/`)
     let response = await a.text();
     // console.log(response)
     let div = document.createElement("div")
     div.innerHTML = response;
     let anchor = div.getElementsByTagName("a")
     let cardcontainer = document.querySelector(".cardcontainer")
    let array =  Array.from(anchor)
          for (let index = 0; index < array.length; index++) {
               const e = array[index];
               
         
          // console.log(e.href)
          if(e.href.includes("/songs/")){
             let folder =   e.href.split("/").slice(4)[0]

             //get meta data of the folder
             let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
                let response = await a.json();
               //  console.log(response)
                cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}"  class="card ">
                <div class="artist">

                        <img src="/songs/${folder}/cover.jpg"  alt="">
                        <div class="play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></div>
                    </div>
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`
          }
     }
     // console.log(folder)
     // console.log(anchor)


     // load the playlist when card is click 

Array.from(document.getElementsByClassName("card")).forEach(e => {
     // console.log(e)
     e.addEventListener("click", async item=>{
          // console.log(item,item.currentTarget.dataset.folder.songs)
          songss =await getsongs(`songs/${item.currentTarget.dataset.folder}`);
          console.log(songs)
     })
});


}
async function main(){
     await getsongs("songs/arijit");
     playmusic(songs[0],true)
     // console.log(songs)

// display all the albums on the page 
   
displayalbums()

// add event listener to next play and prev button 

play.addEventListener("click", ()=>{
     if(currentsong.paused){
          currentsong.play()
          play.src = "assets/pause.svg"
     }
     else
     {
          currentsong.pause()
          play.src = "assets/play.svg"
     }
})

// listen for timeupdate event
currentsong.addEventListener("timeupdate",()=>{

     // console.log(currentsong.currentTime, currentsong.duration)
     document.querySelector(".songtime").innerHTML = `${sectomin(currentsong.currentTime)} / ${sectomin(currentsong.duration)}`
     document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
})

// add event listener to seek bar 

document.querySelector(".seekbar").addEventListener("click",e=>{
     let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
     document.querySelector(".circle").style.left = percent +"%"
     currentsong.currentTime = ((currentsong.duration)*percent)/100 
})

// add a event listener to menu 

document.querySelector(".menu").addEventListener("click",()=>{
     document.querySelector(".left").style.left = "0"
})

document.querySelector(".close").addEventListener("click",()=>{
     document.querySelector(".left").style.left = "-100%"
})


 







// add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     // console.log( e.target.value)
     currentsong.volume = parseInt(e.target.value)/100

})

//add event listener to mute
document.querySelector(".volume>img").addEventListener("click",e=>{
     // console.log(e.target.src)
     if(e.target.src.includes("assets/volume.svg")){
       e.target.src = e.target.src.replace("assets/volume.svg","assets/mute.svg") 
          currentsong.volume = 0;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 0
     }
     else
     {
        e.target.src = e.target.src.replace("assets/mute.svg","assets/volume.svg") 
          currentsong.volume = 0.1;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 10
     }
})
// console.log(songs.);


function changemusic() {
     playmusic(songs[n])
     
}
// console.log(songs)
// console.log(currentsong)

previous.addEventListener("click",()=>{
     // console.log("pre")
     console.log(currentsong.src)

     
     if (n>0) {
          n--
     }
     else{
          n = songs.length-1
     }
     changemusic()
})



// add a event listener to  next 
next.addEventListener("click",()=>{
     // console.log("next")
     // console.log(currentsong.src.split("/")[5].split(".mp3")[0])
     console.log(songs)
     // console.log(currentsong)
     if(n<songs.length-1){
          n++
     }
     else{
          n= 0
     }
     
     changemusic()
})
// document.querySelector(".songlist").getElementsByTagName("li")
// console.log(currfolder)
Array.from(document.getElementsByClassName("card")).forEach(e => {
     // console.log(e)
     // e.addEventListener("click", async item=>{
     //      console.log(item,item.currentTarget.dataset)

     //      songs =await getsongs(`songs/${item.currentTarget.dataset.folder}`);
     //      console.log(item)
     // })
});


}
main()
