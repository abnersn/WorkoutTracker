(this["webpackJsonpworkout-tracker"]=this["webpackJsonpworkout-tracker"]||[]).push([[0],{46:function(e,t,r){},53:function(e,t,r){},55:function(e,t,r){"use strict";r.r(t);var n={};r.r(n),r.d(n,"en",(function(){return p})),r.d(n,"pt",(function(){return x}));var a=r(1),i=r.n(a),c=r(35),s=r.n(c),o=(r(46),r(17)),u=r(5),l=r(4),d=r(56),b=r(21),f=r(16),p={no_exercise:"No exercises to list.",start:"Start",close:"Close",complete:"Complete",reset:"Reset",sets:"Sets",reps:"Reps",history:"History",view:"View",last_run:"Last run",time:"Time",rest:"Rest",weight:"Weight",confirm_delete:"Are you sure you want to delete this workout?",save_progress:"Would you like to save your progress?",erase_workout:"Are you sure you want to erase the current workout?",back:"Back",reset_workout:"Reset workout",finish_workout:"Finish Workout",finish_exercise:"Finish exercise",start_workout:"Start workout",add_exercise:"Add exercise",exercise_name:"Exercise name",no_sets:"No sets for this exercise.",remove_set:"Remove set",add_set:"Add set",rpe_title_1:"Very light activity",rpe_title_2:"Light activity",rpe_title_3:"Light activity",rpe_title_4:"Moderate activity",rpe_title_5:"Moderate activity",rpe_title_6:"Moderate activity",rpe_title_7:"Vigorous activity",rpe_title_8:"Vigorous activity",rpe_title_9:"Very hard activity",rpe_title_10:"Max effort activity",rpe_desc_1:"Hardly any exertion, but more than sleeping, watching TV, etc.",rpe_desc_2:"Could mantain for hours. Easy to breathe and carry a conversation.",rpe_desc_3:"Could mantain for hours. Easy to breathe and carry a conversation.",rpe_desc_4:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_5:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_6:"Breathing heavily, can mantain a conversation, but more challenging.",rpe_desc_7:"Almost uncofortable, short of breath, can speak a sentence.",rpe_desc_8:"Almost uncofortable, short of breath, can speak a sentence.",rpe_desc_9:"Very difficult to mantain, can barely breathe, can speak a few words",rpe_desc_10:"Almost impossible to keep going. Out of breath, unable to talk.",rpe:"Rate of perceived exertion ",workouts_list:"Workouts list",workout_name:"Workout name",add_workout:"Add workout",remove_workout:"Remove workout",no_workout:"No workout",load_error:"Could not load data",persist_error:"Could not save data"},x={no_exercise:"Nenhum exerc\xedcio para listar.",start:"Iniciar",close:"Fechar",complete:"Completar",reset:"Reiniciar",sets:"S\xe9ries",reps:"Repet.",time:"Tempo",history:"Hist\xf3rico",view:"Ver",last_run:"\xdaltima vez",rest:"Descanso",weight:"Peso",confirm_delete:"Tem certeza que deseja remover este treino?",save_progress:"Voc\xea gostaria de salvar seu progresso?",erase_workout:"Tem certeza que deseja apagar o treino atual?",back:"Voltar",reset_workout:"Apagar treino",finish_workout:"Concluir treino",finish_exercise:"Concluir exerc\xedcio",start_workout:"Iniciar treino",add_exercise:"Adicionar exerc\xedcio",exercise_name:"Nome do exerc\xedcio",no_sets:"Nenhuma s\xe9rie para este exerc\xedcio.",remove_set:"Remover s\xe9rie",add_set:"Adicionar s\xe9rie",rpe_title_1:"Atividade muito leve",rpe_title_2:"Atividade leve",rpe_title_3:"Atividade leve",rpe_title_4:"Atividade moderada",rpe_title_5:"Atividade moderada",rpe_title_6:"Atividade moderada",rpe_title_7:"Atividade vigorosa",rpe_title_8:"Atividade vigorosa",rpe_title_9:"Atividade muito dif\xedcil",rpe_title_10:"Esfor\xe7o m\xe1ximo",rpe_desc_1:"Quase nenhum esfor\xe7o, por\xe9m mais que assistir TV ou dormir.",rpe_desc_2:"Conseguiria manter por horas. Respira facilmente e consegue conversar normalmente.",rpe_desc_3:"Conseguiria manter por horas. Respira facilmente e consegue conversar normalmente.",rpe_desc_4:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_5:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_6:"Respira com dificuldade, conseguiria manter uma conversa, mas seria mais dif\xedcil.",rpe_desc_7:"Quase desconfort\xe1vel, falta f\xf4lego, consegue dizer uma frase no m\xe1ximo.",rpe_desc_8:"Quase desconfort\xe1vel, falta f\xf4lego, consegue dizer uma frase no m\xe1ximo.",rpe_desc_9:"Muito dif\xedcil de manter, mal consegue respirar, consegue dizer apenas algumas palavras.",rpe_desc_10:"Imposs\xedvel continuar, totalmente sem f\xf4lego, n\xe3o consegue falar.",rpe:"Escala de esfor\xe7o ",workouts_list:"Lista de treinos",workout_name:"Nome do treino",add_workout:"Adicionar treino",remove_workout:"Remover treino",no_workout:"Nenhum treino dispon\xedvel",load_error:"N\xe3o foi poss\xedvel carregar os dados",persist_error:"N\xe3o foi poss\xedvel salvar as altera\xe7\xf5es"};function m(){var e=Object(a.useState)("en"),t=Object(l.a)(e,2),r=t[0],i=t[1];Object(a.useEffect)((function(){var e=window.navigator.language.split("-")[0];["en","pt"].includes(e)?i(e):i("en")}),[]);var c=p;return{t:function(e){return n[r][e]||c[e]||e},language:r}}var j=r(7);function v(e){return e.sets.some((function(e){return"COMPLETE"!==e.stage}))}function h(e){if(e<0)return"-".concat(h(Math.abs(e)));var t=function(e){return"".concat(e%60).padStart(2,"0")},r=Math.floor(e/60);if(0===r)return"".concat(e);if(r>=60){var n=Math.floor(r/60);return"".concat(n,":").concat(t(r),":").concat(t(e))}return"".concat(r,":").concat(t(e))}var g=r(11),O=r(27),_=r(0);function y(e){var t=e.children;return Object(_.jsx)("div",{className:"container bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center",children:t})}function E(e){var t=e.children;return Object(_.jsx)("div",{className:"fixed flex justify-center bottom-0 w-screen left-0",children:Object(_.jsx)("div",{className:"flex justify-end items-center border-t border-indigo-200 bg-white w-full max-w-5xl p-3 pb-8",children:t})})}function k(e){var t=e.Icon,r=e.type,n=void 0===r?"neutral":r,a=e.label,i=Object(O.a)(e,["Icon","type","label"]),c={primary:"bg-blue-500 ml-2 border-blue-600 focus:ring-blue-200 active:bg-blue-700",neutral:"bg-indigo-500 ml-2 border-indigo-600 focus:ring-indigo-200 active:bg-indigo-700",success:"bg-green-500 ml-2 border-green-600 focus:ring-green-200 active:bg-green-700"},s=c[n]||c.neutral;return Object(_.jsxs)("button",Object(g.a)(Object(g.a)({},i),{},{className:"border flex uppercase focus:ring-2 text-sm items-center text-white px-3 py-2 rounded-md ".concat(s),children:[t&&Object(_.jsx)(t,{className:"mr-1 text-lg"})," ",a]}))}function w(e){var t=e.type,r=void 0===t?"neutral":t,n=e.children,a={primary:"border-blue-500 text-blue-700",neutral:"border-indigo-500 text-indigo-700",success:"border-green-500 text-green-700"},i=a[r]||a.neutral;return Object(_.jsx)("div",{className:"text-xl mr-auto border-l-2 pl-2 bg-white ".concat(i),children:n})}function I(e){var t=e.small,r=void 0!==t&&t,n=e.className,a=e.children,i=r?"text-xs":"text-sm";return Object(_.jsx)("p",{className:"".concat(i," uppercase tracking-wider ").concat(n),children:a})}function N(e){var t=e.onSubmit,r=e.value,n=e.onChange,a=e.placeholder,i=e.label;return Object(_.jsxs)("form",{onSubmit:t,className:"m-3 pt-3 border-t border-indigo-200",children:[Object(_.jsx)("div",{className:"flex p-2 items-center bg-indigo-50 rounded-xl border border-indigo-200",children:Object(_.jsx)("input",{required:!0,value:r,onChange:n,className:"text-indigo-800 px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200",type:"text",placeholder:a})}),Object(_.jsx)("div",{className:"flex justify-end mt-1",children:Object(_.jsxs)("button",{className:"text-indigo-500 text-sm px-1",children:[" ",i]})})]})}function S(e){var t=e.isActive,r=void 0!==t&&t,n=e.type,a=void 0===n?"neutral":n,i=e.children,c={primary:"border-blue-200 bg-blue-50 ".concat(r?"ring-2 ring-blue-200":""),neutral:"border-indigo-200 bg-indigo-50 ".concat(r?"ring-2 ring-indigo-200":""),success:"border-green-200 bg-green-50 ".concat(r?"ring-2 ring-green-200":"")},s=c[a]||c.neutral;return Object(_.jsx)("div",{className:"p-2 border ".concat(s," rounded-xl"),children:i})}function T(e){var t=e.children;return Object(_.jsx)("ul",{className:"flex flex-col space-y-3",children:t})}function C(e){var t=e.isActive,r=e.children,n=e.className,a=Object(O.a)(e,["isActive","children","className"]),i=t?"ring-2 ring-indigo-200 border-indigo-400":"";return Object(_.jsx)("div",Object(g.a)(Object(g.a)({},a),{},{className:"bg-white p-2 rounded-md shadow border border-indigo-200 ".concat(i," ").concat(n),children:r}))}function A(e){var t=e.children,r=e.className;return Object(_.jsx)("h3",{className:"text-lg font-semibold text-indigo-800 ".concat(r),children:t})}function R(e){var t=e.children;return Object(_.jsx)("p",{className:"text-indigo-500 text-sm pb-1",children:t})}function D(e){var t=e.children,r=Object(O.a)(e,["children"]);return Object(_.jsx)("button",Object(g.a)(Object(g.a)({},r),{},{className:"text-indigo-500 text-sm px-1",children:t}))}function L(e){var t=e.children;return Object(_.jsx)("div",{className:"flex justify-end mt-1 space-x-4",children:t})}var P=r(22),W=r(6),M=r.n(W),V=r(9),q=r(36),F=r(37),U=r(41),B=function(){function e(){Object(q.a)(this,e),this.db=null}return Object(F.a)(e,[{key:"init",value:function(){var e=Object(V.a)(M.a.mark((function e(){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("indexedDB"in window){e.next=3;break}return alert("This app needs indexedDb support to run."),e.abrupt("return");case 3:return e.next=5,Object(U.a)("workoutTracker",1,{upgrade:function(e){e.objectStoreNames.contains("workouts")||e.createObjectStore("workouts",{keyPath:"id"}),e.objectStoreNames.contains("logs")||e.createObjectStore("logs",{autoIncrement:!0})}});case 5:this.db=e.sent;case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getAllData",value:function(){var e=Object(V.a)(M.a.mark((function e(t){var r,n,a,i,c;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],n=this.db.transaction(t,"readonly"),a=n.objectStore(t),e.next=5,a.openCursor();case 5:i=e.sent;case 6:if(!i){e.next=15;break}return(c=i.value).persistenceKey=i.key,r.push(c),e.next=12,i.continue();case 12:i=e.sent,e.next=6;break;case 15:return e.abrupt("return",r);case 16:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getData",value:function(e,t){return this.db.transaction(e,"readonly").objectStore(e).get(t)}},{key:"runInWorkouts",value:function(e){var t=this.db.transaction("workouts","readwrite");return e(t.objectStore("workouts")),t.complete}},{key:"runInLogs",value:function(e){var t=this.db.transaction("logs","readwrite");return e(t.objectStore("logs")),t.complete}},{key:"saveLogEntry",value:function(e){return this.runInLogs((function(t){return t.add(e)}))}},{key:"eraseLogEntry",value:function(e){return this.runInLogs((function(t){return t.delete(e)}))}},{key:"saveWorkout",value:function(e){return this.runInWorkouts((function(t){return t.add(e)}))}},{key:"eraseWorkout",value:function(e){return this.runInWorkouts((function(t){return t.delete(e)}))}},{key:"getLastLogEntry",value:function(){var e=Object(V.a)(M.a.mark((function e(t){var r,n;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getAllData("logs");case 2:return r=e.sent,n=r.filter((function(e){return e.id===t})).sort((function(e,t){return t.date-e.date})),e.abrupt("return",n[0]);case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"loadWorkoutLogById",value:function(){var e=Object(V.a)(M.a.mark((function e(t){var r,n,a,i,c,s,o,u,l=arguments;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=!(l.length>1&&void 0!==l[1])||l[1],e.next=3,this.getLastLogEntry(t);case 3:if(n=e.sent,e.t0=n,e.t0){e.next=9;break}return e.next=8,this.getData("workouts",t);case 8:e.t0=e.sent;case 9:a=e.t0,r?(a.date=new Date,a.isComplete=!1,a.duration=0):a.date?a.date=new Date(a.date):a.date=new Date,i=Object(P.a)(a.exercises);try{for(i.s();!(c=i.n()).done;){s=c.value,o=Object(P.a)(s.sets);try{for(o.s();!(u=o.n()).done;)u.value.stage=r?"IDLE":"COMPLETE"}catch(d){o.e(d)}finally{o.f()}}}catch(d){i.e(d)}finally{i.f()}return e.abrupt("return",a);case 14:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}();function G(){var e=Object(a.useState)(null),t=Object(l.a)(e,2),r=t[0],n=t[1];return Object(a.useEffect)((function(){var e=new B;e.init().then((function(){return n(e)}))}),[]),r}function K(e){var t={id:e,isComplete:!0,activeSetId:null,activeExerciseId:null};t.date=new Date,t.name=document.querySelector(".workout-name").textContent.trim(),t.duration=Number(document.querySelector(".workout-duration").dataset.value),t.exercises=[];var r,n=document.querySelectorAll(".exercise"),a=Object(P.a)(n);try{for(a.s();!(r=a.n()).done;){var i=r.value,c={};c.name=i.querySelector(".exercise-name").textContent.trim(),c.id=i.dataset.id,c.sets=[];var s,o=i.querySelectorAll(".set-display"),u=Object(P.a)(o);try{for(u.s();!(s=u.n()).done;){var l=s.value,d={};d.id=l.dataset.id,d.defaultDurationTime=Number(l.querySelector(".time .value").dataset.value),d.defaultReps=Number(l.querySelector(".reps .value").dataset.value),d.defaultWeight=Number(l.querySelector(".weight .value").dataset.value),d.defaultRestTime=Number(l.querySelector(".rest .value").dataset.value),d.stage="COMPLETE",c.sets.push(d)}}catch(b){u.e(b)}finally{u.f()}c.rpe=Number(i.querySelector(".rpe").value),t.exercises.push(c)}}catch(b){a.e(b)}finally{a.f()}return t}var z={pt:b.a,en:f.a};function X(e){var t=e.stage,r=e.onClick,n=void 0===r?function(){}:r,a=m().t,i={IDLE:a("start"),ACTIVE:a("rest"),RESTING:a("complete"),COMPLETE:a("reset")},c={IDLE:j.h,ACTIVE:j.g,RESTING:j.b,COMPLETE:j.i},s=i[t],o=c[t],u={IDLE:"neutral",ACTIVE:"neutral",RESTING:"neutral",COMPLETE:"primary"}[t];return Object(_.jsx)(k,{onClick:n,type:u,label:s,Icon:o})}function H(e){var t,r=e.state,n=e.dispatch,i=e.isReadOnly,c=m(),s=c.t,o=c.language,b=G(),f=Object(u.f)(),p=Object(a.useState)(r.duration||0),x=Object(l.a)(p,2),g=x[0],O=x[1],y=Object(a.useState)(!1),N=Object(l.a)(y,2),S=N[0],T=N[1],C=Object(a.useState)(!1),A=Object(l.a)(C,2),R=A[0],D=A[1];Object(a.useEffect)((function(){if(R){var e=setInterval((function(){O((function(e){return e+1}))}),1e3);return function(){return clearInterval(e)}}}),[R]);var L=function(){f.push("/")},P=[null,null],W=r.exercises.find((function(e){return e.id===r.activeExerciseId})),M=W?W.sets.find((function(e){return e.id===r.activeSetId})):null,V=Boolean(M),q=r.exercises.length>0,F=(null===(t=r.exercises[0])||void 0===t?void 0:t.sets.length)>0;i||S?P[0]=Object(_.jsx)(k,{type:"primary",label:s("back"),onClick:L,Icon:j.a}):R?(V&&(P[0]=Object(_.jsx)(X,{onClick:function(){n({type:"UPDATE_SET_STAGE"})},stage:M.stage})),r.exercises.some(v)?v(W)||(P[1]=Object(_.jsx)(k,{type:"success",label:s("finish_exercise"),Icon:j.j,onClick:function(){n({type:"COMPLETE_EXERCISE"})}})):P[1]=Object(_.jsx)(k,{type:"success",label:s("finish_workout"),Icon:j.m,onClick:function(){if(window.confirm(s("save_progress"))){var e=K(r.id);null===b||void 0===b||b.saveLogEntry(e)}T(!0),D(!1),n({type:"COMPLETE_WORKOUT"})}})):q&&F&&!S&&(P[0]=Object(_.jsx)(k,{type:"primary",label:s("start_workout"),onClick:function(){var e,t,a;D(!0),n({type:"UPDATE_ACTIVE_SET",payload:{exerciseId:null===(e=r.exercises[0])||void 0===e?void 0:e.id,setId:null===(t=r.exercises[0])||void 0===t||null===(a=t.sets[0])||void 0===a?void 0:a.id}}),n({type:"UPDATE_SET_STAGE"})},Icon:j.h}));var U=R||!S?"neutral":"success",B=z[o],H={};B&&(H.locale=B);var Q=r.date||new Date;return Object(_.jsxs)(E,{children:[Object(_.jsxs)(w,{type:U,children:[Object(_.jsx)(j.k,{className:"inline -mt-1 mr-1 -ml-1"}),Object(_.jsx)("time",{className:"workout-duration","data-value":g,children:h(g)}),Object(_.jsx)(I,{small:!0,children:Object(d.a)(Q,"PP",H)})]}),P[0]," ",P[1]]})}function Q(e){var t=m().t,r=Object(a.useState)(""),n=Object(l.a)(r,2),i=n[0],c=n[1],s=e.dispatch;return Object(_.jsx)(N,{onSubmit:function(e){e.preventDefault(),c(""),s({type:"ADD_EXERCISE",payload:{name:i}})},onChange:function(e){return c(e.target.value)},placeholder:t("exercise_name"),label:t("add_exercise"),value:i})}function J(e){var t=e.inputProps,r=e.labelText,n=e.value,a=void 0===n?null:n,i=e.formatFunction,c=void 0===i?function(e){return e}:i,s=e.type,o=void 0===s?"neutral":s,u=e.isEdit,l=void 0!==u&&u,d=e.onToggleEdit,b=void 0===d?function(){}:d,f=e.onChange,p=void 0===f?function(){}:f,x={primary:"text-blue-800 bg-blue-50 border-blue-200 focus:ring-blue-100",neutral:"text-indigo-800 bg-indigo-50 border-indigo-200 focus:ring-indigo-100",success:"text-green-800 bg-green-50 border-green-200 focus:ring-green-100",danger:"text-red-800 bg-red-50 border-red-200 focus:ring-red-100",highlight:"text-cyan-800 bg-cyan-50 border-cyan-200 focus:ring-cyan-100"};return Object(_.jsxs)("label",{className:{primary:"text-blue-800",neutral:"text-indigo-800",success:"text-green-800",danger:"text-red-800",highlight:"text-cyan-800"}[o],children:[Object(_.jsx)(I,{className:"mb-1",children:r}),l?Object(_.jsx)("input",Object(g.a)(Object(g.a)({},t),{},{className:"block tabuler-nums w-full px-1 rounded shadow-sm border focus:ring-2 ".concat(x[o]),value:a,autoFocus:!0,onFocus:function(e){return e.target.select()},onBlur:function(){return l&&b(!1)},onChange:function(e){return p(Number(e.target.value))}})):Object(_.jsx)("span",{"data-value":a,tabIndex:0,onFocus:function(){return l||b(!0)},className:"value block tabuler-nums w-full px-1 rounded shadow-sm border ".concat(x[o]),children:c(Number(a))})]})}function Y(e){var t=e.id,r=e.exerciseId,n=e.defaultDurationTime,i=void 0===n?0:n,c=e.defaultRestTime,s=void 0===c?30:c,o=e.defaultReps,u=void 0===o?8:o,d=e.defaultWeight,b=void 0===d?10:d,f=e.isReadOnly,p=void 0!==f&&f,x=e.onClick,j=void 0===x?function(){}:x,v=e.dispatch,g=void 0===v?function(){}:v,O=e.isActive,y=void 0===O||O,E=e.stage,k=void 0===E?"IDLE":E,w=Object(a.useState)(i),I=Object(l.a)(w,2),N=I[0],S=I[1],T=Object(a.useState)(s),A=Object(l.a)(T,2),R=A[0],D=A[1],L=Object(a.useState)(u),P=Object(l.a)(L,2),W=P[0],M=P[1],V=Object(a.useState)(b),q=Object(l.a)(V,2),F=q[0],U=q[1],B=Object(a.useState)(!1),G=Object(l.a)(B,2),K=G[0],z=G[1],X=Object(a.useState)(!1),H=Object(l.a)(X,2),Q=H[0],Y=H[1],Z=Object(a.useState)(!1),$=Object(l.a)(Z,2),ee=$[0],te=$[1],re=Object(a.useState)(!1),ne=Object(l.a)(re,2),ae=ne[0],ie=ne[1],ce=Object(a.useRef)(),se=m().t;Object(a.useEffect)((function(){(K||Q||ee||ae)&&g({type:"UPDATE_ACTIVE_SET",payload:{setId:t,exerciseId:r}})}),[g,K,Q,ae,ee,t,r]),Object(a.useEffect)((function(){"IDLE"===k&&"COMPLETE"===ce.current&&(S(0),D(s),M(u),U(b))}),[s,u,b,k]),Object(a.useEffect)((function(){ce.current=k}),[k]),Object(a.useEffect)((function(){if("ACTIVE"===k&&!K){var e=setInterval((function(){S((function(e){return Number(e)+1}))}),1e3);return function(){return clearInterval(e)}}}),[k,K]),Object(a.useEffect)((function(){if("RESTING"===k&&!ae){var e=setInterval((function(){D((function(e){return Number(e)-1}))}),1e3);return function(){return clearInterval(e)}}}),[k,s,ae]);var oe={type:"number",pattern:"\\d+",min:"0",inputMode:"numeric"},ue="COMPLETE"===k?"success":"neutral";return Object(_.jsxs)(C,{onClick:j,"data-id":t,className:"set-display flex space-x-2",isActive:y&&!p,children:[Object(_.jsx)("div",{className:"time flex-1",children:Object(_.jsx)(J,{inputProps:oe,isEdit:K&&!p,onToggleEdit:z,onChange:S,value:N,formatFunction:h,type:"ACTIVE"===k?"highlight":ue,labelText:se("time"),defaultValue:"0"})}),Object(_.jsx)("div",{className:"reps flex-1",children:Object(_.jsx)(J,{inputProps:oe,isEdit:Q&&!p,onToggleEdit:Y,onChange:M,value:W,type:ue,labelText:se("reps"),defaultValue:"8"})}),Object(_.jsx)("div",{className:"weight flex-1",children:Object(_.jsx)(J,{inputProps:oe,isEdit:ee&&!p,onToggleEdit:te,onChange:U,value:F,type:ue,labelText:se("weight"),defaultValue:"10"})}),Object(_.jsx)("div",{className:"rest flex-1",children:Object(_.jsx)(J,{inputProps:oe,isEdit:ae&&!p,onToggleEdit:ie,onChange:D,value:R,type:"RESTING"===k?R<0?"danger":"highlight":ue,formatFunction:h,labelText:se("rest"),defaultValue:s})})]})}function Z(e){var t=e.defaultRPE,r=void 0===t?5:t,n=e.isReadOnly,i=m().t,c=Object(a.useState)(r),s=Object(l.a)(c,2),o=s[0],u=s[1],d=Object(a.useState)(!1),b=Object(l.a)(d,2),f=b[0],p=b[1],x=[i("rpe_title_1"),i("rpe_title_2"),i("rpe_title_3"),i("rpe_title_4"),i("rpe_title_5"),i("rpe_title_6"),i("rpe_title_7"),i("rpe_title_8"),i("rpe_title_9"),i("rpe_title_10")],v=[i("rpe_desc_1"),i("rpe_desc_2"),i("rpe_desc_3"),i("rpe_desc_4"),i("rpe_desc_5"),i("rpe_desc_6"),i("rpe_desc_7"),i("rpe_desc_8"),i("rpe_desc_9"),i("rpe_desc_10")];return Object(_.jsxs)(_.Fragment,{children:[Object(_.jsx)("hr",{className:"border-t border-indigo-200"}),Object(_.jsxs)(C,{children:[Object(_.jsxs)("span",{className:"uppercase text-sm tracking-wider text-indigo-700",children:[i("rpe"),Object(_.jsx)("button",{onClick:function(){return p(!f)},children:Object(_.jsx)(j.f,{className:"inline ml-1 mb-1"})})]}),Object(_.jsx)("input",{className:"rpe val-".concat(o),type:"range",min:"1",value:o,onChange:function(e){return n||u(e.target.value)},max:"10",step:"1"}),Object(_.jsx)("ul",{className:"tracks flex w-full justify-between text-xs -mt-1 text-indigo-700",children:Array.from(Array(10).keys()).map((function(e){return Object(_.jsx)("li",{children:e+1},e)}))}),f&&Object(_.jsxs)(_.Fragment,{children:[Object(_.jsx)("hr",{className:"mt-2 border-t border-indigo-200"}),Object(_.jsx)("h4",{className:"text-xs font-semibold mb-1 mt-2 text-indigo-700",children:x[o-1]}),Object(_.jsx)("p",{className:"text-xs text-indigo-700",children:v[o-1]})]})]})]})}r(53);function $(e){var t=e.id,r=e.name,n=e.sets,a=e.isFirst,i=void 0!==a&&a,c=e.isLast,s=void 0!==c&&c,o=e.isActive,u=void 0!==o&&o,l=e.isComplete,d=void 0!==l&&l,b=e.isReadOnly,f=void 0!==b&&b,p=e.defaultRPE,x=void 0===p?5:p,v=e.isWorkoutComplete,h=void 0!==v&&v,g=e.activeSetId,O=void 0===g?null:g,y=e.dispatch,E=void 0===y?function(){}:y,k=m().t,w=function(e){E({type:"UPDATE_ACTIVE_SET",payload:{exerciseId:t,setId:e}})},I=function(e){E({type:"MOVE_EXERCISE",payload:{exerciseId:t,factor:e}})};return Object(_.jsxs)("div",{className:"exercise relative","data-id":t,children:[h||f||Object(_.jsxs)("div",{className:"absolute top-1 right-1 text-indigo-500",children:[Object(_.jsx)("button",{disabled:s,onClick:function(){return I(1)},className:"disabled:opacity-50 p-2",children:Object(_.jsx)(j.c,{})}),Object(_.jsx)("button",{disabled:i,onClick:function(){return I(-1)},className:"disabled:opacity-50 p-2",children:Object(_.jsx)(j.d,{})})]}),Object(_.jsx)(S,{isActive:u,children:Object(_.jsxs)(T,{children:[Object(_.jsxs)(A,{className:"exercise-name",children:[Object(_.jsx)(j.e,{className:"inline text-xl mb-1"})," ",r]}),n.length?n.map((function(e){return Object(_.jsx)(Y,{id:e.id,exerciseId:t,defaultDurationTime:e.defaultDurationTime,defaultWeight:e.defaultWeight,defaultRestTime:e.defaultRestTime,defaultReps:e.defaultReps,onClick:function(){return w(e.id)},onActivateSet:w,isActive:e.id===O,isReadOnly:f,stage:e.stage,dispatch:E},e.id)})):Object(_.jsx)(R,{children:k("no_sets")}),d&&n.length>0&&Object(_.jsx)(Z,{defaultRPE:x,isReadOnly:f})]})}),h||f||Object(_.jsxs)(L,{children:[u&&null!==O&&Object(_.jsx)(D,{onClick:function(){E({type:"REMOVE_SET",payload:{exerciseId:t}})},children:k("remove_set")}),Object(_.jsx)(D,{onClick:function(){E({type:"ADD_SET",payload:{exerciseId:t}})},children:k("add_set")})]})]})}var ee=r(40),te=r(39);function re(){return crypto.getRandomValues(new Uint32Array(1))[0].toString(16)}function ne(e,t){var r=Object(te.cloneDeep)(e);switch(t.type){case"SET_WORKOUT":return t.payload;case"ADD_SET":return function(e,t){var r=t.exerciseId,n=e.exercises.find((function(e){return e.id===r})),a=re();return n.sets=[].concat(Object(ee.a)(n.sets),[{id:a,stage:"IDLE"}]),e.activeSetId=a,e}(r,t.payload);case"REMOVE_SET":return function(e,t){var r=t.exerciseId,n=e.exercises.find((function(e){return e.id===r})),a=n.sets.findIndex((function(t){return t.id===e.activeSetId}));return-1!==a&&(n.sets.splice(a,1),e.activeSetId=null),e}(r,t.payload);case"UPDATE_ACTIVE_SET":return function(e,t){var r=t.setId,n=t.exerciseId;return e.activeSetId=r,e.activeExerciseId=n,e}(r,t.payload);case"UPDATE_SET_STAGE":return function(e,t){var r=e.exercises.find((function(t){return t.id===e.activeExerciseId})),n=r.sets.findIndex((function(t){return t.id===e.activeSetId}));if(-1===n)return e;var a=r.sets[n].stage,i=t||function(e){var t=["IDLE","ACTIVE","RESTING","COMPLETE"],r=t.findIndex((function(t){return t===e}));return t[(r+1)%t.length]}(a);if("COMPLETE"===i&&!t){var c=(n+1)%r.sets.length;e.activeSetId=c>0?r.sets[(n+1)%r.sets.length].id:null}return r.sets[n].stage=i,v(r)||(e.activeSetId=null),e}(r);case"COMPLETE_EXERCISE":return function(e){var t,r=(e.exercises.findIndex((function(t){return t.id===e.activeExerciseId}))+1)%e.exercises.length,n=e.exercises[r];return e.activeExerciseId=n.id,e.activeSetId=(null===(t=n.sets[0])||void 0===t?void 0:t.id)||null,e}(r);case"ADD_EXERCISE":return function(e,t){var r=t.name;return e.exercises.push({id:re(),name:r,sets:[]}),e}(r,t.payload);case"COMPLETE_WORKOUT":return function(e){return e.isComplete=!0,e}(r);case"MOVE_EXERCISE":return function(e,t){var r=t.exerciseId,n=t.factor,a=e.exercises.findIndex((function(e){return e.id===r}));if(-1===a)return e;var i=Math.min(Math.max(0,a+n),e.exercises.length-1),c=e.exercises[a],s=e.exercises[i];return e.exercises[a]=s,e.exercises[i]=c,e}(r,t.payload);default:throw new Error}}function ae(e){var t=m().t,r=e.id,n=e.createNew,i=void 0===n||n,c=G(),s=Object(a.useReducer)(ne,null),u=Object(l.a)(s,2),d=u[0],b=u[1];return Object(a.useEffect)((function(){null===c||void 0===c||c.loadWorkoutLogById(r,i).then((function(e){b({type:"SET_WORKOUT",payload:e})}))}),[c]),d?Object(_.jsxs)("div",{children:[Object(_.jsxs)("header",{className:"flex items-center",children:[Object(_.jsx)("h2",{className:"workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4",children:d.name}),Object(_.jsx)(o.b,{className:"text-blue-500 ml-auto px-3 pt-4",to:"/",children:t("close")})]}),Object(_.jsxs)("main",{children:[d.exercises.length>0?Object(_.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:d.exercises.map((function(e,t){return Object(_.jsx)("li",{children:Object(_.jsx)($,{id:e.id,isFirst:0===t,isWorkoutComplete:d.isComplete,isLast:t===d.exercises.length-1,isActive:e.id===d.activeExerciseId&&i,isComplete:!v(e),isReadOnly:!i,name:e.name,sets:e.sets,defaultRPE:e.rpe,activeSetId:d.activeSetId,dispatch:b})},e.id)}))}):Object(_.jsx)("p",{className:"px-3 my-2 text-indigo-500",children:t("no_exercise")}),d.isComplete||!i||Object(_.jsx)(Q,{dispatch:b})]}),Object(_.jsx)(H,{isReadOnly:!i,state:d,dispatch:b})]}):null}var ie={pt:b.a,en:f.a};function ce(){var e=Object(a.useState)([]),t=Object(l.a)(e,2),r=t[0],n=t[1],i=G(),c=m(),s=c.t,u=c.language;Object(a.useEffect)((function(){null===i||void 0===i||i.getAllData("logs").then(n)}),[i]);var b=function(){var e=Object(V.a)(M.a.mark((function e(t){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:null===i||void 0===i||i.eraseLogEntry(t),n(r.filter((function(e){return e.persistenceKey!==t})));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();if(!r.length)return null;var f=ie[u],p={};return f&&(p.locale=f),Object(_.jsxs)("div",{children:[Object(_.jsx)("h2",{className:"workout-name text-2xl text-blue-800 font-semibold px-3 pt-4",children:s("history")}),Object(_.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:r.map((function(e){return Object(_.jsxs)(o.b,{to:{pathname:"/viewWorkout",search:"?id=".concat(e.id)},className:"p-2 border border-blue-200 relative flex flex-wrap bg-blue-50 rounded-xl",children:[Object(_.jsx)("button",{onClick:function(t){b(e.persistenceKey),t.preventDefault()},className:"absolute p-2 top-0 right-0 text-blue-400",children:Object(_.jsx)(j.l,{})}),Object(_.jsxs)("h2",{className:"text-blue-700 w-full text-md",children:[Object(_.jsx)(j.e,{className:"-mt-1 inline text-lg"})," ",e.name]}),Object(_.jsx)("p",{className:"text-blue-600 text-sm",children:Object(d.a)(e.date,"PP",p)})]},e.id)}))})]})}function se(e){var t=m().t,r=Object(a.useState)(""),n=Object(l.a)(r,2),i=n[0],c=n[1],s=e.onAddWorkout,o=void 0===s?function(){}:s;return Object(_.jsx)(N,{onSubmit:function(e){e.preventDefault(),o(i),c("")},onChange:function(e){return c(e.target.value)},placeholder:t("workout_name"),label:t("add_workout"),value:i})}var oe=r(57),ue={pt:b.a,en:f.a};function le(e){var t=e.name,r=e.onRemoveWorkout,n=e.id,i=Object(a.useState)(null),c=Object(l.a)(i,2),s=c[0],u=c[1],d=G(),b=m(),f=b.t,p=b.language;Object(a.useEffect)(Object(V.a)(M.a.mark((function e(){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:null===d||void 0===d||d.getLastLogEntry(n).then((function(e){e&&u(e.date)}));case 1:case"end":return e.stop()}}),e)}))),[d]);var x=ue[p],v={};return x&&(v.locale=x),Object(_.jsxs)(o.b,{to:{pathname:"/newWorkout",search:"?id=".concat(n)},className:"p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl",children:[Object(_.jsx)("button",{onClick:function(e){r(n),e.preventDefault()},className:"p-2 absolute top-0 right-0 text-indigo-400",children:Object(_.jsx)(j.l,{})}),Object(_.jsxs)("h2",{className:"text-indigo-700 w-full text-md",children:[Object(_.jsx)(j.e,{className:"-mt-1 inline text-lg"})," ",t]}),s&&Object(_.jsxs)("p",{className:"text-indigo-600 text-sm",children:[f("last_run"),": ",Object(oe.a)(s,new Date,v)]})]})}function de(){var e=G(),t=m().t,r=Object(a.useState)([]),n=Object(l.a)(r,2),i=n[0],c=n[1];Object(a.useEffect)((function(){null===e||void 0===e||e.getAllData("workouts").then(c)}),[e]);var s=function(){var t=Object(V.a)(M.a.mark((function t(r){var n;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n={id:re(),name:r,exercises:[]},!e){t.next=4;break}return t.next=4,e.saveWorkout(n);case 4:c(i.concat([n]));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),o=function(){var r=Object(V.a)(M.a.mark((function r(n){return M.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!window.confirm(t("confirm_delete"))){r.next=6;break}if(!e){r.next=5;break}return r.next=5,e.eraseWorkout(n);case 5:c(i.filter((function(e){return e.id!==n})));case 6:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}();return Object(_.jsxs)("div",{children:[Object(_.jsx)("h2",{className:"workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4",children:t("workouts_list")}),i.length>0?Object(_.jsx)("ul",{className:"flex flex-col space-y-4 p-3",children:i.map((function(e){return Object(_.jsx)(le,{id:e.id,name:e.name,onRemoveWorkout:o},e.id)}))}):Object(_.jsx)("p",{className:"px-3 my-2 text-indigo-500",children:t("no_workout")}),Object(_.jsx)(se,{onAddWorkout:s})]})}var be=function(){var e=function(e){var t=new URLSearchParams(e.location.search).get("id"),r="/newWorkout"===e.match.path;return Object(_.jsx)(ae,{id:t,createNew:r})};return Object(_.jsx)(y,{children:Object(_.jsx)(o.a,{basename:"/WorkoutTracker",children:Object(_.jsxs)(u.c,{children:[Object(_.jsxs)(u.a,{exact:!0,path:"/",children:[Object(_.jsx)(de,{}),Object(_.jsx)(ce,{})]}),Object(_.jsx)(u.a,{path:"/viewWorkout",render:e}),Object(_.jsx)(u.a,{path:"/newWorkout",render:e})]})})})};s.a.render(Object(_.jsx)(i.a.StrictMode,{children:Object(_.jsx)(be,{})}),document.getElementById("root"))}},[[55,1,2]]]);
//# sourceMappingURL=main.e0738671.chunk.js.map