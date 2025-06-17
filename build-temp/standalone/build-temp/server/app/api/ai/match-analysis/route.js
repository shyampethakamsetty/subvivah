"use strict";(()=>{var e={};e.id=7881,e.ids=[7881],e.modules={53524:e=>{e.exports=require("@prisma/client")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},71017:e=>{e.exports=require("path")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},11163:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>g,originalPathname:()=>v,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>y});var o={};t.r(o),t.d(o,{POST:()=>p});var a=t(95419),s=t(69108),i=t(99678),n=t(78070),c=t(42632),u=t(81494);let l=new c.ZP({apiKey:process.env.OPENAI_API_KEY});async function p(e){try{if(!process.env.OPENAI_API_KEY)return console.error("OpenAI API key is not configured"),n.Z.json({error:"AI analysis service is not configured"},{status:503});let{userId:r,matchedUserId:t}=await e.json();if(!r||!t)return n.Z.json({error:"Both user IDs are required"},{status:400});let[o,a]=await Promise.all([u._.profile.findUnique({where:{userId:r},include:{user:{select:{firstName:!0,lastName:!0,gender:!0}}}}),u._.profile.findUnique({where:{userId:t},include:{user:{select:{firstName:!0,lastName:!0,gender:!0}}}})]);if(!o||!a)return n.Z.json({error:"One or both profiles not found"},{status:404});let s=`
Analyze the compatibility between these two profiles and generate a personalized message:

User 1 (${o.user.gender}):

Name: ${o.user.firstName} ${o.user.lastName}

Education: ${o.education||"Not specified"}

Occupation: ${o.occupation||"Not specified"}

Location: ${o.workLocation||"Not specified"}

About: ${o.aboutMe||"Not specified"}

User 2 (${a.user.gender}):

Name: ${a.user.firstName} ${a.user.lastName}

Education: ${a.education||"Not specified"}

Occupation: ${a.occupation||"Not specified"}

Location: ${a.workLocation||"Not specified"}

About: ${a.aboutMe||"Not specified"}

Please provide:

A compatibility summary in exactly 6 lines, highlighting how they complement each other. Keep it friendly and positive.

2–3 shared interests or conversation starters

A casual, warm ice-breaker message

Simple first meeting suggestions, considering distance or schedules.

 strictly remove **symbols on the response

Keep the tone friendly and complimentary, focusing on shared values and natural connection.

also add emojis to every few lines to create more engaging and friendly tone

`;try{let e=(await l.chat.completions.create({messages:[{role:"system",content:"You are a professional matchmaking assistant. Provide thoughtful, personalized analysis and suggestions for potential matches."},{role:"user",content:s}],model:"gpt-3.5-turbo",temperature:.7,max_tokens:500})).choices[0].message.content;return n.Z.json({analysis:e,userProfile:{name:`${o.user.firstName} ${o.user.lastName}`,education:o.education,occupation:o.occupation,location:o.workLocation,about:o.aboutMe},matchedProfile:{name:`${a.user.firstName} ${a.user.lastName}`,education:a.education,occupation:a.occupation,location:a.workLocation,about:a.aboutMe}})}catch(e){return console.error("OpenAI API error:",e),n.Z.json({error:"Failed to generate AI analysis",details:"AI service temporarily unavailable"},{status:503})}}catch(e){return console.error("AI Analysis error:",e),n.Z.json({error:"Failed to generate analysis",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/match-analysis/route",pathname:"/api/ai/match-analysis",filename:"route",bundlePath:"app/api/ai/match-analysis/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/ai/match-analysis/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:f,headerHooks:g,staticGenerationBailout:y}=d,v="/api/ai/match-analysis/route";function b(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},81494:(e,r,t)=>{t.d(r,{_:()=>a});var o=t(53524);let a=globalThis.prisma??new o.PrismaClient({log:["query","error","warn"],datasources:{db:{url:process.env.DATABASE_URL}}});(async(e=3,r=1e3)=>{for(let t=0;t<e;t++)try{await a.$connect(),console.log("Successfully connected to MongoDB via Prisma");return}catch(o){console.error(`Failed to connect to database (attempt ${t+1}/${e}):`,o),t===e-1&&(console.error("Max retries reached. Exiting process..."),process.exit(1)),console.log(`Retrying in ${r}ms...`),await new Promise(e=>setTimeout(e,r))}})()}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[1638,6206,319,2632],()=>t(11163));module.exports=o})();