"use strict";(()=>{var e={};e.id=3723,e.ids=[3723],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},71017:e=>{e.exports=require("path")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},95156:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>h,originalPathname:()=>q,patchFetch:()=>x,requestAsyncStorage:()=>c,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>g});var o={};r.r(o),r.d(o,{POST:()=>p});var s=r(95419),a=r(69108),n=r(99678),i=r(78070);let u=new(r(42632)).ZP({apiKey:process.env.OPENAI_API_KEY});async function p(e){try{let{userData:t,language:r="en"}=await e.json(),o=`You are an expert matchmaker for a matrimonial service. Your job is to ask 3 personalized, open-ended questions that will help you understand the user's values, relationship goals, compatibility factors, and preferences for matchmaking. Do NOT ask generic personality questions. All questions must be strictly relevant to finding a compatible life partner, understanding their expectations from marriage, and what matters most to them in a relationship. Use the user's background to personalize the questions, but always keep the matchmaking context primary.

User Information:
- Name: ${t.name}
- Age: ${t.age}
- Gender: ${t.gender}
- Location: ${t.location}
- Profession: ${t.profession}
- Education: ${t.education}

Generate 3 questions that:
1. Are strictly about matchmaking, compatibility, and relationship values
2. Are personalized to their background
3. Are open-ended and encourage detailed responses
4. Are suitable for a matrimonial context

${"hi"===r?"All questions must be in Hindi.":"All questions must be in English."}

Format the response as a JSON object: { "questions": [ ... ] }`,s=(await u.chat.completions.create({messages:[{role:"user",content:o}],model:"gpt-4-turbo-preview",response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No content received from OpenAI");let a=JSON.parse(s).questions;return i.Z.json({questions:a})}catch(e){return console.error("Error generating questions:",e),i.Z.json({error:"Failed to generate questions"},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/ai/generate-questions/route",pathname:"/api/ai/generate-questions",filename:"route",bundlePath:"app/api/ai/generate-questions/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/ai/generate-questions/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:m,headerHooks:h,staticGenerationBailout:g}=l,q="/api/ai/generate-questions/route";function x(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[1638,6206,319,2632],()=>r(95156));module.exports=o})();