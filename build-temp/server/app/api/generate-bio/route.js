"use strict";(()=>{var e={};e.id=7242,e.ids=[7242],e.modules={53524:e=>{e.exports=require("@prisma/client")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},71017:e=>{e.exports=require("path")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},50729:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>f,originalPathname:()=>w,patchFetch:()=>y,requestAsyncStorage:()=>h,routeModule:()=>d,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g,staticGenerationBailout:()=>b});var i={};r.r(i),r.d(i,{POST:()=>l});var a=r(95419),o=r(69108),n=r(99678),s=r(78070),u=r(42632),p=r(34490);let c=new u.ZP({apiKey:process.env.OPENAI_API_KEY});async function l(e){try{let{userId:t,hobbies:r,education:i,occupation:a,maritalStatus:o,religion:n,workLocation:u}=await e.json(),l=await p.Z.preferences.findFirst({where:{userId:t}}),d=`Create an engaging and personalized bio for a matrimonial profile based on the following details:

    Personal Details:
    - Education: ${i||"Not specified"}
    - Occupation: ${a||"Not specified"}
    - Marital Status: ${o||"Not specified"}
    - Religion: ${n||"Not specified"}
    - Work Location: ${u||"Not specified"}
    - Hobbies: ${r?.length>0?r.join(", "):"Not specified"}

    Partner Preferences:
    - Age Range: ${l?.ageFrom||"Any"} to ${l?.ageTo||"Any"} years
    - Height Range: ${l?.heightFrom||"Any"} to ${l?.heightTo||"Any"} cm
    - Marital Status: ${l?.maritalStatus||"Any"}
    - Religion: ${l?.religion||"Any"}
    - Education: ${l?.education||"Any"}
    - Occupation: ${l?.occupation||"Any"}

    Guidelines for bio creation:
    1. Maximum 40 words
    2. Include 3-4 emojis placed naturally within the text
    3. Structure the bio in this order:
       - Start with professional background/education
       - Mention personality traits or values
       - Include hobbies or interests
       - End with a brief mention of what they seek in a partner
    4. Use a warm, friendly tone while maintaining professionalism
    5. Highlight unique qualities and aspirations
    6. Incorporate partner preferences subtly without being too specific
    7. Make it personal and authentic

    Example format (but create unique content):
    "👨‍💼 Software engineer with an MBA, passionate about innovation. Enjoy photography 📸 and hiking 🏃‍♂️. Looking for an educated, like-minded partner who shares my values and zest for life."`,h=await c.chat.completions.create({messages:[{role:"system",content:"You are an expert at writing engaging matrimonial bios that capture the essence of a person while being concise and authentic. Focus on creating a natural flow between professional background, personal qualities, and partner preferences. Use emojis thoughtfully to enhance readability and engagement."},{role:"user",content:d}],model:"gpt-3.5-turbo",max_tokens:150,temperature:.7}),g=h.choices[0].message.content?.trim();return s.Z.json({bio:g})}catch(e){return console.error("Error generating bio:",e),s.Z.json({error:"Failed to generate bio"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/generate-bio/route",pathname:"/api/generate-bio",filename:"route",bundlePath:"app/api/generate-bio/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/generate-bio/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:m,headerHooks:f,staticGenerationBailout:b}=d,w="/api/generate-bio/route";function y(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}},34490:(e,t,r)=>{r.d(t,{Z:()=>a});var i=r(53524);let a=globalThis.prisma??new i.PrismaClient}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[1638,6206,319,2632],()=>r(50729));module.exports=i})();