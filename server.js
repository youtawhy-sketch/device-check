const express=require("express");
const fs=require("fs");
const path=require("path");
const app=express();
const PORT=process.env.PORT||3000;
const DB=path.join(__dirname,"data.json");

app.use(express.json({limit:"20kb"}));
app.use(express.static(__dirname));

function readDB(){
  try{return JSON.parse(fs.readFileSync(DB,"utf8"))}catch{return []}
}
function writeDB(data){fs.writeFileSync(DB,JSON.stringify(data,null,2))}

app.post("/api/device",(req,res)=>{
  const d=req.body||{};
  if(d.consent!==true) return res.status(400).json({error:"Consent required"});
  const allowed={
    time:d.time||new Date().toISOString(),
    userAgent:String(d.userAgent||"").slice(0,1000),
    platform:String(d.platform||"").slice(0,200),
    language:String(d.language||"").slice(0,50),
    screen:String(d.screen||"").slice(0,50),
    battery:Number.isFinite(d.battery)?d.battery:null,
    charging:typeof d.charging==="boolean"?d.charging:null
  };
  const db=readDB(); db.push(allowed); writeDB(db);
  res.json({ok:true});
});

app.get("/api/device",(req,res)=>{
  res.json(readDB());
});

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
