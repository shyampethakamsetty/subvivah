"use strict";(()=>{var e={};e.id=6178,e.ids=[6178],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},80073:(e,t,n)=>{n.r(t),n.d(t,{headerHooks:()=>h,originalPathname:()=>g,patchFetch:()=>f,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>m});var o={};n.r(o),n.d(o,{POST:()=>u});var a=n(95419),i=n(69108),r=n(99678),s=n(78070);async function u(e){let{gender:t,age:n,education:o,profession:a,fullName:i,family:r,preferences:u,language:l="en"}=await e.json(),p=`Generate 5 personalized interview questions for a matrimonial AI interview. The user is:
- Name: ${i||"N/A"}
- Gender: ${t||"N/A"}
- Age: ${n||"N/A"}
- Education: ${o||"N/A"}
- Profession: ${a||"N/A"}
- Family: ${r||"N/A"}
- Preferences: ${u||"N/A"}

Questions should be:
1. Open-ended and friendly
2. Relevant to the user's background
3. Focused on understanding their values, relationship goals, and compatibility factors
4. Suitable for a matrimonial context

${"hi"===l?"All questions must be in Hindi.":"All questions must be in English."}

Return only the questions as a numbered list.`;try{let e=process.env.OPENAI_API_KEY;if(!e)throw Error("Missing OpenAI API key");let t=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"hi"===l?"आप एक विवाह सलाहकार हैं जो हिंदी में प्रश्न पूछते हैं।":"You are a matrimonial counselor asking questions in English."},{role:"user",content:p}],max_tokens:500,temperature:.7})}),n=await t.json(),o=(n.choices?.[0]?.message?.content||"").split(/\n\d+\. /).filter(Boolean).map(e=>e.replace(/^\d+\.\s*/,""));if(o.length>0)return s.Z.json({questions:o})}catch(e){console.error("Error generating questions:",e)}return s.Z.json({questions:{hi:["आपके जीवन में सबसे महत्वपूर्ण मूल्य क्या हैं?","आप एक सफल और संतुष्ट जीवनसाथी के लिए किन गुणों को आवश्यक मानते हैं?","आपके परिवार के मूल्य आपके जीवन को कैसे प्रभावित करते हैं?","आप अपने भविष्य के जीवनसाथी से क्या अपेक्षाएं रखते हैं?","आप एक मजबूत और स्थायी रिश्ते के लिए क्या योगदान दे सकते हैं?"],en:["What are the most important values in your life?","What qualities do you believe are essential for a successful and fulfilling relationship?","How have your family values influenced your life?","What are your expectations from your future life partner?","What can you contribute to a strong and lasting relationship?"]}[l]})}let l=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/generate-questions/route",pathname:"/api/generate-questions",filename:"route",bundlePath:"app/api/generate-questions/route"},resolvedPagePath:"/home/subvivah/htdocs/subvivah.com/src/app/api/generate-questions/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:h,staticGenerationBailout:m}=l,g="/api/generate-questions/route";function f(){return(0,r.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:c})}}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),o=t.X(0,[1638,6206],()=>n(80073));module.exports=o})();