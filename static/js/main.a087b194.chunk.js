(this["webpackJsonpworkout-tracker"]=this["webpackJsonpworkout-tracker"]||[]).push([[0],{41:function(e,t,r){},47:function(e,t,r){},49:function(e,t,r){"use strict";r.r(t);var n={};r.r(n),r.d(n,"en",(function(){return f})),r.d(n,"pt",(function(){return x}));var i=r(1),a=r.n(i),c=r(33),s=r.n(c),o=(r(41),r(15)),l=r(5),d=r(4),u=r(50),b=r(19),m=r(13),f={no_exercise:"No exercises to list.",start:"Start",close:"Close",complete:"Complete",reset:"Reset",sets:"Sets",reps:"Reps",history:"History",view:"View",last_run:"Last run",time:"Time",rest:"Rest",weight:"Weight",confirm_delete:"Are you sure you want to delete this workout and all its past registries?",save_progress:"Would you like to save your progress?",erase_workout:"Are you sure you want to erase the current workout?",back:"Back",reset_workout:"Reset workout",finish_workout:"Finish Workout",finish_exercise:"Finish exercise",start_workout:"Start workout",add_exercise:"Add exercise",exercise_name:"Exercise name",no_sets:"No sets for this exercise.",remove_set:"Remove set",add_set:"Add set",rpe_title_1:"Very light activity",rpe_title_2:"Light activity",rpe_title_3:"Light activity",rpe_title_4:"Moderate activity",rpe_title_5:"Moderate activity",rpe_title_6:"Moderate activity",rpe_title_7:"Vigorous activity",rpe_title_8:"Vigorous activity",rpe_title_9:"Very hard activity",rpe_title_10:"Max effort activity",rpe_desc_1:"Hardly any exertion, but more than sleeping, watching TV, etc.",rpe_desc_2:"Could mantain for hours. Easy to breathe and carry a conversation.",rpe_desc_3:"Could mantain for hours. Easy to breathe and carry a conversation.",rpe_desc_4:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_5:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_6:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_7:"Almost uncofortable, short of breath, can speak a sentence.",rpe_desc_8:"Almost uncofortable, short of breath, can speak a sentence.",rpe_desc_9:"Very difficult to mantain, can barely breathe, can speak a few words",rpe_desc_10:"Almost impossible to keep going. Out of breath, unable to talk.",rpe:"Rate of perceived exertion ",workouts_list:"Workouts list",workout_name:"Workout name",add_workout:"Add workout",remove_workout:"Remove workout",no_workout:"No workout"},x={no_exercise:"Nenhum exerc\xedcio para listar.",start:"Iniciar",close:"Fechar",complete:"Completar",reset:"Reiniciar",sets:"S\xe9ries",reps:"Repet.",time:"Tempo",history:"Hist\xf3rico",view:"Ver",last_run:"\xdaltima vez",rest:"Descanso",weight:"Peso",confirm_delete:"Tem certeza que deseja remover este treino e todos os registros dele?",save_progress:"Voc\xea gostaria de salvar seu progresso?",erase_workout:"Tem certeza que deseja apagar o treino atual?",back:"Voltar",reset_workout:"Apagar treino",finish_workout:"Concluir treino",finish_exercise:"Concluir exerc\xedcio",start_workout:"Iniciar treino",add_exercise:"Adicionar exerc\xedcio",exercise_name:"Nome do exerc\xedcio",no_sets:"Nenhuma s\xe9rie para este exerc\xedcio.",remove_set:"Remover s\xe9rie",add_set:"Adicionar s\xe9rie",rpe_title_1:"Atividade muito leve",rpe_title_2:"Atividade leve",rpe_title_3:"Atividade leve",rpe_title_4:"Atividade moderada",rpe_title_5:"Atividade moderada",rpe_title_6:"Atividade moderada",rpe_title_7:"Atividade vigorosa",rpe_title_8:"Atividade vigorosa",rpe_title_9:"Atividade muito dif\xedcil",rpe_title_10:"Esfor\xe7o m\xe1ximo",rpe_desc_1:"Quase nenhum esfor\xe7o, por\xe9m mais que assistir TV ou dormir.",rpe_desc_2:"Conseguiria manter por horas. Respira facilmente e consegue conversar normalmente.",rpe_desc_3:"Conseguiria manter por horas. Respira facilmente e consegue conversar normalmente.",rpe_desc_4:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_5:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_6:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_7:"Quase desconfort\xe1vel, falta f\xf4lego, consegue dizer uma frase no m\xe1ximo.",rpe_desc_8:"Quase desconfort\xe1vel, falta f\xf4lego, consegue dizer uma frase no m\xe1ximo.",rpe_desc_9:"Muito dif\xedcil de manter, mal consegue respirar, consegue dizer apenas algumas palavras.",rpe_desc_10:"Imposs\xedvel continuar, totalmente sem f\xf4lego, n\xe3o consegue falar.",rpe:"Escala de esfor\xe7o ",workouts_list:"Lista de treinos",workout_name:"Nome do treino",add_workout:"Adicionar treino",remove_workout:"Remover treino",no_workout:"Nenhum treino dispon\xedvel"};function p(){var e=Object(i.useState)("en"),t=Object(d.a)(e,2),r=t[0],a=t[1];Object(i.useEffect)((function(){var e=window.navigator.language.split("-")[0];["en","pt"].includes(e)?a(e):a("en")}),[]);var c=f;return{t:function(e){return n[r][e]||c[e]||e},language:r}}var j=r(6);function v(e){return e.sets.some((function(e){return"COMPLETE"!==e.stage}))}function g(e){if(e<0)return"-".concat(g(Math.abs(e)));var t=function(e){return"".concat(e%60).padStart(2,"0")},r=Math.floor(e/60);if(0===r)return"".concat(e);if(r>=60){var n=Math.floor(r/60);return"".concat(n,":").concat(t(r),":").concat(t(e))}return"".concat(r,":").concat(t(e))}var h=r(20);function O(){var e=window.localStorage.getItem("workouts");return e?JSON.parse(e):[]}function _(e){var t=window.localStorage.getItem(e);if(!t)return null;var r=JSON.parse(t);return r.date=new Date(r.date),r}function y(e){var t=window.localStorage,r="".concat((new Date).toISOString().split("T")[0],"_").concat(e),n=function(e){var t={id:e,isComplete:!0,activeSetId:null,activeExerciseId:null};t.date=new Date,t.name=document.querySelector(".workout-name").textContent.trim(),t.duration=Number(document.querySelector(".workout-duration").dataset.value),t.exercises=[];var r,n=document.querySelectorAll(".exercise"),i=Object(h.a)(n);try{for(i.s();!(r=i.n()).done;){var a=r.value,c={};c.name=a.querySelector(".exercise-name").textContent.trim(),c.id=a.dataset.id,c.sets=[];var s,o=a.querySelectorAll(".set-display"),l=Object(h.a)(o);try{for(l.s();!(s=l.n()).done;){var d=s.value,u={};u.id=d.dataset.id,u.defaultDurationTime=Number(d.querySelector(".time .value").dataset.value),u.defaultReps=Number(d.querySelector(".reps .value").dataset.value),u.defaultWeight=Number(d.querySelector(".weight .value").dataset.value),u.defaultRestTime=Number(d.querySelector(".rest .value").dataset.value),u.stage="COMPLETE",c.sets.push(u)}}catch(b){l.e(b)}finally{l.f()}c.rpe=Number(a.querySelector(".rpe").value),t.exercises.push(c)}}catch(b){i.e(b)}finally{i.f()}return JSON.stringify(t)}(e);t.setItem(r,n)}var w=r(14),E=r(25),k=r(0);function N(e){var t=e.children;return Object(k.jsx)("div",{className:"container bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center",children:t})}function I(e){var t=e.children;return Object(k.jsx)("div",{className:"fixed flex justify-center bottom-0 w-screen left-0",children:Object(k.jsx)("div",{className:"flex justify-end items-center border-t border-indigo-200 bg-white w-full max-w-5xl p-3 pb-6",children:t})})}function S(e){var t=e.Icon,r=e.type,n=void 0===r?"neutral":r,i=e.label,a=Object(E.a)(e,["Icon","type","label"]),c={primary:"bg-blue-500 ml-2 border-blue-600 focus:ring-blue-200 active:bg-blue-700",neutral:"bg-indigo-500 ml-2 border-indigo-600 focus:ring-indigo-200 active:bg-indigo-700",success:"bg-green-500 ml-2 border-green-600 focus:ring-green-200 active:bg-green-700"},s=c[n]||c.neutral;return Object(k.jsxs)("button",Object(w.a)(Object(w.a)({},a),{},{className:"border flex uppercase focus:ring-2 text-sm items-center text-white px-3 py-2 rounded-md ".concat(s),children:[t&&Object(k.jsx)(t,{className:"mr-1 text-lg"})," ",i]}))}function T(e){var t=e.type,r=void 0===t?"neutral":t,n=e.children,i={primary:"border-blue-500 text-blue-700",neutral:"border-indigo-500 text-indigo-700",success:"border-green-500 text-green-700"},a=i[r]||i.neutral;return Object(k.jsx)("div",{className:"text-xl mr-auto border-l-2 pl-2 bg-white ".concat(a),children:n})}function C(e){var t=e.small,r=void 0!==t&&t,n=e.className,i=e.children,a=r?"text-xs":"text-sm";return Object(k.jsx)("p",{className:"".concat(a," uppercase tracking-wider ").concat(n),children:i})}function A(e){var t=e.onSubmit,r=e.value,n=e.onChange,i=e.placeholder,a=e.label;return Object(k.jsxs)("form",{onSubmit:t,className:"m-3 pt-3 border-t border-indigo-200",children:[Object(k.jsx)("div",{className:"flex p-2 items-center bg-indigo-50 rounded-xl border border-indigo-200",children:Object(k.jsx)("input",{required:!0,value:r,onChange:n,className:"text-indigo-800 px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200",type:"text",placeholder:i})}),Object(k.jsx)("div",{className:"flex justify-end mt-1",children:Object(k.jsxs)("button",{className:"text-indigo-500 text-sm px-1",children:[" ",a]})})]})}function R(e){var t=e.isActive,r=void 0!==t&&t,n=e.type,i=void 0===n?"neutral":n,a=e.children,c={primary:"border-blue-200 bg-blue-50 ".concat(r?"ring-2 ring-blue-200":""),neutral:"border-indigo-200 bg-indigo-50 ".concat(r?"ring-2 ring-indigo-200":""),success:"border-green-200 bg-green-50 ".concat(r?"ring-2 ring-green-200":"")},s=c[i]||c.neutral;return Object(k.jsx)("div",{className:"p-2 border ".concat(s," rounded-xl"),children:a})}function D(e){var t=e.children;return Object(k.jsx)("ul",{className:"flex flex-col space-y-3",children:t})}function P(e){var t=e.isActive,r=e.children,n=e.className,i=Object(E.a)(e,["isActive","children","className"]),a=t?"ring-2 ring-indigo-200 border-indigo-400":"";return Object(k.jsx)("div",Object(w.a)(Object(w.a)({},i),{},{className:"bg-white p-2 rounded-md shadow border border-indigo-200 ".concat(a," ").concat(n),children:r}))}function M(e){var t=e.children,r=e.className;return Object(k.jsx)("h3",{className:"text-lg font-semibold text-indigo-800 ".concat(r),children:t})}function V(e){var t=e.children;return Object(k.jsx)("p",{className:"text-indigo-500 text-sm pb-1",children:t})}function L(e){var t=e.children,r=Object(E.a)(e,["children"]);return Object(k.jsx)("button",Object(w.a)(Object(w.a)({},r),{},{className:"text-indigo-500 text-sm px-1",children:t}))}function W(e){var t=e.children;return Object(k.jsx)("div",{className:"flex justify-end mt-1 space-x-4",children:t})}var q={pt:b.a,en:m.a};function F(e){var t=e.stage,r=e.onClick,n=void 0===r?function(){}:r,i=p().t,a={IDLE:i("start"),ACTIVE:i("rest"),RESTING:i("complete"),COMPLETE:i("reset")},c={IDLE:j.h,ACTIVE:j.g,RESTING:j.b,COMPLETE:j.i},s=a[t],o=c[t],l={IDLE:"neutral",ACTIVE:"neutral",RESTING:"neutral",COMPLETE:"primary"}[t];return Object(k.jsx)(S,{onClick:n,type:l,label:s,Icon:o})}function U(e){var t,r=e.state,n=e.dispatch,a=e.isReadOnly,c=p(),s=c.t,o=c.language,b=Object(l.f)(),m=Object(i.useState)(r.duration||0),f=Object(d.a)(m,2),x=f[0],h=f[1],O=Object(i.useState)(!1),_=Object(d.a)(O,2),w=_[0],E=_[1],N=Object(i.useState)(!1),A=Object(d.a)(N,2),R=A[0],D=A[1];Object(i.useEffect)((function(){if(R){var e=setInterval((function(){h((function(e){return e+1}))}),1e3);return function(){return clearInterval(e)}}}),[R]);var P=function(){b.push("/")},M=[null,null],V=r.exercises.find((function(e){return e.id===r.activeExerciseId})),L=V?V.sets.find((function(e){return e.id===r.activeSetId})):null,W=Boolean(L),U=r.exercises.length>0,J=(null===(t=r.exercises[0])||void 0===t?void 0:t.sets.length)>0;a||w?M[0]=Object(k.jsx)(S,{type:"primary",label:s("back"),onClick:P,Icon:j.a}):R?(W&&(M[0]=Object(k.jsx)(F,{onClick:function(){n({type:"UPDATE_SET_STAGE"})},stage:L.stage})),r.exercises.some(v)?v(V)||(M[1]=Object(k.jsx)(S,{type:"success",label:s("finish_exercise"),Icon:j.j,onClick:function(){n({type:"COMPLETE_EXERCISE"})}})):M[1]=Object(k.jsx)(S,{type:"success",label:s("finish_workout"),Icon:j.m,onClick:function(){window.confirm(s("save_progress"))&&y(r.id),E(!0),D(!1),n({type:"COMPLETE_WORKOUT"})}})):U&&J&&!w&&(M[0]=Object(k.jsx)(S,{type:"primary",label:s("start_workout"),onClick:function(){var e,t,i;D(!0),n({type:"UPDATE_ACTIVE_SET",payload:{exerciseId:null===(e=r.exercises[0])||void 0===e?void 0:e.id,setId:null===(t=r.exercises[0])||void 0===t||null===(i=t.sets[0])||void 0===i?void 0:i.id}}),n({type:"UPDATE_SET_STAGE"})},Icon:j.h}));var G=R||!w?"neutral":"success",B=q[o],z={};B&&(z.locale=B);var X=r.date||new Date;return Object(k.jsxs)(I,{children:[Object(k.jsxs)(T,{type:G,children:[Object(k.jsx)(j.k,{className:"inline -mt-1 mr-1 -ml-1"}),Object(k.jsx)("time",{className:"workout-duration","data-value":x,children:g(x)}),Object(k.jsx)(C,{small:!0,children:Object(u.a)(X,"PP",z)})]}),M[0]," ",M[1]]})}function J(e){var t=p().t,r=Object(i.useState)(""),n=Object(d.a)(r,2),a=n[0],c=n[1],s=e.dispatch;return Object(k.jsx)(A,{onSubmit:function(e){e.preventDefault(),c(""),s({type:"ADD_EXERCISE",payload:{name:a}})},onChange:function(e){return c(e.target.value)},placeholder:t("exercise_name"),label:t("add_exercise"),value:a})}function G(e){var t=e.inputProps,r=e.labelText,n=e.value,i=void 0===n?null:n,a=e.formatFunction,c=void 0===a?function(e){return e}:a,s=e.type,o=void 0===s?"neutral":s,l=e.isEdit,d=void 0!==l&&l,u=e.onToggleEdit,b=void 0===u?function(){}:u,m=e.onChange,f=void 0===m?function(){}:m,x={primary:"text-blue-800 bg-blue-50 border-blue-200 focus:ring-blue-100",neutral:"text-indigo-800 bg-indigo-50 border-indigo-200 focus:ring-indigo-100",success:"text-green-800 bg-green-50 border-green-200 focus:ring-green-100",danger:"text-red-800 bg-red-50 border-red-200 focus:ring-red-100",highlight:"text-cyan-800 bg-cyan-50 border-cyan-200 focus:ring-cyan-100"};return Object(k.jsxs)("label",{className:{primary:"text-blue-800",neutral:"text-indigo-800",success:"text-green-800",danger:"text-red-800",highlight:"text-cyan-800"}[o],children:[Object(k.jsx)(C,{className:"mb-1",children:r}),d?Object(k.jsx)("input",Object(w.a)(Object(w.a)({},t),{},{className:"block tabuler-nums w-full px-1 rounded shadow-sm border focus:ring-2 ".concat(x[o]),value:i,autoFocus:!0,onFocus:function(e){return e.target.select()},onBlur:function(){return d&&b(!1)},onChange:function(e){return f(Number(e.target.value))}})):Object(k.jsx)("span",{"data-value":i,tabIndex:0,onFocus:function(){return d||b(!0)},className:"value block tabuler-nums w-full px-1 rounded shadow-sm border ".concat(x[o]),children:c(Number(i))})]})}function B(e){var t=e.id,r=e.exerciseId,n=e.defaultDurationTime,a=void 0===n?0:n,c=e.defaultRestTime,s=void 0===c?30:c,o=e.defaultReps,l=void 0===o?8:o,u=e.defaultWeight,b=void 0===u?10:u,m=e.isReadOnly,f=void 0!==m&&m,x=e.onClick,j=void 0===x?function(){}:x,v=e.dispatch,h=void 0===v?function(){}:v,O=e.isActive,_=void 0===O||O,y=e.stage,w=void 0===y?"IDLE":y,E=Object(i.useState)(a),N=Object(d.a)(E,2),I=N[0],S=N[1],T=Object(i.useState)(s),C=Object(d.a)(T,2),A=C[0],R=C[1],D=Object(i.useState)(l),M=Object(d.a)(D,2),V=M[0],L=M[1],W=Object(i.useState)(b),q=Object(d.a)(W,2),F=q[0],U=q[1],J=Object(i.useState)(!1),B=Object(d.a)(J,2),z=B[0],X=B[1],K=Object(i.useState)(!1),H=Object(d.a)(K,2),Q=H[0],Y=H[1],Z=Object(i.useState)(!1),$=Object(d.a)(Z,2),ee=$[0],te=$[1],re=Object(i.useState)(!1),ne=Object(d.a)(re,2),ie=ne[0],ae=ne[1],ce=Object(i.useRef)(),se=p().t;Object(i.useEffect)((function(){(z||Q||ee||ie)&&h({type:"UPDATE_ACTIVE_SET",payload:{setId:t,exerciseId:r}})}),[h,z,Q,ie,ee,t,r]),Object(i.useEffect)((function(){"IDLE"===w&&"COMPLETE"===ce.current&&(S(0),R(s),L(l),U(b))}),[s,l,b,w]),Object(i.useEffect)((function(){ce.current=w}),[w]),Object(i.useEffect)((function(){if("ACTIVE"===w&&!z){var e=setInterval((function(){S((function(e){return Number(e)+1}))}),1e3);return function(){return clearInterval(e)}}}),[w,z]),Object(i.useEffect)((function(){if("RESTING"===w&&!ie){var e=setInterval((function(){R((function(e){return Number(e)-1}))}),1e3);return function(){return clearInterval(e)}}}),[w,s,ie]);var oe={type:"number",pattern:"\\d+",min:"0",inputMode:"numeric"},le="COMPLETE"===w?"success":"neutral";return Object(k.jsxs)(P,{onClick:j,"data-id":t,className:"set-display flex space-x-2",isActive:_&&!f,children:[Object(k.jsx)("div",{className:"time flex-1",children:Object(k.jsx)(G,{inputProps:oe,isEdit:z&&!f,onToggleEdit:X,onChange:S,value:I,formatFunction:g,type:"ACTIVE"===w?"highlight":le,labelText:se("time"),defaultValue:"0"})}),Object(k.jsx)("div",{className:"reps flex-1",children:Object(k.jsx)(G,{inputProps:oe,isEdit:Q&&!f,onToggleEdit:Y,onChange:L,value:V,type:le,labelText:se("reps"),defaultValue:"8"})}),Object(k.jsx)("div",{className:"weight flex-1",children:Object(k.jsx)(G,{inputProps:oe,isEdit:ee&&!f,onToggleEdit:te,onChange:U,value:F,type:le,labelText:se("weight"),defaultValue:"10"})}),Object(k.jsx)("div",{className:"rest flex-1",children:Object(k.jsx)(G,{inputProps:oe,isEdit:ie&&!f,onToggleEdit:ae,onChange:R,value:A,type:"RESTING"===w?A<0?"danger":"highlight":le,formatFunction:g,labelText:se("rest"),defaultValue:s})})]})}function z(e){var t=e.defaultRPE,r=void 0===t?5:t,n=e.isReadOnly,a=p().t,c=Object(i.useState)(r),s=Object(d.a)(c,2),o=s[0],l=s[1],u=Object(i.useState)(!1),b=Object(d.a)(u,2),m=b[0],f=b[1],x=[a("rpe_title_1"),a("rpe_title_2"),a("rpe_title_3"),a("rpe_title_4"),a("rpe_title_5"),a("rpe_title_6"),a("rpe_title_7"),a("rpe_title_8"),a("rpe_title_9"),a("rpe_title_10")],v=[a("rpe_desc_1"),a("rpe_desc_2"),a("rpe_desc_3"),a("rpe_desc_4"),a("rpe_desc_5"),a("rpe_desc_6"),a("rpe_desc_7"),a("rpe_desc_8"),a("rpe_desc_9"),a("rpe_desc_10")];return Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)("hr",{className:"border-t border-indigo-200"}),Object(k.jsxs)(P,{children:[Object(k.jsxs)("span",{className:"uppercase text-sm tracking-wider text-indigo-700",children:[a("rpe"),Object(k.jsx)("button",{onClick:function(){return f(!m)},children:Object(k.jsx)(j.f,{className:"inline ml-1 mb-1"})})]}),Object(k.jsx)("input",{className:"rpe val-".concat(o),type:"range",min:"1",value:o,onChange:function(e){return n||l(e.target.value)},max:"10",step:"1"}),Object(k.jsx)("ul",{className:"tracks flex w-full justify-between text-xs -mt-1 text-indigo-700",children:Array.from(Array(10).keys()).map((function(e){return Object(k.jsx)("li",{children:e+1},e)}))}),m&&Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)("hr",{className:"mt-2 border-t border-indigo-200"}),Object(k.jsx)("h4",{className:"text-xs font-semibold mb-1 mt-2 text-indigo-700",children:x[o-1]}),Object(k.jsx)("p",{className:"text-xs text-indigo-700",children:v[o-1]})]})]})]})}r(47);function X(e){var t=e.id,r=e.name,n=e.sets,i=e.isFirst,a=void 0!==i&&i,c=e.isLast,s=void 0!==c&&c,o=e.isActive,l=void 0!==o&&o,d=e.isComplete,u=void 0!==d&&d,b=e.isReadOnly,m=void 0!==b&&b,f=e.defaultRPE,x=void 0===f?5:f,v=e.isWorkoutComplete,g=void 0!==v&&v,h=e.activeSetId,O=void 0===h?null:h,_=e.dispatch,y=void 0===_?function(){}:_,w=p().t,E=function(e){y({type:"UPDATE_ACTIVE_SET",payload:{exerciseId:t,setId:e}})},N=function(e){y({type:"MOVE_EXERCISE",payload:{exerciseId:t,factor:e}})};return Object(k.jsxs)("div",{className:"exercise relative","data-id":t,children:[g||m||Object(k.jsxs)("div",{className:"absolute top-1 right-1 text-indigo-500",children:[Object(k.jsx)("button",{disabled:s,onClick:function(){return N(1)},className:"disabled:opacity-50 p-2",children:Object(k.jsx)(j.c,{})}),Object(k.jsx)("button",{disabled:a,onClick:function(){return N(-1)},className:"disabled:opacity-50 p-2",children:Object(k.jsx)(j.d,{})})]}),Object(k.jsx)(R,{isActive:l,children:Object(k.jsxs)(D,{children:[Object(k.jsxs)(M,{className:"exercise-name",children:[Object(k.jsx)(j.e,{className:"inline text-xl mb-1"})," ",r]}),n.length?n.map((function(e){return Object(k.jsx)(B,{id:e.id,exerciseId:t,defaultDurationTime:e.defaultDurationTime,defaultWeight:e.defaultWeight,defaultRestTime:e.defaultRestTime,defaultReps:e.defaultReps,onClick:function(){return E(e.id)},onActivateSet:E,isActive:e.id===O,isReadOnly:m,stage:e.stage,dispatch:y},e.id)})):Object(k.jsx)(V,{children:w("no_sets")}),u&&n.length>0&&Object(k.jsx)(z,{defaultRPE:x,isReadOnly:m})]})}),g||m||Object(k.jsxs)(W,{children:[l&&null!==O&&Object(k.jsx)(L,{onClick:function(){y({type:"REMOVE_SET",payload:{exerciseId:t}})},children:w("remove_set")}),Object(k.jsx)(L,{onClick:function(){y({type:"ADD_SET",payload:{exerciseId:t}})},children:w("add_set")})]})]})}var K=r(36),H=r(35);function Q(){return crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}function Y(e,t){var r=Object(H.cloneDeep)(e);switch(t.type){case"ADD_SET":return function(e,t){var r=t.exerciseId,n=e.exercises.find((function(e){return e.id===r})),i=Q();return n.sets=[].concat(Object(K.a)(n.sets),[{id:i,stage:"IDLE"}]),e.activeSetId=i,e}(r,t.payload);case"REMOVE_SET":return function(e,t){var r=t.exerciseId,n=e.exercises.find((function(e){return e.id===r})),i=n.sets.findIndex((function(t){return t.id===e.activeSetId}));return-1!==i&&(n.sets.splice(i,1),e.activeSetId=null),e}(r,t.payload);case"UPDATE_ACTIVE_SET":return function(e,t){var r=t.setId,n=t.exerciseId;return e.activeSetId=r,e.activeExerciseId=n,e}(r,t.payload);case"UPDATE_SET_STAGE":return function(e,t){var r=e.exercises.find((function(t){return t.id===e.activeExerciseId})),n=r.sets.findIndex((function(t){return t.id===e.activeSetId}));if(-1===n)return e;var i=r.sets[n].stage,a=t||function(e){var t=["IDLE","ACTIVE","RESTING","COMPLETE"],r=t.findIndex((function(t){return t===e}));return t[(r+1)%t.length]}(i);if("COMPLETE"===a&&!t){var c=(n+1)%r.sets.length;e.activeSetId=c>0?r.sets[(n+1)%r.sets.length].id:null}return r.sets[n].stage=a,v(r)||(e.activeSetId=null),e}(r);case"COMPLETE_EXERCISE":return function(e){var t,r=(e.exercises.findIndex((function(t){return t.id===e.activeExerciseId}))+1)%e.exercises.length,n=e.exercises[r];return e.activeExerciseId=n.id,e.activeSetId=(null===(t=n.sets[0])||void 0===t?void 0:t.id)||null,e}(r);case"ADD_EXERCISE":return function(e,t){var r=t.name;return e.exercises.push({id:Q(),name:r,sets:[]}),e}(r,t.payload);case"COMPLETE_WORKOUT":return function(e){return e.isComplete=!0,e}(r);case"MOVE_EXERCISE":return function(e,t){var r=t.exerciseId,n=t.factor,i=e.exercises.findIndex((function(e){return e.id===r}));if(-1===i)return e;var a=Math.min(Math.max(0,i+n),e.exercises.length-1),c=e.exercises[i],s=e.exercises[a];return e.exercises[i]=s,e.exercises[a]=c,e}(r,t.payload);default:throw new Error}}function Z(e){var t=p().t,r=e.baseWorkout,n=e.readOnly,a=void 0!==n&&n,c=Object(i.useReducer)(Y,r),s=Object(d.a)(c,2),l=s[0],u=s[1];return Object(k.jsxs)("div",{children:[Object(k.jsxs)("header",{className:"flex items-center",children:[Object(k.jsx)("h2",{className:"workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4",children:l.name}),Object(k.jsx)(o.b,{className:"text-blue-500 ml-auto px-3 pt-4",to:"/",children:t("close")})]}),Object(k.jsxs)("main",{children:[l.exercises.length>0?Object(k.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:l.exercises.map((function(e,t){return Object(k.jsx)("li",{children:Object(k.jsx)(X,{id:e.id,isFirst:0===t,isWorkoutComplete:l.isComplete,isLast:t===l.exercises.length-1,isActive:e.id===l.activeExerciseId&&!a,isComplete:!v(e),isReadOnly:a,name:e.name,sets:e.sets,defaultRPE:e.rpe,activeSetId:l.activeSetId,dispatch:u})},e.id)}))}):Object(k.jsx)("p",{className:"px-3 my-2 text-indigo-500",children:t("no_exercise")}),l.isComplete||a||Object(k.jsx)(J,{dispatch:u})]}),Object(k.jsx)(U,{isReadOnly:a,state:l,dispatch:u})]})}var $={pt:b.a,en:m.a};function ee(){var e=Object(i.useState)(function(){for(var e=window.localStorage,t=[],r=0,n=Object.keys(e);r<n.length;r++){var i=n[r],a=i.split("_"),c=Object(d.a)(a,2),s=c[0],o=c[1];if(Date.parse(s)&&o){var l=JSON.parse(e.getItem(i));l.persistenceKey=i,t.push(l)}}return t}()),t=Object(d.a)(e,2),r=t[0],n=t[1],a=p(),c=a.t,s=a.language,l=function(e){!function(e){window.localStorage.removeItem(e)}(e),n(r.filter((function(t){return t.persistenceKey!==e})))};if(!r.length)return null;var b=$[s],m={};return b&&(m.locale=b),Object(k.jsxs)("div",{children:[Object(k.jsx)("h2",{className:"workout-name text-2xl text-blue-800 font-semibold px-3 pt-4",children:c("history")}),Object(k.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:r.map((function(e){return Object(k.jsxs)("div",{className:"p-2 border border-blue-200 relative flex flex-wrap bg-blue-50 rounded-xl",children:[Object(k.jsx)("button",{onClick:function(){return l(e.persistenceKey)},className:"absolute p-2 top-0 right-0 text-blue-400",children:Object(k.jsx)(j.l,{})}),Object(k.jsxs)("h2",{className:"text-blue-700 w-full text-md",children:[Object(k.jsx)(j.e,{className:"-mt-1 inline text-lg"})," ",e.name]}),Object(k.jsx)("p",{className:"text-blue-600 text-sm",children:Object(u.a)(new Date(e.date),"PP",m)}),Object(k.jsx)(o.b,{className:"bg-blue-600 text-white block px-3 py-2 rounded shadow focus:ring-2 focus:ring-blue-300 ml-auto mt-2 text-xs uppercase tracking-wider",to:{pathname:"/viewWorkout",search:"?id=".concat(e.id)},children:c("view")})]},e.id)}))})]})}function te(e){var t=p().t,r=Object(i.useState)(""),n=Object(d.a)(r,2),a=n[0],c=n[1],s=e.onAddWorkout,o=void 0===s?function(){}:s;return Object(k.jsx)(A,{onSubmit:function(e){e.preventDefault(),o(a),c("")},onChange:function(e){return c(e.target.value)},placeholder:t("workout_name"),label:t("add_workout"),value:a})}var re=r(51),ne={pt:b.a,en:m.a};function ie(e){var t=e.name,r=e.onRemoveWorkout,n=e.id,i=p(),a=i.t,c=i.language,s=function(e){var t=window.localStorage,r=Object.keys(t).filter((function(t){return t.includes(e)})).sort().reverse()[0];return r?new Date(_(r).date):null}(n),l=ne[c],d={};return l&&(d.locale=l),Object(k.jsxs)("div",{className:"p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl",children:[Object(k.jsx)("button",{onClick:function(){return r(n)},className:"p-2 absolute top-0 right-0 text-indigo-400",children:Object(k.jsx)(j.l,{})}),Object(k.jsxs)("h2",{className:"text-indigo-700 w-full text-md",children:[Object(k.jsx)(j.e,{className:"-mt-1 inline text-lg"})," ",t]}),s&&Object(k.jsxs)("p",{className:"text-indigo-600 text-sm",children:[a("last_run"),": ",Object(re.a)(s,new Date,d)]}),Object(k.jsx)(o.b,{to:{pathname:"/newWorkout",search:"?id=".concat(n)},className:"bg-indigo-600 text-white block px-3 py-2 rounded shadow focus:ring-2 focus:ring-indigo-300 ml-auto mt-2 text-xs uppercase tracking-wider",children:a("start")})]})}function ae(){var e=p().t,t=Object(i.useState)(O()),r=Object(d.a)(t,2),n=r[0],a=r[1],c=function(t){window.confirm(e("confirm_delete"))&&(!function(e){var t=window.localStorage,r=t.getItem("workouts"),n=r?JSON.parse(r):[];t.setItem("workouts",JSON.stringify(n.filter((function(t){return t.id!==e}))));for(var i=0,a=Object.keys(t);i<a.length;i++){var c=a[i];c.includes(e)&&t.removeItem(c)}}(t),a(n.filter((function(e){return e.id!==t}))),window.location.reload())};return Object(k.jsxs)("div",{children:[Object(k.jsx)("h2",{className:"workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4",children:e("workouts_list")}),n.length>0?Object(k.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:n.map((function(e){return Object(k.jsx)(ie,{id:e.id,name:e.name,onRemoveWorkout:c},e.id)}))}):Object(k.jsx)("p",{className:"px-3 my-2 text-indigo-500",children:e("no_workout")}),Object(k.jsx)(te,{onAddWorkout:function(e){var t={id:Q(),name:e,exercises:[]};!function(e){var t=window.localStorage,r=t.getItem("workouts"),n=r?JSON.parse(r):[];n.push(e),t.setItem("workouts",JSON.stringify(n))}(t),a(n.concat([t]))}})]})}var ce=function(){var e=function(e){var t=new URLSearchParams(e.location.search).get("id"),r="/newWorkout"===e.match.path,n=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=window.localStorage,n=_(Object.keys(r).filter((function(t){return t.includes(e)})).sort().reverse()[0])||O().find((function(t){return t.id===e}));t?(n.date=new Date,n.isComplete=!1,n.duration=0):n.date=new Date(n.date);var i,a=Object(h.a)(n.exercises);try{for(a.s();!(i=a.n()).done;){var c,s=i.value,o=Object(h.a)(s.sets);try{for(o.s();!(c=o.n()).done;){c.value.stage=t?"IDLE":"COMPLETE"}}catch(l){o.e(l)}finally{o.f()}}}catch(l){a.e(l)}finally{a.f()}return n}(t,r);return Object(k.jsx)(Z,{baseWorkout:n,readOnly:!r})};return Object(k.jsx)(N,{children:Object(k.jsx)(o.a,{basename:"/WorkoutTracker",children:Object(k.jsxs)(l.c,{children:[Object(k.jsxs)(l.a,{exact:!0,path:"/",children:[Object(k.jsx)(ae,{}),Object(k.jsx)(ee,{})]}),Object(k.jsx)(l.a,{path:"/viewWorkout",render:e}),Object(k.jsx)(l.a,{path:"/newWorkout",render:e})]})})})};s.a.render(Object(k.jsx)(a.a.StrictMode,{children:Object(k.jsx)(ce,{})}),document.getElementById("root"))}},[[49,1,2]]]);
//# sourceMappingURL=main.a087b194.chunk.js.map