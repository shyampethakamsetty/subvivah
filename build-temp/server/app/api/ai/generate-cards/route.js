"use strict";(()=>{var e={};e.id=7102,e.ids=[7102],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},71017:e=>{e.exports=require("path")},85477:e=>{e.exports=require("punycode")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},97741:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>m,originalPathname:()=>v,patchFetch:()=>f,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>g});var o={};t.r(o),t.d(o,{POST:()=>p});var a=t(95419),s=t(69108),n=t(99678),i=t(78070);let u=new(t(42632)).ZP({apiKey:process.env.OPENAI_API_KEY});async function p(e){try{let{aiAnswers:r}=await e.json(),t=`Based on the following user's answers to our questions, generate 6 "This-or-That" preference cards. Each card should have two contrasting options that are relevant to their interests and values.

User's Answers:
${r.map((e,r)=>`Answer ${r+1}: ${e}`).join("\n")}

Generate 6 cards that:
1. Are based on themes extracted from their answers
2. Have contrasting but equally valid options
3. Include relevant emojis for each option
4. Are suitable for a matrimonial context

Format the response as a JSON object with a "cards" array. Each card should have:
- id: number
- left: string (first option)
- right: string (second option)
- leftEmoji: string (emoji for first option)
- rightEmoji: string (emoji for second option)`,o=(await u.chat.completions.create({messages:[{role:"user",content:t}],model:"gpt-4-turbo-preview",response_format:{type:"json_object"}})).choices[0].message.content;if(!o)throw Error("No content received from OpenAI");let a=JSON.parse(o).cards;return i.Z.json({cards:a})}catch(e){return console.error("Error generating cards:",e),i.Z.json({error:"Failed to generate cards"},{status:500})}}let c=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/generate-cards/route",pathname:"/api/ai/generate-cards",filename:"route",bundlePath:"app/api/ai/generate-cards/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/ai/generate-cards/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:l,headerHooks:m,staticGenerationBailout:g}=c,v="/api/ai/generate-cards/route";function f(){return(0,n.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:h})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[1638,6206,319,2632],()=>t(97741));module.exports=o})();