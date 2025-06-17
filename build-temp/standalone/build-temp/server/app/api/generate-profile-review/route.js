"use strict";(()=>{var e={};e.id=9492,e.ids=[9492],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6449:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>g,originalPathname:()=>d,patchFetch:()=>v,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>h,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>m});var i={};t.r(i),t.d(i,{POST:()=>p});var n=t(95419),o=t(69108),a=t(99678),s=t(78070);async function p(e){let{profileData:r={},interviewResponses:t={},personalityPreferences:i={},language:n="en"}=await e.json(),o=Object.keys(t).length>0?Object.entries(t).map(([e,r])=>`Q: ${e}
A: ${r}`).join("\n\n"):"hi"===n?"कोई साक्षात्कार उत्तर प्रदान नहीं किए गए।":"No interview responses provided.",a=Object.keys(i).length>0?Object.entries(i).map(([e,r])=>`- ${e}: ${r}`).join("\n"):"hi"===n?"कोई व्यक्तित्व वरीयताएँ प्रदान नहीं की गईं।":"No personality preferences provided.",p=`Generate a concise (2-3 sentences per section) profile review for a matrimonial profile. The user's information is:

Basic Information:
- Name: ${r.fullName||"N/A"}
- Gender: ${r.gender||"N/A"}
- Age: ${r.age||"N/A"}

Education & Career:
- Education: ${r.education||"N/A"}
- Work Experience: ${r.workExperience||"N/A"}

Family Background:
- Family Type: ${r.family?.familyType||"N/A"}
- Native Place: ${r.family?.nativePlace||"N/A"}

Partner Preferences:
- Age Range: ${r.preferences?.ageRange||"N/A"}
- Education: ${r.preferences?.education||"N/A"}
- Location: ${r.preferences?.location||"N/A"}

Personality Traits:
${a}

Interview Responses (summarize if too long):
${o}

Please keep each section concise (2-3 sentences) and the JSON as short as possible. Do not repeat the questions or answers verbatim if too long.

${"hi"===n?"Write the review in Hindi.":"Write the review in English."}

Format the response as a JSON object with the following structure:
{
  "personalityAnalysis": "string",
  "keyStrengths": ["string"],
  "compatibilityFactors": ["string"],
  "lifestyleInsights": ["string"],
  "relationshipPotential": "string"
}`;try{let e=process.env.OPENAI_API_KEY;if(!e)throw Error("Missing OpenAI API key");let r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"hi"===n?"आप एक विवाह सलाहकार हैं जो हिंदी में प्रोफाइल रिव्यू लिखते हैं।":"You are a matrimonial counselor writing profile reviews in English."},{role:"user",content:p}],max_tokens:1500,temperature:.7})}),t=await r.json(),i=t.choices?.[0]?.message?.content||"";console.log("Raw LLM response:",i);try{let e=i.trim();e.startsWith("```json")?e=e.replace(/^```json/,"").replace(/```$/,"").trim():e.startsWith("```")&&(e=e.replace(/^```/,"").replace(/```$/,"").trim());let r=JSON.parse(e);return s.Z.json(r)}catch(e){return console.error("Error parsing review JSON:",e),s.Z.json({error:"Failed to parse LLM response as JSON",raw:i},{status:500})}}catch(e){return console.error("Error generating review:",e),s.Z.json({error:"Failed to generate profile review"},{status:500})}}let c=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/generate-profile-review/route",pathname:"/api/generate-profile-review",filename:"route",bundlePath:"app/api/generate-profile-review/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/generate-profile-review/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:u,serverHooks:h,headerHooks:g,staticGenerationBailout:m}=c,d="/api/generate-profile-review/route";function v(){return(0,a.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:u})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[1638,6206],()=>t(6449));module.exports=i})();