// List all elements fetched from html code at top !!
const yourWeather=document.querySelector(".tab1");
const searchWeather=document.querySelector(".tab2");
const searchForm=document.querySelector(".searchForm");
const grantLocation=document.querySelector(".grantLocation");
const weatherOutput=document.querySelector(".weatherOutput");
const grantAccessBtn=document.querySelector(".grantAccessBtn");
const API_KEY="8f1f3c2b461003119232795ff1e065c2";
const loadingScreen=document.querySelector(".loadingScreen");
const input=document.querySelector(".input");
const searchBtn=document.querySelector(".searchBtn");

var currTab=yourWeather;
currTab.classList.add("currentTab");
getFromSessionStorage();

// handling tab switches
yourWeather.addEventListener("click",()=>{
    switchTab(yourWeather);
});

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
});

function switchTab(clickedTab){
    if(currTab!=clickedTab){
        currTab.classList.remove("currentTab");
        currTab=clickedTab;
        currTab.classList.add("currentTab");

        // (if 'if' works) then that means that search form is not visible that means current tab was your weather tab and now
        // the clicked tab is search weather tab
        if(!searchForm.classList.contains("active")){
            grantLocation.classList.remove("active");
            weatherOutput.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            weatherOutput.classList.remove("active");
            // get my coordinates from session storage
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage(myCoordinates){
    const coordinates =sessionStorage.getItem("myCoordinates");
    if(!coordinates){
        grantLocation.classList.add("active");
    }
    else{
         // we have got the coordinates, now we will find the weather using weather api
         getWeatherInfoLatLon(coordinates);
    }
}

grantAccessBtn.addEventListener("click",getCoordinates);
async function getCoordinates(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("NO GEOLOCATION SUPPORT AVAILABLE");
    }
}
function showPosition(position){
    const latitude=position.coords.latitude;
    const longitude=position.coords.longitude;

    const positionObj ={
        lat:latitude,
        long:longitude
    };
    sessionStorage.setItem("myCoordinates", JSON.stringify(positionObj));
    // we have created an object that contains longitude and latitute and saved it into session storage
    // now we will use these coordinates object to find weather info!
    getWeatherInfoLatLon(JSON.stringify(positionObj));
}

async function getWeatherInfoLatLon(coordinates){
    // converting string to java script object 
    coordinates=JSON.parse(coordinates);
    grantLocation.classList.remove("active");
    loadingScreen.classList.add("active");
    const lat = coordinates.lat;
    const long=coordinates.long;
    console.log(lat,long);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);

    const data = await response.json();
    // now we have got the data 
    // render this data
    renderInfo(data);
    // remove loading screen and show weather output
    
    setTimeout(()=>{
        loadingScreen.classList.remove("active");
        weatherOutput.classList.add("active");
    },300);  
}

function renderInfo(data){
    const cityName=document.querySelector(".cityName");
    const countryIcon=document.querySelector(".countryIcon");
    const weatherCondition=document.querySelector(".weatherCondition");
    const weatherIcon=document.querySelector(".weatherIcon");
    const temp=document.querySelector(".temp");
    const windSpeed=document.querySelector(".windSpeed");
    const humidity=document.querySelector(".humidity");
    const cloudiness=document.querySelector(".cloudiness");

    cityName.innerHTML=data?.name;
    countryIcon.src=`https://flagcdn.com/16x12/${data?.sys?.country?.toLowerCase()}.png`;
    weatherCondition.innerHTML=data?.weather[0]?.main;
    weatherIcon.src=`http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
    const t=data?.main?.temp-273;
    temp.innerHTML=t.toFixed(2) +"°C";
    windSpeed.innerHTML= `${data?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerHTML=`${data?.main?.humidity}%`;
    cloudiness.innerHTML=`${data?.clouds?.all}%`;
    console.log("render");

}

searchBtn.addEventListener("click",searchCityWeather);
function searchCityWeather(e){
    e.preventDefault();
    // console.log("inside search");
    if(input.value===""){
        return;
    }
    getWeatherInfoFromCityName(input.value);
    input.value="";
}

async function getWeatherInfoFromCityName(city){
    weatherOutput.classList.remove("active");
    
    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data=await response.json();
        loadingScreen.classList.add("active");
        renderInfo(data);
        
        setTimeout(()=>{
            loadingScreen.classList.remove("active");
            weatherOutput.classList.add("active");
        },1000);
        
        console.log("try");
    }   
    catch (e) {
        console.log("catch");
        loadingScreen.classList.remove("active");
        alert("City Not Found");
        searchForm.classList.add("active");
       
    }
}