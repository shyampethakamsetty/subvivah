"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/ai/match-analysis/route";
exports.ids = ["app/api/ai/match-analysis/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("node:stream/web");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fai%2Fmatch-analysis%2Froute&page=%2Fapi%2Fai%2Fmatch-analysis%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fai%2Fmatch-analysis%2Froute.ts&appDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fai%2Fmatch-analysis%2Froute&page=%2Fapi%2Fai%2Fmatch-analysis%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fai%2Fmatch-analysis%2Froute.ts&appDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_subvivah_htdocs_subvivah_com_src_app_api_ai_match_analysis_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/ai/match-analysis/route.ts */ \"(rsc)/./src/app/api/ai/match-analysis/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/ai/match-analysis/route\",\n        pathname: \"/api/ai/match-analysis\",\n        filename: \"route\",\n        bundlePath: \"app/api/ai/match-analysis/route\"\n    },\n    resolvedPagePath: \"/home/subvivah/htdocs/subvivah.com/src/app/api/ai/match-analysis/route.ts\",\n    nextConfigOutput,\n    userland: _home_subvivah_htdocs_subvivah_com_src_app_api_ai_match_analysis_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/ai/match-analysis/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhaSUyRm1hdGNoLWFuYWx5c2lzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhaSUyRm1hdGNoLWFuYWx5c2lzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWklMkZtYXRjaC1hbmFseXNpcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGc3Vidml2YWglMkZodGRvY3MlMkZzdWJ2aXZhaC5jb20lMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRmhvbWUlMkZzdWJ2aXZhaCUyRmh0ZG9jcyUyRnN1YnZpdmFoLmNvbSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1zdGFuZGFsb25lJnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDeUI7QUFDdEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1R0FBdUc7QUFDL0c7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUM2Sjs7QUFFN0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWRkaW5nLXdlYnNpdGUvPzc2N2EiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvc3Vidml2YWgvaHRkb2NzL3N1YnZpdmFoLmNvbS9zcmMvYXBwL2FwaS9haS9tYXRjaC1hbmFseXNpcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FpL21hdGNoLWFuYWx5c2lzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYWkvbWF0Y2gtYW5hbHlzaXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FpL21hdGNoLWFuYWx5c2lzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvc3Vidml2YWgvaHRkb2NzL3N1YnZpdmFoLmNvbS9zcmMvYXBwL2FwaS9haS9tYXRjaC1hbmFseXNpcy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9haS9tYXRjaC1hbmFseXNpcy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fai%2Fmatch-analysis%2Froute&page=%2Fapi%2Fai%2Fmatch-analysis%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fai%2Fmatch-analysis%2Froute.ts&appDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/ai/match-analysis/route.ts":
/*!************************************************!*\
  !*** ./src/app/api/ai/match-analysis/route.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\n\n// Initialize OpenAI with proper error handling\nconst openai = new openai__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n    apiKey: process.env.OPENAI_API_KEY\n});\nasync function POST(request) {\n    try {\n        // Check if API key is configured\n        if (!process.env.OPENAI_API_KEY) {\n            console.error(\"OpenAI API key is not configured\");\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"AI analysis service is not configured\"\n            }, {\n                status: 503\n            });\n        }\n        const { userId, matchedUserId } = await request.json();\n        if (!userId || !matchedUserId) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Both user IDs are required\"\n            }, {\n                status: 400\n            });\n        }\n        // Fetch both users' profiles\n        const [userProfile, matchedProfile] = await Promise.all([\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.profile.findUnique({\n                where: {\n                    userId\n                },\n                include: {\n                    user: {\n                        select: {\n                            firstName: true,\n                            lastName: true,\n                            gender: true\n                        }\n                    }\n                }\n            }),\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.profile.findUnique({\n                where: {\n                    userId: matchedUserId\n                },\n                include: {\n                    user: {\n                        select: {\n                            firstName: true,\n                            lastName: true,\n                            gender: true\n                        }\n                    }\n                }\n            })\n        ]);\n        if (!userProfile || !matchedProfile) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"One or both profiles not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Prepare data for OpenAI\n        const prompt = `\nAnalyze the compatibility between these two profiles and generate a personalized message:\n\nUser 1 (${userProfile.user.gender}):\n\nName: ${userProfile.user.firstName} ${userProfile.user.lastName}\n\nEducation: ${userProfile.education || \"Not specified\"}\n\nOccupation: ${userProfile.occupation || \"Not specified\"}\n\nLocation: ${userProfile.workLocation || \"Not specified\"}\n\nAbout: ${userProfile.aboutMe || \"Not specified\"}\n\nUser 2 (${matchedProfile.user.gender}):\n\nName: ${matchedProfile.user.firstName} ${matchedProfile.user.lastName}\n\nEducation: ${matchedProfile.education || \"Not specified\"}\n\nOccupation: ${matchedProfile.occupation || \"Not specified\"}\n\nLocation: ${matchedProfile.workLocation || \"Not specified\"}\n\nAbout: ${matchedProfile.aboutMe || \"Not specified\"}\n\nPlease provide:\n\nA compatibility summary in exactly 6 lines, highlighting how they complement each other. Keep it friendly and positive.\n\n2–3 shared interests or conversation starters\n\nA casual, warm ice-breaker message\n\nSimple first meeting suggestions, considering distance or schedules.\n\n strictly remove **symbols on the response\n\nKeep the tone friendly and complimentary, focusing on shared values and natural connection.\n\nalso add emojis to every few lines to create more engaging and friendly tone\n\n`;\n        try {\n            // Call OpenAI API with error handling\n            const completion = await openai.chat.completions.create({\n                messages: [\n                    {\n                        role: \"system\",\n                        content: \"You are a professional matchmaking assistant. Provide thoughtful, personalized analysis and suggestions for potential matches.\"\n                    },\n                    {\n                        role: \"user\",\n                        content: prompt\n                    }\n                ],\n                model: \"gpt-3.5-turbo\",\n                temperature: 0.7,\n                max_tokens: 500\n            });\n            const analysis = completion.choices[0].message.content;\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                analysis,\n                userProfile: {\n                    name: `${userProfile.user.firstName} ${userProfile.user.lastName}`,\n                    education: userProfile.education,\n                    occupation: userProfile.occupation,\n                    location: userProfile.workLocation,\n                    about: userProfile.aboutMe\n                },\n                matchedProfile: {\n                    name: `${matchedProfile.user.firstName} ${matchedProfile.user.lastName}`,\n                    education: matchedProfile.education,\n                    occupation: matchedProfile.occupation,\n                    location: matchedProfile.workLocation,\n                    about: matchedProfile.aboutMe\n                }\n            });\n        } catch (openaiError) {\n            console.error(\"OpenAI API error:\", openaiError);\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Failed to generate AI analysis\",\n                details: \"AI service temporarily unavailable\"\n            }, {\n                status: 503\n            });\n        }\n    } catch (error) {\n        console.error(\"AI Analysis error:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Failed to generate analysis\",\n            details: error instanceof Error ? error.message : \"Unknown error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9haS9tYXRjaC1hbmFseXNpcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ2Y7QUFDTTtBQUVsQywrQ0FBK0M7QUFDL0MsTUFBTUcsU0FBUyxJQUFJRiw4Q0FBTUEsQ0FBQztJQUN4QkcsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxjQUFjO0FBQ3BDO0FBRU8sZUFBZUMsS0FBS0MsT0FBZ0I7SUFDekMsSUFBSTtRQUNGLGlDQUFpQztRQUNqQyxJQUFJLENBQUNKLFFBQVFDLEdBQUcsQ0FBQ0MsY0FBYyxFQUFFO1lBQy9CRyxRQUFRQyxLQUFLLENBQUM7WUFDZCxPQUFPWCxrRkFBWUEsQ0FBQ1ksSUFBSSxDQUN0QjtnQkFBRUQsT0FBTztZQUF3QyxHQUNqRDtnQkFBRUUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLGFBQWEsRUFBRSxHQUFHLE1BQU1OLFFBQVFHLElBQUk7UUFFcEQsSUFBSSxDQUFDRSxVQUFVLENBQUNDLGVBQWU7WUFDN0IsT0FBT2Ysa0ZBQVlBLENBQUNZLElBQUksQ0FDdEI7Z0JBQUVELE9BQU87WUFBNkIsR0FDdEM7Z0JBQUVFLFFBQVE7WUFBSTtRQUVsQjtRQUVBLDZCQUE2QjtRQUM3QixNQUFNLENBQUNHLGFBQWFDLGVBQWUsR0FBRyxNQUFNQyxRQUFRQyxHQUFHLENBQUM7WUFDdERqQiwyQ0FBTUEsQ0FBQ2tCLE9BQU8sQ0FBQ0MsVUFBVSxDQUFDO2dCQUN4QkMsT0FBTztvQkFBRVI7Z0JBQU87Z0JBQ2hCUyxTQUFTO29CQUNQQyxNQUFNO3dCQUNKQyxRQUFROzRCQUNOQyxXQUFXOzRCQUNYQyxVQUFVOzRCQUNWQyxRQUFRO3dCQUNWO29CQUNGO2dCQUNGO1lBQ0Y7WUFDQTFCLDJDQUFNQSxDQUFDa0IsT0FBTyxDQUFDQyxVQUFVLENBQUM7Z0JBQ3hCQyxPQUFPO29CQUFFUixRQUFRQztnQkFBYztnQkFDL0JRLFNBQVM7b0JBQ1BDLE1BQU07d0JBQ0pD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QUFPO1lBQStCd0MsU0FBU3hDLGlCQUFpQnlDLFFBQVF6QyxNQUFNbUMsT0FBTyxHQUFHO1FBQWdCLEdBQzFHO1lBQUVqQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3dlZGRpbmctd2Vic2l0ZS8uL3NyYy9hcHAvYXBpL2FpL21hdGNoLWFuYWx5c2lzL3JvdXRlLnRzPzBjMjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IE9wZW5BSSBmcm9tICdvcGVuYWknO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xuXG4vLyBJbml0aWFsaXplIE9wZW5BSSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xuY29uc3Qgb3BlbmFpID0gbmV3IE9wZW5BSSh7XG4gIGFwaUtleTogcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVksXG59KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIC8vIENoZWNrIGlmIEFQSSBrZXkgaXMgY29uZmlndXJlZFxuICAgIGlmICghcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ09wZW5BSSBBUEkga2V5IGlzIG5vdCBjb25maWd1cmVkJyk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6ICdBSSBhbmFseXNpcyBzZXJ2aWNlIGlzIG5vdCBjb25maWd1cmVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNTAzIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgeyB1c2VySWQsIG1hdGNoZWRVc2VySWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgaWYgKCF1c2VySWQgfHwgIW1hdGNoZWRVc2VySWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0JvdGggdXNlciBJRHMgYXJlIHJlcXVpcmVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRmV0Y2ggYm90aCB1c2VycycgcHJvZmlsZXNcbiAgICBjb25zdCBbdXNlclByb2ZpbGUsIG1hdGNoZWRQcm9maWxlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHByaXNtYS5wcm9maWxlLmZpbmRVbmlxdWUoe1xuICAgICAgICB3aGVyZTogeyB1c2VySWQgfSxcbiAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgICBmaXJzdE5hbWU6IHRydWUsXG4gICAgICAgICAgICAgIGxhc3ROYW1lOiB0cnVlLFxuICAgICAgICAgICAgICBnZW5kZXI6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHByaXNtYS5wcm9maWxlLmZpbmRVbmlxdWUoe1xuICAgICAgICB3aGVyZTogeyB1c2VySWQ6IG1hdGNoZWRVc2VySWQgfSxcbiAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgICBmaXJzdE5hbWU6IHRydWUsXG4gICAgICAgICAgICAgIGxhc3ROYW1lOiB0cnVlLFxuICAgICAgICAgICAgICBnZW5kZXI6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIF0pO1xuXG4gICAgaWYgKCF1c2VyUHJvZmlsZSB8fCAhbWF0Y2hlZFByb2ZpbGUpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ09uZSBvciBib3RoIHByb2ZpbGVzIG5vdCBmb3VuZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwNCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFByZXBhcmUgZGF0YSBmb3IgT3BlbkFJXG4gICAgY29uc3QgcHJvbXB0ID0gYFxuQW5hbHl6ZSB0aGUgY29tcGF0aWJpbGl0eSBiZXR3ZWVuIHRoZXNlIHR3byBwcm9maWxlcyBhbmQgZ2VuZXJhdGUgYSBwZXJzb25hbGl6ZWQgbWVzc2FnZTpcblxuVXNlciAxICgke3VzZXJQcm9maWxlLnVzZXIuZ2VuZGVyfSk6XG5cbk5hbWU6ICR7dXNlclByb2ZpbGUudXNlci5maXJzdE5hbWV9ICR7dXNlclByb2ZpbGUudXNlci5sYXN0TmFtZX1cblxuRWR1Y2F0aW9uOiAke3VzZXJQcm9maWxlLmVkdWNhdGlvbiB8fCAnTm90IHNwZWNpZmllZCd9XG5cbk9jY3VwYXRpb246ICR7dXNlclByb2ZpbGUub2NjdXBhdGlvbiB8fCAnTm90IHNwZWNpZmllZCd9XG5cbkxvY2F0aW9uOiAke3VzZXJQcm9maWxlLndvcmtMb2NhdGlvbiB8fCAnTm90IHNwZWNpZmllZCd9XG5cbkFib3V0OiAke3VzZXJQcm9maWxlLmFib3V0TWUgfHwgJ05vdCBzcGVjaWZpZWQnfVxuXG5Vc2VyIDIgKCR7bWF0Y2hlZFByb2ZpbGUudXNlci5nZW5kZXJ9KTpcblxuTmFtZTogJHttYXRjaGVkUHJvZmlsZS51c2VyLmZpcnN0TmFtZX0gJHttYXRjaGVkUHJvZmlsZS51c2VyLmxhc3ROYW1lfVxuXG5FZHVjYXRpb246ICR7bWF0Y2hlZFByb2ZpbGUuZWR1Y2F0aW9uIHx8ICdOb3Qgc3BlY2lmaWVkJ31cblxuT2NjdXBhdGlvbjogJHttYXRjaGVkUHJvZmlsZS5vY2N1cGF0aW9uIHx8ICdOb3Qgc3BlY2lmaWVkJ31cblxuTG9jYXRpb246ICR7bWF0Y2hlZFByb2ZpbGUud29ya0xvY2F0aW9uIHx8ICdOb3Qgc3BlY2lmaWVkJ31cblxuQWJvdXQ6ICR7bWF0Y2hlZFByb2ZpbGUuYWJvdXRNZSB8fCAnTm90IHNwZWNpZmllZCd9XG5cblBsZWFzZSBwcm92aWRlOlxuXG5BIGNvbXBhdGliaWxpdHkgc3VtbWFyeSBpbiBleGFjdGx5IDYgbGluZXMsIGhpZ2hsaWdodGluZyBob3cgdGhleSBjb21wbGVtZW50IGVhY2ggb3RoZXIuIEtlZXAgaXQgZnJpZW5kbHkgYW5kIHBvc2l0aXZlLlxuXG4y4oCTMyBzaGFyZWQgaW50ZXJlc3RzIG9yIGNvbnZlcnNhdGlvbiBzdGFydGVyc1xuXG5BIGNhc3VhbCwgd2FybSBpY2UtYnJlYWtlciBtZXNzYWdlXG5cblNpbXBsZSBmaXJzdCBtZWV0aW5nIHN1Z2dlc3Rpb25zLCBjb25zaWRlcmluZyBkaXN0YW5jZSBvciBzY2hlZHVsZXMuXG5cbiBzdHJpY3RseSByZW1vdmUgKipzeW1ib2xzIG9uIHRoZSByZXNwb25zZVxuXG5LZWVwIHRoZSB0b25lIGZyaWVuZGx5IGFuZCBjb21wbGltZW50YXJ5LCBmb2N1c2luZyBvbiBzaGFyZWQgdmFsdWVzIGFuZCBuYXR1cmFsIGNvbm5lY3Rpb24uXG5cbmFsc28gYWRkIGVtb2ppcyB0byBldmVyeSBmZXcgbGluZXMgdG8gY3JlYXRlIG1vcmUgZW5nYWdpbmcgYW5kIGZyaWVuZGx5IHRvbmVcblxuYDtcblxuICAgIHRyeSB7XG4gICAgICAvLyBDYWxsIE9wZW5BSSBBUEkgd2l0aCBlcnJvciBoYW5kbGluZ1xuICAgICAgY29uc3QgY29tcGxldGlvbiA9IGF3YWl0IG9wZW5haS5jaGF0LmNvbXBsZXRpb25zLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogXCJzeXN0ZW1cIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiWW91IGFyZSBhIHByb2Zlc3Npb25hbCBtYXRjaG1ha2luZyBhc3Npc3RhbnQuIFByb3ZpZGUgdGhvdWdodGZ1bCwgcGVyc29uYWxpemVkIGFuYWx5c2lzIGFuZCBzdWdnZXN0aW9ucyBmb3IgcG90ZW50aWFsIG1hdGNoZXMuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgY29udGVudDogcHJvbXB0XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBtb2RlbDogXCJncHQtMy41LXR1cmJvXCIsXG4gICAgICAgIHRlbXBlcmF0dXJlOiAwLjcsXG4gICAgICAgIG1heF90b2tlbnM6IDUwMFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFuYWx5c2lzID0gY29tcGxldGlvbi5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudDtcblxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgYW5hbHlzaXMsXG4gICAgICAgIHVzZXJQcm9maWxlOiB7XG4gICAgICAgICAgbmFtZTogYCR7dXNlclByb2ZpbGUudXNlci5maXJzdE5hbWV9ICR7dXNlclByb2ZpbGUudXNlci5sYXN0TmFtZX1gLFxuICAgICAgICAgIGVkdWNhdGlvbjogdXNlclByb2ZpbGUuZWR1Y2F0aW9uLFxuICAgICAgICAgIG9jY3VwYXRpb246IHVzZXJQcm9maWxlLm9jY3VwYXRpb24sXG4gICAgICAgICAgbG9jYXRpb246IHVzZXJQcm9maWxlLndvcmtMb2NhdGlvbixcbiAgICAgICAgICBhYm91dDogdXNlclByb2ZpbGUuYWJvdXRNZVxuICAgICAgICB9LFxuICAgICAgICBtYXRjaGVkUHJvZmlsZToge1xuICAgICAgICAgIG5hbWU6IGAke21hdGNoZWRQcm9maWxlLnVzZXIuZmlyc3ROYW1lfSAke21hdGNoZWRQcm9maWxlLnVzZXIubGFzdE5hbWV9YCxcbiAgICAgICAgICBlZHVjYXRpb246IG1hdGNoZWRQcm9maWxlLmVkdWNhdGlvbixcbiAgICAgICAgICBvY2N1cGF0aW9uOiBtYXRjaGVkUHJvZmlsZS5vY2N1cGF0aW9uLFxuICAgICAgICAgIGxvY2F0aW9uOiBtYXRjaGVkUHJvZmlsZS53b3JrTG9jYXRpb24sXG4gICAgICAgICAgYWJvdXQ6IG1hdGNoZWRQcm9maWxlLmFib3V0TWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAob3BlbmFpRXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ09wZW5BSSBBUEkgZXJyb3I6Jywgb3BlbmFpRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGdlbmVyYXRlIEFJIGFuYWx5c2lzJywgZGV0YWlsczogJ0FJIHNlcnZpY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA1MDMgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdBSSBBbmFseXNpcyBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBnZW5lcmF0ZSBhbmFseXNpcycsIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJPcGVuQUkiLCJwcmlzbWEiLCJvcGVuYWkiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiT1BFTkFJX0FQSV9LRVkiLCJQT1NUIiwicmVxdWVzdCIsImNvbnNvbGUiLCJlcnJvciIsImpzb24iLCJzdGF0dXMiLCJ1c2VySWQiLCJtYXRjaGVkVXNlcklkIiwidXNlclByb2ZpbGUiLCJtYXRjaGVkUHJvZmlsZSIsIlByb21pc2UiLCJhbGwiLCJwcm9maWxlIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaW5jbHVkZSIsInVzZXIiLCJzZWxlY3QiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsImdlbmRlciIsInByb21wdCIsImVkdWNhdGlvbiIsIm9jY3VwYXRpb24iLCJ3b3JrTG9jYXRpb24iLCJhYm91dE1lIiwiY29tcGxldGlvbiIsImNoYXQiLCJjb21wbGV0aW9ucyIsImNyZWF0ZSIsIm1lc3NhZ2VzIiwicm9sZSIsImNvbnRlbnQiLCJtb2RlbCIsInRlbXBlcmF0dXJlIiwibWF4X3Rva2VucyIsImFuYWx5c2lzIiwiY2hvaWNlcyIsIm1lc3NhZ2UiLCJuYW1lIiwibG9jYXRpb24iLCJhYm91dCIsIm9wZW5haUVycm9yIiwiZGV0YWlscyIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/ai/match-analysis/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ],\n    datasources: {\n        db: {\n            url: process.env.DATABASE_URL\n        }\n    }\n});\nif (true) globalForPrisma.prisma = prisma;\n// Handle database connection with retry logic\nconst connectWithRetry = async (retries = 3, delay = 1000)=>{\n    for(let i = 0; i < retries; i++){\n        try {\n            await prisma.$connect();\n            console.log(\"Successfully connected to MongoDB via Prisma\");\n            return;\n        } catch (err) {\n            console.error(`Failed to connect to database (attempt ${i + 1}/${retries}):`, err);\n            if (i === retries - 1) {\n                console.error(\"Max retries reached. Exiting process...\");\n                process.exit(1);\n            }\n            console.log(`Retrying in ${delay}ms...`);\n            await new Promise((resolve)=>setTimeout(resolve, delay));\n        }\n    }\n};\nconnectWithRetry();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxDQUFDO0lBQy9ESSxLQUFLO1FBQUM7UUFBUztRQUFTO0tBQU87SUFDL0JDLGFBQWE7UUFDWEMsSUFBSTtZQUNGQyxLQUFLQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7UUFDL0I7SUFDRjtBQUNGLEdBQUc7QUFFSCxJQUFJRixJQUF5QixFQUFjUCxnQkFBZ0JFLE1BQU0sR0FBR0E7QUFFcEUsOENBQThDO0FBQzlDLE1BQU1RLG1CQUFtQixPQUFPQyxVQUFVLENBQUMsRUFBRUMsUUFBUSxJQUFJO0lBQ3ZELElBQUssSUFBSUMsSUFBSSxHQUFHQSxJQUFJRixTQUFTRSxJQUFLO1FBQ2hDLElBQUk7WUFDRixNQUFNWCxPQUFPWSxRQUFRO1lBQ3JCQyxRQUFRWixHQUFHLENBQUM7WUFDWjtRQUNGLEVBQUUsT0FBT2EsS0FBSztZQUNaRCxRQUFRRSxLQUFLLENBQUMsQ0FBQyx1Q0FBdUMsRUFBRUosSUFBSSxFQUFFLENBQUMsRUFBRUYsUUFBUSxFQUFFLENBQUMsRUFBRUs7WUFDOUUsSUFBSUgsTUFBTUYsVUFBVSxHQUFHO2dCQUNyQkksUUFBUUUsS0FBSyxDQUFDO2dCQUNkVixRQUFRVyxJQUFJLENBQUM7WUFDZjtZQUNBSCxRQUFRWixHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUVTLE1BQU0sS0FBSyxDQUFDO1lBQ3ZDLE1BQU0sSUFBSU8sUUFBUUMsQ0FBQUEsVUFBV0MsV0FBV0QsU0FBU1I7UUFDbkQ7SUFDRjtBQUNGO0FBRUFGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VkZGluZy13ZWJzaXRlLy4vc3JjL2xpYi9kYi50cz85ZTRmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/PyBuZXcgUHJpc21hQ2xpZW50KHtcbiAgbG9nOiBbJ3F1ZXJ5JywgJ2Vycm9yJywgJ3dhcm4nXSxcbiAgZGF0YXNvdXJjZXM6IHtcbiAgICBkYjoge1xuICAgICAgdXJsOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcblxuLy8gSGFuZGxlIGRhdGFiYXNlIGNvbm5lY3Rpb24gd2l0aCByZXRyeSBsb2dpY1xuY29uc3QgY29ubmVjdFdpdGhSZXRyeSA9IGFzeW5jIChyZXRyaWVzID0gMywgZGVsYXkgPSAxMDAwKSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmV0cmllczsgaSsrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHByaXNtYS4kY29ubmVjdCgpO1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSBjb25uZWN0ZWQgdG8gTW9uZ29EQiB2aWEgUHJpc21hJyk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY29ubmVjdCB0byBkYXRhYmFzZSAoYXR0ZW1wdCAke2kgKyAxfS8ke3JldHJpZXN9KTpgLCBlcnIpO1xuICAgICAgaWYgKGkgPT09IHJldHJpZXMgLSAxKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ01heCByZXRyaWVzIHJlYWNoZWQuIEV4aXRpbmcgcHJvY2Vzcy4uLicpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhgUmV0cnlpbmcgaW4gJHtkZWxheX1tcy4uLmApO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgfVxuICB9XG59O1xuXG5jb25uZWN0V2l0aFJldHJ5KCk7ICJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwiZGF0YXNvdXJjZXMiLCJkYiIsInVybCIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJjb25uZWN0V2l0aFJldHJ5IiwicmV0cmllcyIsImRlbGF5IiwiaSIsIiRjb25uZWN0IiwiY29uc29sZSIsImVyciIsImVycm9yIiwiZXhpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/ms","vendor-chunks/openai","vendor-chunks/form-data-encoder","vendor-chunks/whatwg-url","vendor-chunks/agentkeepalive","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/humanize-ms","vendor-chunks/event-target-shim","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fai%2Fmatch-analysis%2Froute&page=%2Fapi%2Fai%2Fmatch-analysis%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fai%2Fmatch-analysis%2Froute.ts&appDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsubvivah%2Fhtdocs%2Fsubvivah.com&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();