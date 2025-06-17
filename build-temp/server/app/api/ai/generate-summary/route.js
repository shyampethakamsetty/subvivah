"use strict";(()=>{var e={};e.id=4201,e.ids=[4201],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},71017:e=>{e.exports=require("path")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},5352:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>h,originalPathname:()=>y,patchFetch:()=>f,requestAsyncStorage:()=>c,routeModule:()=>m,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>g});var a={};t.r(a),t.d(a,{POST:()=>p});var o=t(95419),s=t(69108),n=t(99678),i=t(78070);let u=new(t(42632)).ZP({apiKey:process.env.OPENAI_API_KEY});async function p(e){try{let{basics:r,aiAnswers:t,preferences:a,language:o="en"}=await e.json(),s=`Create a compelling and personalized profile summary based on the following information:

Basic Information:
- Name: ${r.name}
- Age: ${r.age}
- Gender: ${r.gender}
- Location: ${r.location}
- Profession: ${r.profession}
- Education: ${r.education}

Detailed Answers:
${t.map((e,r)=>`Answer ${r+1}: ${e}`).join("\n")}

Preferences:
${Object.entries(a).map(([e,r])=>`Card ${parseInt(e)+1}: ${r}`).join("\n")}

Generate a concise, engaging profile summary that:
1. Highlights their unique personality traits and values
2. Incorporates their preferences and choices
3. Maintains a professional yet personal tone
4. Is suitable for a matrimonial context
5. Is between 150-200 words

${"hi"===o?"The summary must be in Hindi.":"The summary must be in English."}

Format the response as a JSON object with a "summary" string.`,n=(await u.chat.completions.create({messages:[{role:"user",content:s}],model:"gpt-4-turbo-preview",response_format:{type:"json_object"}})).choices[0].message.content;if(!n)throw Error("No content received from OpenAI");let p=JSON.parse(n).summary;return i.Z.json({summary:p})}catch(e){return console.error("Error generating summary:",e),i.Z.json({error:"Failed to generate summary"},{status:500})}}let m=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/generate-summary/route",pathname:"/api/ai/generate-summary",filename:"route",bundlePath:"app/api/ai/generate-summary/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/ai/generate-summary/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:d,headerHooks:h,staticGenerationBailout:g}=m,y="/api/ai/generate-summary/route";function f(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[1638,6206,319,2632],()=>t(5352));module.exports=a})();