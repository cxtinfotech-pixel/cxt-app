const API = location.origin;

// ✅ EMPLOYEE DATABASE (FIXED)
const employees = {
"19001":"Jhunrey",
"20002":"Benjie",
"20003":"Windyl",
"20004":"Jiovani",
"20005":"Inocencio",
"20006":"Esrael",
"20007":"Robert",
"20009":"Arnel",
"21010":"Danilo",
"21011":"Marlon",
"21012":"Jhonny",
"22014":"Richardson",
"22015":"Markjhon",
"22016":"Jellamae",
"22018":"Jeth",
"23019":"Jacky",
"23020":"Merlito",
"23021":"Aljo",
"23022":"Andrei",
"23023":"Erickson",
"23025":"Danilo",
"23026":"Jonathan",
"23027":"Richan",
"24031":"Marvin",
"24032":"Aaron",
"24034":"Michael",
"24035":"Khate",
"24036":"Jonathan",
"24038":"Erwin",
"24041":"Marvin",
"24043":"Gaspar",
"24044":"Edrian",
"24045":"Junior",
"24046":"Alex",
"25047":"Rolly",
"25048":"Jayson",
"25049":"Joven",
"25050":"Marlon",
"25052":"Zalde",
"25056":"Shan",
"25058":"James",
"25059":"Melvin",
"25060":"Detheir",
"25063":"Christian",
"25064":"Peter",
"25066":"Jay",
"25067":"Jiovani",
"25068":"Jhon",
"25069":"Laurence",
"25070":"Adrian",
"25071":"Soy",
"25072":"Jaycel",
"25073":"Bern",
"26074":"Menard",
"26075":"Lister",
"26076":"Arnel",
"26077":"Denniel"
};

// 🔐 LOGIN VALIDATION
function login(){
    let emp = empNo.value.trim();
    let name = name.value.trim().toLowerCase();

    if(!employees[emp]){
        alert("Invalid Employee Number");
        return;
    }

    let validName = employees[emp].toLowerCase();

    if(!name.startsWith(validName)){
        alert("Name does not match Employee Number");
        return;
    }

    localStorage.empNo = emp;
    localStorage.name = employees[emp];

    location.href="dashboard.html";
}

// ================= SYSTEM =================

let gps="";
let photos={};

const list=[
"Engine Oil Dipstick",
"Water Level",
"Hydraulic Oil",
"Water Separator",
"Battery Terminal",
"Fan Belt",
"Panel Board / Hour Meter"
];

window.onload=()=>{
let div=document.getElementById("photos");
if(!div) return;

list.forEach(p=>{
let b=document.createElement("button");
b.innerText=p;
b.className="primary";
b.onclick=()=>capture(p);
div.appendChild(b);
});
}

function openCamera(){
navigator.mediaDevices.getUserMedia({video:true})
.then(s=>video.srcObject=s);
}

function capture(name){
let c=document.createElement("canvas");
c.width=video.videoWidth;
c.height=video.videoHeight;
c.getContext("2d").drawImage(video,0,0);
photos[name]=c.toDataURL();
alert(name+" captured");
}

function getLocation(){
navigator.geolocation.getCurrentPosition(p=>{
gps=p.coords.latitude+","+p.coords.longitude;
document.getElementById("gps").innerText=gps;
});
}

async function timeIn(){
if(Object.keys(photos).length<7){
alert("Complete all required photos");
return;
}

if(!gps || !site.value){
alert("GPS and Site required");
return;
}

await fetch(API+"/save",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({
empNo:localStorage.empNo,
name:localStorage.name,
equipment:equipment.value,
wheel:wheel.value,
site:site.value,
gps,photos,type:"TIME IN",time:new Date().toLocaleString()
})});

alert("Time In Saved");
}

async function timeOut(){
let r=prompt("Enter reason");

await fetch(API+"/save",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({
empNo:localStorage.empNo,
name:localStorage.name,
reason:r,type:"TIME OUT",time:new Date().toLocaleString()
})});

alert("Time Out Saved");
}

async function loadLogs(){
let res=await fetch(API+"/logs");
let data=await res.json();

let table=document.getElementById("table");
table.innerHTML="<tr><th>Employee</th><th>Type</th><th>Time</th></tr>";

data.forEach(d=>{
table.innerHTML+=`<tr>
<td>${d.name}</td>
<td>${d.type}</td>
<td>${d.time}</td>
</tr>`;
});
}

function exportExcel(){
window.open(API+"/export");
}