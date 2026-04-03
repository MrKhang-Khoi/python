/* THEMIS ONLINE JUDGE v4 — AUTH EDITION */
const FIREBASE_CONFIG={apiKey:"AIzaSyABZz6HoxC80-bU8vci2Ss0-j7ip3X3oZ8",authDomain:"themis-hsg.firebaseapp.com",databaseURL:"https://themis-hsg-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"themis-hsg",storageBucket:"themis-hsg.firebasestorage.app",messagingSenderId:"985711152429",appId:"1:985711152429:web:3067e536a71ddfc46897a4"};
const TEACHER_PASS='admin@2025';
const PRESETS={'single-int':{name:'Một số nguyên',lines:[{variables:[{name:'N',type:'integer'}]}]},'multi-int-1line':{name:'Nhiều số/dòng',lines:[{variables:[{name:'A',type:'integer'},{name:'B',type:'integer'}]}]},'array-1d':{name:'Mảng 1D',lines:[{variables:[{name:'N',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]}]},'array-param':{name:'Mảng+tham số',lines:[{variables:[{name:'N',type:'integer'},{name:'K',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]}]},'string-only':{name:'Chuỗi',lines:[{variables:[{name:'S',type:'string'}]}]},'queries':{name:'Truy vấn',lines:[{variables:[{name:'N',type:'integer'},{name:'Q',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]},{variables:[{name:'L',type:'integer'},{name:'R',type:'integer'}],repeatRef:'Q'}]},'graph':{name:'Đồ thị',lines:[{variables:[{name:'N',type:'integer'},{name:'M',type:'integer'}]},{variables:[{name:'U',type:'integer'},{name:'V',type:'integer'}],repeatRef:'M'}]},'matrix':{name:'Ma trận',lines:[{variables:[{name:'N',type:'integer'},{name:'M',type:'integer'}]},{variables:[{name:'row',type:'array',lengthRef:'M'}],repeatRef:'N'}]}};
const DLIM=[{min:1,max:100,lenMin:1,lenMax:10},{min:1,max:1000000,lenMin:1,lenMax:100000}];

class DataGenerator{constructor(c){this.inputLines=c.inputLines;this.subtasks=c.subtasks;this.totalTests=c.totalTests;this.maxOverride=c.maxOverride||null}
generateAllInputs(){const r=[];let rem=this.totalTests;for(let i=0;i<this.subtasks.length;i++){const st=this.subtasks[i];const cnt=i===this.subtasks.length-1?rem:Math.round(this.totalTests*st.percent/100);rem-=cnt;for(let t=0;t<cnt;t++)r.push({input:this._gen(st.id,t,cnt),subtaskId:st.id,subtaskName:st.name})}return r}
_gen(stId,ti,tot){const lines=[];const vars={};for(const line of this.inputLines){let rep=1;if(line.repeatRef&&vars[line.repeatRef])rep=Math.max(1,vars[line.repeatRef]);for(let r=0;r<rep;r++){const parts=[];for(const v of line.variables){const lim=this._lim(v,stId);const val=this._val(v,lim,vars,ti,tot);if(v.type!=='array'&&v.type!=='string'){vars[v.name]=val;parts.push(String(val))}else if(v.type==='array')parts.push(val.join(' '));else parts.push(val)}lines.push(parts.join(' '))}}return lines.join('\n')}
_lim(v,stId){const b=(v.subtaskLimits&&v.subtaskLimits[stId])?{...v.subtaskLimits[stId]}:{min:1,max:100,lenMin:1,lenMax:10};if(this.maxOverride){b.max=Math.min(b.max,this.maxOverride);if(b.lenMax)b.lenMax=Math.min(b.lenMax,Math.min(this.maxOverride,20))}return b}
_val(v,l,vars,i,t){switch(v.type){case'integer':return this._int(l,i,t);case'float':return i===0?l.min:i===1?l.max:+(Math.random()*(l.max-l.min)+l.min).toFixed(2);case'array':return this._arr(v,l,vars,i,t);case'string':return this._str(v,l,i);default:return this._int(l,i,t)}}
_int(l,i,t){const mn=Math.ceil(l.min),mx=Math.floor(l.max);if(i===0)return mn;if(i===1&&t>1)return mx;return this._ri(mn,mx)}
_arr(v,l,vars,i,t){let len;if(v.lengthRef&&vars[v.lengthRef]!=null)len=Math.max(1,vars[v.lengthRef]);else{const lmn=l.lenMin||1,lmx=l.lenMax||10;len=i===0?lmn:i===1&&t>1?lmx:this._ri(lmn,lmx)}const mn=Math.ceil(l.min),mx=Math.floor(l.max);let p=v.pattern||'random';const ep=['min_all','max_all','ascending','descending','equal'];if(p==='random'&&i<ep.length&&t>ep.length)p=ep[i];switch(p){case'min_all':return Array(len).fill(mn);case'max_all':return Array(len).fill(mx);case'equal':{const val=this._ri(mn,mx);return Array(len).fill(val)}case'ascending':{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a.sort((x,y)=>x-y)}case'descending':{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a.sort((x,y)=>y-x)}default:{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a}}}
_str(v,l,i){const lmn=l.lenMin||1,lmx=l.lenMax||10;const len=i===0?lmn:i===1?lmx:this._ri(lmn,lmx);const cs={az:'abcdefghijklmnopqrstuvwxyz',AZ:'ABCDEFGHIJKLMNOPQRSTUVWXYZ','09':'0123456789',mixed:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'};const c=cs[v.charset||'az'];let s='';for(let j=0;j<len;j++)s+=c[Math.floor(Math.random()*c.length)];return s}
_ri(a,b){return Math.floor(Math.random()*(b-a+1))+a}}

class PyodideEngine{constructor(){this.py=null;this._r=false}async init(){if(this._r)return;this.py=await loadPyodide();this._r=true}isLoaded(){return this._r}
async runStdio(code,stdin){const e=stdin.replace(/\\/g,'\\\\').replace(/"""/g,'\\"\\"\\"');this.py.runPython(`import sys,io\nsys.stdin=io.StringIO("""${e}""")\nsys.stdout=io.StringIO()`);try{await this.py.runPythonAsync(code)}catch(err){this.py.runPython('sys.stdout=sys.__stdout__');throw new Error('Python: '+err.message)}const out=this.py.runPython('sys.stdout.getvalue()');this.py.runPython('sys.stdout=sys.__stdout__;sys.stdin=sys.__stdin__');return out.trim()}
async runFileIO(code,stdin,inp,outp){const e=stdin.replace(/\\/g,'\\\\').replace(/"""/g,'\\"\\"\\"');this.py.runPython(`import sys,io\nwith open("${inp}","w") as _f:\n    _f.write("""${e}""")\nsys.stdout=io.StringIO()`);try{await this.py.runPythonAsync(code)}catch(err){this.py.runPython('sys.stdout=sys.__stdout__');throw new Error('Python: '+err.message)}let out;try{out=this.py.runPython(`\ntry:\n    with open("${outp}","r") as _f:\n        _r=_f.read()\nexcept:\n    _r=sys.stdout.getvalue()\n_r`)}catch{out=this.py.runPython('sys.stdout.getvalue()')}this.py.runPython('sys.stdout=sys.__stdout__');return out.trim()}}

class GeminiHelper{constructor(){this.apiKey=localStorage.getItem('gemini_api_key')||''}setApiKey(k){this.apiKey=k;localStorage.setItem('gemini_api_key',k)}getApiKey(){return this.apiKey}
async generateCode(problem,fileIO=false,brute=false){if(!this.apiKey)throw new Error('Nhập Gemini API Key');const io=fileIO?'đọc file .INP ghi file .OUT':'dùng input()/print()';const mode=brute?'BRUTE FORCE đơn giản chắc đúng':'HIỆU QUẢ tối ưu thuật toán';const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:`Chuyên gia CP. Viết Python ${mode}. ${io}. CHỈ code, comment tiếng Việt.\n\nĐỀ: ${problem}`}]}],generationConfig:{temperature:brute?.1:.3}})});if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error?.message||'API Error')}const d=await r.json();const t=d.candidates?.[0]?.content?.parts?.[0]?.text||'';const m=t.match(/```python\n([\s\S]*?)```/);return m?m[1].trim():t.trim()}}

class StressTester{constructor(e){this.engine=e}
async run(cfg,main,brute,cnt,maxV,cb){await this.engine.init();const g=new DataGenerator({inputLines:cfg.inputLines,subtasks:[{id:cfg.subtasks[0]?.id||1,name:'S',percent:100}],totalTests:cnt,maxOverride:maxV});const ins=g.generateAllInputs();const fio=cfg.fileIO,tn=cfg.taskName||'B',up=cfg.uppercase;const inp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.INP':'.inp'),outp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.OUT':'.out');let pass=0,fail=0,errs=0,ff=null;for(let i=0;i<ins.length;i++){cb&&cb(i+1,ins.length);let mo,bo;try{mo=fio?await this.engine.runFileIO(main,ins[i].input,inp,outp):await this.engine.runStdio(main,ins[i].input)}catch(e){errs++;if(!ff)ff={index:i+1,input:ins[i].input,error:'Code chính: '+e.message};continue}try{bo=fio?await this.engine.runFileIO(brute,ins[i].input,inp,outp):await this.engine.runStdio(brute,ins[i].input)}catch(e){errs++;if(!ff)ff={index:i+1,input:ins[i].input,error:'Brute: '+e.message};continue}if(mo.trim()===bo.trim())pass++;else{fail++;if(!ff)ff={index:i+1,input:ins[i].input,mainOutput:mo,bruteOutput:bo}}await new Promise(r=>setTimeout(r,5))}return{passed:pass,failed:fail,errors:errs,total:ins.length,firstFail:ff}}}

class ThemisManager{constructor(){this.zip=null;this.taskName='BAITAP';this.testCases=[]}
setTaskName(n,up){let c=n.replace(/[^a-zA-Z0-9_]/g,'')||'BAITAP';this.taskName=up?c.toUpperCase():c.toLowerCase()}
addTestCase(i,input,output,stId,stName){this.testCases.push({index:i,input,output,subtaskId:stId,subtaskName:stName})}
async generateZip(){this.zip=new JSZip();const ext=this.taskName===this.taskName.toUpperCase()?['.INP','.OUT']:['.inp','.out'];for(const tc of this.testCases){const f=this.zip.folder('Test'+String(tc.index).padStart(2,'0'));f.file(this.taskName+ext[0],tc.input+'\n');f.file(this.taskName+ext[1],tc.output+'\n')}return await this.zip.generateAsync({type:'blob'})}
async downloadZip(){const b=await this.generateZip();const s=new Blob([b],{type:'application/zip'});const u=URL.createObjectURL(s);const a=document.createElement('a');a.href=u;a.download=this.taskName+'_Tests.zip';document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),5000)}
getPreviewData(){return this.testCases}clear(){this.testCases=[];this.zip=null}}

// ============ FIREBASE MANAGER ============
class FirebaseManager{
constructor(){firebase.initializeApp(FIREBASE_CONFIG);this.db=firebase.database();this._listeners=[]}
_ref(path){return this.db.ref(path)}
generateCode(){return String(Math.floor(100000+Math.random()*900000))}
async createRoom(title,teacher,timeLimit){const code=this.generateCode();await this._ref('rooms/'+code+'/info').set({title,teacher,timeLimit:parseInt(timeLimit)||90,createdAt:Date.now(),status:'waiting',startTime:0,problemCount:0});return code}
async publishProblem(roomCode,idx,data){await this._ref(`rooms/${roomCode}/problems/${idx}`).set(data);await this._ref(`rooms/${roomCode}/info/problemCount`).set(idx+1)}
async startContest(roomCode){await this._ref(`rooms/${roomCode}/info`).update({status:'active',startTime:Date.now()})}
async endContest(roomCode){await this._ref(`rooms/${roomCode}/info`).update({status:'ended'})}
async joinRoom(roomCode,name){const snap=await this._ref(`rooms/${roomCode}/info`).once('value');if(!snap.exists())throw new Error('Mã phòng không tồn tại');await this._ref(`rooms/${roomCode}/students/${name}`).update({joinedAt:Date.now()});return snap.val()}
async getProblems(roomCode){const snap=await this._ref(`rooms/${roomCode}/problems`).once('value');return snap.val()||[]}
async submitResult(roomCode,name,probIdx,result){await this._ref(`rooms/${roomCode}/students/${name}/submissions/${probIdx}`).set({score:result.score,submittedAt:Date.now(),details:result.details,code:result.code});const lbRef=this._ref(`rooms/${roomCode}/leaderboard/${name}`);await lbRef.transaction(cur=>{if(!cur)cur={name,totalScore:0,problems:{},lastSubmit:0};const old=cur.problems&&cur.problems[probIdx]||0;if(result.score>old){cur.totalScore=(cur.totalScore||0)-old+result.score;if(!cur.problems)cur.problems={};cur.problems[probIdx]=result.score}cur.lastSubmit=Date.now();return cur})}
listenRoomInfo(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/info`);ref.on('value',s=>cb(s.val()));this._listeners.push(()=>ref.off())}
listenLeaderboard(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/leaderboard`);ref.on('value',s=>cb(s.val()));this._listeners.push(()=>ref.off())}
listenStudents(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/students`);ref.on('value',s=>cb(s.val()));this._listeners.push(()=>ref.off())}
cleanup(){this._listeners.forEach(fn=>fn());this._listeners=[]}
// Account management — stored at ROOT /accounts/ (permanent)
async createAccount(username,password){await this._ref(`accounts/${username}`).set({password,createdAt:Date.now()})}
async createAccountsBulk(list){for(const item of list){await this._ref(`accounts/${item.name}`).set({password:item.pass,createdAt:Date.now()})}}
async deleteAccount(username){await this._ref(`accounts/${username}`).remove()}
async verifyStudent(username,password){const snap=await this._ref(`accounts/${username}`).once('value');if(!snap.exists())throw new Error('Tài khoản không tồn tại!');const acct=snap.val();if(acct.password!==password)throw new Error('Sai mật khẩu!');return true}
listenAccounts(cb){const ref=this._ref('accounts');ref.on('value',s=>cb(s.val()||{}));this._listeners.push(()=>ref.off())}
// Exercise management
async publishExercise(data){const id=Date.now().toString(36);await this._ref(`exercises/${id}`).set({...data,createdAt:Date.now()});return id}
async deleteExercise(id){await this._ref(`exercises/${id}`).remove()}
listenExercises(cb){const ref=this._ref('exercises');ref.on('value',s=>cb(s.val()||{}));this._listeners.push(()=>ref.off())}
async submitExerciseResult(exId,username,result){await this._ref(`exerciseResults/${exId}/${username}`).set({score:result.score,submittedAt:Date.now(),details:result.details,code:result.code||''})}
async getExerciseResults(exId,username){const snap=await this._ref(`exerciseResults/${exId}/${username}`).once('value');return snap.val()}
listenAllExerciseResults(cb){const ref=this._ref('exerciseResults');ref.on('value',s=>cb(s.val()||{}));this._listeners.push(()=>ref.off())}
async exportCSV(roomCode){const infoSnap=await this._ref(`rooms/${roomCode}/info`).once('value');const info=infoSnap.val();const lbSnap=await this._ref(`rooms/${roomCode}/leaderboard`).once('value');const lb=lbSnap.val();if(!lb)return'';const pCount=info.problemCount||1;let csv='Hạng,Họ tên,Tổng điểm';for(let i=0;i<pCount;i++)csv+=`,Bài ${i+1}`;csv+='\n';const sorted=Object.values(lb).sort((a,b)=>b.totalScore-a.totalScore||(a.lastSubmit-b.lastSubmit));sorted.forEach((s,i)=>{csv+=`${i+1},${s.name},${s.totalScore}`;for(let j=0;j<pCount;j++)csv+=`,${s.problems&&s.problems[j]||0}`;csv+='\n'});return csv}}

// ============ STUDENT GRADER ============
class StudentGrader{
constructor(engine){this.engine=engine}
async grade(code,testCases,subtasks,fileIO,taskName,uppercase,timePerTest,onProgress){
await this.engine.init();const inpF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.INP':'.inp');
const outF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.OUT':'.out');
const details=[];for(let i=0;i<testCases.length;i++){onProgress&&onProgress(i+1,testCases.length);const tc=testCases[i];const t0=performance.now();let verdict='AC',output='';
try{output=fileIO?await this.engine.runFileIO(code,tc.input,inpF,outF):await this.engine.runStdio(code,tc.input);const elapsed=performance.now()-t0;if(elapsed>timePerTest*1000)verdict='TLE';else if(output.trim()!==tc.output.trim())verdict='WA';details.push({testIdx:i,subtaskId:tc.subtaskId,verdict,time:Math.round(elapsed)})}catch(e){details.push({testIdx:i,subtaskId:tc.subtaskId,verdict:e.message.includes('TLE')?'TLE':'RE',time:Math.round(performance.now()-t0)})}await new Promise(r=>setTimeout(r,5))}
const score=this._calcScore(details,subtasks,testCases);return{score,details,code}}
_calcScore(details,subtasks,testCases){let total=0;for(const st of subtasks){const stTests=details.filter(d=>d.subtaskId===st.id);const allAC=stTests.length>0&&stTests.every(d=>d.verdict==='AC');if(allAC)total+=st.percent}return total}}

// ============ UI CONTROLLER ============
class UIController{
constructor(){this.pyEngine=new PyodideEngine();this.themis=new ThemisManager();this.gemini=new GeminiHelper();this.stress=new StressTester(this.pyEngine);this.fb=new FirebaseManager();this.grader=new StudentGrader(this.pyEngine);this.role=null;this.roomCode=null;this.studentName=null;this.problems=[];this.currentProbIdx=0;this.timerInterval=null;this.subtaskCounter=0;this.lineCounter=0;this.varCounter=0;this.cmMain=null;this.cmBrute=null;this.cmAiPreview=null;this.cmStudent=null;this.isGenerating=false;this.publishedCount=0}

init(){const $=id=>document.getElementById(id);
// Teacher role → show login panel
$('btn-role-teacher').onclick=()=>{$('teacher-login-panel').classList.remove('hidden');$('teacher-password').focus()};
$('btn-teacher-login').onclick=()=>this._teacherLogin();
$('teacher-password').onkeydown=e=>{if(e.key==='Enter')this._teacherLogin()};
// Student role
$('btn-role-student').onclick=()=>this._selectRole('student');
$('btn-back-splash-t').onclick=()=>{$('view-teacher').classList.add('hidden');$('splash').classList.remove('hidden');$('teacher-login-panel').classList.add('hidden');$('teacher-password').value='';$('teacher-login-error').textContent=''};
$('btn-back-splash-s').onclick=()=>{$('view-student').classList.add('hidden');$('stu-login').classList.remove('hidden');$('splash').classList.remove('hidden');$('stu-login-error').textContent=''}}

_teacherLogin(){const pass=document.getElementById('teacher-password').value;if(pass===TEACHER_PASS){document.getElementById('teacher-login-error').textContent='';this._selectRole('teacher')}else{document.getElementById('teacher-login-error').textContent='❌ Mật khẩu sai!';document.getElementById('teacher-password').classList.add('shake');setTimeout(()=>document.getElementById('teacher-password').classList.remove('shake'),500)}}

_selectRole(role){this.role=role;document.getElementById('splash').classList.add('hidden');if(role==='teacher')this._initTeacher();else this._initStudent()}

// ===== TEACHER =====
_initTeacher(){document.getElementById('view-teacher').classList.remove('hidden');this._initCM();this._bindTeacher();this.addSubtask(70,'Subtask 1');this.addSubtask(30,'Subtask 2');this._updateSTTotal();const k=this.gemini.getApiKey();if(k)document.getElementById('ai-api-key').value=k;this._validateForm();
// Load accounts immediately (root level)
this.fb.listenAccounts(accts=>{this._cachedAccounts=accts;this._renderAccountList(accts);this._renderProgress()});
// Load exercises for management
this.fb.listenExercises(exs=>{this._teacherExercises=exs;this._renderTeacherExerciseList(exs);this._renderProgress()});
// Load all exercise results for progress  
this.fb.listenAllExerciseResults(res=>{this._teacherExResults=res;this._renderTeacherExerciseList(this._teacherExercises||{});this._renderProgress()})}

_initCM(){if(this.cmMain)return;const cfg={mode:'python',lineNumbers:true,indentUnit:4,tabSize:4,matchBrackets:true,autoCloseBrackets:true,styleActiveLine:true,extraKeys:{'Tab':cm=>cm.execCommand('indentMore'),'Shift-Tab':cm=>cm.execCommand('indentLess'),'Ctrl-/':cm=>cm.execCommand('toggleComment')}};
document.getElementById('editor-main-wrap').innerHTML='';document.getElementById('editor-brute-wrap').innerHTML='';document.getElementById('editor-ai-preview').innerHTML='';
this.cmMain=CodeMirror(document.getElementById('editor-main-wrap'),{...cfg,value:'# Code đáp án\nn = int(input())\nprint(n * 2)\n'});this.cmMain.setSize(null,260);this.cmMain.on('change',()=>this._validateForm());
this.cmBrute=CodeMirror(document.getElementById('editor-brute-wrap'),{...cfg,value:'# Brute force\n'});this.cmBrute.setSize(null,180);
this.cmAiPreview=CodeMirror(document.getElementById('editor-ai-preview'),{...cfg,readOnly:true,value:''});this.cmAiPreview.setSize(null,180)}

_bindTeacher(){const $=id=>document.getElementById(id);
// Tabs
document.querySelectorAll('#code-tabs .tab-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('#code-tabs .tab-btn').forEach(x=>x.classList.remove('active'));document.querySelectorAll('#section-code .tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active');setTimeout(()=>{this.cmMain.refresh();this.cmBrute.refresh();this.cmAiPreview.refresh()},50)});
// File IO
$('chk-file-io').onchange=()=>{const f=$('chk-file-io').checked;const n=$('task-name').value||'BAITAP';$('io-hint').innerHTML=f?`Đọc <code>${n}.INP</code> ghi <code>${n}.OUT</code>`:`Dùng <code>input()</code> và <code>print()</code>`};
$('chk-uppercase').onchange=()=>{$('task-name').value=$('chk-uppercase').checked?$('task-name').value.toUpperCase():$('task-name').value.toLowerCase()};
$('btn-add-subtask').onclick=()=>{this.addSubtask(0);this._rebuildConstraints()};
$('total-tests').oninput=()=>this._updateSTTotal();
$('preset-select').onchange=e=>{if(e.target.value)this.applyPreset(e.target.value)};
$('btn-add-line').onclick=()=>this.addInputLine();
$('btn-generate').onclick=()=>this.startGeneration();
$('btn-download').onclick=()=>this.themis.downloadZip();
$('btn-dismiss-error').onclick=()=>$('error-area').classList.add('hidden');
// AI
$('ai-api-key').onchange=()=>this.gemini.setApiKey($('ai-api-key').value.trim());
$('btn-ai-generate').onclick=()=>this._aiGen(false);
$('btn-ai-brute').onclick=()=>this._aiGen(true);
$('btn-ai-use').onclick=()=>{this.cmMain.setValue(this.cmAiPreview.getValue());this._switchTab('tab-code');this._toast('Đã copy!','success')};
$('btn-ai-use-brute').onclick=()=>{this.cmBrute.setValue(this.cmAiPreview.getValue());this._switchTab('tab-stress');this._toast('Đã copy!','success')};
$('btn-stress-run').onclick=()=>this._runStress();
// Room
$('btn-create-room').onclick=()=>this._showCreateRoomModal();
$('btn-confirm-room').onclick=()=>this._confirmCreateRoom();
$('btn-cancel-room').onclick=()=>$('modal-create-room').classList.add('hidden');
$('btn-start-contest').onclick=()=>this._startContest();
$('btn-end-contest').onclick=()=>this._endContest();
$('btn-publish-problem').onclick=()=>this._publishProblem();
// Exercise modal
$('btn-publish-exercise').onclick=()=>this._showExerciseModal();
$('btn-confirm-exercise').onclick=()=>this._confirmPublishExercise();
$('btn-cancel-exercise').onclick=()=>$('modal-publish-exercise').classList.add('hidden');
$('btn-export-csv').onclick=()=>this._exportCSV();
// Accounts
$('btn-add-student').onclick=()=>{$('add-student-form').classList.remove('hidden');$('bulk-add-form').classList.add('hidden');$('new-stu-name').focus()};
$('btn-bulk-add').onclick=()=>{$('bulk-add-form').classList.remove('hidden');$('add-student-form').classList.add('hidden')};
$('btn-cancel-add').onclick=()=>$('add-student-form').classList.add('hidden');
$('btn-cancel-bulk').onclick=()=>$('bulk-add-form').classList.add('hidden');
$('btn-save-student').onclick=()=>this._addSingleStudent();
$('btn-save-bulk').onclick=()=>this._addBulkStudents()}

_switchTab(id){document.querySelectorAll('#code-tabs .tab-btn').forEach(b=>{b.classList.toggle('active',b.dataset.tab===id)});document.querySelectorAll('#section-code .tab-panel').forEach(p=>{p.classList.toggle('active',p.id===id)});setTimeout(()=>{this.cmMain.refresh();this.cmBrute.refresh();this.cmAiPreview.refresh()},50)}

async _aiGen(brute){const p=document.getElementById('ai-prompt').value.trim();if(!p){this._toast('Nhập đề bài','error');return}const k=document.getElementById('ai-api-key').value.trim();if(!k){this._toast('Nhập API Key','error');return}this.gemini.setApiKey(k);document.getElementById('ai-status').innerHTML='<span class="progress-spinner"></span> Đang sinh...';try{const code=await this.gemini.generateCode(p,document.getElementById('chk-file-io').checked,brute);this.cmAiPreview.setValue(code);document.getElementById('ai-preview').classList.remove('hidden');document.getElementById('ai-status').textContent='✅ Xong!';setTimeout(()=>this.cmAiPreview.refresh(),50)}catch(e){document.getElementById('ai-status').textContent='';this._toast('AI: '+e.message,'error')}}

async _runStress(){const mc=this.cmMain.getValue().trim(),bc=this.cmBrute.getValue().trim();if(!mc||!bc){this._toast('Nhập cả 2 code','error');return}if(!document.getElementById('input-lines-container').children.length){this._toast('Cấu hình input trước','error');return}const cfg=this.collectFormData();const cnt=parseInt(document.getElementById('stress-count').value)||50;const mx=parseInt(document.getElementById('stress-max-val').value)||100;document.getElementById('stress-progress').classList.remove('hidden');document.getElementById('stress-results').classList.add('hidden');try{const r=await this.stress.run(cfg,mc,bc,cnt,mx,(c,t)=>{document.getElementById('stress-progress-text').textContent=`Test ${c}/${t}...`});document.getElementById('stress-progress').classList.add('hidden');this._showStressResult(r)}catch(e){document.getElementById('stress-progress').classList.add('hidden');this._toast('Stress: '+e.message,'error')}}

_showStressResult(r){const el=document.getElementById('stress-results');el.classList.remove('hidden');if(r.failed===0&&r.errors===0){el.className='stress-results pass';el.innerHTML=`<div class="stress-result-header">✅ ${r.passed}/${r.total} ĐÚNG!</div><p style="color:var(--success);font-size:.85rem">Code chính khớp brute force.</p>`}else{el.className='stress-results fail';let h=`<div class="stress-result-header">❌ ${r.failed} sai, ${r.errors} lỗi / ${r.total}</div>`;if(r.firstFail){const f=r.firstFail;h+=`<div class="stress-fail-detail"><div class="stress-fail-label">Input (Test ${f.index}):</div>${this._esc(f.input)}\n\n`;h+=f.error?`<div class="stress-fail-label">Lỗi:</div>${this._esc(f.error)}`:`<div class="stress-fail-label">Code chính:</div>${this._esc(f.mainOutput)}\n<div class="stress-fail-label">Brute:</div>${this._esc(f.bruteOutput)}`;h+='</div>'}el.innerHTML=h}}

// Room management
_showCreateRoomModal(){document.getElementById('modal-create-room').classList.remove('hidden');document.getElementById('room-title').focus()}

async _confirmCreateRoom(){const title=document.getElementById('room-title').value.trim();const teacher=document.getElementById('room-teacher').value.trim();const time=document.getElementById('room-time').value.trim();if(!title||!teacher||!time){this._toast('Nhập đầy đủ thông tin','error');return}document.getElementById('modal-create-room').classList.add('hidden');try{this.roomCode=await this.fb.createRoom(title,teacher,time);document.getElementById('teacher-room-bar').classList.remove('hidden');document.getElementById('t-room-code').textContent=this.roomCode;this._setRoomStatus('waiting');this.fb.listenStudents(this.roomCode,s=>{document.getElementById('t-student-count').textContent=s?Object.keys(s).length:0});this.fb.listenLeaderboard(this.roomCode,lb=>this._renderLeaderboard(lb,'t-leaderboard-body'));document.getElementById('section-leaderboard-teacher').classList.remove('hidden');this._toast(`🏆 Phòng ${this.roomCode} đã tạo!`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// Account management (root level — no roomCode needed)
async _addSingleStudent(){const name=document.getElementById('new-stu-name').value.trim();const pass=document.getElementById('new-stu-pass').value.trim();if(!name||!pass){this._toast('Nhập tên và mật khẩu','error');return}try{await this.fb.createAccount(name,pass);document.getElementById('new-stu-name').value='';document.getElementById('new-stu-pass').value='';this._toast(`Đã tạo: ${name}`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _addBulkStudents(){const text=document.getElementById('bulk-students').value.trim();if(!text){this._toast('Nhập danh sách','error');return}const lines=text.split('\n').filter(l=>l.trim());const list=[];for(const line of lines){const parts=line.split(',').map(s=>s.trim());if(parts.length>=2)list.push({name:parts[0],pass:parts[1]});else this._toast(`Bỏ qua: ${line}`,'error')}if(!list.length)return;try{await this.fb.createAccountsBulk(list);document.getElementById('bulk-students').value='';document.getElementById('bulk-add-form').classList.add('hidden');this._toast(`Đã tạo ${list.length} tài khoản!`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_renderAccountList(accts){const c=document.getElementById('account-list');const keys=Object.keys(accts);if(!keys.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Chưa có tài khoản. Nhấn "+ Thêm HS" để tạo.</p>';return}let h='<table class="acct-table"><thead><tr><th>#</th><th>Tên đăng nhập</th><th>Mật khẩu</th><th>Xóa</th></tr></thead><tbody>';keys.forEach((k,i)=>{const a=accts[k];h+=`<tr><td>${i+1}</td><td style="font-weight:600">${this._esc(k)}</td><td><span class="acct-pass">${this._esc(a.password)}</span></td><td><button class="btn-danger-sm" onclick="window._uic._deleteAccount('${this._esc(k)}')">✕</button></td></tr>`});h+='</tbody></table>';c.innerHTML=h}

async _deleteAccount(name){if(!confirm(`Xóa tài khoản: ${name}?`))return;try{await this.fb.deleteAccount(name);this._toast(`Đã xóa: ${name}`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// Teacher exercise management
_renderTeacherExerciseList(exs){const c=document.getElementById('t-exercise-list');if(!exs||!Object.keys(exs).length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Chưa có bài tập nào.</p>';return}
const res=this._teacherExResults||{};
let h='<table class="acct-table"><thead><tr><th>#</th><th>Tên bài</th><th>Chủ đề</th><th>Tests</th><th>Ngày tạo</th><th>HS đã làm</th><th>Xóa</th></tr></thead><tbody>';
Object.keys(exs).forEach((k,i)=>{const ex=exs[k];const d=new Date(ex.createdAt);const tc=ex.testCases?ex.testCases.length:0;
const exRes=res[k]||{};const doneCount=Object.keys(exRes).length;
const totalAccts=this._cachedAccounts?Object.keys(this._cachedAccounts).length:0;
const pct=totalAccts>0?Math.round(doneCount/totalAccts*100):0;
const barColor=pct>=80?'var(--success)':pct>=40?'var(--warning,#f59e0b)':'var(--error)';
h+=`<tr><td>${i+1}</td><td style="font-weight:600">${this._esc(ex.title)}</td><td><span class="oj-ex-topic">${this._esc(ex.topic||'Chung')}</span></td><td>${tc}</td><td>${d.toLocaleDateString('vi')}</td>`;
h+=`<td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px;transition:width .3s"></div></div><span style="font-size:.78rem;color:var(--text-muted);white-space:nowrap">${doneCount}/${totalAccts}</span></div></td>`;
h+=`<td><button class="btn-danger-sm" onclick="window._uic._deleteExercise('${k}')">✕</button></td></tr>`});
h+='</tbody></table>';c.innerHTML=h}

async _deleteExercise(id){if(!confirm('Xóa bài tập này?'))return;try{await this.fb.deleteExercise(id);this._toast('Đã xóa bài tập!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// Student progress cross-table
_renderProgress(){const c=document.getElementById('t-progress-table');const exs=this._teacherExercises||{};const accts=this._cachedAccounts||{};const res=this._teacherExResults||{};
const exKeys=Object.keys(exs);const stuNames=Object.keys(accts);
if(!exKeys.length||!stuNames.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Cần có bài tập và tài khoản HS để hiển thị tiến độ.</p>';return}
let h='<div class="progress-table-wrap"><table class="progress-cross-table"><thead><tr><th class="sticky-col">Học sinh</th>';
exKeys.forEach(k=>h+=`<th title="${this._esc(exs[k].title)}">${this._esc(exs[k].title).substring(0,12)}</th>`);
h+='<th>Tổng</th></tr></thead><tbody>';
stuNames.sort().forEach(name=>{
h+=`<tr><td class="sticky-col" style="font-weight:600">${this._esc(name)}</td>`;
let totalScore=0;let doneCount=0;
exKeys.forEach(k=>{const r=res[k]&&res[k][name];
if(r){const s=r.score||0;totalScore+=s;doneCount++;
const cls=s>=100?'score-perfect':s>=50?'score-pass':'score-fail';
h+=`<td><span class="progress-score ${cls}">${s}</span></td>`}else{h+=`<td><span class="progress-score score-none">—</span></td>`}});
const avg=exKeys.length>0?Math.round(totalScore/exKeys.length):0;
h+=`<td><strong style="color:${avg>=80?'var(--success)':avg>=50?'var(--warning,#f59e0b)':'var(--text-muted)'}">${avg}</strong> <span style="font-size:.7rem;color:var(--text-muted)">(${doneCount}/${exKeys.length})</span></td></tr>`});
h+='</tbody></table></div>';c.innerHTML=h}

_setRoomStatus(s){const el=document.getElementById('t-room-status');el.textContent=s==='waiting'?'Chờ':s==='active'?'Đang thi':'Kết thúc';el.className='room-status-badge '+s}

async _startContest(){if(!this.roomCode)return;await this.fb.startContest(this.roomCode);this._setRoomStatus('active');this._toast('Cuộc thi bắt đầu!','success');this.fb.listenRoomInfo(this.roomCode,info=>{if(info&&info.startTime&&info.timeLimit){const end=info.startTime+info.timeLimit*60000;const upd=()=>{const rem=Math.max(0,end-Date.now());const m=Math.floor(rem/60000),s=Math.floor(rem%60000/1000);document.getElementById('t-room-timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(rem<=0){clearInterval(this.timerInterval);this._setRoomStatus('ended')}};this.timerInterval=setInterval(upd,1000);upd()}})}

async _endContest(){if(!this.roomCode)return;await this.fb.endContest(this.roomCode);this._setRoomStatus('ended');if(this.timerInterval)clearInterval(this.timerInterval);this._toast('Đã kết thúc!','info')}

async _publishProblem(){if(!this.roomCode){this._toast('Tạo phòng thi trước','error');return}if(!this.themis.testCases.length){this._toast('Sinh test trước','error');return}const cfg=this.collectFormData();const desc=document.getElementById('problem-description').value||document.getElementById('ai-prompt').value||'Không có mô tả';const data={title:cfg.taskName,description:desc,fileIO:cfg.fileIO,uppercase:cfg.uppercase,taskName:cfg.taskName,timePerTest:5,subtasks:cfg.subtasks,testCases:this.themis.testCases.map(tc=>({input:tc.input,output:tc.output,subtaskId:tc.subtaskId}))};try{await this.fb.publishProblem(this.roomCode,this.publishedCount,data);this._toast(`Đã đăng Bài ${this.publishedCount+1}: ${cfg.taskName}`,'success');this.publishedCount++}catch(e){this._toast('Lỗi publish: '+e.message,'error')}}

_showExerciseModal(){if(!this.themis.testCases.length){this._toast('Sinh test trước','error');return}const cfg=this.collectFormData();const desc=document.getElementById('problem-description').value||document.getElementById('ai-prompt').value||'Không có mô tả';document.getElementById('ex-title-input').value=cfg.taskName;document.getElementById('ex-desc-input').value=desc;document.getElementById('ex-test-count').textContent=this.themis.testCases.length;document.getElementById('ex-subtask-count').textContent=cfg.subtasks?cfg.subtasks.length:1;document.getElementById('modal-publish-exercise').classList.remove('hidden');document.getElementById('ex-topic').focus()}

async _confirmPublishExercise(){const topic=document.getElementById('ex-topic').value.trim()||'Không phân loại';const cfg=this.collectFormData();const desc=document.getElementById('ex-desc-input').value;const data={title:cfg.taskName,description:desc,topic:topic,fileIO:cfg.fileIO,uppercase:cfg.uppercase,taskName:cfg.taskName,timePerTest:5,subtasks:cfg.subtasks,testCases:this.themis.testCases.map(tc=>({input:tc.input,output:tc.output,subtaskId:tc.subtaskId}))};document.getElementById('modal-publish-exercise').classList.add('hidden');try{await this.fb.publishExercise(data);this._toast(`📚 Đã đăng bài tập: ${cfg.taskName} (${topic})`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _exportCSV(){if(!this.roomCode)return;const csv=await this.fb.exportCSV(this.roomCode);if(!csv){this._toast('Chưa có dữ liệu','error');return}const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`BangDiem_${this.roomCode}.csv`;document.body.appendChild(a);a.click();document.body.removeChild(a);this._toast('Đã xuất CSV!','success')}

// ===== STUDENT =====
_initStudent(){document.getElementById('view-student').classList.remove('hidden');
const $=id=>document.getElementById(id);
$('btn-stu-login').onclick=()=>this._stuLogin();
$('btn-stu-logout').onclick=()=>this._stuLogout();
$('btn-join-room').onclick=()=>this._joinRoom();
$('btn-stu-submit').onclick=()=>this._stuSubmit();
$('btn-stu-back-join').onclick=()=>{$('stu-ended').classList.add('hidden');$('stu-dashboard').classList.remove('hidden');this.fb.cleanup()};
$('stu-password').onkeydown=e=>{if(e.key==='Enter')this._stuLogin()};
// Dashboard nav tabs
document.querySelectorAll('.oj-nav-tab[data-tab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.oj-nav-tab[data-tab]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.oj-tab-panel').forEach(p=>p.classList.add('hidden'));$('tab-panel-'+btn.dataset.tab).classList.remove('hidden');if(btn.dataset.tab==='exercises'){this.fb.listenExercises(exs=>this._renderExerciseList(exs))}}});
// Back from contest to dashboard
const backBtn=$('btn-stu-back-dash');if(backBtn)backBtn.onclick=()=>{$('stu-contest').classList.add('hidden');$('stu-dashboard').classList.remove('hidden');if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}this.fb.cleanup()};
// Pane tabs (Desc/Results/Leaderboard)
document.querySelectorAll('.oj-ptab[data-ptab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));$('ptab-'+btn.dataset.ptab).classList.add('active')}});
// Draggable divider
this._initDivider();
// Auto-load exercises on dashboard show
this._exerciseResults={};
this.fb.listenExercises(exs=>{this._cachedExercises=exs;this._loadExerciseStatuses(exs)});
this.fb.listenAllExerciseResults(res=>{this._exerciseResults=res;if(this._cachedExercises)this._renderExerciseList(this._cachedExercises)})}

_loadExerciseStatuses(exs){this._renderExerciseList(exs)}

_initDivider(){const divider=document.getElementById('oj-divider');if(!divider)return;const left=document.getElementById('oj-pane-left');let dragging=false;divider.onmousedown=e=>{dragging=true;divider.classList.add('dragging');e.preventDefault()};document.onmousemove=e=>{if(!dragging)return;const container=left.parentElement;const rect=container.getBoundingClientRect();const pct=Math.min(70,Math.max(25,((e.clientX-rect.left)/rect.width)*100));left.style.width=pct+'%'};document.onmouseup=()=>{if(dragging){dragging=false;divider.classList.remove('dragging');if(this.cmStudent)this.cmStudent.refresh()}}}

async _stuLogin(){const name=document.getElementById('stu-name').value.trim();const pass=document.getElementById('stu-password').value;const errEl=document.getElementById('stu-login-error');errEl.textContent='';if(!name||!pass){errEl.textContent='⚠️ Nhập đầy đủ tên và mật khẩu';return}try{await this.fb.verifyStudent(name,pass);this.studentName=name;document.getElementById('stu-login').classList.add('hidden');document.getElementById('stu-dashboard').classList.remove('hidden');document.getElementById('stu-welcome-name').textContent=name;this._toast(`Xin chào ${name}!`,'success')}catch(e){errEl.textContent='❌ '+e.message}}

_stuLogout(){this.studentName=null;this.fb.cleanup();['stu-dashboard','stu-waiting','stu-contest','stu-ended'].forEach(id=>document.getElementById(id).classList.add('hidden'));document.getElementById('stu-login').classList.remove('hidden');document.getElementById('stu-name').value='';document.getElementById('stu-password').value=''}

_renderExerciseList(exs){const c=document.getElementById('exercise-list');const keys=Object.keys(exs);if(!keys.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">📭 Chưa có bài tập nào. Giáo viên chưa đăng.</p>';c.className='';return}
c.className='oj-exercise-list';
let h='<div class="oj-ex-header"><span>TRẠNG THÁI</span><span>BÀI TẬP</span><span>CHỦ ĐỀ</span><span>THÔNG TIN</span></div>';
keys.forEach(k=>{const ex=exs[k];const d=new Date(ex.createdAt);const tc=ex.testCases?ex.testCases.length:0;const topic=ex.topic||'Chung';
// Check if current student has completed this exercise
const myResult=this.studentName&&this._exerciseResults[k]&&this._exerciseResults[k][this.studentName];
const statusHtml=myResult?`<span class="oj-ex-status done" title="${myResult.score}/100 điểm">✅ ${myResult.score}</span>`:`<span class="oj-ex-status pending">○</span>`;
h+=`<div class="oj-ex-row ${myResult?'oj-ex-done':''}" onclick="window._uic._openExercise('${k}')">`;
h+=`${statusHtml}`;
h+=`<div class="oj-ex-info"><span class="oj-ex-title">${this._esc(ex.title)}</span><span class="oj-ex-desc">${this._esc(ex.description||'').substring(0,80)}</span></div>`;
h+=`<span class="oj-ex-topic">${this._esc(topic)}</span>`;
h+=`<div class="oj-ex-stats"><span>${tc} test</span><span>•</span><span>${d.toLocaleDateString('vi')}</span></div>`;
h+=`</div>`});c.innerHTML=h}

async _openExercise(exId){const snap=await this.fb.db.ref(`exercises/${exId}`).once('value');const ex=snap.val();if(!ex)return;this._currentExercise={id:exId,...ex};this.problems=[ex];this.currentProbIdx=0;document.getElementById('stu-dashboard').classList.add('hidden');document.getElementById('stu-contest').classList.remove('hidden');document.getElementById('stu-contest-title').textContent=ex.title;document.getElementById('stu-player-name').textContent=this.studentName;
document.getElementById('stu-timer').textContent='∞';document.getElementById('stu-timer').classList.remove('critical');
if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}
this._renderProblemTabs();this._showProblem(0);this._initStudentEditor();
// Restore saved code from previous submission
const prev=await this.fb.getExerciseResults(exId,this.studentName);
if(prev){
if(prev.code&&this.cmStudent){this.cmStudent.setValue(prev.code);this._toast(`📝 Đã khôi phục code trước (${prev.score}/100)`,'info')}else{this._toast(`Điểm trước: ${prev.score}/100`,'info')}
// Also show previous results
this._showStudentResults({score:prev.score,details:prev.details},ex)}
this.fb.listenLeaderboard(this.roomCode||'_ex_'+exId,lb=>this._renderLeaderboard(lb,'stu-leaderboard-body',this.studentName))}

async _joinRoom(){const code=document.getElementById('stu-room-code').value.trim();const errEl=document.getElementById('stu-join-error');errEl.textContent='';if(!code){errEl.textContent='⚠️ Nhập mã phòng thi';return}try{this.roomCode=code;this._currentExercise=null;const info=await this.fb.joinRoom(code,this.studentName);document.getElementById('stu-dashboard').classList.add('hidden');document.getElementById('stu-waiting-info').textContent=`Phòng: ${code} — ${info.title}`;if(info.status==='active'){this._stuStartContest(info)}else if(info.status==='ended'){document.getElementById('stu-ended').classList.remove('hidden')}else{document.getElementById('stu-waiting').classList.remove('hidden')}this.fb.listenRoomInfo(code,ri=>{if(!ri)return;if(ri.status==='active'){document.getElementById('stu-waiting').classList.add('hidden');this._stuStartContest(ri)}else if(ri.status==='ended'){if(this.timerInterval)clearInterval(this.timerInterval);document.getElementById('stu-contest').classList.add('hidden');document.getElementById('stu-ended').classList.remove('hidden');document.getElementById('stu-final-score').textContent='Cuộc thi kết thúc!'}});this._toast(`Đã vào phòng ${code}!`,'success')}catch(e){errEl.textContent='❌ '+e.message}}

async _stuStartContest(info){document.getElementById('stu-contest').classList.remove('hidden');document.getElementById('stu-contest-title').textContent=info.title;document.getElementById('stu-player-name').textContent=this.studentName;
const end=info.startTime+info.timeLimit*60000;const upd=()=>{const rem=Math.max(0,end-Date.now());const h=Math.floor(rem/3600000),m=Math.floor(rem%3600000/60000),s=Math.floor(rem%60000/1000);const el=document.getElementById('stu-timer');el.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;el.classList.toggle('critical',rem<300000);if(rem<=0){clearInterval(this.timerInterval);document.getElementById('btn-stu-submit').disabled=true}};this.timerInterval=setInterval(upd,1000);upd();
this.problems=await this.fb.getProblems(this.roomCode);if(!this.problems||!this.problems.length){document.getElementById('stu-problem-desc').textContent='Chưa có đề bài';return}this._renderProblemTabs();this._showProblem(0);this._initStudentEditor();
this.fb.listenLeaderboard(this.roomCode,lb=>this._renderLeaderboard(lb,'stu-leaderboard-body',this.studentName))}

_initStudentEditor(){if(!this.cmStudent){const cfg={mode:'python',lineNumbers:true,indentUnit:4,tabSize:4,matchBrackets:true,autoCloseBrackets:true,styleActiveLine:true,extraKeys:{'Tab':cm=>cm.execCommand('indentMore'),'Shift-Tab':cm=>cm.execCommand('indentLess')}};this.cmStudent=CodeMirror(document.getElementById('stu-editor-wrap'),{...cfg,value:'# Viết code tại đây\n'})}else{this.cmStudent.setValue('# Viết code tại đây\n')}setTimeout(()=>this.cmStudent.refresh(),100)}

_renderProblemTabs(){const c=document.getElementById('stu-problem-tabs');c.innerHTML='';this.problems.forEach((p,i)=>{const btn=document.createElement('button');btn.className='oj-ptab-btn'+(i===0?' active':'');btn.textContent=`Bài ${i+1}`;btn.onclick=()=>{c.querySelectorAll('.oj-ptab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');this._showProblem(i)};c.appendChild(btn)})}

_showProblem(idx){this.currentProbIdx=idx;const p=this.problems[idx];if(!p)return;document.getElementById('stu-problem-title').textContent=`Bài ${idx+1}: ${p.title}`;document.getElementById('stu-problem-meta').innerHTML=`${p.fileIO?'📁 File I/O: <strong>'+p.taskName+'.INP/.OUT</strong>':'⌨️ stdin/stdout'} &nbsp;•&nbsp; ${p.subtasks?.length||1} subtask &nbsp;•&nbsp; ${p.testCases?.length||0} test`;document.getElementById('stu-problem-desc').textContent=p.description||'Không có mô tả';
const sio=document.getElementById('stu-sample-io');if(p.testCases&&p.testCases.length>0){const tc=p.testCases[0];sio.innerHTML=`<div class="sample-box"><div class="sample-box-title">Ví dụ Input</div><pre>${this._esc(tc.input)}</pre></div><div class="sample-box"><div class="sample-box-title">Ví dụ Output</div><pre>${this._esc(tc.output)}</pre></div>`}else{sio.innerHTML=''}
document.getElementById('stu-results-card').classList.add('hidden');document.getElementById('no-results-msg').style.display='block';
// Switch to desc tab
document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));document.querySelector('.oj-ptab[data-ptab="desc"]').classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));document.getElementById('ptab-desc').classList.add('active')}

async _stuSubmit(){if(!this.cmStudent)return;const code=this.cmStudent.getValue().trim();if(!code){this._toast('Viết code trước','error');return}const p=this.problems[this.currentProbIdx];if(!p){this._toast('Không có đề','error');return}const statusEl=document.getElementById('stu-submit-status');const consoleOut=document.getElementById('oj-console-output');statusEl.innerHTML='⏳ Đang chấm...';consoleOut.innerHTML='<span style="color:var(--text-muted)">🔄 Đang khởi tạo Pyodide...</span>';document.getElementById('btn-stu-submit').disabled=true;
try{const result=await this.grader.grade(code,p.testCases,p.subtasks||[],p.fileIO,p.taskName,p.uppercase,p.timePerTest||5,(c,t)=>{statusEl.textContent=`Test ${c}/${t}`;consoleOut.innerHTML=`<span style="color:var(--accent)">⚡ Đang chấm test ${c}/${t}...</span>`});
// Build detailed console output
const ac=result.details.filter(d=>d.verdict==='AC').length;
const wa=result.details.filter(d=>d.verdict==='WA').length;
const re=result.details.filter(d=>d.verdict==='RE').length;
const tle=result.details.filter(d=>d.verdict==='TLE').length;
const total=result.details.length;
let con=`<div style="margin-bottom:6px"><strong style="color:${result.score>=100?'var(--success)':result.score>=50?'var(--warning,#f59e0b)':'var(--error)'};font-size:1.1rem">${result.score}/100 điểm</strong></div>`;
con+=`<div style="display:flex;gap:12px;margin-bottom:8px;font-size:.82rem">`;
con+=`<span style="color:var(--success)">✅ AC: ${ac}/${total}</span>`;
if(wa>0)con+=`<span style="color:var(--error)">❌ WA: ${wa}</span>`;
if(re>0)con+=`<span style="color:#f43f5e">💥 RE: ${re}</span>`;
if(tle>0)con+=`<span style="color:#f59e0b">⏰ TLE: ${tle}</span>`;
con+=`</div>`;
// Show error details for first few failures
const failures=result.details.filter(d=>d.verdict!=='AC').slice(0,3);
if(failures.length>0){con+=`<div style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px;font-size:.78rem">`;
con+=`<div style="color:var(--text-muted);margin-bottom:4px">⚠️ Chi tiết lỗi (${Math.min(3,result.details.filter(d=>d.verdict!=='AC').length)} test đầu):</div>`;
failures.forEach(f=>{const testNum=f.testIdx+1;
con+=`<div style="margin:2px 0;padding:3px 6px;background:rgba(255,255,255,.03);border-radius:3px">`;
con+=`Test ${testNum} — <span class="verdict ${f.verdict}" style="font-weight:700">${f.verdict}</span>`;
if(f.verdict==='RE')con+=` <span style="color:#f43f5e">Lỗi runtime</span>`;
if(f.verdict==='WA')con+=` <span style="color:var(--error)">Sai kết quả</span>`;
if(f.verdict==='TLE')con+=` <span style="color:#f59e0b">Quá thời gian (${f.time}ms)</span>`;
con+=`</div>`});con+=`</div>`}
consoleOut.innerHTML=con;
this._showStudentResults(result,p);
if(this._currentExercise){await this.fb.submitExerciseResult(this._currentExercise.id,this.studentName,result);statusEl.textContent='✅ Đã nộp!';this._toast(`📚 ${this._currentExercise.title}: ${result.score} điểm`,'success')}else if(this.roomCode){await this.fb.submitResult(this.roomCode,this.studentName,this.currentProbIdx,result);statusEl.textContent='✅ Đã nộp!';this._toast(`Bài ${this.currentProbIdx+1}: ${result.score} điểm`,'success')}}catch(e){
statusEl.textContent='';
// Check if it's a Python error
const errMsg=e.message;
let con='<div style="color:var(--error);font-weight:600;margin-bottom:6px">💥 Lỗi khi chạy code</div>';
if(errMsg.includes('Python:')){const pyErr=errMsg.replace('Python: ','');
con+=`<pre style="background:rgba(239,68,68,.08);padding:8px;border-radius:4px;font-size:.78rem;color:#f87171;white-space:pre-wrap;max-height:200px;overflow-y:auto">${this._esc(pyErr)}</pre>`;
con+=`<div style="color:var(--text-muted);font-size:.75rem;margin-top:6px">💡 Kiểm tra lại cú pháp, biến, và logic trong code.</div>`}else{con+=`<div style="color:var(--error)">${this._esc(errMsg)}</div>`}
consoleOut.innerHTML=con;
this._toast('Lỗi: '+errMsg.substring(0,60),'error')}finally{document.getElementById('btn-stu-submit').disabled=false}}

_showStudentResults(result,problem){const card=document.getElementById('stu-results-card');card.classList.remove('hidden');document.getElementById('no-results-msg').style.display='none';const scoreEl=document.getElementById('stu-score');scoreEl.textContent=result.score;scoreEl.className='oj-score-value'+(result.score===100?' perfect':'');
const sumEl=document.getElementById('stu-subtask-summary');let sumH='';for(const st of (problem.subtasks||[])){const stTests=(result.details||[]).filter(d=>d.subtaskId===st.id);const ac=stTests.filter(d=>d.verdict==='AC').length;const total=stTests.length;const allAC=total>0&&ac===total;const pts=allAC?st.percent:0;sumH+=`<div class="subtask-summary-row ${allAC?'pass':'fail'}"><span class="st-sum-name">${st.name}</span><div class="st-sum-bar"><div class="st-sum-bar-fill ${allAC?'full':ac>0?'partial':'zero'}" style="width:${total?ac/total*100:0}%"></div></div><span style="font-size:.78rem;color:var(--text-muted)">${ac}/${total} AC</span><span class="st-sum-score">${pts}đ</span></div>`}sumEl.innerHTML=sumH;
const tbody=document.getElementById('stu-results-tbody');if(result.details){tbody.innerHTML=result.details.map((d,i)=>`<tr><td style="text-align:center">${String(i+1).padStart(2,'0')}</td><td>ST${d.subtaskId}</td><td><span class="verdict ${d.verdict}">${d.verdict}</span></td><td style="font-family:var(--font-mono);font-size:.78rem">${d.time}ms</td></tr>`).join('')}
// Auto-switch to results tab
document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));document.querySelector('.oj-ptab[data-ptab="results"]').classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));document.getElementById('ptab-results').classList.add('active')}

// ===== LEADERBOARD =====
_renderLeaderboard(lb,containerId,selfName){const c=document.getElementById(containerId);if(!lb||!Object.keys(lb).length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có dữ liệu</p>';return}const sorted=Object.values(lb).sort((a,b)=>b.totalScore-a.totalScore||(a.lastSubmit-b.lastSubmit));const pCount=this.problems?.length||this.publishedCount||1;let h='<table class="lb-table"><thead><tr><th>Hạng</th><th>Họ tên</th><th>Tổng</th>';for(let i=0;i<pCount;i++)h+=`<th>Bài ${i+1}</th>`;h+='</tr></thead><tbody>';sorted.forEach((s,i)=>{const rank=i+1;const rankCls=rank<=3?`lb-rank-${rank}`:'';const isSelf=s.name===selfName;const medals=['','🥇','🥈','🥉'];h+=`<tr class="${isSelf?'self':''} lb-flash"><td class="lb-rank ${rankCls}">${medals[rank]||rank}</td><td class="lb-name">${this._esc(s.name)}</td><td class="lb-score">${s.totalScore}</td>`;for(let j=0;j<pCount;j++){const ps=s.problems&&s.problems[j]||0;const cls=ps>=100?'full':ps>0?'partial':'zero';h+=`<td><span class="lb-prob-score ${cls}">${ps}</span></td>`}h+='</tr>'});h+='</tbody></table>';c.innerHTML=h}

// ===== SUBTASK/LINE/VAR (same as v3, compacted) =====
addSubtask(pct=0,name=null){this.subtaskCounter++;const id=this.subtaskCounter;if(!name)name='Subtask '+id;const c=document.createElement('div');c.className='subtask-card';c.dataset.stId=id;c.innerHTML=`<span class="subtask-name">${name}</span><input type="number" class="subtask-pct-input" value="${pct}" min="0" max="100" step="5"><span>%</span><span class="subtask-count">0</span><button class="btn-danger-sm btn-rm-st">✕</button>`;c.querySelector('.subtask-pct-input').oninput=()=>this._updateSTTotal();c.querySelector('.btn-rm-st').onclick=()=>{if(document.getElementById('subtasks-container').children.length<=1){this._toast('Cần ít nhất 1 subtask','error');return}c.remove();this._updateSTTotal();this._rebuildConstraints();this._validateForm()};document.getElementById('subtasks-container').appendChild(c);this._updateSTTotal();this._validateForm()}

_updateSTTotal(){const cards=document.querySelectorAll('#subtasks-container .subtask-card');const total=parseInt(document.getElementById('total-tests').value)||20;let sum=0;cards.forEach(c=>{sum+=parseInt(c.querySelector('.subtask-pct-input').value)||0});document.getElementById('subtask-total-pct').textContent=sum+'%';document.getElementById('subtask-total-icon').textContent=sum===100?'✅':'❌';document.getElementById('subtask-total').className='subtask-total '+(sum===100?'ok':'error');let rem=total;[...cards].forEach((c,i,a)=>{const pct=parseInt(c.querySelector('.subtask-pct-input').value)||0;const cnt=i===a.length-1?rem:Math.round(total*pct/100);rem-=cnt;c.querySelector('.subtask-count').textContent=Math.max(0,cnt)+' tests'});this._validateForm()}

_getSubtasks(){return[...document.querySelectorAll('#subtasks-container .subtask-card')].map(c=>({id:parseInt(c.dataset.stId),name:c.querySelector('.subtask-name').textContent,percent:parseInt(c.querySelector('.subtask-pct-input').value)||0}))}

applyPreset(key){const p=PRESETS[key];if(!p)return;document.getElementById('input-lines-container').innerHTML='';this.lineCounter=0;this.varCounter=0;for(const l of p.lines){const lid=this.addInputLine(l.repeatRef||null);for(const v of l.variables)this._addVar(lid,v.name,v.type,v.lengthRef||null,v.charset||'az',v.pattern||'random')}this._toggleEmpty();this._validateForm();this._toast('Mẫu: '+p.name,'info')}

addInputLine(repeatRef=null){this.lineCounter++;const lid=this.lineCounter;const c=document.createElement('div');c.className='input-line-card';c.dataset.lineId=lid;const vars=this._getAllVarNames();const opts=vars.map(n=>`<option value="${n}" ${n===repeatRef?'selected':''}>${n}</option>`).join('');c.innerHTML=`<div class="input-line-header"><span class="line-title">Dòng ${lid}</span><div class="line-actions"><div class="repeat-group"><label><input type="checkbox" class="chk-repeat" ${repeatRef?'checked':''}> Lặp</label><select class="repeat-var-select ${repeatRef?'':'hidden'}">${opts||'<option value="">—</option>'}</select></div><button class="btn btn-sm btn-accent btn-add-var-to-line">＋</button><button class="btn-danger-sm btn-rm-line">✕</button></div></div><div class="input-line-body" data-line-vars="${lid}"></div>`;c.querySelector('.chk-repeat').onchange=function(){c.querySelector('.repeat-var-select').classList.toggle('hidden',!this.checked)};c.querySelector('.btn-add-var-to-line').onclick=()=>this._addVar(lid);c.querySelector('.btn-rm-line').onclick=()=>{c.remove();this._toggleEmpty();this._validateForm()};document.getElementById('input-lines-container').appendChild(c);this._toggleEmpty();this._validateForm();return lid}

_addVar(lineId,name='',type='integer',lengthRef=null,charset='az',pattern='random'){this.varCounter++;const container=document.querySelector(`[data-line-vars="${lineId}"]`);if(!container)return;const sts=this._getSubtasks();const row=document.createElement('div');row.className='var-row';let chips='';sts.forEach((st,i)=>{const dl=DLIM[i]||DLIM[DLIM.length-1];const cc='st-'+Math.min(st.id,5);chips+=`<div class="constraint-chip ${cc}" data-st-id="${st.id}"><span class="st-label">ST${st.id}</span><input type="number" class="cst-min" value="${dl.min}"><span class="sep">—</span><input type="number" class="cst-max" value="${dl.max}"></div>`});const vars=this._getAllVarNames();const refO=vars.map(n=>`<option value="${n}" ${n===lengthRef?'selected':''}>${n}</option>`).join('');row.innerHTML=`<input type="text" class="var-name-input" value="${name}" placeholder="Tên"><select class="var-type-select"><option value="integer" ${type==='integer'?'selected':''}>Số nguyên</option><option value="float" ${type==='float'?'selected':''}>Số thực</option><option value="array" ${type==='array'?'selected':''}>Mảng</option><option value="string" ${type==='string'?'selected':''}>Chuỗi</option></select><div class="var-constraints-inline">${chips}</div><button class="btn-danger-sm btn-rm-var">✕</button>`;const extraArr=document.createElement('div');extraArr.className='var-extra-row '+(type==='array'?'':'hidden');extraArr.innerHTML=`<label>Dài:</label><select class="arr-length-ref"><option value="">Tự cấu hình</option>${refO}</select><label>Pattern:</label><select class="arr-pattern"><option value="random">Random</option><option value="ascending">Tăng</option><option value="descending">Giảm</option></select>`;const extraStr=document.createElement('div');extraStr.className='var-extra-row '+(type==='string'?'':'hidden');extraStr.innerHTML=`<label>Ký tự:</label><select class="str-charset"><option value="az">a-z</option><option value="AZ">A-Z</option><option value="09">0-9</option><option value="mixed">Hỗn hợp</option></select>`;row.appendChild(extraArr);row.appendChild(extraStr);row.querySelector('.var-type-select').onchange=function(){extraArr.classList.toggle('hidden',this.value!=='array');extraStr.classList.toggle('hidden',this.value!=='string')};row.querySelector('.btn-rm-var').onclick=()=>{row.remove();this._validateForm()};container.appendChild(row);this._validateForm()}

_rebuildConstraints(){const sts=this._getSubtasks();document.querySelectorAll('.var-constraints-inline').forEach(c=>{const old={};c.querySelectorAll('.constraint-chip').forEach(ch=>{old[ch.dataset.stId]={min:ch.querySelector('.cst-min').value,max:ch.querySelector('.cst-max').value}});c.innerHTML='';sts.forEach((st,i)=>{const dl=DLIM[i]||DLIM[DLIM.length-1];const o=old[st.id]||{};c.innerHTML+=`<div class="constraint-chip st-${Math.min(st.id,5)}" data-st-id="${st.id}"><span class="st-label">ST${st.id}</span><input type="number" class="cst-min" value="${o.min||dl.min}"><span class="sep">—</span><input type="number" class="cst-max" value="${o.max||dl.max}"></div>`})})}

_getAllVarNames(){const n=[];document.querySelectorAll('.var-name-input').forEach(i=>{if(i.value.trim())n.push(i.value.trim())});return n}
_toggleEmpty(){document.getElementById('no-lines-msg').classList.toggle('hidden',document.getElementById('input-lines-container').children.length>0)}

_validateForm(){const has=this.cmMain&&this.cmMain.getValue().trim().length>0;const lines=document.getElementById('input-lines-container').children.length>0;const sts=this._getSubtasks();const sum=sts.reduce((s,st)=>s+st.percent,0);const ok=has&&lines&&sum===100;const btn=document.getElementById('btn-generate');if(btn)btn.disabled=!ok;const hint=document.getElementById('generate-hint');if(hint)hint.textContent=!has?'Nhập code':!lines?'Thêm dòng input':sum!==100?`Subtask: ${sum}%≠100%`:'✅ Sẵn sàng!'}

collectFormData(){const sts=this._getSubtasks();const inputLines=[];document.querySelectorAll('#input-lines-container .input-line-card').forEach(lc=>{const chk=lc.querySelector('.chk-repeat');const sel=lc.querySelector('.repeat-var-select');const repeatRef=chk&&chk.checked&&sel.value?sel.value:null;const variables=[];lc.querySelectorAll('.var-row').forEach(vr=>{const v={name:vr.querySelector('.var-name-input').value.trim()||'X',type:vr.querySelector('.var-type-select').value,subtaskLimits:{}};vr.querySelectorAll('.var-constraints-inline .constraint-chip').forEach(ch=>{v.subtaskLimits[parseInt(ch.dataset.stId)]={min:parseFloat(ch.querySelector('.cst-min').value)||0,max:parseFloat(ch.querySelector('.cst-max').value)||100}});if(v.type==='array'){const ref=vr.querySelector('.arr-length-ref');v.lengthRef=ref&&ref.value?ref.value:null;v.pattern=vr.querySelector('.arr-pattern')?.value||'random'}if(v.type==='string')v.charset=vr.querySelector('.str-charset')?.value||'az';variables.push(v)});inputLines.push({variables,repeatRef})});return{pythonCode:this.cmMain.getValue(),taskName:document.getElementById('task-name').value||'BAITAP',uppercase:document.getElementById('chk-uppercase').checked,fileIO:document.getElementById('chk-file-io').checked,totalTests:parseInt(document.getElementById('total-tests').value)||20,subtasks:sts,inputLines}}

async startGeneration(){if(this.isGenerating)return;this.isGenerating=true;document.getElementById('btn-generate').disabled=true;document.getElementById('error-area').classList.add('hidden');document.getElementById('section-preview').classList.add('hidden');document.getElementById('progress-area').classList.remove('hidden');this.themis.clear();try{const cfg=this.collectFormData();this._setProg(5,'⏳ Pyodide...');await this.pyEngine.init();this._setProg(20,'✅ Pyodide OK');const gen=new DataGenerator(cfg);const inputs=gen.generateAllInputs();this.themis.setTaskName(cfg.taskName,cfg.uppercase);const inpN=this.themis.taskName+(cfg.uppercase?'.INP':'.inp'),outN=this.themis.taskName+(cfg.uppercase?'.OUT':'.out');for(let i=0;i<inputs.length;i++){this._setProg(30+Math.round(i/inputs.length*55),`🐍 Test ${i+1}/${inputs.length}`);const out=cfg.fileIO?await this.pyEngine.runFileIO(cfg.pythonCode,inputs[i].input,inpN,outN):await this.pyEngine.runStdio(cfg.pythonCode,inputs[i].input);this.themis.addTestCase(i+1,inputs[i].input,out,inputs[i].subtaskId,inputs[i].subtaskName);await new Promise(r=>setTimeout(r,10))}this._setProg(90,'📦 Đóng gói...');await this.themis.generateZip();this._setProg(100,'🎉 Xong!');this._showPreview();this._toast(`${inputs.length} test OK!`,'success')}catch(e){document.getElementById('error-area').classList.remove('hidden');document.getElementById('error-text').textContent=e.message;this._toast('Lỗi','error')}finally{this.isGenerating=false;document.getElementById('btn-generate').disabled=false;setTimeout(()=>document.getElementById('progress-area').classList.add('hidden'),2000);this._validateForm()}}

_setProg(p,m){document.getElementById('progress-bar').style.width=p+'%';document.getElementById('progress-text').textContent=m;document.getElementById('progress-percent').textContent=p+'%'}

_showPreview(){const data=this.themis.getPreviewData();document.getElementById('section-preview').classList.remove('hidden');const counts={};data.forEach(d=>{counts[d.subtaskName]=(counts[d.subtaskName]||0)+1});let si=0;document.getElementById('preview-stats').innerHTML=Object.entries(counts).map(([n,c])=>{si++;return`<div class="stat-chip st-c${Math.min(si,5)}">${n}: ${c}</div>`}).join('');document.getElementById('preview-tbody').innerHTML=data.map(d=>`<tr><td>${String(d.index).padStart(2,'0')}</td><td><span class="stat-chip st-c${Math.min(d.subtaskId,5)}" style="padding:2px 6px;font-size:.72rem">${d.subtaskName}</span></td><td><pre>${this._esc(d.input)}</pre></td><td><pre>${this._esc(d.output)}</pre></td></tr>`).join('');document.getElementById('section-preview').scrollIntoView({behavior:'smooth'})}

_toast(m,t='info'){const c=document.getElementById('toast-container');const el=document.createElement('div');el.className='toast '+t;el.textContent=m;c.appendChild(el);setTimeout(()=>el.remove(),4500)}
_esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}}

document.addEventListener('DOMContentLoaded',()=>{const uic=new UIController();window._uic=uic;uic.init()});
