/* THEMIS ONLINE JUDGE v5 — COMPLETE EDITION */
const FIREBASE_CONFIG={apiKey:"AIzaSyABZz6HoxC80-bU8vci2Ss0-j7ip3X3oZ8",authDomain:"themis-hsg.firebaseapp.com",databaseURL:"https://themis-hsg-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"themis-hsg",storageBucket:"themis-hsg.firebasestorage.app",messagingSenderId:"985711152429",appId:"1:985711152429:web:3067e536a71ddfc46897a4"};
// Mật khẩu GV xác thực qua server — KHÔNG lưu trên client
const APPS_SCRIPT_URL='https://script.google.com/macros/s/AKfycbwfamhMGAV-_peCv2_fH6kRgPYGoJ2uKGZbK0spXAHhb3MIJ0uPpG-DZiaIm8RI7vSl/exec';
const PRESETS={'single-int':{name:'Một số nguyên',lines:[{variables:[{name:'N',type:'integer'}]}]},'multi-int-1line':{name:'Nhiều số/dòng',lines:[{variables:[{name:'A',type:'integer'},{name:'B',type:'integer'}]}]},'array-1d':{name:'Mảng 1D',lines:[{variables:[{name:'N',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]}]},'array-param':{name:'Mảng+tham số',lines:[{variables:[{name:'N',type:'integer'},{name:'K',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]}]},'string-only':{name:'Chuỗi',lines:[{variables:[{name:'S',type:'string'}]}]},'queries':{name:'Truy vấn',lines:[{variables:[{name:'N',type:'integer'},{name:'Q',type:'integer'}]},{variables:[{name:'A',type:'array',lengthRef:'N'}]},{variables:[{name:'L',type:'integer'},{name:'R',type:'integer'}],repeatRef:'Q'}]},'graph':{name:'Đồ thị',lines:[{variables:[{name:'N',type:'integer'},{name:'M',type:'integer'}]},{variables:[{name:'U',type:'integer'},{name:'V',type:'integer'}],repeatRef:'M'}]},'matrix':{name:'Ma trận',lines:[{variables:[{name:'N',type:'integer'},{name:'M',type:'integer'}]},{variables:[{name:'row',type:'array',lengthRef:'M'}],repeatRef:'N'}]}};
const DLIM=[{min:1,max:100,lenMin:1,lenMax:10},{min:1,max:1000000,lenMin:1,lenMax:100000}];
async function _hashSHA256(msg){const buf=new TextEncoder().encode(msg);const h=await crypto.subtle.digest('SHA-256',buf);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')}

class DataGenerator{constructor(c){this.inputLines=c.inputLines;this.subtasks=c.subtasks;this.totalTests=c.totalTests;this.maxOverride=c.maxOverride||null}
generateAllInputs(){const r=[];let rem=this.totalTests;for(let i=0;i<this.subtasks.length;i++){const st=this.subtasks[i];const cnt=i===this.subtasks.length-1?rem:Math.round(this.totalTests*st.percent/100);rem-=cnt;for(let t=0;t<cnt;t++)r.push({input:this._gen(st.id,t,cnt),subtaskId:st.id,subtaskName:st.name})}return r}
_gen(stId,ti,tot){const lines=[];const vars={};for(const line of this.inputLines){let rep=1;if(line.repeatRef&&vars[line.repeatRef])rep=Math.max(1,vars[line.repeatRef]);for(let r=0;r<rep;r++){const parts=[];for(const v of line.variables){const lim=this._lim(v,stId);const val=this._val(v,lim,vars,ti,tot);if(v.type!=='array'&&v.type!=='string'){vars[v.name]=val;parts.push(String(val))}else if(v.type==='array')parts.push(val.join(' '));else parts.push(val)}lines.push(parts.join(' '))}}return lines.join('\n')}
_lim(v,stId){const b=(v.subtaskLimits&&v.subtaskLimits[stId])?{...v.subtaskLimits[stId]}:{min:1,max:100,lenMin:1,lenMax:10};if(this.maxOverride){b.max=Math.min(b.max,this.maxOverride);if(b.lenMax)b.lenMax=Math.min(b.lenMax,Math.min(this.maxOverride,20))}return b}
_val(v,l,vars,i,t){switch(v.type){case'integer':return this._int(l,i,t);case'float':return i===0?l.min:i===1?l.max:+(Math.random()*(l.max-l.min)+l.min).toFixed(2);case'array':return this._arr(v,l,vars,i,t);case'string':return this._str(v,l,i);default:return this._int(l,i,t)}}
_int(l,i,t){const mn=Math.ceil(l.min),mx=Math.floor(l.max);if(i===0)return mn;if(i===1&&t>1)return mx;return this._ri(mn,mx)}
_arr(v,l,vars,i,t){let len;if(v.lengthRef&&vars[v.lengthRef]!=null)len=Math.max(1,vars[v.lengthRef]);else{const lmn=l.lenMin||1,lmx=l.lenMax||10;len=i===0?lmn:i===1&&t>1?lmx:this._ri(lmn,lmx)}const mn=Math.ceil(l.min),mx=Math.floor(l.max);let p=v.pattern||'random';const ep=['min_all','max_all','ascending','descending','equal'];if(p==='random'&&i<ep.length&&t>ep.length)p=ep[i];switch(p){case'min_all':return Array(len).fill(mn);case'max_all':return Array(len).fill(mx);case'equal':{const val=this._ri(mn,mx);return Array(len).fill(val)}case'ascending':{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a.sort((x,y)=>x-y)}case'descending':{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a.sort((x,y)=>y-x)}default:{const a=[];for(let j=0;j<len;j++)a.push(this._ri(mn,mx));return a}}}
_str(v,l,i){const lmn=l.lenMin||1,lmx=l.lenMax||10;const len=i===0?lmn:i===1?lmx:this._ri(lmn,lmx);
// Per-subtask charset: priority is limit.charset > variable.charset > 'az'
const effectiveCharset=l.charset||v.charset||'az';
const CHAR_POOLS={az:'abcdefghijklmnopqrstuvwxyz',AZ:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',azAZ:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ','09':'0123456789',az_space:'abcdefghijklmnopqrstuvwxyz ',az09:'abcdefghijklmnopqrstuvwxyz0123456789',printable:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 !@#$%&*()-_=+[]{}|;:,.<>?',mixed:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'};
// Handle mixed with ratio (legacy global ratio or per-subtask ratio)
const ratio=l.charsetRatio||v.charsetRatio;
if(effectiveCharset==='mixed'&&ratio){
const pools=[{chars:'0123456789',pct:ratio.digits||0},{chars:'abcdefghijklmnopqrstuvwxyz',pct:ratio.lower||0},{chars:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',pct:ratio.upper||0}];
let s='';for(let j=0;j<len;j++){const roll=Math.random()*100;let cum=0,pool=pools[pools.length-1].chars;for(const p of pools){cum+=p.pct;if(roll<cum){pool=p.chars;break}}s+=pool[Math.floor(Math.random()*pool.length)]}return s}
// az_space: guarantee at least 1 space if len>=3
if(effectiveCharset==='az_space'&&len>=3){
const letters='abcdefghijklmnopqrstuvwxyz';let s='';for(let j=0;j<len;j++)s+=letters[Math.floor(Math.random()*letters.length)];
const spaceCount=Math.max(1,Math.floor(len/5));const arr=[...s];
for(let j=0;j<spaceCount;j++){const pos=this._ri(1,len-2);arr[pos]=' '}
return arr.join('')}
const pool=CHAR_POOLS[effectiveCharset]||CHAR_POOLS.az;
let s='';for(let j=0;j<len;j++)s+=pool[Math.floor(Math.random()*pool.length)];return s}
_ri(a,b){return Math.floor(Math.random()*(b-a+1))+a}}

class PyodideEngine{constructor(){this.py=null;this._r=false}async init(){if(this._r)return;this.py=await loadPyodide();this._r=true}isLoaded(){return this._r}
async runStdio(code,stdin){const b64=btoa(unescape(encodeURIComponent(stdin)));this.py.runPython(`import sys,io,base64\nsys.stdin=io.StringIO(base64.b64decode("${b64}").decode("utf-8"))\nsys.stdout=io.StringIO()`);try{await this.py.runPythonAsync(code)}catch(err){this.py.runPython('sys.stdout=sys.__stdout__');throw new Error('Python: '+err.message)}const out=this.py.runPython('sys.stdout.getvalue()');this.py.runPython('sys.stdout=sys.__stdout__;sys.stdin=sys.__stdin__');return out.trim()}
async runFileIO(code,stdin,inp,outp){const b64=btoa(unescape(encodeURIComponent(stdin)));this.py.runPython(`import sys,io,base64\n_data=base64.b64decode("${b64}").decode("utf-8")\nwith open("${inp}","w") as _f:\n    _f.write(_data)\nsys.stdout=io.StringIO()`);try{await this.py.runPythonAsync(code)}catch(err){this.py.runPython('sys.stdout=sys.__stdout__');throw new Error('Python: '+err.message)}let out;try{out=this.py.runPython(`\ntry:\n    with open("${outp}","r") as _f:\n        _r=_f.read()\nexcept:\n    _r=sys.stdout.getvalue()\n_r`)}catch{out=this.py.runPython('sys.stdout.getvalue()')}this.py.runPython('sys.stdout=sys.__stdout__');return out.trim()}}

class GeminiHelper{constructor(){this.apiKey=localStorage.getItem('gemini_api_key')||''}setApiKey(k){this.apiKey=k;localStorage.setItem('gemini_api_key',k)}getApiKey(){return this.apiKey}
async generateCode(problem,ctx={}){if(!this.apiKey)throw new Error('Nhập Gemini API Key');
const io=ctx.fileIO?'Đọc dữ liệu từ file .INP, ghi kết quả vào file .OUT':'Dùng input() để đọc và print() để xuất kết quả';
const mode=ctx.brute?'BRUTE FORCE (đơn giản, chắc chắn đúng, không cần tối ưu, dùng vòng lặp trực tiếp)':'HIỆU QUẢ (tối ưu thuật toán, đảm bảo chạy nhanh với dữ liệu lớn)';
const model=ctx.model||'gemini-2.5-flash';
// Build rich prompt with context
let prompt=`Bạn là chuyên gia lập trình thi đấu (Competitive Programming).\nViết code Python giải bài sau theo phong cách ${mode}.\n\n## ĐỀ BÀI:\n${problem}\n`;
if(ctx.constraints)prompt+=`\n## RÀNG BUỘC:\n${ctx.constraints}\n`;
if(ctx.sampleIO&&ctx.sampleIO.length){prompt+='\n## VÍ DỤ:\n';ctx.sampleIO.forEach((s,i)=>{prompt+=`### Ví dụ ${i+1}:\nInput:\n${s.input}\nOutput:\n${s.output}\n`;if(s.explanation)prompt+=`Giải thích: ${s.explanation}\n`})}
if(ctx.subtasksInfo)prompt+=`\n## SUBTASKS:\n${ctx.subtasksInfo}\n`;
prompt+=`\n## YÊU CẦU:\n- I/O: ${io}\n- CHỈ trả về code Python, KHÔNG giải thích\n- Comment tiếng Việt cho các bước chính\n- Xử lý edge case: input rỗng, min/max values\n`;
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:ctx.brute?0.1:0.3}})});
if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error?.message||'API Error')}
const d=await r.json();const t=d.candidates?.[0]?.content?.parts?.[0]?.text||'';
const m=t.match(/```python\n([\s\S]*?)```/);return m?m[1].trim():t.trim()}
// AI Quiz Generation
async generateQuiz(topic,numQ=5,difficulty='medium'){if(!this.apiKey)throw new Error('Nhập Gemini API Key');
const models=['gemini-2.5-flash','gemini-2.0-flash'];
const diffLabel={easy:'dễ',medium:'trung bình',hard:'khó'}[difficulty]||'trung bình';
const prompt=`Bạn là chuyên gia giáo dục Việt Nam. Tạo CHÍNH XÁC ${numQ} câu hỏi trắc nghiệm 4 lựa chọn.
Chủ đề: ${topic}
Độ khó: ${diffLabel}
QUY TẮC: Mỗi câu 4 đáp án, chỉ 1 đúng (correctIndex:0-3), viết tiếng Việt, CHỈ trả JSON array.
Format: [{"content":"Câu hỏi?","options":["A","B","C","D"],"correctIndex":0,"explanation":"Giải thích"}]`;
let lastErr=null;
for(const model of models){
try{
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:8192}})});
if(!r.ok){const e=await r.json().catch(()=>({}));const msg=e.error?.message||'API Error '+r.status;if(r.status===404){lastErr=msg;continue}throw new Error(msg)}
const d2=await r.json();const parts=d2.candidates?.[0]?.content?.parts||[];
const textParts=parts.filter(p=>!p.thought&&p.text);const t2=textParts.length?textParts[textParts.length-1].text:'';
if(!t2){lastErr='AI trả về rỗng';continue}
console.log('[AI Quiz] Response from',model,':',t2.length,'chars');
let jsonStr='';const fenced=t2.match(/```(?:json)?\s*([\s\S]*?)```/);
if(fenced)jsonStr=fenced[1].trim();else{const am=t2.match(/\[\s*\{[\s\S]*\}\s*\]/);jsonStr=am?am[0]:t2.trim()}
const result=JSON.parse(jsonStr);if(!Array.isArray(result))throw new Error('Not array');
console.log('[AI Quiz] Parsed',result.length,'questions');return result
}catch(e){console.warn('[AI Quiz]',model,'error:',e.message);lastErr=e.message;continue}}
throw new Error(lastErr||'Không có model AI khả dụng')}}
class StressTester{constructor(e){this.engine=e}
async run(cfg,main,brute,cnt,maxV,cb){await this.engine.init();const g=new DataGenerator({inputLines:cfg.inputLines,subtasks:[{id:cfg.subtasks[0]?.id||1,name:'S',percent:100}],totalTests:cnt,maxOverride:maxV});const ins=g.generateAllInputs();const fio=cfg.fileIO,tn=cfg.taskName||'B',up=cfg.uppercase;const inp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.INP':'.inp'),outp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.OUT':'.out');let pass=0,fail=0,errs=0,ff=null;for(let i=0;i<ins.length;i++){cb&&cb(i+1,ins.length);let mo,bo;try{mo=fio?await this.engine.runFileIO(main,ins[i].input,inp,outp):await this.engine.runStdio(main,ins[i].input)}catch(e){errs++;if(!ff)ff={index:i+1,input:ins[i].input,error:'Code chính: '+e.message};continue}try{bo=fio?await this.engine.runFileIO(brute,ins[i].input,inp,outp):await this.engine.runStdio(brute,ins[i].input)}catch(e){errs++;if(!ff)ff={index:i+1,input:ins[i].input,error:'Brute: '+e.message};continue}if(mo.trim()===bo.trim())pass++;else{fail++;if(!ff)ff={index:i+1,input:ins[i].input,mainOutput:mo,bruteOutput:bo}}await new Promise(r=>setTimeout(r,5))}return{passed:pass,failed:fail,errors:errs,total:ins.length,firstFail:ff}}}

class ThemisManager{constructor(){this.zip=null;this.taskName='BAITAP';this.testCases=[]}
setTaskName(n,up){let c=n.replace(/[^a-zA-Z0-9_]/g,'')||'BAITAP';this.taskName=up?c.toUpperCase():c.toLowerCase()}
addTestCase(i,input,output,stId,stName){this.testCases.push({index:i,input,output,subtaskId:stId,subtaskName:stName})}
async generateZip(){this.zip=new JSZip();const ext=this.taskName===this.taskName.toUpperCase()?['.INP','.OUT']:['.inp','.out'];for(const tc of this.testCases){const f=this.zip.folder('Test'+String(tc.index).padStart(2,'0'));f.file(this.taskName+ext[0],tc.input+'\n');f.file(this.taskName+ext[1],tc.output+'\n')}return await this.zip.generateAsync({type:'blob'})}
async downloadZip(){const b=await this.generateZip();const s=new Blob([b],{type:'application/zip'});const u=URL.createObjectURL(s);const a=document.createElement('a');a.href=u;a.download=this.taskName+'_Tests.zip';document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),5000)}
getPreviewData(){return this.testCases}clear(){this.testCases=[];this.zip=null}}

// ============ GOOGLE DRIVE HELPER ============
class DriveHelper{
constructor(url){this.url=url}
async uploadFile(fileName,mimeType,base64Data,metadata={}){
const res=await fetch(this.url,{method:'POST',body:JSON.stringify({action:'upload_file',fileName,mimeType,base64Data,metadata}),headers:{'Content-Type':'text/plain'}});
const data=await res.json();if(!data.ok)throw new Error(data.error||'Upload failed');return data}
async deleteFile(fileId){
const res=await fetch(this.url,{method:'POST',body:JSON.stringify({action:'delete_file',fileId}),headers:{'Content-Type':'text/plain'}});
return await res.json()}
async logData(sheet,row){
const res=await fetch(this.url,{method:'POST',body:JSON.stringify({action:'log_data',sheet,row}),headers:{'Content-Type':'text/plain'}});
return await res.json()}
async deleteRow(sheet,key){
const res=await fetch(this.url,{method:'POST',body:JSON.stringify({action:'delete_row',sheet,key}),headers:{'Content-Type':'text/plain'}});
return await res.json()}
getViewUrl(fileId){return'https://drive.google.com/file/d/'+fileId+'/preview'}
getDownloadUrl(fileId){return'https://drive.google.com/uc?export=download&id='+fileId}
}

// ============ FIREBASE MANAGER ============
class FirebaseManager{
constructor(){firebase.initializeApp(FIREBASE_CONFIG);this.db=firebase.database();try{this.storage=firebase.storage()}catch(e){console.warn('Firebase Storage unavailable:',e)};this._listeners=[];this._exerciseListeners=[];this._studentDashListeners=[]}
_ref(path){return this.db.ref(path)}
generateCode(){return String(Math.floor(100000+Math.random()*900000))}
async createRoom(title,teacher,timeLimit){const code=this.generateCode();await this._ref('rooms/'+code+'/info').set({title,teacher,timeLimit:parseInt(timeLimit)||90,createdAt:Date.now(),status:'waiting',startTime:0,problemCount:0});return code}
async publishProblem(roomCode,idx,data){await this._ref(`rooms/${roomCode}/problems/${idx}`).set(data);await this._ref(`rooms/${roomCode}/info/problemCount`).set(idx+1)}
async startContest(roomCode){await this._ref(`rooms/${roomCode}/info`).update({status:'active',startTime:Date.now()})}
async endContest(roomCode){await this._ref(`rooms/${roomCode}/info`).update({status:'ended'})}
async joinRoom(roomCode,name){const snap=await this._ref(`rooms/${roomCode}/info`).once('value');if(!snap.exists())throw new Error('Mã phòng không tồn tại');await this._ref(`rooms/${roomCode}/students/${name}`).update({joinedAt:Date.now()});return snap.val()}
async getProblems(roomCode){const snap=await this._ref(`rooms/${roomCode}/problems`).once('value');return snap.val()||[]}
async submitResult(roomCode,name,probIdx,result){await this._ref(`rooms/${roomCode}/students/${name}/submissions/${probIdx}`).set({score:result.score,submittedAt:Date.now(),details:result.details,code:result.code});const lbRef=this._ref(`rooms/${roomCode}/leaderboard/${name}`);await lbRef.transaction(cur=>{if(!cur)cur={name,totalScore:0,problems:{},lastSubmit:0};const old=cur.problems&&cur.problems[probIdx]||0;if(result.score>old){cur.totalScore=(cur.totalScore||0)-old+result.score;if(!cur.problems)cur.problems={};cur.problems[probIdx]=result.score}cur.lastSubmit=Date.now();return cur})}
// BUG-L01 FIX: Use ref.off('value',wrappedCb) instead of ref.off() to avoid killing unrelated listeners on the same path
listenRoomInfo(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/info`);const w=s=>cb(s.val());ref.on('value',w);this._listeners.push(()=>ref.off('value',w))}
listenLeaderboard(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/leaderboard`);const w=s=>cb(s.val());ref.on('value',w);this._listeners.push(()=>ref.off('value',w))}
listenStudents(roomCode,cb){const ref=this._ref(`rooms/${roomCode}/students`);const w=s=>cb(s.val());ref.on('value',w);this._listeners.push(()=>ref.off('value',w))}
cleanup(){this._listeners.forEach(fn=>fn());this._listeners=[]}
cleanupExercise(){this._exerciseListeners.forEach(fn=>fn());this._exerciseListeners=[]}
cleanupStudentDash(){this._studentDashListeners.forEach(fn=>fn());this._studentDashListeners=[]}
// Account management — stored at ROOT /accounts/ (permanent)
async createAccount(username,password){const h=await _hashSHA256(password);await this._ref(`accounts/${username}`).set({passwordHash:h,createdAt:Date.now()})}
async createAccountsBulk(list){for(const item of list){const h=await _hashSHA256(item.pass);await this._ref(`accounts/${item.name}`).set({passwordHash:h,createdAt:Date.now()})}}
async deleteAccount(username){await this._ref(`accounts/${username}`).remove()}
async verifyStudent(username,password){const snap=await this._ref(`accounts/${username}`).once('value');if(!snap.exists())throw new Error('Tài khoản không tồn tại!');const acct=snap.val();const inputHash=await _hashSHA256(password);if(acct.passwordHash){if(acct.passwordHash!==inputHash)throw new Error('Sai mật khẩu!');return true}if(acct.password){if(acct.password!==password)throw new Error('Sai mật khẩu!');await this._ref(`accounts/${username}`).update({passwordHash:inputHash,password:null});return true}throw new Error('Tài khoản lỗi!')}
listenAccounts(cb){const ref=this._ref('accounts');const w=s=>cb(s.val()||{});ref.on('value',w);this._listeners.push(()=>ref.off('value',w))}
// Exercise management
async publishExercise(data){const id=Date.now().toString(36);await this._ref(`exercises/${id}`).set({...data,createdAt:Date.now()});return id}
async updateExercise(id,updates){await this._ref(`exercises/${id}`).update(updates)}
async deleteExercise(id){await this._ref(`exercises/${id}`).remove();await this._ref(`exerciseResults/${id}`).remove()}
listenExercises(cb,group){const ref=this._ref('exercises');const w=s=>cb(s.val()||{});ref.on('value',w);const offFn=()=>ref.off('value',w);if(group==='student')this._studentDashListeners.push(offFn);else this._listeners.push(offFn)}
async submitExerciseResult(exId,username,result){
// BUG-C02+RT01 FIX: Use transaction for atomic best-score + update() to preserve attempts
const newScore=result.score||0;
const ref=this._ref(`exerciseResults/${exId}/${username}`);
const existingSnap=await ref.child('score').once('value');
const oldScore=existingSnap.val();
if(oldScore!=null&&newScore<oldScore){
// Save attempt history but DON'T overwrite best result 
await ref.child(`attempts/${Date.now()}`).set({score:newScore,submittedAt:Date.now()});
return {kept:true,bestScore:oldScore}}
// Use update() instead of set() to preserve attempts history
await ref.update({score:newScore,submittedAt:Date.now(),details:result.details,code:result.code||'',bestScore:Math.max(newScore,oldScore||0)});
return {kept:false,bestScore:Math.max(newScore,oldScore||0)}}
async getExerciseResults(exId,username){const snap=await this._ref(`exerciseResults/${exId}/${username}`).once('value');return snap.val()}
// BUG-L01 CRITICAL FIX: ref.off() without callback kills ALL listeners on 'exerciseResults' path
// including the student dashboard listener. Use ref.off('value',wrappedCb) to only remove the specific callback.
listenAllExerciseResults(cb,group){const ref=this._ref('exerciseResults');const w=s=>cb(s.val()||{});ref.on('value',w);const offFn=()=>ref.off('value',w);if(group==='student')this._studentDashListeners.push(offFn);else if(group==='exercise')this._exerciseListeners.push(offFn);else this._listeners.push(offFn)}
// ===== QUIZ BANK =====
async createQuiz(data){const id=Date.now().toString(36);await this._ref(`quizBanks/${id}`).set({...data,createdAt:Date.now()});return id}
async updateQuiz(id,updates){await this._ref(`quizBanks/${id}`).update(updates)}
async deleteQuiz(id){await this._ref(`quizBanks/${id}`).remove();await this._ref(`quizResults/${id}`).remove()}
listenQuizBanks(cb,group){const ref=this._ref('quizBanks');const w=s=>cb(s.val()||{});ref.on('value',w);const offFn=()=>ref.off('value',w);if(group==='student')this._studentDashListeners.push(offFn);else this._listeners.push(offFn)}
async submitQuizResult(quizId,studentName,result){await this._ref(`quizResults/${quizId}/${studentName}`).set({...result,submittedAt:Date.now()})}
async getQuizResult(quizId,studentName){const snap=await this._ref(`quizResults/${quizId}/${studentName}`).once('value');return snap.val()}
listenAllQuizResults(cb,group){const ref=this._ref('quizResults');const w=s=>cb(s.val()||{});ref.on('value',w);const offFn=()=>ref.off('value',w);if(group==='student')this._studentDashListeners.push(offFn);else this._listeners.push(offFn)}
async exportCSV(roomCode){const infoSnap=await this._ref(`rooms/${roomCode}/info`).once('value');const info=infoSnap.val();const lbSnap=await this._ref(`rooms/${roomCode}/leaderboard`).once('value');const lb=lbSnap.val();if(!lb)return'';const pCount=info.problemCount||1;let csv='Hạng,Họ tên,Tổng điểm';for(let i=0;i<pCount;i++)csv+=`,Bài ${i+1}`;csv+='\n';const sorted=Object.values(lb).sort((a,b)=>b.totalScore-a.totalScore||(a.lastSubmit-b.lastSubmit));sorted.forEach((s,i)=>{csv+=`${i+1},${s.name},${s.totalScore}`;for(let j=0;j<pCount;j++)csv+=`,${s.problems&&s.problems[j]||0}`;csv+='\n'});return csv}}

// ============ STUDENT GRADER ============
class StudentGrader{
constructor(engine){this.engine=engine}
async grade(code,testCases,subtasks,fileIO,taskName,uppercase,timePerTest,onProgress){
await this.engine.init();const inpF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.INP':'.inp');
const outF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.OUT':'.out');
const details=[];for(let i=0;i<testCases.length;i++){onProgress&&onProgress(i+1,testCases.length);const tc=testCases[i];const t0=performance.now();let verdict='AC',output='';
try{output=fileIO?await this.engine.runFileIO(code,tc.input,inpF,outF):await this.engine.runStdio(code,tc.input);const elapsed=performance.now()-t0;if(elapsed>timePerTest*1000)verdict='TLE';else{
// Normalize output: \r\n → \n, trim each line, remove trailing empty lines
const norm=s=>(s||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').map(l=>l.trimEnd()).join('\n').replace(/\n+$/,'').trim();
if(norm(output)!==norm(tc.output))verdict='WA'}
details.push({testIdx:i,subtaskId:tc.subtaskId,verdict,time:Math.round(elapsed)})}catch(e){details.push({testIdx:i,subtaskId:tc.subtaskId,verdict:e.message.includes('TLE')?'TLE':'RE',time:Math.round(performance.now()-t0)})}await new Promise(r=>setTimeout(r,5))}
const score=this._calcScore(details,subtasks,testCases);return{score,details,code}}
_calcScore(details,subtasks,testCases){let total=0;for(const st of subtasks){const stTests=details.filter(d=>d.subtaskId===st.id);const allAC=stTests.length>0&&stTests.every(d=>d.verdict==='AC');if(allAC)total+=st.percent}return total}}

// ============ UI CONTROLLER ============
class UIController{
constructor(){this.pyEngine=new PyodideEngine();this.themis=new ThemisManager();this.gemini=new GeminiHelper();this.stress=new StressTester(this.pyEngine);this.fb=new FirebaseManager();this.drive=new DriveHelper(APPS_SCRIPT_URL);this.grader=new StudentGrader(this.pyEngine);this.role=null;this.roomCode=null;this.studentName=null;this.problems=[];this.currentProbIdx=0;this.timerInterval=null;this.subtaskCounter=0;this.lineCounter=0;this.varCounter=0;this.cmMain=null;this.cmBrute=null;this.cmAiPreview=null;this.cmStudent=null;this.isGenerating=false;this.publishedCount=0;this._teacherInited=false;this._studentInited=false;this._pendingFiles=[]}

init(){const $=id=>document.getElementById(id);
// Teacher role → show login panel
$('btn-role-teacher').onclick=()=>{$('teacher-login-panel').classList.remove('hidden');$('teacher-password').focus()};
$('btn-teacher-login').onclick=()=>this._teacherLogin();
$('teacher-password').onkeydown=e=>{if(e.key==='Enter')this._teacherLogin()};
// Student role
$('btn-role-student').onclick=()=>this._selectRole('student');
$('btn-back-splash-t').onclick=()=>{$('view-teacher').classList.add('hidden');$('splash').classList.remove('hidden');$('teacher-login-panel').classList.add('hidden');$('teacher-password').value='';$('teacher-login-error').textContent=''};
$('btn-back-splash-s').onclick=()=>{$('view-student').classList.add('hidden');$('stu-login').classList.remove('hidden');$('splash').classList.remove('hidden');$('stu-login-error').textContent=''}}

async _teacherLogin(){const pass=document.getElementById('teacher-password').value;const errEl=document.getElementById('teacher-login-error');if(!pass){errEl.textContent='⚠️ Nhập mật khẩu';return}
errEl.textContent='🔐 Đang xác thực...';
try{
const hash=await this._sha256(pass);
const res=await fetch(APPS_SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'verify_teacher',passwordHash:hash}),headers:{'Content-Type':'text/plain'}});
const data=await res.json();
if(data.ok){errEl.textContent='';this._selectRole('teacher')}
else{errEl.textContent='❌ '+data.error;document.getElementById('teacher-password').classList.add('shake');setTimeout(()=>document.getElementById('teacher-password').classList.remove('shake'),500)}
}catch(e){errEl.textContent='❌ Lỗi kết nối server'}}

async _sha256(message){const msgBuffer=new TextEncoder().encode(message);const hashBuffer=await crypto.subtle.digest('SHA-256',msgBuffer);return Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,'0')).join('')}

_selectRole(role){this.role=role;document.getElementById('splash').classList.add('hidden');if(role==='teacher')this._initTeacher();else this._initStudent()}

// ===== TEACHER =====
_initTeacher(){if(this._teacherInited){document.getElementById('view-teacher').classList.remove('hidden');return}this._teacherInited=true;document.getElementById('view-teacher').classList.remove('hidden');this._initCM();this._bindTeacher();this._bindTeacherTabs();this.addSubtask(70,'Subtask 1');this.addSubtask(30,'Subtask 2');this._updateSTTotal();const k=this.gemini.getApiKey();if(k)document.getElementById('ai-api-key').value=k;this._validateForm();
// Stats sub-tab switching
document.querySelectorAll('.stats-subtab').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.stats-subtab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.stats-subtab-content').forEach(p=>p.classList.remove('active'));const panel=document.getElementById('stab-'+btn.dataset.stab);if(panel)panel.classList.add('active')}});
// Auto-restore draft if exists
this._restoreDraft();
this.fb.listenAccounts(accts=>{this._cachedAccounts=accts;this._renderAccountList(accts);this._renderProgress();this._renderTopicStats()});
this.fb.listenExercises(exs=>{this._teacherExercises=exs;this._renderTeacherExerciseList(exs);this._renderProgress();this._renderTopicStats()});
this.fb.listenAllExerciseResults(res=>{this._teacherExResults=res;this._renderTeacherExerciseList(this._teacherExercises||{});this._renderProgress();this._renderTopicStats()});
// Theory listener
const thRef=this.fb.db.ref('theories');const _thCb=s=>{this._cachedTheories=s.val()||{};this._renderTheoryList(this._cachedTheories,'t-theory-list',true)};thRef.on('value',_thCb);this.fb._listeners.push(()=>thRef.off('value',_thCb));
// Room history listener
const roomRef=this.fb.db.ref('rooms');const _rmCb=s=>{this._allRooms=s.val()||{};this._renderRoomHistory()};roomRef.on('value',_rmCb);this.fb._listeners.push(()=>roomRef.off('value',_rmCb));
// Restore active room from localStorage (BUG-E fix)
this._restoreActiveRoom();this._initTeacherNotifListener();this._initCCFilters();
// Quiz bank listeners
this.fb.listenQuizBanks(quizzes=>{this._teacherQuizzes=quizzes;this._renderTeacherQuizList(quizzes)});
this.fb.listenAllQuizResults(res=>{this._teacherQuizResults=res;this._renderTeacherQuizList(this._teacherQuizzes||{})});
this._initTeacherQuiz();
const tqSearch=document.getElementById('t-quiz-search');if(tqSearch)tqSearch.oninput=()=>this._renderTeacherQuizList(this._teacherQuizzes||{})}

_bindTeacherTabs(){const self=this;document.querySelectorAll('.t-tab[data-ttab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.t-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.t-tab-panel').forEach(p=>p.classList.add('hidden'));const panel=document.getElementById('t-tab-'+btn.dataset.ttab);if(panel)panel.classList.remove('hidden');if(btn.dataset.ttab==='compose')setTimeout(()=>{self.cmMain&&self.cmMain.refresh();self.cmBrute&&self.cmBrute.refresh();self.cmAiPreview&&self.cmAiPreview.refresh()},50)}})}

_initCM(){if(this.cmMain)return;const cfg={mode:'python',lineNumbers:true,indentUnit:4,tabSize:4,matchBrackets:true,autoCloseBrackets:true,styleActiveLine:true,extraKeys:{'Tab':cm=>cm.execCommand('indentMore'),'Shift-Tab':cm=>cm.execCommand('indentLess'),'Ctrl-/':cm=>cm.execCommand('toggleComment')}};
document.getElementById('editor-main-wrap').innerHTML='';document.getElementById('editor-brute-wrap').innerHTML='';document.getElementById('editor-ai-preview').innerHTML='';
this.cmMain=CodeMirror(document.getElementById('editor-main-wrap'),{...cfg,value:'# Code đáp án\nn = int(input())\nprint(n * 2)\n'});this.cmMain.setSize(null,260);this.cmMain.on('change',()=>{this._validateForm();this._debouncedSaveDraft()});
this.cmBrute=CodeMirror(document.getElementById('editor-brute-wrap'),{...cfg,value:'# Brute force\n'});this.cmBrute.setSize(null,180);this.cmBrute.on('change',()=>this._debouncedSaveDraft());
this.cmAiPreview=CodeMirror(document.getElementById('editor-ai-preview'),{...cfg,readOnly:true,value:''});this.cmAiPreview.setSize(null,180);this.cmAiPreview.on('change',()=>this._debouncedSaveDraft());
// Bind auto-save on form inputs (debounced 3s)
const draftInputs=['problem-title','task-name','problem-topic','total-tests','problem-description','ai-prompt'];draftInputs.forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',()=>this._debouncedSaveDraft())}});
['chk-file-io','chk-uppercase'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',()=>this._debouncedSaveDraft())});
// Use event delegation on dynamic containers so any sub-input change triggers auto-save
['subtasks-container','input-lines-container','sample-io-container'].forEach(cid=>{const c=document.getElementById(cid);if(c){c.addEventListener('input',()=>this._debouncedSaveDraft());c.addEventListener('change',()=>this._debouncedSaveDraft())}});
// Observe DOM mutations (add/remove subtask/line/var) to trigger auto-save
const obs=new MutationObserver(()=>this._debouncedSaveDraft());
['subtasks-container','input-lines-container','sample-io-container'].forEach(cid=>{const c=document.getElementById(cid);if(c)obs.observe(c,{childList:true,subtree:true})})}

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
$('btn-ai-auto').onclick=()=>this._aiAutoGenVerify();
$('btn-ai-use').onclick=()=>{this.cmMain.setValue(this.cmAiPreview.getValue());this._switchTab('tab-code');this._toast('Đã copy code chính!','success')};
$('btn-ai-use-brute').onclick=()=>{this.cmBrute.setValue(this.cmAiPreview.getValue());this._switchTab('tab-stress');this._toast('Đã điền vào Brute Force!','success');setTimeout(()=>this.cmBrute.refresh(),50)};
$('btn-stress-run').onclick=()=>this._runStress();
// Verify
const verifyBtn=$('btn-verify-run');if(verifyBtn)verifyBtn.onclick=()=>this._verifyCode();
// Room
$('btn-create-room').onclick=()=>this._showCreateRoomModal();
$('btn-confirm-room').onclick=()=>this._confirmCreateRoom();
$('btn-cancel-room').onclick=()=>$('modal-create-room').classList.add('hidden');
$('btn-start-contest').onclick=()=>this._startContest();
$('btn-end-contest').onclick=()=>this._endContest();
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
$('btn-save-bulk').onclick=()=>this._addBulkStudents();
// View/Edit exercise modal bindings
$('btn-close-view-ex').onclick=()=>$('modal-view-exercise').classList.add('hidden');
$('btn-save-view-ex').onclick=()=>this._saveViewExercise();
// File upload bindings
const fileInput=$('ex-files');const chooseBtn=$('btn-choose-files');if(chooseBtn)chooseBtn.onclick=()=>fileInput.click();if(fileInput)fileInput.onchange=e=>this._handleFileSelect(e.target.files);
const viewFileInput=$('view-ex-files');const viewChooseBtn=$('btn-view-choose-files');if(viewChooseBtn)viewChooseBtn.onclick=()=>viewFileInput.click();
if(viewFileInput)viewFileInput.onchange=e=>this._toast('Thêm file cho bài đã đăng chưa hỗ trợ','info');
// Search bindings
const exSearch=$('t-exercise-search');if(exSearch)exSearch.oninput=()=>this._renderTeacherExerciseList(this._teacherExercises||{});
const thSearch=$('t-theory-search');if(thSearch)thSearch.oninput=()=>this._renderTheoryList(this._cachedTheories||{},'t-theory-list',true);
// Theory bindings
const btnPublishTh=$('btn-publish-theory');if(btnPublishTh)btnPublishTh.onclick=()=>this._publishTheory();
// Theory file upload
const thFileInput=$('theory-file');const btnChooseTh=$('btn-choose-theory-file');
if(btnChooseTh)btnChooseTh.onclick=()=>thFileInput.click();
if(thFileInput)thFileInput.onchange=e=>{if(e.target.files[0])this._selectTheoryFile(e.target.files[0])};
// Drag-drop for theory file zone
const thZone=$('theory-file-zone');if(thZone){thZone.ondragover=e=>{e.preventDefault();thZone.classList.add('drag-over')};thZone.ondragleave=()=>thZone.classList.remove('drag-over');thZone.ondrop=e=>{e.preventDefault();thZone.classList.remove('drag-over');if(e.dataTransfer.files[0])this._selectTheoryFile(e.dataTransfer.files[0])}}
// Sample I/O
$('btn-add-sample-io').onclick=()=>this._addSampleIO();this._addSampleIO();
// Notification bindings
const btnSendNotif=$('btn-send-notif');if(btnSendNotif)btnSendNotif.onclick=()=>this._sendNotification();
const btnCancelNotifEdit=$('btn-cancel-notif-edit');if(btnCancelNotifEdit)btnCancelNotifEdit.onclick=()=>this._cancelNotifEdit();
document.querySelectorAll('input[name="notif-target"]').forEach(r=>r.onchange=()=>{const stuList=$('notif-stu-list');if(r.value==='select'&&r.checked){stuList.classList.remove('hidden');this._loadNotifStudentList()}else if(r.value==='all'&&r.checked){stuList.classList.add('hidden')}});
}

_sampleIOCounter=0;
_addSampleIO(inputVal='',outputVal='',explainVal=''){this._sampleIOCounter++;const idx=this._sampleIOCounter;const c=document.getElementById('sample-io-container');const card=document.createElement('div');card.className='sample-io-card';card.dataset.sampleId=idx;
card.innerHTML=`<div class="sample-io-header"><span class="sample-io-label">Ví dụ ${idx}</span><button class="btn-danger-sm btn-rm-sample" title="Xóa">✕</button></div><div class="sample-io-body"><div class="sample-io-col"><label class="sample-io-col-label">INPUT</label><textarea class="sample-io-input" rows="3" placeholder="3">${this._esc(inputVal)}</textarea></div><div class="sample-io-col"><label class="sample-io-col-label">OUTPUT</label><textarea class="sample-io-output" rows="3" placeholder="1\n2\n3">${this._esc(outputVal)}</textarea></div></div><div class="sample-io-explain-row"><label class="sample-io-col-label">💡 GIẢI THÍCH <span style="text-transform:none;font-weight:400;letter-spacing:0">(tùy chọn)</span></label><input type="text" class="sample-io-explanation" placeholder="VD: n = 4 (1,2,3,4) có 2 số chẵn là 2,4" value="${this._esc(explainVal)}"></div>`;
card.querySelector('.btn-rm-sample').onclick=()=>{if(c.children.length<=1){this._toast('Cần ít nhất 1 ví dụ','error');return}card.remove()};
c.appendChild(card)}

_getSampleIOs(){const cards=document.querySelectorAll('#sample-io-container .sample-io-card');return[...cards].map(c=>({input:c.querySelector('.sample-io-input').value,output:c.querySelector('.sample-io-output').value,explanation:c.querySelector('.sample-io-explanation').value})).filter(s=>s.input.trim()||s.output.trim())}

_switchTab(id){document.querySelectorAll('#code-tabs .tab-btn').forEach(b=>{b.classList.toggle('active',b.dataset.tab===id)});document.querySelectorAll('#section-code .tab-panel').forEach(p=>{p.classList.toggle('active',p.id===id)});setTimeout(()=>{this.cmMain.refresh();this.cmBrute.refresh();this.cmAiPreview.refresh()},50)}

// Collect AI context from current form data
_getAIContext(brute){const ctx={brute,fileIO:document.getElementById('chk-file-io').checked,model:document.getElementById('ai-model-select')?.value||'gemini-2.5-flash'};
// Constraints from subtasks
try{const sts=this._getSubtasks();if(sts.length){let c='';sts.forEach(st=>{c+=`- ${st.name}: ${st.percent}% điểm\n`});ctx.subtasksInfo=c;
// Variable constraints
const vars=document.querySelectorAll('.var-row');let constraintStr='';vars.forEach(v=>{const name=v.querySelector('.var-name-input')?.value||'';const type=v.querySelector('.var-type-select')?.value||'';const chips=v.querySelectorAll('.constraint-chip');chips.forEach(ch=>{const min=ch.querySelector('.cst-min')?.value||'';const max=ch.querySelector('.cst-max')?.value||'';if(name&&min&&max)constraintStr+=`${name} (${type}): ${min} ≤ ${name} ≤ ${max}\n`})});if(constraintStr)ctx.constraints=constraintStr}}catch(e){}
// Sample I/O
try{const samples=this._getSampleIOs();if(samples.length)ctx.sampleIO=samples}catch(e){}
return ctx}

async _aiGen(brute){const p=document.getElementById('ai-prompt').value.trim();if(!p){this._toast('Nhập đề bài','error');return}const k=document.getElementById('ai-api-key').value.trim();if(!k){this._toast('Nhập API Key','error');return}this.gemini.setApiKey(k);
const ctx=this._getAIContext(brute);
// Show context info
const infoEl=document.getElementById('ai-context-info');
let infoHtml=`<small>📊 Context: ${ctx.constraints?'Constraints ✅':'Constraints ❌'} | ${ctx.sampleIO?ctx.sampleIO.length+' sample(s) ✅':'Sample ❌'} | ${ctx.subtasksInfo?'Subtasks ✅':'Subtasks ❌'} | Model: ${ctx.model}</small>`;
infoEl.innerHTML=infoHtml;infoEl.classList.remove('hidden');
document.getElementById('ai-status').innerHTML='<span class="progress-spinner"></span> Đang sinh...';
try{const code=await this.gemini.generateCode(p,ctx);
this.cmAiPreview.setValue(code);document.getElementById('ai-preview').classList.remove('hidden');
document.getElementById('ai-status').textContent=brute?'✅ Brute force xong!':'✅ Code chính xong!';
setTimeout(()=>this.cmAiPreview.refresh(),50);
// Auto-fill brute if brute mode
if(brute){this.cmBrute.setValue(code);this._toast('Đã tự động điền vào tab Stress Test!','success')}
}catch(e){document.getElementById('ai-status').textContent='';this._toast('AI: '+e.message,'error')}}

// A3: One-click Auto Gen & Verify
async _aiAutoGenVerify(){const p=document.getElementById('ai-prompt').value.trim();if(!p){this._toast('Nhập đề bài','error');return}const k=document.getElementById('ai-api-key').value.trim();if(!k){this._toast('Nhập API Key','error');return}this.gemini.setApiKey(k);
if(!document.getElementById('input-lines-container').children.length){this._toast('Cấu hình input (Step 4) trước!','error');return}
const statusEl=document.getElementById('ai-status');
try{
// Step 1: Sinh code chính
statusEl.innerHTML='<span class="progress-spinner"></span> 1/3: Sinh code chính...';
const mainCtx=this._getAIContext(false);
const mainCode=await this.gemini.generateCode(p,mainCtx);
this.cmMain.setValue(mainCode);this.cmAiPreview.setValue(mainCode);
document.getElementById('ai-preview').classList.remove('hidden');
setTimeout(()=>{this.cmAiPreview.refresh();this.cmMain.refresh()},50);
// Step 2: Sinh brute
statusEl.innerHTML='<span class="progress-spinner"></span> 2/3: Sinh brute force...';
const bruteCtx=this._getAIContext(true);
const bruteCode=await this.gemini.generateCode(p,bruteCtx);
this.cmBrute.setValue(bruteCode);setTimeout(()=>this.cmBrute.refresh(),50);
// Step 3: Chạy stress test
statusEl.innerHTML='<span class="progress-spinner"></span> 3/3: Chạy stress test...';
const cfg=this.collectFormData();const cnt=parseInt(document.getElementById('stress-count').value)||50;const mx=parseInt(document.getElementById('stress-max-val').value)||100;
const r=await this.stress.run(cfg,mainCode,bruteCode,cnt,mx,(c,t)=>{statusEl.innerHTML=`<span class="progress-spinner"></span> 3/3: Stress ${c}/${t}...`});
this._showStressResult(r);
if(r.failed===0&&r.errors===0){statusEl.textContent='✅ Auto Gen & Verify hoàn tất — Tất cả đúng!';this._toast('🎉 Auto Gen & Verify: Pass!','success')}
else{statusEl.textContent=`⚠️ Auto Gen & Verify: ${r.failed} sai, ${r.errors} lỗi`;this._toast('⚠️ Stress test có lỗi — kiểm tra tab Stress Test','error');
this._switchTab('tab-stress')}
}catch(e){statusEl.textContent='';this._toast('Auto: '+e.message,'error')}}

async _runStress(){const mc=this.cmMain.getValue().trim(),bc=this.cmBrute.getValue().trim();if(!mc||!bc){this._toast('Nhập cả 2 code (Code Chính + Brute Force)','error');return}if(!document.getElementById('input-lines-container').children.length){this._toast('Cấu hình input (Step 4) trước','error');return}const cfg=this.collectFormData();const cnt=parseInt(document.getElementById('stress-count').value)||50;const mx=parseInt(document.getElementById('stress-max-val').value)||100;document.getElementById('stress-progress').classList.remove('hidden');document.getElementById('stress-results').classList.add('hidden');try{const r=await this.stress.run(cfg,mc,bc,cnt,mx,(c,t)=>{document.getElementById('stress-progress-text').textContent=`Test ${c}/${t}...`});document.getElementById('stress-progress').classList.add('hidden');this._showStressResult(r)}catch(e){document.getElementById('stress-progress').classList.add('hidden');this._toast('Stress: '+e.message,'error')}}

_showStressResult(r){const el=document.getElementById('stress-results');el.classList.remove('hidden');if(r.failed===0&&r.errors===0){el.className='stress-results pass';el.innerHTML=`<div class="stress-result-header">✅ ${r.passed}/${r.total} ĐÚNG!</div><p style="color:var(--success);font-size:.85rem">Code chính khớp brute force trên tất cả test ngẫu nhiên.</p>`}else{el.className='stress-results fail';let h=`<div class="stress-result-header">❌ ${r.failed} sai, ${r.errors} lỗi / ${r.total}</div>`;if(r.firstFail){const f=r.firstFail;h+=`<div class="stress-fail-detail"><div class="stress-fail-label">Input (Test ${f.index}):</div><pre>${this._esc(f.input)}</pre>`;h+=f.error?`<div class="stress-fail-label">Lỗi:</div><pre>${this._esc(f.error)}</pre>`:`<div class="stress-fail-label">Code chính:</div><pre>${this._esc(f.mainOutput)}</pre><div class="stress-fail-label">Brute:</div><pre>${this._esc(f.bruteOutput)}</pre>`;h+='</div>'}el.innerHTML=h}}

// A2: Real Verify — chạy test cases đã sinh với code chính
async _verifyCode(){const code=this.cmMain.getValue().trim();if(!code){this._toast('Nhập code chính trước','error');return}
const tests=this.themis.testCases;if(!tests.length){this._toast('Sinh test (Step 5) trước khi verify','error');return}
const cfg=this.collectFormData();const fio=cfg.fileIO;const tn=cfg.taskName||'B';const up=cfg.uppercase;
const inp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.INP':'.inp');
const outp=(up?tn.toUpperCase():tn.toLowerCase())+(up?'.OUT':'.out');
document.getElementById('verify-progress').classList.remove('hidden');
document.getElementById('verify-results').classList.add('hidden');
document.getElementById('verify-status').textContent='';
try{await this.pyEngine.init();
let pass=0,fail=0,errs=0;const details=[];
for(let i=0;i<tests.length;i++){const tc=tests[i];
document.getElementById('verify-progress-text').textContent=`Kiểm tra test ${i+1}/${tests.length}...`;
document.getElementById('verify-bar').style.width=((i+1)/tests.length*100)+'%';
let actual;try{
actual=fio?await this.pyEngine.runFileIO(code,tc.input,inp,outp):await this.pyEngine.runStdio(code,tc.input);
}catch(e){errs++;details.push({idx:i+1,status:'error',input:tc.input,expected:tc.output,actual:'',error:e.message,subtask:tc.subtaskName});continue}
if(actual.trim()===tc.output.trim()){pass++;details.push({idx:i+1,status:'pass',subtask:tc.subtaskName})}
else{fail++;details.push({idx:i+1,status:'fail',input:tc.input,expected:tc.output,actual,subtask:tc.subtaskName})}
await new Promise(r=>setTimeout(r,5))}
document.getElementById('verify-progress').classList.add('hidden');
this._showVerifyResults({pass,fail,errs,total:tests.length,details});
}catch(e){document.getElementById('verify-progress').classList.add('hidden');this._toast('Verify: '+e.message,'error')}}

_showVerifyResults(r){const el=document.getElementById('verify-results');el.classList.remove('hidden');
const allPass=r.fail===0&&r.errs===0;
const statusEl=document.getElementById('verify-status');
statusEl.textContent=allPass?`✅ ${r.pass}/${r.total} Pass`:`⚠️ ${r.fail} sai, ${r.errs} lỗi / ${r.total}`;
statusEl.style.color=allPass?'var(--success)':'var(--danger,#ef4444)';
let h=`<div class="verify-summary ${allPass?'pass':'fail'}">`;
h+=`<div class="verify-summary-header">${allPass?'✅ TẤT CẢ TEST ĐÃ PASS':'❌ CÓ TEST KHÔNG ĐÚNG'}</div>`;
h+=`<div class="verify-summary-stats"><span class="verify-stat pass">✅ ${r.pass}</span><span class="verify-stat fail">❌ ${r.fail}</span><span class="verify-stat err">⚠️ ${r.errs}</span><span class="verify-stat total">📋 ${r.total}</span></div></div>`;
// Detailed table
const failedTests=r.details.filter(d=>d.status!=='pass');
if(failedTests.length){h+='<div class="verify-detail-list">';
failedTests.forEach(d=>{h+=`<div class="verify-detail-item ${d.status}">`;
h+=`<div class="verify-detail-header"><strong>Test ${d.idx}</strong> <span class="verify-badge ${d.status}">${d.status==='fail'?'Sai':'Lỗi'}</span> <span style="color:var(--text-muted);font-size:.72rem">${d.subtask||''}</span></div>`;
h+=`<div class="verify-detail-body">`;
h+=`<div><label>Input:</label><pre>${this._esc(d.input||'')}</pre></div>`;
h+=`<div><label>Expected:</label><pre>${this._esc(d.expected||'')}</pre></div>`;
h+=d.error?`<div><label>Error:</label><pre class="err">${this._esc(d.error)}</pre></div>`:`<div><label>Actual:</label><pre class="wrong">${this._esc(d.actual||'')}</pre></div>`;
h+=`</div></div>`});
h+='</div>'}
el.innerHTML=h}

// Room management
_showCreateRoomModal(){
const exs=this._teacherExercises||{};const keys=Object.keys(exs);
const cl=document.getElementById('room-exercise-checklist');
if(!keys.length){cl.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px;font-size:.85rem">Chưa có bài tập. Hãy đăng bài tập trước.</p>'}
else{let h='';keys.forEach(k=>{const ex=exs[k];const tc=ex.testCases?ex.testCases.length:0;
h+=`<label class="room-ex-item"><input type="checkbox" value="${k}" class="room-ex-chk"><span class="room-ex-item-info"><strong>${this._esc(ex.title)}</strong><span class="room-ex-item-meta">${this._esc(ex.topic||'Chung')} • ${tc} test</span></span></label>`});
cl.innerHTML=h}
this._updateRoomExCount();
document.getElementById('btn-room-select-all').onclick=()=>{cl.querySelectorAll('.room-ex-chk').forEach(c=>c.checked=true);this._updateRoomExCount()};
document.getElementById('btn-room-deselect-all').onclick=()=>{cl.querySelectorAll('.room-ex-chk').forEach(c=>c.checked=false);this._updateRoomExCount()};
cl.querySelectorAll('.room-ex-chk').forEach(c=>c.onchange=()=>this._updateRoomExCount());
document.getElementById('modal-create-room').classList.remove('hidden');document.getElementById('room-title').focus()}

_updateRoomExCount(){
const checked=[...document.querySelectorAll('#room-exercise-checklist .room-ex-chk:checked')];
const n=checked.length;
document.getElementById('room-ex-selected-count').textContent=`${n} bài đã chọn`;
const scoreConfig=document.getElementById('room-score-config');
const scoreList=document.getElementById('room-score-list');
if(n>0){
scoreConfig.classList.remove('hidden');
const exs=this._teacherExercises||{};
let h='';checked.forEach((c,i)=>{const ex=exs[c.value];
h+=`<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:6px">
<span style="font-weight:600;font-size:.84rem;min-width:50px;color:var(--accent-light)">Bài ${i+1}</span>
<span style="flex:1;font-size:.82rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${this._esc(ex?.title||'?')}</span>
<input type="number" class="room-prob-score" data-idx="${i}" value="${n<=4?Math.floor(20/n):5}" min="1" max="100" style="width:60px;padding:4px 6px;text-align:center;font-weight:700;font-size:.85rem">
<span style="font-size:.78rem;color:var(--text-muted)">điểm</span>
</div>`});
scoreList.innerHTML=h;
scoreList.querySelectorAll('.room-prob-score').forEach(inp=>inp.oninput=()=>this._updateRoomTotalScore());
this._updateRoomTotalScore();
}else{scoreConfig.classList.add('hidden');scoreList.innerHTML=''}}

async _confirmCreateRoom(){const title=document.getElementById('room-title').value.trim();const time=document.getElementById('room-time').value.trim();if(!title||!time){this._toast('Nhập đầy đủ thông tin','error');return}
const selectedIds=[...document.querySelectorAll('#room-exercise-checklist .room-ex-chk:checked')].map(c=>c.value);
if(!selectedIds.length){this._toast('Chọn ít nhất 1 bài tập','error');return}
// Collect per-problem max scores
const scoreInputs=document.querySelectorAll('.room-prob-score');
const maxScores=[];scoreInputs.forEach(inp=>maxScores.push(parseInt(inp.value)||5));
const totalMaxScore=maxScores.reduce((s,v)=>s+v,0);
document.getElementById('modal-create-room').classList.add('hidden');
try{this.roomCode=await this.fb.createRoom(title,'Giáo viên',time);
// Persist to localStorage (BUG-E fix)
localStorage.setItem('themis_activeRoom',this.roomCode);
document.getElementById('teacher-room-bar').classList.remove('hidden');document.getElementById('t-room-code').textContent=this.roomCode;this._setRoomStatus('waiting');
// Publish selected exercises as contest problems
const exs=this._teacherExercises||{};
const problemNames=[];
for(let i=0;i<selectedIds.length;i++){const ex=exs[selectedIds[i]];if(!ex)continue;
problemNames.push(ex.title);
const data={title:ex.title,description:ex.description||'',fileIO:ex.fileIO||false,uppercase:ex.uppercase||false,taskName:ex.taskName||ex.title,timePerTest:5,subtasks:ex.subtasks||[{name:'Subtask 1',score:100}],sampleIO:ex.sampleIO||null,maxScore:maxScores[i]||5,testCases:(ex.testCases||[]).map(tc=>({input:tc.input,output:tc.output,subtaskId:tc.subtaskId||0}))};
await this.fb.publishProblem(this.roomCode,i,data)}
this.publishedCount=selectedIds.length;
// Save problem names and total max score to Firebase room info
await this.fb.db.ref(`rooms/${this.roomCode}/info/problemNames`).set(problemNames.join(', '));
await this.fb.db.ref(`rooms/${this.roomCode}/info/totalMaxScore`).set(totalMaxScore);
// Log to Google Sheet
this.drive.logData('Rooms',[this.roomCode,title,time,'waiting',new Date().toISOString(),'',selectedIds.length,0,problemNames.join(', '),totalMaxScore]).catch(()=>{});
// Show active room dashboard
this._showActiveRoomDashboard(this.roomCode,title,time,selectedIds.length);
// Render problems in the dashboard
this._viewingRoomCode=this.roomCode;
await this._viewRoomHistory(this.roomCode);
// Listen for students joining (lobby)
this.fb.listenStudents(this.roomCode,s=>{this._activeRoomStudents=s||{};const count=Object.keys(s||{}).length;this._activeRoomStudentCount=count;document.getElementById('t-student-count').textContent=count;this._renderStudentLobby(s||{})});
this.fb.listenLeaderboard(this.roomCode,lb=>{this._activeRoomLeaderboard=lb;this._renderLeaderboard(lb,'t-leaderboard-body')});
this._toast(`🏆 Phòng ${this.roomCode} đã tạo với ${selectedIds.length} bài (tổng ${totalMaxScore}đ)!`,'success')
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_updateRoomTotalScore(){const inputs=document.querySelectorAll('.room-prob-score');let total=0;inputs.forEach(inp=>total+=parseInt(inp.value)||0);const el=document.getElementById('room-total-score');if(el)el.textContent=`Tổng: ${total} điểm`;el.style.color=total===20?'var(--success)':total>20?'var(--warning)':'var(--accent-light)'}

_toggleProbDetail(idx){const el=document.getElementById(`room-prob-detail-${idx}`);if(el)el.classList.toggle('hidden')}

// ===== COMMAND CENTER =====
_openCommandCenter(code,title,time,probCount,status){
const el=id=>document.getElementById(id);
// Switch views
const list=el('cc-list-view');const cc=el('cc-command-center');
if(list)list.classList.add('hidden');
if(cc)cc.classList.remove('hidden');
// Populate status bar
el('cc-room-title').textContent=title||'Kỳ thi';
el('cc-room-code').textContent='#'+code;
el('cc-timer').textContent='00:00';
el('cc-student-count').textContent='0';
el('cc-prob-count').textContent=probCount||0;
el('cc-prob-badge').textContent=(probCount||0)+' bài';
const statusBadge=el('cc-status-badge');
const statusText=status==='active'?'ĐANG THI':status==='ended'?'KẾT THÚC':status==='graded'?'ĐÃ CHẤM':status==='published'?'ĐÃ CÔNG BỐ':'CHỜ';
if(statusBadge){statusBadge.textContent=statusText;statusBadge.className='room-status-badge '+(status||'waiting')}
// Wire buttons
const startBtn=el('cc-btn-start');const endBtn=el('cc-btn-end');
if(startBtn){startBtn.onclick=()=>this._startContest();startBtn.style.display=status==='active'?'none':''}
if(endBtn){endBtn.onclick=()=>this._endContest();endBtn.style.display=status==='active'?'':'none'}
// Wire back button
el('cc-back-to-list').onclick=()=>this._closeCommandCenter();
// Init sub-tab switching
this._initCCSubtabs();
// Auto-select tab based on status
if(status==='ended'||status==='graded')this._switchCCTab('grading');
else if(status==='published')this._switchCCTab('leaderboard');
else this._switchCCTab('problems');
// Track
this._viewingRoomCode=code;
}

_closeCommandCenter(){
const el=id=>document.getElementById(id);
const list=el('cc-list-view');const cc=el('cc-command-center');
if(list)list.classList.remove('hidden');
if(cc)cc.classList.add('hidden');
this._viewingRoomCode=null;
this._renderContestList();
}

// Backward compat — keep old API working
_showActiveRoomDashboard(code,title,time,probCount){
this._openCommandCenter(code,title,time,probCount,'waiting');
}
_hideActiveRoomDashboard(){this._closeCommandCenter()}
_setContestStep(step){
// Map old steps to CC status badge
const statusBadge=document.getElementById('cc-status-badge');
if(!statusBadge)return;
if(step===1){statusBadge.textContent='ĐỀ THI';statusBadge.className='room-status-badge waiting'}
else if(step===2){statusBadge.textContent='PHÒNG CHỜ';statusBadge.className='room-status-badge waiting'}
else if(step===3){statusBadge.textContent='ĐANG THI';statusBadge.className='room-status-badge active';
// Auto-switch to Students tab during active contest
this._switchCCTab('students');
}
}

// Sub-tab switching
_initCCSubtabs(){
document.querySelectorAll('.cc-subtab').forEach(btn=>{
btn.onclick=()=>this._switchCCTab(btn.dataset.cctab)
})
}
_switchCCTab(tab){
document.querySelectorAll('.cc-subtab').forEach(b=>b.classList.toggle('active',b.dataset.cctab===tab));
document.querySelectorAll('.cc-panel').forEach(p=>p.classList.toggle('active',p.id==='ccp-'+tab));
}

// Filter tabs for contest list
_initCCFilters(){
document.querySelectorAll('.cc-filter').forEach(btn=>{
btn.onclick=()=>{
document.querySelectorAll('.cc-filter').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
this._renderContestList(btn.dataset.filter);
}
})
}

// Student lobby (updated to also write to cc-student-count)
_renderStudentLobby(students){
const lobby=document.getElementById('t-student-lobby');
const countEl=document.getElementById('t-lobby-count');
const ccCount=document.getElementById('cc-student-count');
const names=Object.keys(students);
if(countEl)countEl.textContent=names.length+' HS';
if(ccCount)ccCount.textContent=names.length;
if(!names.length){lobby.innerHTML='<p class="lobby-empty">⏳ Đang chờ học sinh tham gia...</p>';return}
if(names.length>0)this._setContestStep(2);
const colors=['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6'];
let h='<div class="lobby-grid">';
names.sort().forEach((name,i)=>{
const initial=(name[0]||'?').toUpperCase();
const color=colors[i%colors.length];
const joinTime=students[name]?.joinedAt?new Date(students[name].joinedAt).toLocaleTimeString('vi',{hour:'2-digit',minute:'2-digit'}):'';
h+=`<div class="lobby-student-card">
<div class="lobby-avatar" style="background:${color}">${initial}</div>
<div>
<div class="lobby-student-name" title="${this._esc(name)}">${this._esc(name)}</div>
${joinTime?`<div class="lobby-student-time">Vào lúc ${joinTime}</div>`:''}
</div></div>`});
h+='</div>';lobby.innerHTML=h}

// Contest problem management
_editContestProblem(idx,code){
// Open detail and show edit form
const detail=document.getElementById(`room-prob-detail-${idx}`);if(detail)detail.classList.remove('hidden');
const viewEl=document.getElementById(`prob-view-${idx}`);if(viewEl)viewEl.classList.add('hidden');
const editEl=document.getElementById(`prob-edit-${idx}`);if(editEl)editEl.classList.remove('hidden');
this._toast('✏️ Chế độ chỉnh sửa','info')}

_cancelEditProblem(idx){
const viewEl=document.getElementById(`prob-view-${idx}`);if(viewEl)viewEl.classList.remove('hidden');
const editEl=document.getElementById(`prob-edit-${idx}`);if(editEl)editEl.classList.add('hidden')}

async _saveContestProblem(idx,code){
const titleInput=document.getElementById(`prob-edit-title-${idx}`);
const descInput=document.getElementById(`prob-edit-desc-${idx}`);
const scoreInput=document.getElementById(`prob-edit-score-${idx}`);
if(!titleInput||!descInput){this._toast('Mở chế độ sửa trước','error');return}
const title=titleInput.value.trim();const desc=descInput.value;const score=parseInt(scoreInput.value)||5;
if(!title){this._toast('Tên đề không được trống','error');return}
const ok=await this._confirmDialog('💾 Lưu thay đổi',`Cập nhật bài ${idx+1}: "${title}" (${score}đ)?`,'Lưu','btn-accent');
if(!ok)return;
try{const updates={};updates[`rooms/${code}/problems/${idx}/title`]=title;updates[`rooms/${code}/problems/${idx}/description`]=desc;updates[`rooms/${code}/problems/${idx}/maxScore`]=score;
await this.fb.db.ref().update(updates);
this._cancelEditProblem(idx);
// Refresh the view
const titleDisplay=document.getElementById(`prob-title-display-${idx}`);if(titleDisplay)titleDisplay.textContent=title;
const viewTitle=document.querySelector(`#prob-view-${idx} div`);if(viewTitle)viewTitle.textContent=title;
this._toast('✅ Đã lưu thay đổi!','success');
// Reload room data to reflect changes
if(this._viewingRoomCode===code)setTimeout(()=>this._viewRoomHistory(code),500);
}catch(e){this._toast('Lỗi lưu: '+e.message,'error')}}

async _deleteContestProblem(idx,code){
const ok=await this._confirmDialog('🗑 Xóa đề bài',`Xóa bài ${idx+1} khỏi phòng thi?\n⚠️ Hành động này không thể hoàn tác!`,'Xóa','btn-danger');
if(!ok)return;
try{const probSnap=await this.fb.db.ref(`rooms/${code}/problems`).once('value');
const probs=probSnap.val()||[];const probArr=Array.isArray(probs)?[...probs]:Object.values(probs);
if(idx<0||idx>=probArr.length){this._toast('Chỉ số bài không hợp lệ','error');return}
probArr.splice(idx,1);
await this.fb.db.ref(`rooms/${code}/problems`).set(probArr);
// Update room info
await this.fb.db.ref(`rooms/${code}/info/problemCount`).set(probArr.length);
const names=probArr.map(p=>p?.title||'?').join(', ');
await this.fb.db.ref(`rooms/${code}/info/problemNames`).set(names);
this._toast(`🗑 Đã xóa bài ${idx+1}!`,'success');
if(this._viewingRoomCode===code)setTimeout(()=>this._viewRoomHistory(code),500);
}catch(e){this._toast('Lỗi xóa: '+e.message,'error')}}

// Account management (root level — no roomCode needed)
async _addSingleStudent(){const name=document.getElementById('new-stu-name').value.trim();const pass=document.getElementById('new-stu-pass').value.trim();if(!name||!pass){this._toast('Nhập tên và mật khẩu','error');return}try{await this.fb.createAccount(name,pass);this.drive.logData('Accounts',[name,pass,new Date().toISOString(),'','active']).catch(()=>{});document.getElementById('new-stu-name').value='';document.getElementById('new-stu-pass').value='';this._toast(`Đã tạo: ${name}`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _addBulkStudents(){const text=document.getElementById('bulk-students').value.trim();if(!text){this._toast('Nhập danh sách','error');return}const lines=text.split('\n').filter(l=>l.trim());const list=[];for(const line of lines){const parts=line.split(',').map(s=>s.trim());if(parts.length>=2)list.push({name:parts[0],pass:parts[1]});else this._toast(`Bỏ qua: ${line}`,'error')}if(!list.length)return;try{await this.fb.createAccountsBulk(list);document.getElementById('bulk-students').value='';document.getElementById('bulk-add-form').classList.add('hidden');this._toast(`Đã tạo ${list.length} tài khoản!`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_renderAccountList(accts){const c=document.getElementById('account-list');const keys=Object.keys(accts);if(!keys.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Chưa có tài khoản. Nhấn "+ Thêm HS" để tạo.</p>';return}
let h='<p style="color:var(--text-muted);font-size:.75rem;margin-bottom:8px">🔒 Mật khẩu mới được mã hóa SHA-256. Tra cứu mật khẩu gốc trong Google Sheet.</p>';
h+='<table class="acct-table"><thead><tr><th>#</th><th>Tên đăng nhập</th><th>Bảo mật</th><th>Xóa</th></tr></thead><tbody>';
keys.forEach((k,i)=>{const acct=accts[k];const isHashed=!!acct.passwordHash;const pwCell=isHashed?'<span style="color:var(--success);font-size:.8rem">🔒 SHA-256</span>':'<span class="acct-pass" data-user="'+this._esc(k)+'" data-hidden="true">••••••</span>';h+=`<tr><td>${i+1}</td><td style="font-weight:600">${this._esc(k)}</td><td>${pwCell}</td><td><button class="btn-danger-sm" onclick="window._uic._deleteAccount('${this._esc(k)}')">✕</button></td></tr>`});
h+='</tbody></table>';c.innerHTML=h;
c.querySelectorAll('.acct-pass').forEach(span=>{const uname=span.dataset.user;span.style.cursor='pointer';span.onclick=()=>{if(span.dataset.hidden==='true'){span.textContent=accts[uname]?.password||'?';span.dataset.hidden='false';span.style.color='var(--accent)'}else{span.textContent='••••••';span.dataset.hidden='true';span.style.color=''}}})}

async _deleteAccount(name){const ok=await this._confirmDialog('🗑️ Xóa tài khoản',`Bạn chắc chắn muốn xóa tài khoản <strong>${this._esc(name)}</strong>? Dữ liệu bài làm của học sinh này sẽ bị mất.`,'Xóa','btn-danger');if(!ok)return;try{await this.fb.deleteAccount(name);this._toast(`Đã xóa: ${name}`,'success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// [BUG-01 FIXED] Dead code removed — using version with search filter at L404+

async _deleteExercise(id){const ex=(this._teacherExercises||{})[id];const name=ex?ex.title:'bài tập';const ok=await this._confirmDialog('🗑️ Xóa bài tập',`Bạn chắc chắn muốn xóa <strong>${this._esc(name)}</strong>? Tất cả kết quả làm bài của HS sẽ bị mất.`,'Xóa','btn-danger');if(!ok)return;try{await this.fb.deleteExercise(id);this._toast('Đã xóa bài tập!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// === Exercise view/edit/save modal ===
_openViewExercise(id){const exs=this._teacherExercises||{};const ex=exs[id];if(!ex)return;
// Store current exercise for re-grading
this._viewingExId=id;
document.getElementById('view-ex-id').value=id;
document.getElementById('view-ex-title').value=ex.title||'';
document.getElementById('view-ex-topic').value=ex.topic||'';
// Set difficulty selector
this._setViewDifficulty(ex.difficulty||'medium');
document.getElementById('view-ex-desc').value=ex.description||'';
// Show test count readonly
const tcCount=ex.testCases?ex.testCases.length:0;
const tcEl=document.getElementById('view-ex-tests-count');if(tcEl)tcEl.textContent=tcCount;
// F1: Render Sample I/O editor
this._renderViewSampleIO(ex.sampleIO||[]);
// F2: Render Subtask editor
this._renderViewSubtasks(ex.subtasks||[{id:1,name:'Subtask 1',percent:100}],tcCount);
// F_TC: Render Test Cases viewer (read-only)
this._renderViewTestCases(ex.testCases||[],ex.subtasks||[]);
// F3: Render students with code viewer
const res=this._teacherExResults||{};const exRes=res[id]||{};
this._renderViewStudentsWithCode(id,exRes);
// Attachments
const attEl=document.getElementById('view-ex-attachments');attEl.innerHTML='';
if(ex.attachments){ex.attachments.forEach(att=>{attEl.innerHTML+=`<div class="file-chip"><a href="${att.url}" target="_blank">📎 ${this._esc(att.name)}</a></div>`})}
// Enable save button and bind regrade
const saveBtn=document.getElementById('btn-save-view-ex');if(saveBtn)saveBtn.disabled=false;
const regradeBtn=document.getElementById('btn-regrade-exercise');
if(regradeBtn){const hasStudents=Object.keys(exRes).length>0;regradeBtn.style.display=hasStudents?'':'none';regradeBtn.onclick=()=>this._reGradeExercise(id)}
// Footer regrade button
const footerRegradeBtn=document.getElementById('btn-regrade-view-ex');
if(footerRegradeBtn){const hs2=Object.keys(exRes).length>0;footerRegradeBtn.style.display=hs2?'inline-flex':'none';footerRegradeBtn.onclick=()=>this._reGradeExercise(id)}
// Add sample IO button binding
const addSampleBtn=document.getElementById('btn-view-add-sample');if(addSampleBtn)addSampleBtn.onclick=()=>this._addViewSampleIO();
const addStBtn=document.getElementById('btn-view-add-subtask');if(addStBtn)addStBtn.onclick=()=>this._addViewSubtask();
document.getElementById('modal-view-exercise').classList.remove('hidden')}

async _saveViewExercise(){const id=document.getElementById('view-ex-id').value;if(!id)return;
const newSubtasks=this._collectViewSubtasks();
const stTotal=newSubtasks.reduce((s,st)=>s+st.percent,0);
if(stTotal!==100){this._toast(`Tổng % subtask = ${stTotal}%, cần = 100%`,'error');return}
const newSampleIO=this._collectViewSampleIO();
const updates={title:document.getElementById('view-ex-title').value.trim(),topic:document.getElementById('view-ex-topic').value.trim()||'Không phân loại',description:document.getElementById('view-ex-desc').value,difficulty:document.getElementById('view-ex-difficulty')?.value||'medium',subtasks:newSubtasks,sampleIO:newSampleIO.length?newSampleIO:null};
try{
await this.fb.updateExercise(id,updates);
this._toast('Đã cập nhật bài tập!','success');
this._tcViewOpen=false;
const tcList=document.getElementById('view-ex-tc-list');if(tcList)tcList.style.display='none';
document.getElementById('modal-view-exercise').classList.add('hidden')
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// === View Exercise Modal Helpers ===

// F1: Render editable Sample I/O
_sampleIOViewCounter=0;
_renderViewSampleIO(samples){
this._sampleIOViewCounter=0;
const el=document.getElementById('view-ex-sample-io-list');el.innerHTML='';
if(!samples||!samples.length){el.innerHTML='<p style="color:var(--text-muted);font-size:.78rem;text-align:center;padding:10px">Chưa có ví dụ. Nhấn "+ Thêm ví dụ".</p>';return}
samples.forEach((s,i)=>this._addViewSampleIO(s.input||'',s.output||'',s.explanation||''))}

_addViewSampleIO(inputVal='',outputVal='',explainVal=''){
this._sampleIOViewCounter++;
const idx=this._sampleIOViewCounter;
const list=document.getElementById('view-ex-sample-io-list');
// Remove placeholder if exists
const ph=list.querySelector('p');if(ph)ph.remove();
const card=document.createElement('div');card.className='view-sample-io-card';card.dataset.sampleIdx=idx;
card.innerHTML=`<div class="view-sample-io-card-header"><span>Ví dụ ${idx}</span><button class="btn-danger-sm btn-rm-view-sample" title="Xóa">✕</button></div><div class="view-sample-io-grid"><div><label>INPUT</label><textarea class="view-sample-input" rows="3" placeholder="3">${this._esc(inputVal)}</textarea></div><div><label>OUTPUT</label><textarea class="view-sample-output" rows="3" placeholder="1\n2\n3">${this._esc(outputVal)}</textarea></div></div><div class="view-sample-io-explain"><label style="font-size:.7rem;font-weight:600;color:var(--text-muted);letter-spacing:.04em">💡 GIẢI THÍCH (tùy chọn)</label><input type="text" class="view-sample-explain" placeholder="Giải thích ngắn..." value="${this._esc(explainVal)}"></div>`;
card.querySelector('.btn-rm-view-sample').onclick=()=>card.remove();
list.appendChild(card)}

_collectViewSampleIO(){const cards=document.querySelectorAll('#view-ex-sample-io-list .view-sample-io-card');return[...cards].map(c=>({input:c.querySelector('.view-sample-input').value,output:c.querySelector('.view-sample-output').value,explanation:c.querySelector('.view-sample-explain').value})).filter(s=>s.input.trim()||s.output.trim())}

// F_TC: Render Test Cases viewer
_renderViewTestCases(testCases,subtasks){
// Update count badge
const countEl=document.getElementById('view-ex-tc-count');if(countEl)countEl.textContent=testCases.length;
const list=document.getElementById('view-ex-tc-list');if(!list)return;
if(!testCases.length){list.innerHTML='<p style="color:var(--text-muted);font-size:.78rem;text-align:center;padding:12px">Bài này chưa có test cases.</p>';return}
// Group by subtaskId
const groups={};
const stMap={};
subtasks.forEach(st=>{stMap[st.id]=st.name});
testCases.forEach((tc,i)=>{
const sid=tc.subtaskId!==undefined?tc.subtaskId:1;
if(!groups[sid])groups[sid]=[];
groups[sid].push({...tc,_globalIdx:i+1})});
let h='';
Object.keys(groups).sort((a,b)=>a-b).forEach(sid=>{
const tests=groups[sid];
const stName=stMap[sid]||('Subtask '+sid);
h+=`<div class="view-tc-group">
<div class="view-tc-group-header" onclick="this.nextElementSibling.classList.toggle('open')">
<span>${stName}</span><span class="view-tc-group-badge">${tests.length} test</span>
<span style="font-size:.65rem;color:var(--text-muted);margin-left:auto">▼</span>
</div>
<div class="view-tc-cards">
${tests.map(tc=>`<div class="view-tc-card">
<div class="view-tc-card-header">
<span class="tc-num">Test #${tc._globalIdx}</span>
<span class="view-tc-verdict pending">—</span>
</div>
<div class="view-tc-io">
<div class="view-tc-io-pane"><div class="view-tc-io-label">INPUT</div><pre>${this._esc(tc.input||'(trống)')}</pre></div>
<div class="view-tc-io-pane"><div class="view-tc-io-label">OUTPUT (đáp án)</div><pre>${this._esc(tc.output||'(trống)')}</pre></div>
</div>
</div>`).join('')}
</div></div>`});
list.innerHTML=h}

_tcViewOpen=false;
_toggleViewTestCases(){
const list=document.getElementById('view-ex-tc-list');
const btn=document.getElementById('btn-toggle-tc-view');
if(!list)return;
this._tcViewOpen=!this._tcViewOpen;
list.style.display=this._tcViewOpen?'block':'none';
if(btn)btn.textContent=this._tcViewOpen?'▲ Ẩn bớt':'▼ Xem tất cả';
// Auto-open first subtask group when expanding
if(this._tcViewOpen){const first=list.querySelector('.view-tc-cards');if(first&&!first.classList.contains('open'))first.classList.add('open')}}

// F2: Render editable Subtasks
_viewStCounter=0;
_renderViewSubtasks(subtasks,totalTests){
this._viewStCounter=0;
const el=document.getElementById('view-ex-subtasks-list');el.innerHTML='';
// Distribute tests among subtasks for display
const total=totalTests||0;
subtasks.forEach((st,i)=>{
const testCount=Math.round(total*(st.percent||0)/100);
this._addViewSubtask(st.id||i+1,st.name||('Subtask '+(i+1)),st.percent||0,testCount)});
this._updateViewStTotal()}

_addViewSubtask(id,name,pct,testCount){
this._viewStCounter++;
const counter=this._viewStCounter;
const el=document.getElementById('view-ex-subtasks-list');
const row=document.createElement('div');row.className='view-st-row';row.dataset.stId=id||counter;
row.innerHTML=`<span style="font-size:.72rem;color:var(--text-muted);min-width:28px">ST${id||counter}</span><input type="text" class="view-st-name" value="${this._esc(name||('Subtask '+counter))}" placeholder="Tên subtask"><input type="number" class="view-st-pct" value="${pct||0}" min="0" max="100" step="5"><span style="font-size:.72rem;color:var(--text-muted)">%</span><span class="view-st-count">${testCount||0} test</span><button class="btn-danger-sm btn-rm-view-st" title="Xóa">✕</button>`;
row.querySelector('.view-st-pct').oninput=()=>this._updateViewStTotal();
row.querySelector('.btn-rm-view-st').onclick=()=>{if(document.querySelectorAll('#view-ex-subtasks-list .view-st-row').length<=1){this._toast('Cần ít nhất 1 subtask','error');return}row.remove();this._updateViewStTotal()};
el.appendChild(row)}

_updateViewStTotal(){
const rows=document.querySelectorAll('#view-ex-subtasks-list .view-st-row');
let sum=0;rows.forEach(r=>sum+=parseInt(r.querySelector('.view-st-pct').value)||0);
const badge=document.getElementById('view-ex-st-total');
if(badge){badge.textContent='Tổng: '+sum+'%';badge.className='view-ex-st-badge '+(sum===100?'ok':'error')}
const saveBtn=document.getElementById('btn-save-view-ex');if(saveBtn)saveBtn.disabled=(sum!==100)}

_collectViewSubtasks(){const rows=document.querySelectorAll('#view-ex-subtasks-list .view-st-row');return[...rows].map((r,i)=>({id:parseInt(r.dataset.stId)||i+1,name:r.querySelector('.view-st-name').value.trim()||('Subtask '+(i+1)),percent:parseInt(r.querySelector('.view-st-pct').value)||0}))}

// F3: Render students with code expander
_renderViewStudentsWithCode(exId,exRes){
const el=document.getElementById('view-ex-students');
const stuKeys=Object.keys(exRes);
if(!stuKeys.length){el.innerHTML='<p style="color:var(--text-muted);font-size:.82rem;text-align:center;padding:12px">Chưa có học sinh nào nộp.</p>';return}
let h='';
stuKeys.forEach(name=>{
const r=exRes[name];const score=r.score||0;
const cls=score>=100?'score-perfect':score>=50?'score-pass':'score-fail';
const sub=r.submittedAt?new Date(r.submittedAt).toLocaleString('vi',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
h+=`<div class="view-stu-row" id="view-stu-${this._esc(name).replace(/[^a-z0-9]/gi,'_')}">
<div class="view-stu-row-header">
<span style="font-weight:600;font-size:.83rem">${this._esc(name)}</span>
<div style="display:flex;align-items:center;gap:8px">
${sub?'<span style="font-size:.7rem;color:var(--text-muted)">'+sub+'</span>':''}
<span class="progress-score ${cls}">${score}</span>
<button class="btn btn-sm btn-ghost btn-view-stu-code" data-name="${this._esc(name)}" style="font-size:.72rem;padding:3px 8px">👁 Code</button>
</div></div>
<div class="view-stu-code-panel" id="view-code-${this._esc(name).replace(/[^a-z0-9]/gi,'_')}">
<div class="stu-code-toolbar"><span>📄 Code đã nộp</span><button class="btn btn-sm btn-ghost btn-copy-stu-code" data-name="${name}" style="font-size:.68rem">📋 Copy</button></div>
<pre>${this._esc(r.code||'(Chưa có code)')}</pre>
</div>
</div>`});
el.innerHTML=h;
// Bind toggle buttons
el.querySelectorAll('.btn-view-stu-code').forEach(btn=>{
const name=btn.dataset.name;
const panelId='view-code-'+name.replace(/[^a-z0-9]/gi,'_');
btn.onclick=()=>{const panel=document.getElementById(panelId);if(!panel)return;const isOpen=panel.classList.contains('open');panel.classList.toggle('open',!isOpen);btn.textContent=isOpen?'👁 Code':'🔼 Ẩn'}});
// Bind copy buttons
el.querySelectorAll('.btn-copy-stu-code').forEach(btn=>{
btn.onclick=()=>{const r=exRes[btn.dataset.name];if(r&&r.code)this._copyText(r.code)}})}

// F2+: Re-grade exercise for all students
async _reGradeExercise(exId){
const ok=await this._confirmDialog('🔄 Chấm lại bài tập','Hệ thống sẽ chấm lại tất cả học sinh đã nộp với subtasks mới. Kết quả cũ sẽ bị ghi đè.','Bắt đầu chấm','btn-accent');
if(!ok)return;
try{
// Load exercise data (has testCases + new subtasks)
const snap=await this.fb.db.ref(`exercises/${exId}`).once('value');
const ex=snap.val();if(!ex){this._toast('Không tìm thấy bài tập','error');return}
if(!ex.testCases||!ex.testCases.length){this._toast('Bài tập không có test cases','error');return}
// Load all student results for this exercise
const resSnap=await this.fb.db.ref(`exerciseResults/${exId}`).once('value');
const allRes=resSnap.val()||{};
const names=Object.keys(allRes).filter(n=>allRes[n]&&allRes[n].code);
if(!names.length){this._toast('Không có học sinh nào đã nộp code','error');return}
await this.pyEngine.init();
let done=0;
for(const name of names){
done++;
this._toast(`⚡ Chấm lại: ${name} (${done}/${names.length})`,'info');
const code=allRes[name].code;
try{
const result=await this.grader.grade(code,ex.testCases,ex.subtasks||[],ex.fileIO,ex.taskName||'BAITAP',ex.uppercase||false,ex.timePerTest||5);
const trimmed={score:result.score,details:result.details,code:code.substring(0,10000),submittedAt:allRes[name].submittedAt||Date.now(),regraded:true,regradedAt:Date.now()};
await this.fb.db.ref(`exerciseResults/${exId}/${name}`).set(trimmed);
}catch(e){console.error('Re-grade error for',name,e)}}
this._toast(`✅ Chấm lại xong ${names.length} học sinh!`,'success');
}catch(e){this._toast('Lỗi chấm lại: '+e.message,'error')}}

// === Difficulty helpers ===
_setDifficulty(val){
document.querySelectorAll('#ex-difficulty-group .diff-select-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===val));
const inp=document.getElementById('ex-difficulty');if(inp)inp.value=val}

_setViewDifficulty(val){
document.querySelectorAll('#view-ex-difficulty-group .diff-select-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===val));
const inp=document.getElementById('view-ex-difficulty');if(inp)inp.value=val}

// === File handling ===
_handleFileSelect(files){this._pendingFiles=[];for(const f of files){if(f.size>5*1024*1024){this._toast(`${f.name} quá 5MB`,'error');continue}if(this._pendingFiles.length>=3)break;this._pendingFiles.push(f)}this._renderPendingFiles()}
_renderPendingFiles(){const list=document.getElementById('ex-file-list');if(!list)return;list.innerHTML='';this._pendingFiles.forEach((f,i)=>{list.innerHTML+=`<div class="file-chip">📎 ${this._esc(f.name)} <span style="color:var(--text-muted);font-size:.68rem">(${(f.size/1024).toFixed(1)}KB)</span><button class="file-remove" onclick="window._uic._removePendingFile(${i})">✕</button></div>`})}
_removePendingFile(idx){this._pendingFiles.splice(idx,1);this._renderPendingFiles()}

// === Theory/Learning Materials CRUD ===
_theoryFileData=null;
_selectTheoryFile(file){if(!file)return;const allowed=['.pdf','.doc','.docx'];const ext='.'+file.name.split('.').pop().toLowerCase();if(!allowed.includes(ext)){this._toast('Chỉ hỗ trợ PDF, DOC, DOCX','error');return}
if(file.size>5*1024*1024){this._toast('File quá 5MB','error');return}
const reader=new FileReader();reader.onload=e=>{this._theoryFileData={name:file.name,size:file.size,type:file.type,data:e.target.result};
const preview=document.getElementById('theory-file-preview');preview.innerHTML=`<div class="file-chip">📎 ${this._esc(file.name)} <span style="color:var(--text-muted);font-size:.68rem">(${(file.size/1024).toFixed(1)}KB)</span><button class="file-remove" onclick="window._uic._removeTheoryFile()">✕</button></div>`};reader.readAsDataURL(file)}
_removeTheoryFile(){this._theoryFileData=null;const p=document.getElementById('theory-file-preview');if(p)p.innerHTML='';const f=document.getElementById('theory-file');if(f)f.value=''}

async _publishTheory(){const title=document.getElementById('theory-title').value.trim();const topic=document.getElementById('theory-topic').value.trim()||'Chung';const content=document.getElementById('theory-content').value.trim();if(!title||!content){this._toast('Nhập tiêu đề và nội dung','error');return}
const id=Date.now().toString(36);
const data={title,topic,content,createdAt:Date.now()};
// Upload file to Google Drive if present
if(this._theoryFileData){
this._toast('📤 Đang tải file lên Drive...','info');
try{
const base64Raw=this._theoryFileData.data.split(',')[1]; // strip data:xxx;base64,
const result=await this.drive.uploadFile(this._theoryFileData.name,this._theoryFileData.type,base64Raw,{source:'theory',sourceId:id});
data.file={name:this._theoryFileData.name,type:this._theoryFileData.type,size:this._theoryFileData.size,fileId:result.fileId,viewUrl:result.viewUrl,downloadUrl:result.downloadUrl};
// Log to Google Sheet
this.drive.logData('Theories',[id,title,topic,content.substring(0,200),result.fileId,this._theoryFileData.name,Math.round(this._theoryFileData.size/1024),new Date().toISOString()]).catch(()=>{});
}catch(e){this._toast('Lỗi upload: '+e.message,'error');return}}else{
this.drive.logData('Theories',[id,title,topic,content.substring(0,200),'','','',new Date().toISOString()]).catch(()=>{});
}
try{await this.fb.db.ref(`theories/${id}`).set(data);document.getElementById('theory-title').value='';document.getElementById('theory-topic').value='';document.getElementById('theory-content').value='';this._removeTheoryFile();this._toast('📖 Đã đăng bài lý thuyết!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _deleteTheory(id){const theories=this._cachedTheories||{};const t=theories[id];const name=t?t.title:'bài lý thuyết';const ok=await this._confirmDialog('🗑️ Xóa lý thuyết',`Bạn chắc chắn muốn xóa <strong>${this._esc(name)}</strong>? File đính kèm cũng sẽ bị xóa.`,'Xóa','btn-danger');if(!ok)return;
try{
// Delete file from Google Drive if exists
if(t&&t.file&&t.file.fileId){this.drive.deleteFile(t.file.fileId).catch(()=>{});this.drive.deleteRow('Theories',id).catch(()=>{});}
await this.fb.db.ref(`theories/${id}`).remove();this._toast('Đã xóa!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_renderTheoryList(theories,containerId,isTeacher){const c=document.getElementById(containerId);if(!c)return;const keys=Object.keys(theories||{});
if(!keys.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Chưa có bài lý thuyết nào.</p>';return}
const filter=(document.getElementById(isTeacher?'t-theory-search':'stu-theory-search')||{}).value||'';
const filtered=keys.filter(k=>{const t=theories[k];return(!filter||(t.title||'').toLowerCase().includes(filter.toLowerCase())||(t.topic||'').toLowerCase().includes(filter.toLowerCase()))});
if(!filtered.length){c.innerHTML=`<p style="color:var(--text-muted);text-align:center;padding:20px">Không tìm thấy "${this._esc(filter)}"</p>`;return}
let h='';filtered.forEach(k=>{const t=theories[k];const d=new Date(t.createdAt);
let fileHtml='';if(t.file){const icon=t.file.name.endsWith('.pdf')?'📕':'📘';const hasDrive=!!t.file.fileId;const isPdf=t.file.name.toLowerCase().endsWith('.pdf');
fileHtml=`<div class="theory-file-attach"><div class="theory-file-actions">`;
fileHtml+=`<button class="theory-download-btn" onclick="event.stopPropagation();window._uic._downloadTheoryFile('${k}')">${icon} ${this._esc(t.file.name)} <span style="font-size:.7rem;color:var(--text-muted)">(${(t.file.size/1024).toFixed(0)}KB)</span> ⬇️ Tải xuống</button>`;
if(hasDrive||isPdf){fileHtml+=`<button class="theory-view-btn" onclick="event.stopPropagation();window._uic._viewFile('${k}')">👁️ Xem trực tiếp</button>`}
if(hasDrive){fileHtml+=`<button class="theory-view-btn" style="background:rgba(66,133,244,.15);color:#4285f4" onclick="event.stopPropagation();window.open('https://drive.google.com/file/d/${t.file.fileId}/view','_blank')">🔗 Mở file</button>`}
fileHtml+=`</div></div>`}
h+=`<div class="theory-card"><div class="theory-card-header"><div><h3 class="theory-card-title">${this._esc(t.title)}</h3><span class="oj-ex-topic">${this._esc(t.topic)}</span> <span style="font-size:.72rem;color:var(--text-muted);margin-left:8px">${d.toLocaleDateString('vi')}</span></div>${isTeacher?`<button class="btn-danger-sm" onclick="event.stopPropagation();window._uic._deleteTheory('${k}')">✕</button>`:''}</div><div class="theory-card-body">${this._esc(t.content).replace(/\n/g,'<br>')}</div>${fileHtml}</div>`});
c.innerHTML=h}

// Download file — use Apps Script proxy for Drive files (correct filename), fallback to Base64
async _downloadTheoryFile(theoryId){const theories=this._cachedTheories||this._stuTheories||{};const t=theories[theoryId];if(!t||!t.file){this._toast('Không tìm thấy file','error');return}
// Google Drive file — fetch via Apps Script proxy
if(t.file.fileId){
this._toast('⬇️ Đang tải file từ Drive...','info');
try{
const res=await fetch(APPS_SCRIPT_URL+'?action=download&fileId='+t.file.fileId);
const data=await res.json();
if(!data.ok)throw new Error(data.error);
const decoded=atob(data.base64Data);const n=decoded.length;const u8=new Uint8Array(n);for(let i=0;i<n;i++)u8[i]=decoded.charCodeAt(i);
const blob=new Blob([u8],{type:data.mimeType||t.file.type});
const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=t.file.name;document.body.appendChild(a);a.click();document.body.removeChild(a);
setTimeout(()=>URL.revokeObjectURL(url),3000);
this._toast(`✅ Đã tải: ${t.file.name}`,'success');
}catch(e){
// Fallback: open Drive download page
window.open('https://drive.google.com/uc?export=download&id='+t.file.fileId,'_blank');
this._toast('⬇️ Mở trang tải file...','info');
}return}
// Legacy: Base64 data in Firebase
try{const dataUrl=t.file.data;const arr=dataUrl.split(',');const mime=arr[0].match(/:(.*?);/)[1];const bstr=atob(arr[1]);let n=bstr.length;const u8=new Uint8Array(n);while(n--)u8[n]=bstr.charCodeAt(n);
const blob=new Blob([u8],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=t.file.name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),1000);
this._toast(`⬇️ Đang tải: ${t.file.name}`,'success')}catch(e){this._toast('Lỗi tải file: '+e.message,'error')}}

// View file inline — supports PDF, DOCX via Google Drive viewer
_viewFile(theoryId){const theories=this._cachedTheories||this._stuTheories||{};const t=theories[theoryId];if(!t||!t.file){this._toast('Không tìm thấy file','error');return}
let modal=document.getElementById('modal-pdf-viewer');if(!modal){modal=document.createElement('div');modal.id='modal-pdf-viewer';modal.className='modal-overlay';modal.innerHTML=`<div class="pdf-viewer-modal"><div class="pdf-viewer-header"><h3 id="pdf-viewer-title">📄 Xem file</h3><div class="pdf-viewer-actions"><button class="btn btn-sm btn-ghost" id="btn-pdf-newtab">🔗 Mở tab mới</button><button class="btn btn-sm btn-ghost" id="btn-pdf-download">⬇️ Tải xuống</button><button class="btn btn-sm btn-ghost" id="btn-pdf-close">✕ Đóng</button></div></div><div class="pdf-viewer-body"><div id="pdf-loading" style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:1.1rem">⏳ Đang tải file...</div><iframe id="pdf-viewer-frame" style="width:100%;height:100%;border:none;display:none"></iframe></div></div>`;document.body.appendChild(modal)}
const frame=document.getElementById('pdf-viewer-frame');
const loading=document.getElementById('pdf-loading');
frame.style.display='none';loading.style.display='flex';
document.getElementById('pdf-viewer-title').textContent=`📄 ${t.file.name}`;
let frameUrl='';let driveViewUrl='';
if(t.file.fileId){
// Google Drive viewer — works for PDF, DOCX, XLSX, PPTX, etc.
frameUrl='https://drive.google.com/file/d/'+t.file.fileId+'/preview';
driveViewUrl='https://drive.google.com/file/d/'+t.file.fileId+'/view';
}else if(t.file.data){
// Legacy Base64
const arr=t.file.data.split(',');const mime=arr[0].match(/:(.*?);/)[1];const bstr=atob(arr[1]);let n=bstr.length;const u8=new Uint8Array(n);while(n--)u8[n]=bstr.charCodeAt(n);
frameUrl=URL.createObjectURL(new Blob([u8],{type:mime}));
}
frame.onload=()=>{loading.style.display='none';frame.style.display='block'};
frame.src=frameUrl||'';
// Timeout fallback if iframe takes too long
setTimeout(()=>{if(loading.style.display!=='none'){loading.style.display='none';frame.style.display='block'}},5000);
document.getElementById('btn-pdf-close').onclick=()=>{modal.classList.add('hidden');frame.src='';if(!t.file.fileId&&frameUrl)URL.revokeObjectURL(frameUrl)};
document.getElementById('btn-pdf-download').onclick=()=>this._downloadTheoryFile(theoryId);
document.getElementById('btn-pdf-newtab').onclick=()=>{if(driveViewUrl)window.open(driveViewUrl,'_blank');else if(frameUrl)window.open(frameUrl,'_blank')};
modal.classList.remove('hidden')}

// === Teacher exercise list with search (grouped by topic) ===
_tTopicOpen={};
_topicSlug(s){return s.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g,'_')}
_toggleTeacherTopic(topic){this._tTopicOpen[topic]=!this._tTopicOpen[topic];const el=document.getElementById('tg-t-'+this._topicSlug(topic));if(el)el.classList.toggle('open',!!this._tTopicOpen[topic])}
_renderTeacherExerciseList(exs){const c=document.getElementById('t-exercise-list');if(!exs||!Object.keys(exs).length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Chưa có bài tập nào. Chuyển sang tab "Soạn Đề" để tạo.</p>';return}
const res=this._teacherExResults||{};
const filter=(document.getElementById('t-exercise-search')||{}).value||'';
const keys=Object.keys(exs).filter(k=>{const ex=exs[k];return(!filter||(ex.title||'').toLowerCase().includes(filter.toLowerCase())||(ex.topic||'').toLowerCase().includes(filter.toLowerCase()))});
if(!keys.length){c.innerHTML=`<p style="color:var(--text-muted);text-align:center;padding:20px">Không tìm thấy bài tập "${this._esc(filter)}"</p>`;return}
// Group by topic
const groups={};keys.forEach(k=>{const topic=exs[k].topic||'Không phân loại';if(!groups[topic])groups[topic]=[];groups[topic].push(k)});
const sortedTopics=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'vi'));
const totalAccts=this._cachedAccounts?Object.keys(this._cachedAccounts).length:0;
let h='';
sortedTopics.forEach(topic=>{
const topicKeys=groups[topic];
// When searching, auto-open groups that have matches
const isOpen=filter?true:!!this._tTopicOpen[topic];
// Compute group-level stats
let groupDone=0;topicKeys.forEach(k=>{const er=res[k]||{};groupDone+=Object.keys(er).length});
const avgPct=totalAccts>0&&topicKeys.length>0?Math.round(groupDone/(topicKeys.length*totalAccts)*100):0;
const barColor=avgPct>=80?'var(--success)':avgPct>=40?'var(--warning,#f59e0b)':'var(--accent-light)';
h+=`<div class="topic-group ${isOpen?'open':''}" id="tg-t-${this._topicSlug(topic)}">`;
h+=`<div class="topic-group-header" onclick="window._uic._toggleTeacherTopic('${this._esc(topic).replace(/'/g,"\\'")}')">`;
h+=`<span class="topic-group-chevron">▶</span>`;
const isExamTopic=(topic.trim().toLowerCase()==='đề thi'||topic.trim().toLowerCase()==='de thi');
const examBadge=isExamTopic?' <span style="font-size:.65rem;padding:2px 6px;border-radius:4px;background:rgba(239,68,68,.12);color:#f87171;font-weight:700;vertical-align:middle">🔒 Ẩn HS</span>':'';
h+=`<span class="topic-group-name">${this._esc(topic)}${examBadge} <span class="topic-group-count">${topicKeys.length} bài</span></span>`;
h+=`<div class="topic-group-stats">`;
h+=`<div class="topic-group-progress"><div class="topic-group-progress-fill" style="width:${avgPct}%;background:${barColor}"></div></div>`;
h+=`<span>${groupDone}/${topicKeys.length*totalAccts} lượt</span>`;
h+=`</div></div>`;
h+=`<div class="topic-group-body">`;
h+=`<table class="ex-mgmt-table"><thead><tr><th>#</th><th>Tên bài</th><th style="width:96px">Độ khó</th><th>Tests</th><th>Ngày tạo</th><th>HS đã làm</th><th>Thao tác</th></tr></thead><tbody>`;
topicKeys.forEach((k,i)=>{const ex=exs[k];const d=new Date(ex.createdAt);const tc=ex.testCases?ex.testCases.length:0;
const exRes=res[k]||{};const doneCount=Object.keys(exRes).length;
const pct=totalAccts>0?Math.round(doneCount/totalAccts*100):0;
const bColor=pct>=80?'var(--success)':pct>=40?'var(--warning,#f59e0b)':'var(--error)';
const _diffHtml=(dv=>{if(!dv)return'<span class="diff-badge diff-none">—</span>';const _lbl={easy:'Dễ',medium:'Trung bình',hard:'Khó'}[dv]||dv;const _cls={easy:'diff-easy',medium:'diff-medium',hard:'diff-hard'}[dv]||'diff-none';return`<span class="diff-badge ${_cls}">${_lbl}</span>`})(ex.difficulty);
h+=`<tr onclick="window._uic._openViewExercise('${k}')">`;
h+=`<td>${i+1}</td><td style="font-weight:600">${this._esc(ex.title)}</td><td>${_diffHtml}</td><td>${tc}</td><td>${d.toLocaleDateString('vi')}</td>`;
h+=`<td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${bColor};border-radius:3px;transition:width .3s"></div></div><span style="font-size:.78rem;color:var(--text-muted);white-space:nowrap">${doneCount}/${totalAccts}</span></div></td>`;
h+=`<td><div class="ex-mgmt-actions"><button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();window._uic._openViewExercise('${k}')">✏️</button><button class="btn-danger-sm" onclick="event.stopPropagation();window._uic._deleteExercise('${k}')">✕</button></div></td></tr>`});
h+=`</tbody></table></div></div>`});
c.innerHTML=h}

// Student progress cross-table
_renderProgress(){const c=document.getElementById('t-progress-table');const exs=this._teacherExercises||{};const accts=this._cachedAccounts||{};const res=this._teacherExResults||{};const exKeys=Object.keys(exs);const stuNames=Object.keys(accts);if(!exKeys.length||!stuNames.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Cần có bài tập và tài khoản HS để hiển thị tiến độ.</p>';return}
let h='<div class="progress-table-wrap"><table class="progress-cross-table"><thead><tr><th class="sticky-col">Học sinh</th>';
exKeys.forEach(k=>h+=`<th title="${this._esc(exs[k].title)}">${this._esc(exs[k].title).substring(0,12)}</th>`);
h+='<th>Tổng</th></tr></thead><tbody>';
stuNames.sort().forEach(name=>{h+=`<tr><td class="sticky-col" style="font-weight:600">${this._esc(name)}</td>`;let totalScore=0;let doneCount=0;
exKeys.forEach(k=>{const r=res[k]&&res[k][name];if(r){const s=r.score||0;totalScore+=s;doneCount++;const cls=s>=100?'score-perfect':s>=50?'score-pass':'score-fail';h+=`<td><span class="progress-score ${cls}">${s}</span></td>`}else{h+=`<td><span class="progress-score score-none">—</span></td>`}});
const avg=exKeys.length>0?Math.round(totalScore/exKeys.length):0;
h+=`<td><strong style="color:${avg>=80?'var(--success)':avg>=50?'var(--warning,#f59e0b)':'var(--text-muted)'}">${avg}</strong> <span style="font-size:.7rem;color:var(--text-muted)">(${doneCount}/${exKeys.length})</span></td></tr>`});
h+='</tbody></table></div>';c.innerHTML=h}

// Topic-based stats for teacher
_renderTopicStats(){const c=document.getElementById('t-topic-stats');const exs=this._teacherExercises||{};const accts=this._cachedAccounts||{};const res=this._teacherExResults||{};const exKeys=Object.keys(exs);const stuNames=Object.keys(accts);
if(!exKeys.length||!stuNames.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:16px">Cần có bài tập và tài khoản HS để hiển thị.</p>';return}
// Group exercises by topic
const topicMap={};exKeys.forEach(k=>{const topic=exs[k].topic||'Không phân loại';if(!topicMap[topic])topicMap[topic]=[];topicMap[topic].push(k)});
const topics=Object.keys(topicMap).sort();
let h='<div class="topic-stats-grid">';
topics.forEach((topic,ti)=>{const topicExKeys=topicMap[topic];
// Calculate topic-level stats
let totalComplete=0;let totalPerfect=0;const totalSlots=stuNames.length*topicExKeys.length;
const stuData=stuNames.sort().map(name=>{let done=0;let perfect=0;let totalScore=0;
topicExKeys.forEach(k=>{const r=res[k]&&res[k][name];if(r){done++;totalScore+=r.score||0;if(r.score>=100)perfect++}});
totalComplete+=done;totalPerfect+=perfect;
const pct=topicExKeys.length>0?Math.round(done/topicExKeys.length*100):0;
return{name,done,perfect,totalScore,pct,notDone:topicExKeys.length-done}});
const completionPct=totalSlots>0?Math.round(totalComplete/totalSlots*100):0;
const needAlert=stuData.filter(s=>s.pct<50).length;
// Topic card
h+=`<div class="topic-card open" id="topic-card-${ti}">`;
h+=`<div class="topic-card-header" onclick="this.parentElement.classList.toggle('open')">`;
h+=`<div class="topic-card-title"><span>📂 ${this._esc(topic)}</span><span class="topic-card-badge">${topicExKeys.length} bài</span></div>`;
h+=`<div class="topic-card-stats">`;
h+=`<span>✅ ${completionPct}% hoàn thành</span>`;
if(needAlert>0)h+=`<span style="color:var(--error)">⚠️ ${needAlert} HS cần nhắc</span>`;
h+=`<span>▼</span></div></div>`;
h+=`<div class="topic-card-body">`;
// Table for this topic
h+=`<div class="progress-table-wrap"><table class="progress-cross-table"><thead><tr><th class="sticky-col">Học sinh</th>`;
topicExKeys.forEach(k=>h+=`<th title="${this._esc(exs[k].title)}">${this._esc(exs[k].title).substring(0,15)}</th>`);
h+=`<th>Hoàn thành</th><th>Trạng thái</th></tr></thead><tbody>`;
stuData.forEach(s=>{const alertCls=s.pct<50?'topic-alert-row':'';
h+=`<tr class="${alertCls}"><td class="sticky-col" style="font-weight:600">${this._esc(s.name)}</td>`;
topicExKeys.forEach(k=>{const r=res[k]&&res[k][s.name];if(r){const sc=r.score||0;const cls=sc>=100?'score-perfect':sc>=50?'score-pass':'score-fail';h+=`<td><span class="progress-score ${cls}">${sc}</span></td>`}else{h+=`<td><span class="progress-score score-none">—</span></td>`}});
// Completion column
const barColor=s.pct>=80?'var(--success)':s.pct>=50?'var(--warning,#f59e0b)':'var(--error)';
h+=`<td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:${s.pct}%;background:${barColor};border-radius:3px"></div></div><span style="font-size:.78rem;font-weight:600;color:var(--text-muted)">${s.done}/${topicExKeys.length}</span></div></td>`;
// Status column
if(s.pct>=100)h+=`<td><span style="color:var(--success);font-weight:700">🌟 Hoàn thành</span></td>`;
else if(s.pct>=50)h+=`<td><span style="color:var(--warning,#f59e0b);font-weight:600">📝 Đang làm</span></td>`;
else if(s.done>0)h+=`<td><span class="topic-alert-icon">⚠️ Cần nhắc nhở</span></td>`;
else h+=`<td><span class="topic-alert-icon">🚨 Chưa làm bài nào</span></td>`;
h+=`</tr>`});
h+=`</tbody></table></div></div></div>`});
h+='</div>';c.innerHTML=h}


_setRoomStatus(s){const el=document.getElementById('t-room-status');if(el){el.textContent=s==='waiting'?'Chờ':s==='active'?'Đang thi':'Kết thúc';el.className='room-status-badge '+s}
const el2=document.getElementById('t-room-status-display');if(el2){el2.textContent=s==='waiting'?'Chờ':s==='active'?'Đang thi':'Kết thúc';el2.className='room-status-badge '+s}}

async _startContest(){if(!this.roomCode)return;
const ok=await this._confirmDialog('▶️ Bắt đầu cuộc thi','Học sinh sẽ bắt đầu làm bài ngay khi bạn xác nhận. Bạn chắc chắn?','Bắt đầu','btn-accent');
if(!ok)return;
this._contestEnded=false;
await this.fb.startContest(this.roomCode);this._setRoomStatus('active');this._toast('Cuộc thi bắt đầu!','success');
// Update dashboard step and buttons
this._setContestStep(3);
const startBtn=document.getElementById('cc-btn-start');if(startBtn)startBtn.style.display='none';
const endBtn=document.getElementById('cc-btn-end');if(endBtn)endBtn.style.display='';
// Update Google Sheet with start time (BUG-D fix)
this.drive.logData('Rooms',[this.roomCode+'_START','','','active','',new Date().toISOString(),'','','']).catch(()=>{});
this.fb.listenRoomInfo(this.roomCode,info=>{if(this._contestEnded)return;if(info&&info.startTime&&info.timeLimit){const end=info.startTime+info.timeLimit*60000;if(this.timerInterval)clearInterval(this.timerInterval);const upd=()=>{if(this._contestEnded)return;const rem=Math.max(0,end-Date.now());const m=Math.floor(rem/60000),s=Math.floor(rem%60000/1000);const txt=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;document.getElementById('t-room-timer').textContent=txt;const td=document.getElementById('t-room-timer-display');if(td)td.textContent=txt;const ccT=document.getElementById('cc-timer');if(ccT)ccT.textContent=txt;if(rem<=0){clearInterval(this.timerInterval);this._setRoomStatus('ended')}};this.timerInterval=setInterval(upd,1000);upd()}})}

async _endContest(){if(!this.roomCode)return;
const ok=await this._confirmDialog('⏹ Kết thúc cuộc thi','Tất cả học sinh sẽ bị dừng làm bài. Hành động này không thể hoàn tác!','Kết thúc','btn-danger');
if(!ok)return;
this._contestEnded=true;
await this.fb.endContest(this.roomCode);this._setRoomStatus('ended');
if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}
document.getElementById('t-room-timer').textContent='00:00';
// Log final leaderboard to Google Sheet (BUG-C fix)
try{const lb=this._activeRoomLeaderboard||{};
const studentCount=this._activeRoomStudentCount||0;
// Update Rooms sheet with final status
this.drive.logData('Rooms',[this.roomCode+'_END','','','ended','','',this.publishedCount,studentCount,'']).catch(()=>{});
// Log each student's result to ContestResults
const sorted=Object.values(lb).sort((a,b)=>b.totalScore-a.totalScore||(a.lastSubmit-b.lastSubmit));
for(const s of sorted){
for(let j=0;j<(this.publishedCount||1);j++){
const ps=s.problems&&s.problems[j]||0;
this.drive.logData('ContestResults',[this.roomCode,s.name,`Bài ${j+1}`,ps,new Date().toISOString()]).catch(()=>{})}}
}catch(e){console.error('Log contest results failed:',e)}
localStorage.removeItem('themis_activeRoom');
this._toast('Đã kết thúc cuộc thi!','info');
// Auto-transition to detail view for grading
const endedCode=this.roomCode;
this.roomCode=null;
document.getElementById('teacher-room-bar').classList.add('hidden');
this._hideActiveRoomDashboard();
// BUG-C06 FIX: Only cleanup room-specific listeners, re-register teacher core listeners
this.fb.cleanup();
// Re-register core listeners that cleanup() destroyed (mirrors _initTeacher)
this.fb.listenAccounts(accts=>{this._cachedAccounts=accts;this._renderAccountList(accts);this._renderProgress();this._renderTopicStats()});
this.fb.listenExercises(exs=>{this._teacherExercises=exs;this._renderTeacherExerciseList(exs);this._renderProgress();this._renderTopicStats()});
this.fb.listenAllExerciseResults(res=>{this._teacherExResults=res;this._renderTeacherExerciseList(this._teacherExercises||{});this._renderProgress();this._renderTopicStats()});
const _thRef2=this.fb.db.ref('theories');const _thCb2=s=>{this._cachedTheories=s.val()||{};this._renderTheoryList(this._cachedTheories,'t-theory-list',true)};_thRef2.on('value',_thCb2);this.fb._listeners.push(()=>_thRef2.off('value',_thCb2));
const _roomRef2=this.fb.db.ref('rooms');const _rmCb2=s=>{this._allRooms=s.val()||{};this._renderRoomHistory()};_roomRef2.on('value',_rmCb2);this.fb._listeners.push(()=>_roomRef2.off('value',_rmCb2));
this._initTeacherNotifListener();
// Reload all rooms data then open the ended room's detail view
try{const roomsSnap=await this.fb.db.ref('rooms').once('value');this._allRooms=roomsSnap.val()||{};
this._viewRoomHistory(endedCode)}catch(e){console.error('Auto-open history:',e);this._renderRoomHistory()}}

// Restore active room from localStorage after F5 (BUG-E fix)
async _restoreActiveRoom(){const saved=localStorage.getItem('themis_activeRoom');if(!saved)return;
try{const snap=await this.fb.db.ref(`rooms/${saved}/info`).once('value');const info=snap.val();if(!info){localStorage.removeItem('themis_activeRoom');return}
this.roomCode=saved;this.publishedCount=info.problemCount||0;
document.getElementById('teacher-room-bar').classList.remove('hidden');document.getElementById('t-room-code').textContent=saved;this._setRoomStatus(info.status||'waiting');
// Show active room dashboard
this._showActiveRoomDashboard(saved,info.title||'Phòng thi',info.timeLimit||0,info.problemCount||0);
// Set correct step based on status
if(info.status==='active')this._setContestStep(3);
// Re-listen students & leaderboard
this.fb.listenStudents(saved,s=>{this._activeRoomStudents=s||{};const count=Object.keys(s||{}).length;this._activeRoomStudentCount=count;document.getElementById('t-student-count').textContent=count;this._renderStudentLobby(s||{})});
this.fb.listenLeaderboard(saved,lb=>{this._activeRoomLeaderboard=lb;this._renderLeaderboard(lb,'t-leaderboard-body')});
// Render problem list with full actions
this._viewingRoomCode=saved;
await this._viewRoomHistory(saved);
// Resume timer if active
if(info.status==='active'&&info.startTime&&info.timeLimit){this._contestEnded=false;
const startBtn=document.getElementById('cc-btn-start');if(startBtn)startBtn.style.display='none';
const endBtn=document.getElementById('cc-btn-end');if(endBtn)endBtn.style.display='';
const end=info.startTime+info.timeLimit*60000;
if(end>Date.now()){if(this.timerInterval)clearInterval(this.timerInterval);
const upd=()=>{if(this._contestEnded)return;const rem=Math.max(0,end-Date.now());const m=Math.floor(rem/60000),s=Math.floor(rem%60000/1000);const txt=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;document.getElementById('t-room-timer').textContent=txt;const td=document.getElementById('t-room-timer-display');if(td)td.textContent=txt;const ccT=document.getElementById('cc-timer');if(ccT)ccT.textContent=txt;if(rem<=0){clearInterval(this.timerInterval);this._setRoomStatus('ended')}};
this.timerInterval=setInterval(upd,1000);upd()}}
this._toast(`🔄 Đã khôi phục phòng thi ${saved}`,'info');
}catch(e){localStorage.removeItem('themis_activeRoom');console.error('Restore room failed:',e)}}

// Render contest list grid (replaces old _renderRoomHistory)
_renderContestList(filter){
const container=document.getElementById('cc-contest-grid');if(!container)return;
if(this.roomCode){/* Active room — don't overwrite, CC is open */return}
const rooms=this._allRooms||{};const keys=Object.keys(rooms);
if(!keys.length){container.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Tạo phòng thi và thêm đề bài để bắt đầu.</p>';return}
const sorted=keys.map(k=>({code:k,...(rooms[k].info||{})})).filter(r=>r.createdAt).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
if(!sorted.length){container.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Tạo phòng thi và thêm đề bài để bắt đầu.</p>';return}
// Compute effective status (merged gradeStatus)
const getEffective=r=>{
const gs=r.gradeStatus||'pending';
if(gs==='published')return 'published';
if(gs==='graded')return 'graded';
return r.status||'waiting';
};
const filtered=filter&&filter!=='all'?sorted.filter(r=>getEffective(r)===filter):sorted;
if(!filtered.length){container.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Không có kỳ thi nào phù hợp bộ lọc.</p>';return}
let h='';
filtered.forEach(r=>{const d=new Date(r.createdAt);
const eStatus=getEffective(r);
const studentCount=rooms[r.code]&&rooms[r.code].students?Object.keys(rooms[r.code].students).length:0;
const statusLabels={active:'ĐANG THI',waiting:'CHỜ',ended:'KẾT THÚC',graded:'ĐÃ CHẤM',published:'ĐÃ CÔNG BỐ'};
h+=`<div class="cc-contest-card status-${eStatus}" onclick="window._uic._viewRoomHistory('${r.code}')">
<div class="cc-card-header">
<span class="cc-card-title" title="${this._esc(r.title||'')}">${this._esc(r.title||'Không tên')}</span>
<span class="cc-card-code">#${r.code}</span>
</div>
<div class="cc-card-meta">
<span>⏱ ${r.timeLimit||0} phút</span>
<span>📝 ${r.problemCount||0} bài</span>
<span>👥 ${studentCount} HS</span>
<span>📅 ${d.toLocaleDateString('vi')}</span>
</div>
<div class="cc-card-footer">
<span class="room-status-badge ${eStatus}">${statusLabels[eStatus]||eStatus}</span>
<button class="cc-card-delete" onclick="event.stopPropagation();window._uic._deleteRoom('${r.code}')" title="Xóa kỳ thi">🗑️ Xóa</button>
</div>
</div>`});
container.innerHTML=h;
document.querySelectorAll('.cc-filter').forEach(btn=>{
const f=btn.dataset.filter;
if(f==='all')btn.textContent=`Tất cả (${sorted.length})`;
else{const count=sorted.filter(r=>getEffective(r)===f).length;
const labels={active:'🟢 Đang thi',waiting:'⏳ Chờ',ended:'⏹ Kết thúc',graded:'✅ Đã chấm',published:'📢 Đã công bố'};
btn.textContent=`${labels[f]||f} (${count})`}
});
}
_renderRoomHistory(){this._renderContestList()}

// View past room leaderboard → opens Command Center
async _viewRoomHistory(code){try{
this._viewingRoomCode=code;
const infoSnap=await this.fb.db.ref(`rooms/${code}/info`).once('value');const info=infoSnap.val();if(!info)return;
const lbSnap=await this.fb.db.ref(`rooms/${code}/leaderboard`).once('value');const lb=lbSnap.val();
const probSnap=await this.fb.db.ref(`rooms/${code}/problems`).once('value');const probs=probSnap.val()||[];
const probArr=Array.isArray(probs)?probs:Object.values(probs);
const pCount=info.problemCount||probArr.length||1;this.publishedCount=pCount;

// Determine effective status
const gs=info.gradeStatus||'pending';
const eStatus=gs==='published'?'published':gs==='graded'?'graded':info.status||'waiting';

// Open Command Center
this._openCommandCenter(code,info.title||'Kỳ thi',info.timeLimit||0,pCount,eStatus);

// Count students
const stuSnap=await this.fb.db.ref(`rooms/${code}/students`).once('value');
const students=stuSnap.val()||{};const stuCount=Object.keys(students).length;
const submittedCount=Object.keys(students).filter(n=>students[n].finalCode).length;
const ccStuCount=document.getElementById('cc-student-count');if(ccStuCount)ccStuCount.textContent=stuCount;

// Render problem list in Problems sub-tab
const listEl=document.getElementById('t-contest-problem-list');
let ph='';probArr.forEach((p,i)=>{const ms=p?.maxScore||Math.floor(100/probArr.length);
ph+=`<div class="room-prob-card" id="room-prob-card-${i}" style="padding:0;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;font-size:.85rem;overflow:hidden;transition:all .2s">
<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;cursor:pointer" onclick="window._uic._toggleProbDetail(${i})">
<span><strong>Bài ${i+1}:</strong> <span id="prob-title-display-${i}">${this._esc(p?.title||'?')}</span></span>
<span style="display:flex;align-items:center;gap:8px">
<span style="color:var(--accent-light);font-weight:700">${ms}đ</span>
<span style="color:var(--text-muted);font-size:.78rem">• ${(p?.testCases||[]).length} test</span>
</span></div>
<div style="display:flex;gap:4px;padding:0 14px 8px;flex-wrap:wrap">
<button class="btn btn-ghost btn-sm" style="font-size:.72rem" onclick="event.stopPropagation();window._uic._toggleProbDetail(${i})">👁 Xem</button>
<button class="btn btn-ghost btn-sm" style="font-size:.72rem" onclick="event.stopPropagation();window._uic._editContestProblem(${i},'${code}')">✏️ Sửa</button>
<button class="btn btn-ghost btn-sm" style="font-size:.72rem" onclick="event.stopPropagation();window._uic._saveContestProblem(${i},'${code}')">💾 Lưu</button>
<button class="btn-danger-sm" style="font-size:.72rem;padding:3px 8px" onclick="event.stopPropagation();window._uic._deleteContestProblem(${i},'${code}')">🗑 Xóa</button>
</div>
<div id="room-prob-detail-${i}" class="hidden" style="padding:12px 14px;background:rgba(0,0,0,.15);border-top:1px solid var(--border);cursor:text" onclick="event.stopPropagation()">
<div id="prob-view-${i}">
<div style="font-weight:600;margin-bottom:6px;color:var(--text-primary)">${this._esc(p?.title||'Bài '+(i+1))}</div>
<div style="white-space:pre-wrap;line-height:1.6;color:var(--text-secondary);font-size:.82rem">${this._esc(p?.description||'Không có mô tả')}</div>
${p?.sampleIO&&p.sampleIO.length?p.sampleIO.map((s,si)=>`<div class="sample-io-display" style="margin-top:8px"><div class="sample-io-display-header">Ví dụ ${si+1}</div><div class="sample-io-display-grid"><div class="sample-box"><div class="sample-box-title">INPUT</div><pre>${this._esc(s.input||'')}</pre></div><div class="sample-box"><div class="sample-box-title">OUTPUT</div><pre>${this._esc(s.output||'')}</pre></div></div></div>`).join(''):''}
${(p?.testCases&&p.testCases.length)?`<details style="margin-top:10px"><summary style="cursor:pointer;font-weight:600;color:var(--accent-light);font-size:.8rem">📋 Test Cases (${p.testCases.length} test)</summary><div style="max-height:300px;overflow-y:auto;margin-top:6px"><table style="width:100%;font-size:.75rem;border-collapse:collapse"><thead><tr><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">#</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Input</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Output</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Subtask</th></tr></thead><tbody>${p.testCases.map((tc,ti)=>`<tr style="border-bottom:1px solid rgba(255,255,255,.03)"><td style="padding:4px 8px;color:var(--text-muted)">${ti+1}</td><td style="padding:4px 8px"><pre style="margin:0;max-width:250px;overflow:auto;white-space:pre-wrap;font-size:.72rem">${this._esc((tc.input||'').substring(0,200))}</pre></td><td style="padding:4px 8px"><pre style="margin:0;max-width:250px;overflow:auto;white-space:pre-wrap;font-size:.72rem">${this._esc((tc.output||'').substring(0,200))}</pre></td><td style="padding:4px 8px;color:var(--text-muted)">ST${tc.subtaskId||1}</td></tr>`).join('')}</tbody></table></div></details>`:''}
</div>
<div id="prob-edit-${i}" class="hidden" style="margin-top:8px">
<label style="font-size:.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:2px;display:block">Tên đề</label>
<input id="prob-edit-title-${i}" class="form-input" value="${this._esc(p?.title||'')}" style="margin-bottom:8px;font-size:.84rem">
<label style="font-size:.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:2px;display:block">Mô tả</label>
<textarea id="prob-edit-desc-${i}" class="form-input" rows="6" style="margin-bottom:8px;font-size:.82rem;resize:vertical">${this._esc(p?.description||'')}</textarea>
<label style="font-size:.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:2px;display:block">Điểm tối đa</label>
<input id="prob-edit-score-${i}" class="form-input" type="number" value="${ms}" min="1" max="100" style="width:80px;margin-bottom:8px;font-size:.84rem">
<div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px">
<button class="btn btn-ghost btn-sm" style="font-size:.72rem" onclick="window._uic._cancelEditProblem(${i})">✕ Hủy</button>
<button class="btn btn-accent btn-sm" style="font-size:.72rem" onclick="window._uic._saveContestProblem(${i},'${code}')">💾 Lưu thay đổi</button>
</div>
</div>
<div style="margin-top:8px;display:flex;justify-content:flex-end">
<button class="btn btn-ghost btn-sm" style="font-size:.72rem" onclick="event.stopPropagation();window._uic._toggleContestStEditor(${i},${JSON.stringify(p?.subtasks||[]).replace(/"/g,'&quot;')},''+code)">⚙️ Sửa Subtask</button>
</div>
<div class="contest-prob-st-editor" id="contest-st-editor-${i}" style="display:none">
<label>⚙️ Subtasks (Tổng phải = 100%)</label>
<div id="contest-st-list-${i}"></div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
<span id="contest-st-total-${i}" style="font-size:.75rem;font-weight:700;color:#f87171">Tổng: 0%</span>
<div style="display:flex;gap:6px">
<button class="btn btn-ghost btn-sm" onclick="window._uic._addContestSubtask(${i})" style="font-size:.72rem">＋ Subtask</button>
<button class="btn btn-accent btn-sm" onclick="window._uic._saveContestSubtasks('${code}',${i})" style="font-size:.72rem">💾 Lưu & Chấm lại</button>
</div></div></div>
</div></div>`});
listEl.innerHTML=ph;
probArr.forEach((p,i)=>this._initContestStEditor(i,p?.subtasks||[],(p?.testCases||[]).length));

// Render anti-cheat in Students sub-tab
try{const stuData=students;
const cheaters=Object.entries(stuData).filter(([,d])=>d.antiCheat&&d.antiCheat.tabSwitches>0).sort((a,b)=>(b[1].antiCheat.tabSwitches||0)-(a[1].antiCheat.tabSwitches||0));
const acEl=document.getElementById('cc-anticheat-list');
const acCountEl=document.getElementById('cc-anticheat-count');
if(acCountEl)acCountEl.textContent=cheaters.length+' cảnh báo';
if(cheaters.length>0&&acEl){
let acH='';
cheaters.forEach(([name,d])=>{const c=d.antiCheat;const severity=c.tabSwitches>=5?'#f87171':c.tabSwitches>=3?'#f59e0b':'var(--text-muted)';
acH+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.04)">
<span style="font-weight:600;font-size:.85rem">${this._esc(name)}</span>
<span style="font-weight:700;color:${severity};font-size:.82rem">⚠️ ${c.tabSwitches} lần chuyển tab</span></div>`});
acEl.innerHTML=acH}
else if(acEl){acEl.innerHTML='<p class="lobby-empty">✅ Không có vi phạm</p>'}
}catch(e){console.warn('Anti-cheat report:',e)}

// Update grading sub-tab status
const gradeBadge=document.getElementById('cc-grade-status-badge');
if(gradeBadge){
const statusLabel=gs==='published'?'📢 Đã công bố':gs==='graded'?'✅ Đã chấm':'⏳ Chưa chấm';
gradeBadge.textContent=statusLabel;
}

// Load gradeResults for grading and leaderboard tabs
const gradeResultsEl=document.getElementById('grade-results');
const lbContainer=document.getElementById('t-leaderboard-body');
if(gs==='graded'||gs==='published'){
const gradeSnap=await this.fb.db.ref(`rooms/${code}/gradeResults`).once('value');
const grades=gradeSnap.val()||{};const stuNames=Object.keys(grades);
if(stuNames.length>0){
this._gradeResults={};this._gradeProblems=probArr;
stuNames.forEach(name=>{this._gradeResults[name]={};
Object.keys(grades[name]).forEach(pi=>{this._gradeResults[name][pi]=grades[name][pi]})});
this._renderGradeResults(this._gradeResults,probArr,stuNames,'grade-results');
if(gradeResultsEl)gradeResultsEl.classList.remove('hidden');
this._renderGradeResults(this._gradeResults,probArr,stuNames,'t-leaderboard-body');
}else if(lb){this._renderLeaderboard(lb,'t-leaderboard-body')}
}else if(lb){this._renderLeaderboard(lb,'t-leaderboard-body')}
else if(lbContainer){lbContainer.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có kết quả. Nhấn "Chấm Bài" để bắt đầu chấm.</p>'}
}catch(e){this._toast('Lỗi đọc dữ liệu: '+e.message,'error')}}

_closeRoomHistory(){this._closeCommandCenter()}
_showExerciseModal(){if(!this.themis.testCases.length){this._toast('Sinh test trước','error');return}const cfg=this.collectFormData();const desc=document.getElementById('problem-description').value||document.getElementById('ai-prompt').value||'Không có mô tả';const displayTitle=document.getElementById('problem-title').value.trim()||cfg.taskName;const topic=document.getElementById('problem-topic').value.trim()||'Không phân loại';document.getElementById('ex-title-input').value=displayTitle;document.getElementById('ex-desc-input').value=desc;document.getElementById('ex-test-count').textContent=this.themis.testCases.length;document.getElementById('ex-subtask-count').textContent=cfg.subtasks?cfg.subtasks.length:1;document.getElementById('ex-topic').value=topic;document.getElementById('modal-publish-exercise').classList.remove('hidden')}

async _confirmPublishExercise(){const topic=document.getElementById('ex-topic').value.trim()||document.getElementById('problem-topic').value.trim()||'Không phân loại';const cfg=this.collectFormData();const desc=document.getElementById('ex-desc-input').value;const displayTitle=document.getElementById('ex-title-input').value.trim()||cfg.taskName;const sampleIO=this._getSampleIOs();const difficulty=document.getElementById('ex-difficulty')?.value||'medium';
const data={title:displayTitle,description:desc,topic,difficulty,fileIO:cfg.fileIO,uppercase:cfg.uppercase,taskName:cfg.taskName,timePerTest:5,subtasks:cfg.subtasks,sampleIO:sampleIO.length?sampleIO:null,testCases:this.themis.testCases.map(tc=>({input:tc.input,output:tc.output,subtaskId:tc.subtaskId}))};document.getElementById('modal-publish-exercise').classList.add('hidden');try{const exId=await this.fb.publishExercise(data);this._clearDraft();this.drive.logData('Exercises',[exId,displayTitle,topic,desc.substring(0,200),this.themis.testCases.length,cfg.subtasks?.length||1,new Date().toISOString(),cfg.fileIO?'Yes':'No',cfg.taskName]).catch(()=>{});this._toast(`📚 Đã đăng bài tập: ${displayTitle} (${topic})`,'success');
// Auto-switch to exercise management tab so teacher sees the new exercise immediately
const exTab=document.querySelector('.t-tab[data-ttab="exercises"]');if(exTab){exTab.click()}}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _exportCSV(){const rc=this.roomCode||this._viewingRoomCode;if(!rc){this._toast('Không có phòng thi để export','error');return}const csv=await this.fb.exportCSV(rc);if(!csv){this._toast('Chưa có dữ liệu','error');return}const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`BangDiem_${rc}.csv`;document.body.appendChild(a);a.click();document.body.removeChild(a);this._toast('Đã xuất CSV!','success')}

// ===== STUDENT =====
_initStudent(){if(this._studentInited){document.getElementById('view-student').classList.remove('hidden');return}this._studentInited=true;document.getElementById('view-student').classList.remove('hidden');
const $=id=>document.getElementById(id);
$('btn-stu-login').onclick=()=>this._stuLogin();
$('btn-stu-logout').onclick=async()=>{const ok=await this._confirmDialog('🚪 Đăng xuất','Bạn chắc chắn muốn đăng xuất?','Đăng xuất','btn-accent');if(ok)this._stuLogout()};
$('btn-join-room').onclick=()=>this._joinRoom();
$('btn-stu-submit').onclick=()=>this._stuSubmit();
$('btn-stu-run').onclick=()=>this._stuRun();
// Sample input button
$('btn-use-sample-input').onclick=()=>this._fillSampleInput();
$('btn-stu-back-join').onclick=()=>{$('stu-ended').classList.add('hidden');$('stu-dashboard').classList.remove('hidden');this.fb.cleanupExercise();this._renderExerciseList(this._cachedExercises||{});this._renderStudentRanking();this._renderStudentStats()};
$('stu-password').onkeydown=e=>{if(e.key==='Enter')this._stuLogin()};
// Notification bell
const bellBtn=$('btn-stu-notif-bell');if(bellBtn)bellBtn.onclick=e=>{e.stopPropagation();const dd=$('stu-notif-dropdown');dd.classList.toggle('hidden')};
document.addEventListener('click',e=>{const dd=document.getElementById('stu-notif-dropdown');const wrap=e.target.closest('.notif-bell-wrap');if(!wrap&&dd&&!dd.classList.contains('hidden'))dd.classList.add('hidden')});
const markAllBtn=$('btn-mark-all-read');if(markAllBtn)markAllBtn.onclick=()=>this._markAllNotifsRead();
// Toggle password visibility
const toggleBtn=$('btn-toggle-pass');if(toggleBtn)toggleBtn.onclick=()=>{const inp=$('stu-password');const isHidden=inp.type==='password';inp.type=isHidden?'text':'password';toggleBtn.textContent=isHidden?'🙈':'👁';toggleBtn.title=isHidden?'Ẩn mật khẩu':'Hiện mật khẩu'};
// Change password button
const chgPassBtn=$('btn-change-pass');if(chgPassBtn)chgPassBtn.onclick=()=>this._showChangePasswordModal();
// Dashboard nav tabs
document.querySelectorAll('.oj-nav-tab[data-tab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.oj-nav-tab[data-tab]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.oj-tab-panel').forEach(p=>p.classList.add('hidden'));$('tab-panel-'+btn.dataset.tab).classList.remove('hidden')}});
// Back from contest to dashboard
const backBtn=$('btn-stu-back-dash');if(backBtn)backBtn.onclick=()=>{$('stu-contest').classList.add('hidden');$('stu-dashboard').classList.remove('hidden');this._currentExercise=null;if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}if(this._contestAutoSave){clearInterval(this._contestAutoSave);this._contestAutoSave=null}this._stopAntiCheat();this.fb.cleanupExercise();this._renderExerciseList(this._cachedExercises||{});this._renderStudentRanking();this._renderStudentStats()};
// Pane tabs (Desc/Leaderboard — left pane)
document.querySelectorAll('.oj-ptab[data-ptab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));$('ptab-'+btn.dataset.ptab).classList.add('active')}});
// Console sub-tabs (Results/Input/Console — right pane bottom)
document.querySelectorAll('.oj-ctab[data-ctab]').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.oj-ctab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.oj-ctab-content').forEach(p=>p.classList.remove('active'));$('ctab-'+btn.dataset.ctab).classList.add('active')}});
// Draggable dividers (vertical + horizontal)
this._initDivider();
this._initHDivider();
// NOTE: Do NOT call _registerStudentListeners() here — it registers before login (studentName=null)
// Listeners will be registered in _stuLogin() after successful authentication
// Search bindings
const stuExSearch=$('stu-exercise-search');if(stuExSearch)stuExSearch.oninput=()=>{this._exPage=1;this._renderExerciseList(this._cachedExercises||{})};
const stuStatusFilter=$('stu-status-filter');if(stuStatusFilter)stuStatusFilter.onchange=()=>{this._exPage=1;this._renderExerciseList(this._cachedExercises||{})};
const stuThSearch=$('stu-theory-search');if(stuThSearch)stuThSearch.oninput=()=>this._renderTheoryList(this._stuTheories||{},'stu-theory-list',false);
// Quiz search/filter
const stuQSearch=$('stu-quiz-search');if(stuQSearch)stuQSearch.oninput=()=>this._renderStudentQuizList();
const stuQFilter=$('stu-quiz-filter');if(stuQFilter)stuQFilter.onchange=()=>this._renderStudentQuizList();
// Quiz taking back button
const quizBackBtn=$('btn-quiz-back-dash');if(quizBackBtn)quizBackBtn.onclick=()=>this._exitQuizTaking()}

// Register Firebase listeners for exercises, results, theories
// Called ONLY after successful login when studentName is set
_registerStudentListeners(){
// Cleanup any existing student dashboard listeners first to prevent duplicates
this.fb.cleanupStudentDash();
this._exerciseResults={};this._prevExCount=0;
this.fb.listenExercises(exs=>{// Filter out exam-only exercises (topic='Đề Thi') from student view
const filtered={};Object.keys(exs).forEach(k=>{const t=(exs[k].topic||'').trim().toLowerCase();if(t!=='đề thi'&&t!=='de thi')filtered[k]=exs[k]});this._cachedExercises=filtered;this._loadExerciseStatuses(filtered);this._checkNewExerciseNotification(filtered)},'student');
this.fb.listenAllExerciseResults(res=>{this._exerciseResults=res;if(this._cachedExercises){this._renderExerciseList(this._cachedExercises);this._renderStudentRanking();this._renderStudentStats()}},'student');
const thRef2=this.fb.db.ref('theories');const _sthCb=s=>{this._stuTheories=s.val()||{};this._renderTheoryList(this._stuTheories,'stu-theory-list',false)};thRef2.on('value',_sthCb);this.fb._studentDashListeners.push(()=>thRef2.off('value',_sthCb));
// Listen for notifications
this._listenStudentNotifications();
// Load contest history for student
this._loadStudentContestHistory();
// Quiz listeners
this.fb.listenQuizBanks(quizzes=>{this._stuQuizzes=quizzes;this._renderStudentQuizList()},'student');
this.fb.listenAllQuizResults(res=>{this._stuQuizResults=res;this._renderStudentQuizList()},'student')}

async _loadStudentContestHistory(){
const el=document.getElementById('stu-contest-history');if(!el||!this.studentName)return;
try{
const snap=await this.fb.db.ref('rooms').once('value');
const allRooms=snap.val()||{};
this._processStudentContests(allRooms);
// Real-time listener
const roomRef=this.fb.db.ref('rooms');
const _srmCb=s=>{const rooms=s.val()||{};this._processStudentContests(rooms)};
roomRef.on('value',_srmCb);
this.fb._studentDashListeners.push(()=>roomRef.off('value',_srmCb));
}catch(e){console.error('Load contest history:',e);el.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Lỗi tải lịch sử</p>'}}

_processStudentContests(allRooms){
const myContests=[];const upcomingContests=[];
for(const code of Object.keys(allRooms)){
const room=allRooms[code];const info=room.info;if(!info)continue;
const hasRecord=room.students&&room.students[this.studentName];
const isActive=info.status==='active';
const isWaiting=info.status==='waiting';

// Upcoming: active or waiting rooms (any student can see)
if(isActive||isWaiting){
upcomingContests.push({code,title:info.title||'Không tên',status:info.status,
timeLimit:info.timeLimit||0,problemCount:info.problemCount||0,
createdAt:info.createdAt||0,joined:!!hasRecord,
studentCount:room.students?Object.keys(room.students).length:0})}
// History: rooms student has joined
if(hasRecord){
myContests.push({code,title:info.title||'Không tên',status:info.status||'waiting',
gradeStatus:info.gradeStatus||'pending',published:!!info.published,
timeLimit:info.timeLimit||0,problemCount:info.problemCount||0,
createdAt:info.createdAt||0,publishedAt:info.publishedAt||0})}}
upcomingContests.sort((a,b)=>{if(a.status==='active'&&b.status!=='active')return -1;if(b.status==='active'&&a.status!=='active')return 1;return(b.createdAt||0)-(a.createdAt||0)});
myContests.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
this._renderUpcomingContests(upcomingContests);
this._renderStudentContestHistory(myContests);
this._updateContestBadge(upcomingContests)}

_renderUpcomingContests(contests){
const el=document.getElementById('stu-upcoming-contests');if(!el)return;
if(!contests.length){el.innerHTML='';return}
const activeCount=contests.filter(c=>c.status==='active').length;
let h='<div class="upcoming-contests-section">';
h+='<div class="upcoming-contests-header"><h3>📡 Kỳ Thi Hiện Tại</h3>';
if(activeCount>0)h+=`<span class="upcoming-live-badge">● ${activeCount} đang diễn ra</span>`;
h+='</div><div class="upcoming-grid">';
contests.forEach(c=>{
const isActive=c.status==='active';
const d=new Date(c.createdAt);
h+=`<div class="upcoming-card ${isActive?'is-active':'is-waiting'}" onclick="document.getElementById('stu-room-code').value='${c.code}';window._uic._joinRoom()">`;
h+=`<div class="upcoming-card-header">`;
h+=`<span class="upcoming-card-code">#${c.code}</span>`;
h+=`<span class="upcoming-card-status ${isActive?'active':'waiting'}">${isActive?'🟢 Đang thi':'⏳ Chờ bắt đầu'}</span>`;
h+=`</div>`;
h+=`<div class="upcoming-card-title">${this._esc(c.title)}</div>`;
h+=`<div class="upcoming-card-meta">`;
h+=`<span>⏱ ${c.timeLimit} phút</span>`;
h+=`<span>📝 ${c.problemCount} bài</span>`;
h+=`<span>👥 ${c.studentCount} HS</span>`;
h+=`<span>📅 ${d.toLocaleDateString('vi')}</span>`;
h+=`</div>`;
if(c.joined)h+=`<div class="upcoming-card-action">${isActive?'👉 Nhấn để tiếp tục thi':'✅ Đã đăng ký — chờ GV bắt đầu'}</div>`;
else h+=`<div class="upcoming-card-action">${isActive?'🚀 Nhấn để vào thi ngay!':'👉 Nhấn để đăng ký thi'}</div>`;
h+=`</div>`});
h+='</div></div>';el.innerHTML=h}

_updateContestBadge(upcomingContests){
const badge=document.getElementById('stu-contest-badge');if(!badge)return;
const activeCount=upcomingContests.filter(c=>c.status==='active').length;
if(activeCount>0){badge.textContent=activeCount;badge.classList.remove('hidden')}
else{badge.classList.add('hidden')}}

_renderStudentContestHistory(contests){
const el=document.getElementById('stu-contest-history');if(!el)return;
if(!contests.length){el.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa tham gia kỳ thi nào</p>';return}
let h='<div class="room-history-grid">';
contests.forEach(c=>{
const d=new Date(c.createdAt);
const isActive=c.status==='active';
const isEnded=c.status==='ended';
let statusBadge,statusColor;
if(isActive){statusBadge='🟢 Đang thi';statusColor='var(--success)'}
else if(isEnded&&c.published){statusBadge='📊 Đã có kết quả';statusColor='var(--accent)'}
else if(isEnded&&c.gradeStatus==='graded'){statusBadge='✅ Đã chấm (chờ công bố)';statusColor='var(--warning,#f59e0b)'}
else if(isEnded){statusBadge='⏳ Chờ chấm bài';statusColor='var(--text-muted)'}
else{statusBadge='⏸️ Chờ bắt đầu';statusColor='var(--text-muted)'}
const canView=isEnded&&c.published;
h+=`<div class="room-history-card" style="cursor:${canView||isActive?'pointer':'default'};${canView?'border-color:rgba(99,102,241,.3)':''}" ${canView?`onclick="window._uic._viewContestResult('${c.code}')"`:isActive?`onclick="document.getElementById('stu-room-code').value='${c.code}';window._uic._joinRoom()"`:''}>`;
h+=`<div class="room-history-header"><span class="room-history-code">#${c.code}</span><span style="font-size:.72rem;font-weight:600;color:${statusColor}">${statusBadge}</span></div>`;
h+=`<div class="room-history-title">${this._esc(c.title)}</div>`;
h+=`<div class="room-history-meta">`;
h+=`<span>⏱ ${c.timeLimit} phút</span>`;
h+=`<span>📝 ${c.problemCount} bài</span>`;
h+=`<span>📅 ${d.toLocaleDateString('vi')}</span>`;
h+=`</div>`;
if(canView)h+=`<div style="margin-top:6px;font-size:.75rem;color:var(--accent)">👉 Nhấn để xem kết quả chi tiết</div>`;
if(isActive)h+=`<div style="margin-top:6px;font-size:.75rem;color:var(--success)">👉 Nhấn để vào phòng thi</div>`;
h+=`</div>`});
h+='</div>';el.innerHTML=h}

async _viewContestResult(code){
// Navigate to contest ended screen to view results
// BUG-5 FIX: Use _viewingContestCode instead of overwriting this.roomCode
try{
this._viewingContestCode=code;
const infoSnap=await this.fb.db.ref(`rooms/${code}/info`).once('value');
const info=infoSnap.val();
if(!info){this._toast('Không tìm thấy kỳ thi','error');return}
document.getElementById('stu-dashboard').classList.add('hidden');
this._showStudentEndedScreen(code,info);
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_loadExerciseStatuses(exs){this._renderExerciseList(exs);this._renderStudentRanking();this._renderStudentStats()}

// ===== STUDENT BADGE / TITLE SYSTEM =====
_computeStudentBadges(stats){
// stats: {done, total, perfect, avg, totalScore, rank, totalStudents}
const {done,total,perfect,avg,totalScore,rank,totalStudents}=stats;
const pct=total>0?Math.round(done/total*100):0;
const perfectPct=total>0?Math.round(perfect/total*100):0;

// === MAIN TITLE (tier-based) ===
let tier,tierIcon,tierName,tierClass,tierNext;
if(perfect>=total&&total>=10){
  tier=5;tierIcon='🏆';tierName='Huyền Thoại';tierClass='legend';tierNext='Đã đạt cấp cao nhất!'}
else if(perfectPct>=80&&avg>=95){
  tier=4;tierIcon='💎';tierName='Kim Cương';tierClass='diamond';tierNext=`Hoàn thành 100% bài → Huyền Thoại`}
else if(perfectPct>=50&&avg>=80){
  tier=3;tierIcon='🥇';tierName='Vàng';tierClass='gold';tierNext=`${80-perfectPct>0?80-perfectPct+'% bài 100đ nữa':'ĐTB ≥95'} → Kim Cương`}
else if(pct>=50&&avg>=60){
  tier=2;tierIcon='🥈';tierName='Bạc';tierClass='silver';tierNext=`${50-perfectPct>0?'50% bài 100đ':'ĐTB ≥80'} → Vàng`}
else if(done>=3){
  tier=1;tierIcon='🥉';tierName='Đồng';tierClass='bronze';tierNext=`Làm 50% bài + ĐTB ≥60 → Bạc`}
else{
  tier=0;tierIcon='🌱';tierName='Tập Sự';tierClass='bronze';tierNext=`Hoàn thành 3 bài → Đồng`}

// === ACHIEVEMENT BADGES ===
const badges=[];

// Progress milestones
if(done>=1)badges.push({emoji:'🎯',name:'Khởi Đầu',desc:'Hoàn thành bài đầu tiên',tier:'bronze',earned:true});
else badges.push({emoji:'🎯',name:'Khởi Đầu',desc:'Hoàn thành bài đầu tiên',tier:'bronze',earned:false});

if(done>=5)badges.push({emoji:'📚',name:'Chăm Chỉ',desc:'Hoàn thành 5 bài',tier:'bronze',earned:true});
else if(done>=1)badges.push({emoji:'📚',name:'Chăm Chỉ',desc:`Hoàn thành 5 bài (${done}/5)`,tier:'bronze',earned:false});

if(done>=10)badges.push({emoji:'🔥',name:'Kiên Trì',desc:'Hoàn thành 10 bài',tier:'silver',earned:true});
else if(done>=3)badges.push({emoji:'🔥',name:'Kiên Trì',desc:`Hoàn thành 10 bài (${done}/10)`,tier:'silver',earned:false});

if(pct>=100)badges.push({emoji:'🏅',name:'Hoàn Tất',desc:'Làm hết tất cả bài tập',tier:'gold',earned:true});
else if(done>=5)badges.push({emoji:'🏅',name:'Hoàn Tất',desc:`Làm hết bài tập (${pct}%)`,tier:'gold',earned:false});

// Score milestones
if(perfect>=1)badges.push({emoji:'💯',name:'Hoàn Hảo',desc:'Đạt 100 điểm bài đầu tiên',tier:'bronze',earned:true});
else if(done>=1)badges.push({emoji:'💯',name:'Hoàn Hảo',desc:'Đạt 100 điểm 1 bài',tier:'bronze',earned:false});

if(perfect>=5)badges.push({emoji:'⭐',name:'Ngôi Sao',desc:'5 bài 100 điểm',tier:'silver',earned:true});
else if(perfect>=1)badges.push({emoji:'⭐',name:'Ngôi Sao',desc:`5 bài 100đ (${perfect}/5)`,tier:'silver',earned:false});

if(perfect>=10)badges.push({emoji:'🌟',name:'Siêu Sao',desc:'10 bài 100 điểm',tier:'gold',earned:true});
else if(perfect>=3)badges.push({emoji:'🌟',name:'Siêu Sao',desc:`10 bài 100đ (${perfect}/10)`,tier:'gold',earned:false});

if(perfectPct>=100&&total>=5)badges.push({emoji:'👑',name:'Bất Bại',desc:'100% bài đạt 100 điểm',tier:'special',earned:true});

// Average score
if(avg>=90)badges.push({emoji:'🧠',name:'Thiên Tài',desc:'Điểm trung bình ≥ 90',tier:'gold',earned:true});
else if(avg>=70&&done>=3)badges.push({emoji:'🧠',name:'Thiên Tài',desc:`ĐTB ≥ 90 (hiện: ${avg})`,tier:'gold',earned:false});

if(avg>=80&&done>=5)badges.push({emoji:'📊',name:'Ổn Định',desc:'ĐTB ≥ 80 với ≥ 5 bài',tier:'silver',earned:true});

// Ranking
if(rank===1&&totalStudents>=3)badges.push({emoji:'🏆',name:'Quán Quân',desc:'Xếp hạng #1',tier:'special',earned:true});
else if(rank<=3&&totalStudents>=5)badges.push({emoji:'🎖️',name:'Top 3',desc:'Xếp hạng Top 3',tier:'gold',earned:true});

// Total score milestones
if(totalScore>=1000)badges.push({emoji:'💰',name:'Nghìn Điểm',desc:'Tổng ≥ 1000 điểm',tier:'silver',earned:true});
if(totalScore>=5000)badges.push({emoji:'💎',name:'Năm Nghìn',desc:'Tổng ≥ 5000 điểm',tier:'gold',earned:true});

return{tier,tierIcon,tierName,tierClass,tierNext,badges:badges.filter(b=>b.earned||done>=1)};}


_renderStudentStats(){const el=document.getElementById('stu-stats-bar');if(!el)return;const exs=this._cachedExercises||{};const res=this._exerciseResults||{};const total=Object.keys(exs).length;if(!total||!this.studentName){el.innerHTML='';return}
let done=0,totalScore=0,perfect=0;Object.keys(exs).forEach(k=>{const r=res[k]&&res[k][this.studentName];if(r){done++;totalScore+=r.score||0;if(r.score>=100)perfect++}});
const notDone=total-done;const avg=done>0?Math.round(totalScore/done):0;const pct=total>0?Math.round(done/total*100):0;
// Compute rank for badge system
const exKeys2=Object.keys(exs);const stuSet2=new Set();exKeys2.forEach(k=>{if(res[k])Object.keys(res[k]).forEach(n=>stuSet2.add(n))});
const allStu2=[...stuSet2].map(n=>{let ts=0,pc=0;exKeys2.forEach(k=>{const r=res[k]&&res[k][n];if(r){ts+=r.score||0;if(r.score>=100)pc++}});return{name:n,ts,pc}}).sort((a,b)=>b.pc-a.pc||b.ts-a.ts);
const myRank=allStu2.findIndex(s=>s.name===this.studentName)+1;
const b=this._computeStudentBadges({done,total,perfect,avg,totalScore,rank:myRank||999,totalStudents:allStu2.length});
const earnedB=b.badges.filter(x=>x.earned);const lockedB=b.badges.filter(x=>!x.earned);
let chips2=earnedB.map(x=>`<span class="stu-badge-chip earned-${x.tier}" data-tooltip="${this._esc(x.desc)}"><span class="badge-emoji">${x.emoji}</span><span class="badge-name">${this._esc(x.name)}</span></span>`).join('');
chips2+=lockedB.map(x=>`<span class="stu-badge-chip locked" data-tooltip="${this._esc(x.desc)}"><span class="badge-emoji">${x.emoji}</span><span class="badge-name">${this._esc(x.name)}</span></span>`).join('');
el.innerHTML=`<div class="stu-badge-card badge-tier-${b.tierClass}"><span class="stu-badge-icon">${b.tierIcon}</span><div class="stu-badge-info"><span class="stu-badge-title">${b.tierName}</span><span class="stu-badge-subtitle">${this._esc(b.tierNext)}</span></div></div><div class="oj-stat-item"><span class="oj-stat-value">${total}</span><span class="oj-stat-label">Tổng bài</span></div><div class="oj-stat-item"><span class="oj-stat-value">${done}</span><span class="oj-stat-label">Đã làm</span></div><div class="oj-stat-item"><span class="oj-stat-value oj-stat-notdone">${notDone}</span><span class="oj-stat-label">Chưa làm</span></div><div class="oj-stat-item"><span class="oj-stat-value" style="color:var(--success)">${perfect}</span><span class="oj-stat-label">100 điểm</span></div><div class="oj-stat-item"><span class="oj-stat-value" style="color:${avg>=80?'var(--success)':avg>=50?'var(--warning)':'var(--text-muted)'}">${avg}</span><span class="oj-stat-label">Điểm TB</span></div><div class="oj-progress-wrap"><div class="oj-progress-fill" style="width:${pct}%"></div><span class="oj-progress-text">${pct}% hoàn thành (${done}/${total})</span></div>`;
const badgeCollEl=document.getElementById('stu-badge-collection');
if(badgeCollEl)badgeCollEl.innerHTML=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:.78rem;font-weight:700;color:var(--text-secondary)">🎖️ Thành tích (${earnedB.length}/${b.badges.length})</span></div><div class="stu-badges-grid">${chips2}</div>`}

_renderStudentRanking(){const el=document.getElementById('stu-ranking');if(!el)return;const exs=this._cachedExercises||{};const res=this._exerciseResults||{};const exKeys=Object.keys(exs);
if(!exKeys.length){el.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có bài tập</p>';return}
// Collect all student names from results
const stuSet=new Set();exKeys.forEach(k=>{if(res[k])Object.keys(res[k]).forEach(n=>stuSet.add(n))});
const students=[...stuSet].map(name=>{let totalScore=0,doneCount=0,perfectCount=0;
exKeys.forEach(k=>{const r=res[k]&&res[k][name];if(r){totalScore+=r.score||0;doneCount++;if(r.score>=100)perfectCount++}});
return{name,totalScore,doneCount,perfectCount,avg:doneCount>0?Math.round(totalScore/doneCount):0}});
students.sort((a,b)=>b.perfectCount-a.perfectCount||b.totalScore-a.totalScore);
if(!students.length){el.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có dữ liệu</p>';return}
const medals=['','\ud83e\udd47','\ud83e\udd48','\ud83e\udd49'];
let h='<table class="oj-ranking-table"><thead><tr><th>Hạng</th><th>Học sinh</th><th>Hoàn thành</th><th>Điểm TB</th><th>Tổng</th></tr></thead><tbody>';
students.forEach((s,i)=>{const rank=i+1;const isSelf=s.name===this.studentName;
h+=`<tr class="${isSelf?'self-row':''}"><td style="text-align:center;font-weight:800">${medals[rank]||rank}</td><td style="font-weight:600">${this._esc(s.name)}</td><td>${s.perfectCount}/${exKeys.length}</td><td style="color:${s.avg>=80?'var(--success)':s.avg>=50?'var(--warning)':'var(--text-muted)'};font-weight:700">${s.avg}</td><td style="font-weight:700;color:var(--accent-light)">${s.totalScore}</td></tr>`});
h+='</tbody></table>';el.innerHTML=h}

// === Notification: new exercises the student hasn't done ===
_checkNewExerciseNotification(exs){if(!this.studentName)return;const res=this._exerciseResults||{};const exKeys=Object.keys(exs||{});
const notDone=exKeys.filter(k=>!(res[k]&&res[k][this.studentName]));
const badge=document.getElementById('stu-notif-badge');
if(badge){if(notDone.length>0){badge.textContent=notDone.length;badge.classList.remove('hidden')}else{badge.classList.add('hidden')}}
// Show toast if new exercises appeared
if(this._prevExCount>0&&exKeys.length>this._prevExCount){const newCount=exKeys.length-this._prevExCount;this._toast(`📢 Có ${newCount} bài tập mới! Kiểm tra ngay.`,'info')}
this._prevExCount=exKeys.length}

// BUG-1 FIX: Single canonical _stuLogout with full cleanup (anti-cheat, intervals, listeners)
_stuLogout(){this.studentName=null;this._currentExercise=null;this._cachedExercises=null;this._exerciseResults={};this.roomCode=null;this._viewingContestCode=null;this.problems=[];this.currentProbIdx=0;if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}if(this._autoSaveInterval){clearInterval(this._autoSaveInterval);this._autoSaveInterval=null}if(this._contestAutoSave){clearInterval(this._contestAutoSave);this._contestAutoSave=null}this._stopAntiCheat();this.fb.cleanupExercise();this.fb.cleanupStudentDash();this.fb.cleanup();['stu-dashboard','stu-waiting','stu-contest','stu-ended'].forEach(id=>document.getElementById(id).classList.add('hidden'));document.getElementById('stu-login').classList.remove('hidden');document.getElementById('stu-name').value='';document.getElementById('stu-password').value='';document.getElementById('stu-login-error').textContent='';if(this.cmStudent){this._suppressAutoSave=true;this.cmStudent.setValue('# Viết code tại đây\n');this._suppressAutoSave=false}}

// ===== 🔒 ANTI-CHEAT SYSTEM (contest mode only) =====
// BUG-3 FIX: Save paste handler ref for proper cleanup
_startAntiCheat(){this._tabSwitchCount=0;this._antiCheatActive=true;
// 1. Detect tab switches
this._visibilityHandler=()=>{if(document.hidden&&this._antiCheatActive){this._tabSwitchCount++;
// Save to Firebase for teacher to see
if(this.roomCode&&this.studentName){this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/antiCheat`).update({tabSwitches:this._tabSwitchCount,lastSwitch:Date.now()}).catch(()=>{})}
// Show warning to student
const warn=this._tabSwitchCount>=3?'🚨 CẢNH BÁO NGHIÊM TRỌNG: Bạn đã rời khỏi tab thi '+this._tabSwitchCount+' lần! GV sẽ nhận được báo cáo.':'⚠️ Phát hiện chuyển tab ('+this._tabSwitchCount+' lần). GV có thể theo dõi hành vi này.';
this._toast(warn,this._tabSwitchCount>=3?'error':'info')}};
document.addEventListener('visibilitychange',this._visibilityHandler);
// 2. Block paste in code editor (contest only) — save ref for cleanup
if(this.cmStudent){
  // Remove old handler if exists (prevent stacking)
  if(this._cmPasteHandler)this.cmStudent.off('beforeChange',this._cmPasteHandler);
  this._cmPasteHandler=(cm,change)=>{if(this._antiCheatActive&&change.origin==='paste'){change.cancel();this._toast('📋 Paste bị tắt trong kỳ thi','error')}};
  this.cmStudent.on('beforeChange',this._cmPasteHandler)}
// 3. Warn on navigation attempts
this._beforeUnloadHandler=e=>{if(this._antiCheatActive){e.preventDefault();e.returnValue='Bạn đang trong kỳ thi! Rời khỏi sẽ mất code chưa lưu.'}};
window.addEventListener('beforeunload',this._beforeUnloadHandler);
// Show anti-cheat indicator
const indicator=document.getElementById('anti-cheat-badge');if(indicator)indicator.classList.remove('hidden')}

_stopAntiCheat(){this._antiCheatActive=false;
if(this._visibilityHandler){document.removeEventListener('visibilitychange',this._visibilityHandler);this._visibilityHandler=null}
if(this._beforeUnloadHandler){window.removeEventListener('beforeunload',this._beforeUnloadHandler);this._beforeUnloadHandler=null}
// BUG-3 FIX: Remove paste handler from CodeMirror
if(this._cmPasteHandler&&this.cmStudent){this.cmStudent.off('beforeChange',this._cmPasteHandler);this._cmPasteHandler=null}
const indicator=document.getElementById('anti-cheat-badge');if(indicator)indicator.classList.add('hidden')}

// ===== 🔑 CHANGE PASSWORD =====
async _changePassword(){const oldPass=document.getElementById('chg-old-pass')?.value;const newPass=document.getElementById('chg-new-pass')?.value;const confirmPass=document.getElementById('chg-confirm-pass')?.value;const errEl=document.getElementById('chg-pass-error');
if(!oldPass||!newPass||!confirmPass){if(errEl)errEl.textContent='⚠️ Điền đầy đủ các trường';return}
if(newPass.length<4){if(errEl)errEl.textContent='⚠️ Mật khẩu mới phải ≥ 4 ký tự';return}
if(newPass!==confirmPass){if(errEl)errEl.textContent='⚠️ Mật khẩu xác nhận không khớp';return}
try{
// Verify old password
await this.fb.verifyStudent(this.studentName,oldPass);
// Update to new password
const newHash=await _hashSHA256(newPass);
await this.fb.db.ref(`accounts/${this.studentName}`).update({passwordHash:newHash});
// Log to Google Sheet
this.drive.logData('PasswordChanges',[this.studentName,new Date().toISOString()]).catch(()=>{});
if(errEl)errEl.textContent='';
document.getElementById('modal-change-pass')?.remove();
this._toast('🔑 Đổi mật khẩu thành công!','success');
}catch(e){if(errEl)errEl.textContent='❌ '+e.message}}

_showChangePasswordModal(){
let h='<div class="modal-overlay" id="modal-change-pass" style="display:flex"><div class="modal-content" style="max-width:400px">';
h+='<h3 style="margin-bottom:16px">🔑 Đổi Mật Khẩu</h3>';
h+='<div class="form-group"><label>Mật khẩu hiện tại</label><input type="password" id="chg-old-pass" placeholder="Nhập mật khẩu cũ..."></div>';
h+='<div class="form-group"><label>Mật khẩu mới</label><input type="password" id="chg-new-pass" placeholder="Tối thiểu 4 ký tự"></div>';
h+='<div class="form-group"><label>Xác nhận mật khẩu mới</label><input type="password" id="chg-confirm-pass" placeholder="Nhập lại mật khẩu mới"></div>';
h+='<p id="chg-pass-error" style="color:var(--danger);font-size:.82rem;min-height:1.2em"></p>';
h+='<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">';
h+='<button class="btn btn-ghost btn-sm" onclick="document.getElementById(\'modal-change-pass\').remove()">Hủy</button>';
h+='<button class="btn btn-accent btn-sm" onclick="window._uic._changePassword()">💾 Lưu</button>';
h+='</div></div></div>';
document.body.insertAdjacentHTML('beforeend',h)}

// ===== 💡 SMART ERROR HINTS (Enhanced verdict explanations) =====
_getVerdictHint(verdict,details,problem){
const hints={
'WA':{icon:'❌',title:'Wrong Answer — Sai kết quả',tips:['Kiểm tra lại logic xử lý, đặc biệt tại các giá trị biên (min, max)','Kiểm tra format output: thừa dấu cách, thiếu xuống dòng?','Thử chạy với ví dụ mẫu để so sánh','Với bài mảng: kiểm tra chỉ số bắt đầu từ 0 hay 1']},
'RE':{icon:'💥',title:'Runtime Error — Lỗi khi chạy',tips:['IndexError: Truy cập ngoài phạm vi mảng → kiểm tra len()','ZeroDivisionError: Chia cho 0 → thêm kiểm tra if','ValueError: int() nhận chuỗi không hợp lệ → kiểm tra input','RecursionError: Đệ quy quá sâu → kiểm tra điều kiện dừng']},
'TLE':{icon:'⏰',title:'Time Limit Exceeded — Quá thời gian',tips:['Thuật toán O(n²) có thể quá chậm → thử O(n log n) hoặc O(n)','Kiểm tra vòng lặp vô hạn: while True cần break/return','Dùng sys.stdin.readline thay vì input() để đọc nhanh hơn','Tránh sort/min/max lặp lại nhiều lần trong vòng lặp']},
'MLE':{icon:'📦',title:'Memory Limit Exceeded — Quá bộ nhớ',tips:['Tránh tạo mảng quá lớn (> 10⁷ phần tử)','Dùng generator thay list khi không cần lưu toàn bộ','Giải phóng biến lớn khi không dùng nữa']}
};
return hints[verdict]||null}

_renderSmartHints(result,consoleHtml){
const failures=result.details.filter(d=>d.verdict!=='AC');
if(!failures.length)return consoleHtml;
// Group verdicts
const verdictCounts={};failures.forEach(f=>{verdictCounts[f.verdict]=(verdictCounts[f.verdict]||0)+1});
let hintsHtml='<div style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px">';
hintsHtml+='<div style="font-weight:700;font-size:.85rem;margin-bottom:8px;color:var(--accent-light)">💡 Gợi ý sửa lỗi:</div>';
for(const [v,count] of Object.entries(verdictCounts)){
const hint=this._getVerdictHint(v);
if(hint){hintsHtml+=`<div style="margin-bottom:8px;padding:8px 10px;background:rgba(99,102,241,.04);border:1px solid rgba(99,102,241,.1);border-radius:6px">`;
hintsHtml+=`<div style="font-weight:600;font-size:.82rem;margin-bottom:4px">${hint.icon} ${hint.title} <span style="color:var(--text-muted);font-weight:400">(${count} test)</span></div>`;
hintsHtml+='<ul style="margin:0;padding-left:16px;font-size:.78rem;color:var(--text-secondary);line-height:1.6">';
hint.tips.slice(0,3).forEach(t=>hintsHtml+=`<li>${t}</li>`);
hintsHtml+='</ul></div>'}}
hintsHtml+='</div>';
return consoleHtml+hintsHtml}

_initDivider(){const divider=document.getElementById('oj-divider');if(!divider)return;const left=document.getElementById('oj-pane-left');let dragging=false;divider.onmousedown=e=>{dragging=true;divider.classList.add('dragging');e.preventDefault()};document.addEventListener('mousemove',e=>{if(!dragging)return;const container=left.parentElement;const rect=container.getBoundingClientRect();const pct=Math.min(50,Math.max(20,((e.clientX-rect.left)/rect.width)*100));left.style.width=pct+'%'});document.addEventListener('mouseup',()=>{if(dragging){dragging=false;divider.classList.remove('dragging');if(this.cmStudent)this.cmStudent.refresh()}})}
// Horizontal divider: resize editor section vs console section
_initHDivider(){const hDiv=document.getElementById('oj-h-divider');if(!hDiv)return;const edSec=document.getElementById('oj-editor-section');const conSec=document.getElementById('oj-console-section');const rightPane=document.getElementById('oj-pane-right');let hDragging=false;
hDiv.onmousedown=e=>{hDragging=true;hDiv.classList.add('dragging');e.preventDefault()};
document.addEventListener('mousemove',e=>{if(!hDragging)return;const rect=rightPane.getBoundingClientRect();const offsetY=e.clientY-rect.top;const totalH=rect.height;const editorPct=Math.min(85,Math.max(20,(offsetY/totalH)*100));const consolePct=100-editorPct;
edSec.style.flex='0 0 '+editorPct+'%';conSec.style.flex='0 0 '+consolePct+'%';conSec.style.height=consolePct+'%'});
document.addEventListener('mouseup',()=>{if(hDragging){hDragging=false;hDiv.classList.remove('dragging');if(this.cmStudent)this.cmStudent.refresh()}})}


async _stuLogin(){const name=document.getElementById('stu-name').value.trim();const pass=document.getElementById('stu-password').value;const errEl=document.getElementById('stu-login-error');errEl.textContent='';if(!name||!pass){errEl.textContent='⚠️ Nhập đầy đủ tên và mật khẩu';return}try{await this.fb.verifyStudent(name,pass);this.studentName=name;document.getElementById('stu-login').classList.add('hidden');document.getElementById('stu-dashboard').classList.remove('hidden');document.getElementById('stu-welcome-name').textContent=name;
// Re-register Firebase listeners (destroyed on previous logout)
this._registerStudentListeners();
this._toast(`Xin chào ${name}!`,'success')}catch(e){errEl.textContent='❌ '+e.message}}

// BUG-1 FIX: Removed duplicate _stuLogout — see canonical version at L1142

_sTopicOpen={};
_toggleStudentTopic(topic){this._sTopicOpen[topic]=!this._sTopicOpen[topic];const el=document.getElementById('tg-s-'+this._topicSlug(topic));if(el)el.classList.toggle('open',!!this._sTopicOpen[topic])}
_renderExerciseList(exs){const c=document.getElementById('exercise-list');
// Safety filter: exclude exam-only topic from student view
const filteredExs={};Object.keys(exs).forEach(k=>{const t=(exs[k].topic||'').trim().toLowerCase();if(t!=='đề thi'&&t!=='de thi')filteredExs[k]=exs[k]});exs=filteredExs;
const allKeys=Object.keys(exs);if(!allKeys.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">📭 Chưa có bài tập nào. Giáo viên chưa đăng.</p>';c.className='';return}
const filter=(document.getElementById('stu-exercise-search')||{}).value||'';
const statusFilter=(document.getElementById('stu-status-filter')||{}).value||'all';
const keys=allKeys.filter(k=>{const ex=exs[k];const textMatch=!filter||(ex.title||'').toLowerCase().includes(filter.toLowerCase())||(ex.topic||'').toLowerCase().includes(filter.toLowerCase());
const myRes=this.studentName&&this._exerciseResults[k]&&this._exerciseResults[k][this.studentName];
const isDone=!!myRes;const isPerfect=myRes&&myRes.score>=100;
let statusMatch=true;if(statusFilter==='done')statusMatch=isDone;else if(statusFilter==='notdone')statusMatch=!isDone;else if(statusFilter==='perfect')statusMatch=isPerfect;else if(statusFilter==='partial')statusMatch=isDone&&!isPerfect;
return textMatch&&statusMatch});
const countEl=document.getElementById('stu-exercise-count');
const notDoneAll=allKeys.filter(k=>!(this._exerciseResults[k]&&this._exerciseResults[k][this.studentName])).length;
if(countEl){const txt=filter||statusFilter!=='all'?`${keys.length}/${allKeys.length} bài`:`${allKeys.length} bài tập`;countEl.textContent=txt}
const badgeEl=document.getElementById('stu-notif-badge');if(badgeEl){if(notDoneAll>0){badgeEl.textContent=notDoneAll;badgeEl.classList.remove('hidden')}else{badgeEl.classList.add('hidden')}}
if(!keys.length){c.innerHTML=`<p style="color:var(--text-muted);text-align:center;padding:20px">${filter?'Không tìm thấy "'+this._esc(filter)+'"':'Không có bài tập phù hợp bộ lọc'}</p>`;c.className='';return}
c.className='oj-exercise-list-v2';
// Group by topic
const groups={};keys.forEach(k=>{const topic=exs[k].topic||'Không phân loại';if(!groups[topic])groups[topic]=[];groups[topic].push(k)});
const sortedTopics=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'vi'));
const hasFilter=!!(filter||statusFilter!=='all');
let h='';
sortedTopics.forEach(topic=>{
const topicKeys=groups[topic];
const isOpen=hasFilter?true:!!this._sTopicOpen[topic];
// Personal stats for this topic
let doneCnt=0,perfectCnt=0;
topicKeys.forEach(k=>{const myRes=this.studentName&&this._exerciseResults[k]&&this._exerciseResults[k][this.studentName];if(myRes){doneCnt++;if(myRes.score>=100)perfectCnt++}});
const pct=topicKeys.length>0?Math.round(doneCnt/topicKeys.length*100):0;
const barColor=pct>=100?'var(--success)':pct>=50?'var(--warning,#f59e0b)':'var(--accent-light)';
const personalIcon=doneCnt===topicKeys.length?(perfectCnt===topicKeys.length?'💯':'✅'):(doneCnt>0?'🔶':'❌');
const personalClass=doneCnt===topicKeys.length?'tg-done':(doneCnt>0?'tg-partial':'tg-none');
h+=`<div class="topic-group ${isOpen?'open':''}" id="tg-s-${this._topicSlug(topic)}">`;
h+=`<div class="topic-group-header" onclick="window._uic._toggleStudentTopic('${this._esc(topic).replace(/'/g,"\\'")}')">`;
h+=`<span class="topic-group-chevron">▶</span>`;
h+=`<span class="topic-group-name">${this._esc(topic)} <span class="topic-group-count">${topicKeys.length} bài</span></span>`;
h+=`<div class="topic-group-stats">`;
h+=`<div class="topic-group-progress"><div class="topic-group-progress-fill" style="width:${pct}%;background:${barColor}"></div></div>`;
h+=`<span class="topic-group-personal ${personalClass}">${personalIcon} ${doneCnt}/${topicKeys.length}</span>`;
h+=`</div></div>`;
h+=`<div class="topic-group-body">`;
h+=`<table class="stu-ex-table"><thead><tr><th style="width:36px">STT</th><th>Bài tập</th><th style="width:80px">Độ khó</th><th style="width:84px">Trạng thái</th><th style="width:56px">Điểm</th><th style="width:56px">Tests</th><th style="width:72px">Ngày tạo</th></tr></thead><tbody>`;
topicKeys.forEach((k,idx)=>{const ex=exs[k];const d=new Date(ex.createdAt);const tc=ex.testCases?ex.testCases.length:0;
const myResult=this.studentName&&this._exerciseResults[k]&&this._exerciseResults[k][this.studentName];
const isDone=!!myResult;const score=myResult?myResult.score:null;
const scoreClass=score>=100?'perfect':score>=50?'partial':'fail';
const scoreHtml=isDone?`<span class="stu-ex-score ${scoreClass}">${score}</span>`:`<span class="stu-ex-score none">—</span>`;
const statusHtml=isDone?(score>=100?'<span class="stu-status-badge done">✅ Hoàn thành</span>':'<span class="stu-status-badge partial">🔶 Chưa đạt</span>'):'<span class="stu-status-badge notdone">❌ Chưa làm</span>';
h+=`<tr class="${isDone?(score>=100?'stu-ex-done':'stu-ex-partial'):'stu-ex-new'}" onclick="window._uic._openExercise('${k}')">`;
h+=`<td class="stu-ex-idx">${idx+1}</td>`;
h+=`<td><div class="stu-ex-name">${this._esc(ex.title)}</div><div class="stu-ex-desc-line">${this._esc(ex.description||'').substring(0,70)}${(ex.description||'').length>70?'…':''}</div></td>`;
const _sDiffHtml=(dv=>{if(!dv)return'<span class="diff-badge diff-none">—</span>';const _lbl={easy:'Dễ',medium:'Trung bình',hard:'Khó'}[dv]||dv;const _cls={easy:'diff-easy',medium:'diff-medium',hard:'diff-hard'}[dv]||'diff-none';return`<span class="diff-badge ${_cls}">${_lbl}</span>`})(ex.difficulty);
h+=`<td>${_sDiffHtml}</td>`;
h+=`<td class="stu-ex-status-cell">${statusHtml}</td>`;
h+=`<td class="stu-ex-score-cell">${scoreHtml}</td>`;
h+=`<td class="stu-ex-tests-cell">${tc} test</td>`;
h+=`<td class="stu-ex-date-cell">${d.toLocaleDateString('vi')}</td>`;
h+=`</tr>`});
h+=`</tbody></table></div></div>`});
c.innerHTML=h}

async _openExercise(exId){
// BUG-05 FIX: Guard against rapid switching between exercises
if(this._openingExercise)return;this._openingExercise=true;
// BUG-C03 FIX: Snapshot exId at entry to prevent race condition
const snapExId=exId;
try{
const snap=await this.fb.db.ref(`exercises/${snapExId}`).once('value');const ex=snap.val();if(!ex){this._openingExercise=false;return}this._currentExercise={id:snapExId,...ex};this.roomCode=null;this.problems=[ex];this.currentProbIdx=0;document.getElementById('stu-dashboard').classList.add('hidden');document.getElementById('stu-contest').classList.remove('hidden');document.getElementById('stu-contest-title').textContent=ex.title;document.getElementById('stu-player-name').textContent=this.studentName;
document.getElementById('stu-timer').textContent='∞';document.getElementById('stu-timer').classList.remove('critical');
if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}
// BUG-08 FIX: Clear auto-save interval from previous exercise
if(this._autoSaveInterval){clearInterval(this._autoSaveInterval);this._autoSaveInterval=null}
// BUG-09 FIX: Reset readOnly from contest ended mode
if(this.cmStudent)this.cmStudent.setOption('readOnly',false);
// === RESET UI state from previous exercise ===
const consoleOut=document.getElementById('oj-console-output');if(consoleOut)consoleOut.innerHTML='<span style="color:var(--text-muted)">Nhấn "Chạy thử" hoặc "Nộp Bài" để bắt đầu.</span>';
const statusEl=document.getElementById('stu-submit-status');if(statusEl)statusEl.textContent='';
const resultsCard=document.getElementById('stu-results-card');if(resultsCard)resultsCard.classList.add('hidden');
const noResults=document.getElementById('no-results-msg');if(noResults)noResults.style.display='';
const customInput=document.getElementById('oj-custom-input');if(customInput)customInput.value='';
const testOutput=document.getElementById('oj-test-output');if(testOutput)testOutput.textContent='Chưa có output. Nhấn 🧪 Chạy thử.';
// Enable submit button (may have been disabled)
const submitBtn=document.getElementById('btn-stu-submit');if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='▶ Nộp Bài'}
this._renderProblemTabs();this._showProblem(0);this._initStudentEditor();
// F04: Restore draft from localStorage first, then Firebase
const savedDraft=localStorage.getItem('themis_draft_'+exId);
const prev=await this.fb.getExerciseResults(exId,this.studentName);
if(savedDraft&&this.cmStudent){this.cmStudent.setValue(savedDraft);this._toast('📝 Đã khôi phục bản nháp tự lưu','info')}
else if(prev&&prev.code&&this.cmStudent){this.cmStudent.setValue(prev.code);this._toast(`📝 Đã khôi phục code (${prev.score}/100)`,'info')}
else if(prev){this._toast(`Điểm trước: ${prev.score}/100`,'info')}
if(prev){this._showStudentResults({score:prev.score,details:prev.details},ex);statusEl.textContent=`✅ Đã nộp (${prev.score}/100)`;
// Switch to Results tab in console so student sees their previous score
document.querySelectorAll('.oj-ctab').forEach(b=>b.classList.remove('active'));const resTab=document.querySelector('.oj-ctab[data-ctab="results"]');if(resTab)resTab.classList.add('active');document.querySelectorAll('.oj-ctab-content').forEach(p=>p.classList.remove('active'));const resPanel=document.getElementById('ctab-results');if(resPanel)resPanel.classList.add('active')}
else{
// New exercise: show Đề Bài tab
document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));const descTab=document.querySelector('.oj-ptab[data-ptab="desc"]');if(descTab)descTab.classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));const descPanel=document.getElementById('ptab-desc');if(descPanel)descPanel.classList.add('active')}
// BUG-05 FIX: Build leaderboard from exercise results instead of non-existent room leaderboard
const exRes=this._exerciseResults||{};const exResultsForThis=exRes[exId]||{};const pseudoLb={};Object.keys(exResultsForThis).forEach(name=>{const r=exResultsForThis[name];pseudoLb[name]={name,totalScore:r.score||0,problems:{0:r.score||0},lastSubmit:r.submittedAt||0}});this._renderLeaderboard(pseudoLb,'stu-leaderboard-body',this.studentName);
// Use 'exercise' group so cleanup only removes this listener, not dashboard listeners
this.fb.cleanupExercise();
this.fb.listenAllExerciseResults(res=>{const lr=res[exId]||{};const lb={};Object.keys(lr).forEach(n=>{const r=lr[n];lb[n]={name:n,totalScore:r.score||0,problems:{0:r.score||0},lastSubmit:r.submittedAt||0}});this._renderLeaderboard(lb,'stu-leaderboard-body',this.studentName)},'exercise');
// AI Tutor: init and reset for this exercise
this._initAITutor();this._resetAITutorForExercise();
}catch(e){this._toast('Lỗi mở bài: '+e.message,'error')}finally{this._openingExercise=false}}

async _joinRoom(){const code=document.getElementById('stu-room-code').value.trim();const errEl=document.getElementById('stu-join-error');errEl.textContent='';if(!code){errEl.textContent='⚠️ Nhập mã phòng thi';return}if(!this.studentName){errEl.textContent='⚠️ Vui lòng đăng nhập trước';return}try{this.roomCode=code;this._currentExercise=null;const info=await this.fb.joinRoom(code,this.studentName);document.getElementById('stu-dashboard').classList.add('hidden');document.getElementById('stu-waiting-info').textContent=`Phòng: ${code} — ${info.title}`;if(info.status==='active'){this._stuStartContest(info)}else if(info.status==='ended'){this._showStudentEndedScreen(code,info)}else{document.getElementById('stu-waiting').classList.remove('hidden')}this.fb.listenRoomInfo(code,ri=>{if(!ri)return;if(ri.status==='active'){document.getElementById('stu-waiting').classList.add('hidden');this._stuStartContest(ri)}else if(ri.status==='ended'){if(this.timerInterval){clearInterval(this.timerInterval);this.timerInterval=null}this._stopAntiCheat();if(this._contestAutoSave){clearInterval(this._contestAutoSave);this._contestAutoSave=null}document.getElementById('stu-contest').classList.add('hidden');this._showStudentEndedScreen(code,ri)}});this._toast(`Đã vào phòng ${code}!`,'success')}catch(e){errEl.textContent='❌ '+e.message}}

async _showStudentEndedScreen(roomCode,info){
document.getElementById('stu-ended').classList.remove('hidden');
// Show contest title and info
const titleEl=document.getElementById('stu-ended-title');
titleEl.textContent=info.title||'Cuộc thi đã kết thúc!';
const infoEl=document.getElementById('stu-ended-info');
const d=new Date(info.createdAt||Date.now());
infoEl.innerHTML=`<span>⏱ ${info.timeLimit||0} phút</span><span>📅 ${d.toLocaleDateString('vi')}</span><span>📝 ${info.problemCount||0} bài</span>${info.totalMaxScore?`<span>🎯 ${info.totalMaxScore}đ</span>`:''}`;
// Load submitted code for review
try{
const codeSnap=await this.fb.db.ref(`rooms/${roomCode}/students/${this.studentName}/finalCode`).once('value');
const codes=codeSnap.val()||{};
const codeKeys=Object.keys(codes);
if(codeKeys.length>0){
document.getElementById('stu-submitted-code-review').classList.remove('hidden');
const tabsEl=document.getElementById('stu-code-review-tabs');
const preEl=document.getElementById('stu-code-review-content');
tabsEl.innerHTML='';
codeKeys.forEach((pi,i)=>{
const btn=document.createElement('button');btn.className='oj-ptab-btn'+(i===0?' active':'');btn.textContent=`Bài ${parseInt(pi)+1}`;
btn.onclick=()=>{tabsEl.querySelectorAll('.oj-ptab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');preEl.textContent=codes[pi]||'(Chưa nộp)'};
tabsEl.appendChild(btn)});
preEl.textContent=codes[codeKeys[0]]||'(Chưa nộp)'}
// Load problem descriptions
try{
const probSnap=await this.fb.db.ref(`rooms/${roomCode}/problems`).once('value');
const probs=probSnap.val();
if(probs){
const probSection=document.getElementById('stu-ended-problems');
probSection.classList.remove('hidden');
const tabsEl=document.getElementById('stu-ended-prob-tabs');
const detailEl=document.getElementById('stu-ended-prob-detail');
// Get grades ONLY if published
const isPublished=!!info.published;
const myGrades=isPublished?(await this.fb.db.ref(`rooms/${roomCode}/gradeResults/${this.studentName}`).once('value')).val()||{}:{};
tabsEl.innerHTML='';
const probKeys=Object.keys(probs).sort((a,b)=>parseInt(a)-parseInt(b));
const showProb=(pi)=>{
const p=probs[pi];
const grade=isPublished?myGrades[pi]:null;
const score=grade?grade.score:null;
const ms=p.maxScore||(grade?.maxScore)||100;
let scoreHtml='';
if(isPublished&&score!==null){const cls=score>=ms?'perfect':score>0?'partial':'zero';scoreHtml=`<div class="contest-prob-score ${cls}">🎯 Điểm: ${score}/${ms}</div>`}
let sampleHtml='';
if(p.sampleIO&&p.sampleIO.length){
sampleHtml='<div style="margin-top:12px">';
p.sampleIO.forEach((s,si)=>{
sampleHtml+=`<div class="sample-io-display"><div class="sample-io-display-header">Ví dụ ${si+1}</div><div class="sample-io-display-grid"><div class="sample-box"><div class="sample-box-title">INPUT</div><pre>${this._esc(s.input||'')}</pre></div><div class="sample-box"><div class="sample-box-title">OUTPUT</div><pre>${this._esc(s.output||'')}</pre></div></div>`;
if(s.explanation)sampleHtml+=`<div class="sample-io-display-explain">💡 ${this._esc(s.explanation)}</div>`;
sampleHtml+=`</div>`});
sampleHtml+='</div>'}
detailEl.innerHTML=`<div class="contest-prob-detail">
<div class="contest-prob-title">📝 ${this._esc(p.title||'Bài '+(parseInt(pi)+1))}</div>
${scoreHtml}
<div class="contest-prob-desc">${this._esc(p.description||'Không có mô tả')}</div>
${sampleHtml}</div>`};
probKeys.forEach((pi,i)=>{
const btn=document.createElement('button');btn.className='contest-prob-tab'+(i===0?' active':'');
const p=probs[pi];const grade=isPublished?myGrades[pi]:null;
const ms=p.maxScore||(grade?.maxScore)||100;
const scoreIcon=isPublished&&grade?(grade.score>=ms?'✅':grade.score>0?'🟡':'❌'):'📝';
btn.textContent=`${scoreIcon} Bài ${parseInt(pi)+1}`;
btn.onclick=()=>{tabsEl.querySelectorAll('.contest-prob-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');showProb(pi)};
tabsEl.appendChild(btn)});
if(probKeys.length)showProb(probKeys[0]);
}}catch(e){console.warn('Load contest problems:',e)}
// Check if published
if(info.published){
document.getElementById('stu-final-score').textContent='📊 GV đã công bố kết quả!';
document.getElementById('stu-contest-results').classList.remove('hidden');
// Show leaderboard
const lbSnap=await this.fb.db.ref(`rooms/${roomCode}/leaderboard`).once('value');
const lb=lbSnap.val();
this.publishedCount=info.problemCount||1;
if(lb){this._renderLeaderboard(lb,'stu-contest-lb',this.studentName)}
// Show teacher notes
const noteSnap=await this.fb.db.ref(`rooms/${roomCode}/teacherNotes/${this.studentName}`).once('value');
const notes=noteSnap.val();
if(notes){let nh='<div style="margin-top:8px"><h4 style="font-size:.85rem;margin-bottom:6px">💬 Nhận xét GV:</h4>';
Object.keys(notes).forEach(pi=>{nh+=`<div style="padding:6px 10px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:6px;font-size:.78rem;margin-bottom:4px"><strong>Bài ${parseInt(pi)+1}:</strong> ${this._esc(notes[pi])}</div>`});
nh+='</div>';document.getElementById('stu-contest-notes').innerHTML=nh}
// Show AI analysis
const gradeSnap2=await this.fb.db.ref(`rooms/${roomCode}/gradeResults/${this.studentName}`).once('value');
const grades=gradeSnap2.val()||{};
let aiHtml='';Object.keys(grades).forEach(pi=>{if(grades[pi].aiAnalysis){aiHtml+=`<div style="padding:6px 10px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);border-radius:6px;font-size:.78rem;margin-bottom:4px"><strong>🤖 Bài ${parseInt(pi)+1}:</strong> ${this._esc(grades[pi].aiAnalysis).replace(/\n/g,'<br>')}</div>`}});
if(aiHtml)document.getElementById('stu-contest-notes').innerHTML+='<div style="margin-top:8px"><h4 style="font-size:.85rem;margin-bottom:6px">🤖 Phân tích AI:</h4>'+aiHtml+'</div>';
}else{document.getElementById('stu-final-score').textContent='⏳ Chờ GV chấm bài và công bố kết quả...'}
}catch(e){console.error('Load ended screen:',e);document.getElementById('stu-final-score').textContent='⏳ Chờ kết quả...'}}


async _stuStartContest(info){document.getElementById('stu-contest').classList.remove('hidden');document.getElementById('stu-contest-title').textContent=info.title;document.getElementById('stu-player-name').textContent=this.studentName;
// Timer with visual urgency
const end=info.startTime+info.timeLimit*60000;if(this.timerInterval)clearInterval(this.timerInterval);const upd=()=>{const rem=Math.max(0,end-Date.now());const h=Math.floor(rem/3600000),m=Math.floor(rem%3600000/60000),s=Math.floor(rem%60000/1000);const el=document.getElementById('stu-timer');el.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
el.classList.toggle('critical',rem<300000);el.classList.toggle('warning-timer',rem>=300000&&rem<600000);
if(rem<=0){clearInterval(this.timerInterval);this.timerInterval=null;document.getElementById('btn-stu-submit').disabled=true;this._toast('⏰ Hết thời gian! Không thể nộp thêm.','error');this._stopAntiCheat();this._showContestEndedReadonly()}};this.timerInterval=setInterval(upd,1000);upd();
// Load problems — HIDE test cases from client in contest mode
const allProblems=await this.fb.getProblems(this.roomCode);
if(!allProblems||!allProblems.length){document.getElementById('stu-problem-desc').textContent='Chưa có đề bài';return}
// Strip testCases for security: only keep sampleIO, description, title, fileIO, etc.
this.problems=allProblems.map(p=>({title:p.title,description:p.description,fileIO:p.fileIO,taskName:p.taskName,uppercase:p.uppercase,subtasks:p.subtasks,sampleIO:p.sampleIO,timePerTest:p.timePerTest,_testCount:p.testCases?p.testCases.length:0}));
this._renderProblemTabs();this._showProblem(0);
// BUG-4 FIX: Suppress auto-save during editor init to prevent race condition
this._suppressAutoSave=true;
this._initStudentEditor();
// Restore auto-saved code from Firebase if available
try{const draftSnap=await this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/draftCode`).once('value');
const drafts=draftSnap.val();
if(drafts&&drafts[0]&&this.cmStudent){this.cmStudent.setValue(drafts[0]);this._toast('💾 Đã khôi phục code từ lần trước!','info')}}catch(e){console.warn('Restore draft:',e)}
this._suppressAutoSave=false;
// Hide leaderboard in contest mode — show message instead
const lbBody=document.getElementById('stu-leaderboard-body');
if(lbBody)lbBody.innerHTML='<div style="text-align:center;padding:32px;color:var(--text-muted)"><div style="font-size:2rem;margin-bottom:8px">🔒</div><p style="font-size:.85rem">Bảng xếp hạng sẽ được công bố<br>sau khi GV chấm bài.</p></div>';
// Track submission count per problem
this._contestSubmissions={};this._contestRoomInfo=info;
// 🔒 ANTI-CHEAT: Enable for contest mode only
this._startAntiCheat();
// 💾 AUTO-SAVE: Save ALL problems' code to Firebase every 30s during contest
// BUG-M04 FIX: Sync ALL cached drafts, not just the currently-visible problem
if(this._contestAutoSave)clearInterval(this._contestAutoSave);
// BUG-C04 FIX: Check _suppressAutoSave to prevent overwriting during restore
this._contestAutoSave=setInterval(()=>{if(this._suppressAutoSave)return;if(this.cmStudent&&this.roomCode&&this.studentName){
// Sync current editor content into draft cache before flushing
const curCode=this.cmStudent.getValue();
if(curCode.trim()&&curCode.trim()!=='# Viết code tại đây'){
  if(!this._contestDrafts)this._contestDrafts={};
  this._contestDrafts[this.currentProbIdx]=curCode.substring(0,15000)}
// Flush all cached drafts to Firebase
const drafts=this._contestDrafts||{};
Object.keys(drafts).forEach(pi=>{const draft=drafts[pi];
  if(draft&&draft.trim()&&draft.trim()!=='# Viết code tại đây'){
    this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/draftCode/${pi}`).set(draft).catch(()=>{})}});
const indicator=document.getElementById('auto-save-indicator');
if(indicator){indicator.textContent='💾 Đã lưu '+new Date().toLocaleTimeString('vi',{hour:'2-digit',minute:'2-digit'});indicator.classList.add('saved');setTimeout(()=>indicator.classList.remove('saved'),2000)}}},30000)}

// BUG-6 FIX: Only bind change listener once, use _suppressAutoSave flag (BUG-4)
_initStudentEditor(){if(!this.cmStudent){const cfg={mode:'python',lineNumbers:true,indentUnit:4,tabSize:4,matchBrackets:true,autoCloseBrackets:true,styleActiveLine:true,extraKeys:{'Tab':cm=>cm.execCommand('indentMore'),'Shift-Tab':cm=>cm.execCommand('indentLess')}};this.cmStudent=CodeMirror(document.getElementById('stu-editor-wrap'),{...cfg,value:'# Viết code tại đây\n'});
// Bind change listener ONCE at creation time
this.cmStudent.on('change',()=>{if(this._suppressAutoSave)return;
if(this._currentExercise){const code=this.cmStudent.getValue();if(code.trim()&&code.trim()!=='# Viết code tại đây'){localStorage.setItem('themis_draft_'+this._currentExercise.id,code)}}
// Also auto-save to Firebase for contests on every change (debounced)
if(this.roomCode&&!this._currentExercise&&this.studentName){
if(this._contestSaveDebounce)clearTimeout(this._contestSaveDebounce);
this._contestSaveDebounce=setTimeout(()=>{const code=this.cmStudent.getValue();
if(code.trim()&&code.trim()!=='# Viết code tại đây'){
this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/draftCode/${this.currentProbIdx}`).set(code.substring(0,15000)).catch(()=>{})}},5000)}})
}else{this._suppressAutoSave=true;this.cmStudent.setValue('# Viết code tại đây\n');this._suppressAutoSave=false}setTimeout(()=>this.cmStudent.refresh(),100);
// F04: Auto-save code to localStorage every 30s (exercises only)
if(this._autoSaveInterval)clearInterval(this._autoSaveInterval);
this._autoSaveInterval=setInterval(()=>{if(this._suppressAutoSave)return;if(this.cmStudent&&this._currentExercise){const code=this.cmStudent.getValue();if(code.trim()&&code.trim()!=='# Viết code tại đây'){localStorage.setItem('themis_draft_'+this._currentExercise.id,code)}}},30000)}

_renderProblemTabs(){const c=document.getElementById('stu-problem-tabs');c.innerHTML='';this.problems.forEach((p,i)=>{const btn=document.createElement('button');btn.className='oj-ptab-btn'+(i===0?' active':'');btn.textContent=`Bài ${i+1}`;btn.onclick=()=>{c.querySelectorAll('.oj-ptab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');this._showProblem(i)};c.appendChild(btn)})}

_showProblem(idx){
// BUG-C05 FIX: Save current code before switching problem in contest mode
if(this.cmStudent&&this.roomCode&&!this._currentExercise){
const curCode=this.cmStudent.getValue();
if(curCode.trim()&&curCode.trim()!=='# Viết code tại đây'){
if(!this._contestDrafts)this._contestDrafts={};
this._contestDrafts[this.currentProbIdx]=curCode.substring(0,15000)}}
this.currentProbIdx=idx;const p=this.problems[idx];if(!p)return;
// BUG-M08 FIX: Restore cached draft for the selected problem
if(this.cmStudent&&this.roomCode&&!this._currentExercise){
const cached=this._contestDrafts&&this._contestDrafts[idx];
this._suppressAutoSave=true;
this.cmStudent.setValue(cached||'# Viết code tại đây\n');
this._suppressAutoSave=false}
document.getElementById('stu-problem-title').textContent=`Bài ${idx+1}: ${p.title}`;
const isContest=!!this.roomCode&&!this._currentExercise;
const testInfo=p.testCases?p.testCases.length:(p._testCount||'?');
document.getElementById('stu-problem-meta').innerHTML=`${p.fileIO?'📁 File I/O: <strong>'+p.taskName+'.INP/.OUT</strong>':'⌨️ stdin/stdout'} &nbsp;•&nbsp; ${p.subtasks?.length||1} subtask${isContest?' &nbsp;•&nbsp; 🔒 Test ẩn':' &nbsp;•&nbsp; '+testInfo+' test'}`;document.getElementById('stu-problem-desc').textContent=p.description||'Không có mô tả';
const sio=document.getElementById('stu-sample-io');
const samples=p.sampleIO&&p.sampleIO.length?p.sampleIO:(p.testCases&&p.testCases.length?[{input:p.testCases[0].input,output:p.testCases[0].output}]:[]);
if(samples.length>0){let h='';samples.forEach((s,i)=>{const label=samples.length>1?` ${i+1}`:'';const explainHtml=s.explanation?`<div class="sample-io-display-explain">💡 Giải thích: ${this._esc(s.explanation)}</div>`:'';const inpEnc=encodeURIComponent(s.input);const outEnc=encodeURIComponent(s.output);h+=`<div class="sample-io-display"><div class="sample-io-display-header">📝 Ví dụ${label}</div><div class="sample-io-display-grid"><div class="sample-box"><div class="sample-box-title">INPUT <button class="btn-copy-io" onclick="window._uic._copyText(decodeURIComponent('${inpEnc}'))" title="Copy input">📋</button></div><pre>${this._esc(s.input)}</pre></div><div class="sample-box"><div class="sample-box-title">OUTPUT <button class="btn-copy-io" onclick="window._uic._copyText(decodeURIComponent('${outEnc}'))" title="Copy output">📋</button></div><pre>${this._esc(s.output)}</pre></div></div>${explainHtml}</div>`});sio.innerHTML=h}else{sio.innerHTML=''}
document.getElementById('stu-results-card').classList.add('hidden');document.getElementById('no-results-msg').style.display='block';
// Switch to desc tab
document.querySelectorAll('.oj-ptab').forEach(b=>b.classList.remove('active'));document.querySelector('.oj-ptab[data-ptab="desc"]').classList.add('active');document.querySelectorAll('.oj-ptab-content').forEach(p=>p.classList.remove('active'));document.getElementById('ptab-desc').classList.add('active')}

// === RUN/TEST CODE (no grading) ===
_fillSampleInput(){
const p=this.problems[this.currentProbIdx];if(!p)return;
const samples=p.sampleIO&&p.sampleIO.length?p.sampleIO:(p.testCases&&p.testCases.length?[{input:p.testCases[0].input,output:p.testCases[0].output}]:[]);
if(samples.length>0){document.getElementById('oj-custom-input').value=samples[0].input;this._toast('📋 Đã điền input từ ví dụ','info')}
else{this._toast('Không có ví dụ input','error')}}

async _stuRun(){
if(!this.cmStudent)return;
if(this._isRunning)return;// BUG-06 FIX: Prevent concurrent runs
const code=this.cmStudent.getValue().trim();
if(!code){this._toast('Viết code trước','error');return}
const p=this.problems[this.currentProbIdx];
// BUG-02 FIX: Switch to input tab AND auto-fill, but DON'T return — continue to run
const activeCtab=document.querySelector('.oj-ctab.active');
if(!activeCtab||activeCtab.dataset.ctab!=='testinput'){
document.querySelectorAll('.oj-ctab').forEach(b=>b.classList.remove('active'));
const inputTab=document.querySelector('.oj-ctab[data-ctab="testinput"]');if(inputTab)inputTab.classList.add('active');
document.querySelectorAll('.oj-ctab-content').forEach(p2=>p2.classList.remove('active'));
const inputPanel=document.getElementById('ctab-testinput');if(inputPanel)inputPanel.classList.add('active');
const inp=document.getElementById('oj-custom-input');
if(!inp.value.trim())this._fillSampleInput();
// BUG-02 FIX: Don't return! Fall through to actually run the code
}
const customInput=document.getElementById('oj-custom-input').value;
const statusEl=document.getElementById('stu-submit-status');
const consoleOut=document.getElementById('oj-console-output');
const testOutput=document.getElementById('oj-test-output');
const runBtn=document.getElementById('btn-stu-run');
this._isRunning=true;statusEl.textContent='🧪 Đang chạy...';runBtn.disabled=true;runBtn.classList.add('running');
// BUG-06 FIX: Disable submit button during run to prevent Pyodide conflict
const submitBtn2=document.getElementById('btn-stu-submit');if(submitBtn2)submitBtn2.disabled=true;
if(testOutput)testOutput.innerHTML='<span style="color:var(--accent)">🔄 Đang khởi tạo...</span>';
consoleOut.innerHTML='<span style="color:var(--accent)">🔄 Đang khởi tạo Pyodide...</span>';
try{
await this.pyEngine.init();
consoleOut.innerHTML='<span style="color:var(--accent)">⚡ Đang thực thi code...</span>';
let output='',isFileIO=p&&p.fileIO;
const taskName=p?p.taskName:'BAITAP';const uppercase=p?p.uppercase:true;
const inpF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.INP':'.inp');
const outF=(uppercase?taskName.toUpperCase():taskName.toLowerCase())+(uppercase?'.OUT':'.out');
const t0=performance.now();
if(isFileIO){output=await this.pyEngine.runFileIO(code,customInput,inpF,outF)}
else{output=await this.pyEngine.runStdio(code,customInput)}
const elapsed=Math.round(performance.now()-t0);
// Success — show output
let html='<div style="margin-bottom:8px"><strong style="color:var(--success);font-size:1.05rem">✅ Chạy thành công!</strong>';
html+=` <span style="font-size:.78rem;color:var(--text-muted)">(${elapsed}ms)</span></div>`;
if(isFileIO){html+=`<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:4px">📁 File I/O: ${inpF} → ${outF}</div>`}
html+='<div style="font-size:.78rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px">📥 Input:</div>';
html+=`<pre style="background:rgba(255,255,255,.03);padding:8px;border-radius:4px;font-size:.8rem;margin-bottom:8px;max-height:80px;overflow-y:auto;border:1px solid var(--border)">${this._esc(customInput||'(không có)')}</pre>`;
html+='<div style="font-size:.78rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px">📤 Output:</div>';
html+=`<pre style="background:rgba(16,185,129,.05);padding:8px;border-radius:4px;font-size:.8rem;max-height:150px;overflow-y:auto;border:1px solid rgba(16,185,129,.2);color:var(--success)">${this._esc(output||'(không có output)')}</pre>`;
// Compare with expected output if available
const samples=p&&p.sampleIO&&p.sampleIO.length?p.sampleIO:(p&&p.testCases&&p.testCases.length?[{input:p.testCases[0].input,output:p.testCases[0].output}]:[]);
const matchingSample=samples.find(s=>s.input.trim()===customInput.trim());
if(matchingSample){const expected=matchingSample.output.trim();const actual=output.trim();
if(actual===expected){html+='<div style="margin-top:8px;padding:8px;background:rgba(16,185,129,.08);border-radius:4px;font-weight:600;color:var(--success)">✅ Kết quả ĐÚNG so với ví dụ!</div>'}
else{html+='<div style="margin-top:8px;padding:8px;background:rgba(239,68,68,.08);border-radius:4px">';
html+='<div style="font-weight:600;color:var(--error);margin-bottom:4px">❌ Kết quả KHÁC so với ví dụ:</div>';
html+=`<div style="font-size:.78rem"><span style="color:var(--text-muted)">Mong đợi:</span> <code style="color:var(--success)">${this._esc(expected)}</code></div>`;
html+=`<div style="font-size:.78rem"><span style="color:var(--text-muted)">Nhận được:</span> <code style="color:var(--error)">${this._esc(actual)}</code></div></div>`}}
consoleOut.innerHTML=html;if(testOutput)testOutput.innerHTML=html;statusEl.textContent='✅ Chạy xong'
}catch(e){
const errMsg=e.message;
let html='<div style="margin-bottom:8px"><strong style="color:var(--error);font-size:1.05rem">💥 Lỗi khi chạy code</strong></div>';
// Parse Python error for better display
if(errMsg.includes('Python:')){const pyErr=errMsg.replace('Python: ','');
// Try to extract line number
const lineMatch=pyErr.match(/line\s+(\d+)/i);
const errTypeMatch=pyErr.match(/(SyntaxError|NameError|TypeError|ValueError|IndexError|ZeroDivisionError|IndentationError|TabError|KeyError|AttributeError|ImportError|FileNotFoundError|RuntimeError|OverflowError|RecursionError|EOFError)[:\s]/);
if(errTypeMatch){
const errType=errTypeMatch[1];
const errDescriptions={'SyntaxError':'Lỗi cú pháp — sai cấu trúc code','NameError':'Biến/hàm chưa được khai báo','TypeError':'Sai kiểu dữ liệu','ValueError':'Giá trị không hợp lệ (ví dụ: int("abc"))','IndexError':'Truy cập phần tử ngoài phạm vi mảng/list','ZeroDivisionError':'Chia cho 0','IndentationError':'Thụt lề sai — kiểm tra khoảng trắng đầu dòng','TabError':'Trộn Tab và Space — dùng 1 loại thôi','KeyError':'Key không tồn tại trong dictionary','AttributeError':'Phương thức/thuộc tính không tồn tại','ImportError':'Module không tồn tại','RecursionError':'Đệ quy quá sâu — kiểm tra điều kiện dừng','EOFError':'Hết dữ liệu input — kiểm tra số lần gọi input()'};
html+=`<div style="padding:8px 12px;background:rgba(239,68,68,.06);border-left:3px solid var(--error);border-radius:0 4px 4px 0;margin-bottom:8px">`;
html+=`<div style="font-weight:700;color:var(--error);font-size:.9rem">${errType}</div>`;
html+=`<div style="font-size:.78rem;color:var(--text-secondary);margin-top:2px">${errDescriptions[errType]||''}</div>`;
if(lineMatch)html+=`<div style="font-size:.78rem;color:var(--warning,#f59e0b);margin-top:4px">📍 Dòng ${lineMatch[1]} trong code của bạn</div>`;
html+=`</div>`}
html+=`<pre style="background:rgba(239,68,68,.08);padding:10px;border-radius:4px;font-size:.78rem;color:#f87171;white-space:pre-wrap;max-height:200px;overflow-y:auto">${this._esc(pyErr)}</pre>`;
html+='<div style="color:var(--text-muted);font-size:.75rem;margin-top:8px">💡 <strong>Mẹo:</strong> Đọc kỹ dòng cuối của lỗi để biết nguyên nhân.</div>'}
else if(errMsg.includes('TLE')){
html+='<div style="padding:8px;background:rgba(245,158,11,.08);border-radius:4px;color:#f59e0b"><strong>⏰ Quá thời gian (TLE)</strong><br><span style="font-size:.78rem">Code chạy quá lâu. Kiểm tra vòng lặp vô hạn hoặc tối ưu thuật toán.</span></div>'}
else{html+=`<div style="color:var(--error)">${this._esc(errMsg)}</div>`}
consoleOut.innerHTML=html;if(testOutput)testOutput.innerHTML=html;statusEl.textContent='❌ Có lỗi'
}finally{runBtn.disabled=false;runBtn.classList.remove('running');this._isRunning=false;
// BUG-06 FIX: Re-enable submit button
const _sb=document.getElementById('btn-stu-submit');if(_sb)_sb.disabled=false}}

async _stuSubmit(){if(!this.cmStudent)return;
// BUG-01 FIX: Global guard against double submit
if(this._isSubmitting){this._toast('⏳ Đang xử lý...','info');return}this._isSubmitting=true;
if(this._isRunning){this._toast('⏳ Đang chạy code, vui lòng chờ...','info');this._isSubmitting=false;return}
const code=this.cmStudent.getValue().trim();if(!code){this._toast('Viết code trước','error');this._isSubmitting=false;return}
const isContest=!!this.roomCode&&!this._currentExercise;
const p=this.problems[this.currentProbIdx];if(!p){this._toast('Không có đề','error');return}
const statusEl=document.getElementById('stu-submit-status');const consoleOut=document.getElementById('oj-console-output');

// === CONTEST MODE: chỉ lưu code, KHÔNG chấm ===
if(isContest){
document.getElementById('btn-stu-submit').disabled=true;
statusEl.innerHTML='<span class="progress-spinner"></span> Đang nộp...';
try{
// Track submissions
if(!this._contestSubmissions)this._contestSubmissions={};
if(!this._contestSubmissions[this.currentProbIdx])this._contestSubmissions[this.currentProbIdx]=0;
this._contestSubmissions[this.currentProbIdx]++;
const subCount=this._contestSubmissions[this.currentProbIdx];
// Save code to Firebase (NO grading)
await this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/submissions/${this.currentProbIdx}/${Date.now()}`).set({code:code.substring(0,15000),submittedAt:Date.now(),attempt:subCount});
// Also save as finalCode (latest submission)
await this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/finalCode/${this.currentProbIdx}`).set(code.substring(0,15000));
statusEl.textContent=`✅ Đã nộp! (Lần ${subCount})`;
consoleOut.innerHTML=`<div style="padding:16px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">✅</div><div style="font-weight:600;font-size:1rem;margin-bottom:4px">Đã nộp bài thành công!</div><div style="color:var(--text-muted);font-size:.82rem">Lần nộp: ${subCount} • Bạn có thể nộp lại bất kỳ lúc nào trước khi hết giờ.</div><div style="color:var(--text-muted);font-size:.78rem;margin-top:8px">⚠️ Bài sẽ được GV chấm sau khi kết thúc cuộc thi.</div></div>`;
this._toast(`📝 Bài ${this.currentProbIdx+1}: Đã nộp (lần ${subCount})`,'success');
}catch(e){statusEl.textContent='⚠️ Lỗi nộp!';this._toast('Lỗi nộp bài: '+e.message,'error')}
finally{document.getElementById('btn-stu-submit').disabled=false}
return}

// === EXERCISE MODE: chấm ngay ===
// BUG-C01 FIX: Validate _currentExercise exists before grading
if(!this._currentExercise){this._toast('⚠️ Không xác định bài tập. Quay lại dashboard.','error');return}
// Auto-switch to console tab to show grading progress
document.querySelectorAll('.oj-ctab').forEach(b=>b.classList.remove('active'));const cTab=document.querySelector('.oj-ctab[data-ctab="console"]');if(cTab)cTab.classList.add('active');document.querySelectorAll('.oj-ctab-content').forEach(p2=>p2.classList.remove('active'));const cPanel=document.getElementById('ctab-console');if(cPanel)cPanel.classList.add('active');
statusEl.innerHTML='⏳ Đang chấm...';consoleOut.innerHTML='<span style="color:var(--text-muted)">🔄 Đang khởi tạo Pyodide...</span>';document.getElementById('btn-stu-submit').disabled=true;
// Disable back button during grading to prevent premature exit
const backBtn=document.getElementById('btn-stu-back-dash');if(backBtn)backBtn.disabled=true;
try{const result=await this.grader.grade(code,p.testCases,p.subtasks||[],p.fileIO,p.taskName,p.uppercase,p.timePerTest||5,(c,t)=>{statusEl.textContent=`Test ${c}/${t}`;consoleOut.innerHTML=`<span style="color:var(--accent)">⚡ Đang chấm test ${c}/${t}...</span>`});
const ac=result.details.filter(d=>d.verdict==='AC').length;const wa=result.details.filter(d=>d.verdict==='WA').length;const re=result.details.filter(d=>d.verdict==='RE').length;const tle=result.details.filter(d=>d.verdict==='TLE').length;const total=result.details.length;
let con=`<div style="margin-bottom:6px"><strong style="color:${result.score>=100?'var(--success)':result.score>=50?'var(--warning,#f59e0b)':'var(--error)'};font-size:1.1rem">${result.score}/100 điểm</strong></div>`;
con+=`<div style="display:flex;gap:12px;margin-bottom:8px;font-size:.82rem">`;
con+=`<span style="color:var(--success)">✅ AC: ${ac}/${total}</span>`;
if(wa>0)con+=`<span style="color:var(--error)">❌ WA: ${wa}</span>`;if(re>0)con+=`<span style="color:#f43f5e">💥 RE: ${re}</span>`;if(tle>0)con+=`<span style="color:#f59e0b">⏰ TLE: ${tle}</span>`;
con+=`</div>`;
const failures=result.details.filter(d=>d.verdict!=='AC').slice(0,3);
if(failures.length>0){con+=`<div style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px;font-size:.78rem">`;
con+=`<div style="color:var(--text-muted);margin-bottom:4px">⚠️ Chi tiết lỗi (${Math.min(3,result.details.filter(d=>d.verdict!=='AC').length)} test đầu):</div>`;
failures.forEach(f=>{const testNum=f.testIdx+1;
con+=`<div style="margin:2px 0;padding:3px 6px;background:rgba(255,255,255,.03);border-radius:3px">`;
con+=`Test ${testNum} — <span class="verdict ${f.verdict}" style="font-weight:700">${f.verdict}</span>`;
if(f.verdict==='RE')con+=` <span style="color:#f43f5e">Lỗi runtime</span>`;if(f.verdict==='WA')con+=` <span style="color:var(--error)">Sai kết quả</span>`;if(f.verdict==='TLE')con+=` <span style="color:#f59e0b">Quá thời gian (${f.time}ms)</span>`;
con+=`</div>`});con+=`</div>`}
// 💡 Add smart error hints
con=this._renderSmartHints(result,con);
consoleOut.innerHTML=con;this._showStudentResults(result,p);
// BUG-C03 FIX: Snapshot exRef before async to prevent race condition
const exRef=this._currentExercise;
const snapExId=exRef?.id;
const snapTitle=exRef?.title;
const trimmedResult={score:result.score,details:result.details,code:(result.code||'').substring(0,10000)};
if(snapExId){try{const submitRes=await this.fb.submitExerciseResult(snapExId,this.studentName,trimmedResult);localStorage.removeItem('themis_draft_'+snapExId);this.drive.logData('Submissions',[snapExId+'_'+this.studentName+'_'+Date.now(),this.studentName,snapExId,snapTitle,result.score,new Date().toISOString(),result.score>=100?'PERFECT':result.score>0?'PARTIAL':'ZERO']).catch(()=>{});
// BUG-RT02 FIX: Show clear best-score info when current < best
if(submitRes&&submitRes.kept){statusEl.textContent=`✅ Đã nộp (giữ điểm cao nhất: ${submitRes.bestScore})`;this._toast(`📚 ${snapTitle}: ${result.score} điểm lần này • Điểm tốt nhất: ${submitRes.bestScore} (được giữ lại)`,'info');
// Show banner on results card
const banner=document.getElementById('stu-best-score-banner');if(banner){banner.textContent=`⭐ Điểm lần này: ${result.score}/100 — Điểm tốt nhất: ${submitRes.bestScore}/100 (được giữ)`;banner.classList.remove('hidden')}}
else{statusEl.textContent='✅ Đã nộp!';this._toast(`📚 ${snapTitle}: ${result.score} điểm`,'success');
const banner=document.getElementById('stu-best-score-banner');if(banner)banner.classList.add('hidden')}}catch(e){statusEl.textContent='⚠️ Lỗi lưu!';this._toast('⚠️ Lỗi lưu: '+e.message,'error')}}
else{statusEl.textContent='⚠️ Không xác định bài!';this._toast('⚠️ Không tìm thấy thông tin bài tập.','error')}}catch(e){
statusEl.textContent='';const errMsg=e.message;
let con='<div style="color:var(--error);font-weight:600;margin-bottom:6px">💥 Lỗi khi chạy code</div>';
if(errMsg.includes('Python:')){const pyErr=errMsg.replace('Python: ','');
con+=`<pre style="background:rgba(239,68,68,.08);padding:8px;border-radius:4px;font-size:.78rem;color:#f87171;white-space:pre-wrap;max-height:200px;overflow-y:auto">${this._esc(pyErr)}</pre>`;
con+=`<div style="color:var(--text-muted);font-size:.75rem;margin-top:6px">💡 Kiểm tra lại cú pháp, biến, và logic.</div>`}else{con+=`<div style="color:var(--error)">${this._esc(errMsg)}</div>`}
consoleOut.innerHTML=con;this._toast('Lỗi: '+errMsg.substring(0,60),'error')}finally{document.getElementById('btn-stu-submit').disabled=false;const _backBtn=document.getElementById('btn-stu-back-dash');if(_backBtn)_backBtn.disabled=false;this._isSubmitting=false}}

_showStudentResults(result,problem){const card=document.getElementById('stu-results-card');card.classList.remove('hidden');document.getElementById('no-results-msg').style.display='none';const scoreEl=document.getElementById('stu-score');scoreEl.textContent=result.score;scoreEl.className='oj-score-value'+(result.score===100?' perfect':'');
const sumEl=document.getElementById('stu-subtask-summary');let sumH='';for(const st of (problem.subtasks||[])){const stTests=(result.details||[]).filter(d=>d.subtaskId===st.id);const ac=stTests.filter(d=>d.verdict==='AC').length;const total=stTests.length;const allAC=total>0&&ac===total;const pts=allAC?st.percent:0;sumH+=`<div class="subtask-summary-row ${allAC?'pass':'fail'}"><span class="st-sum-name">${st.name}</span><div class="st-sum-bar"><div class="st-sum-bar-fill ${allAC?'full':ac>0?'partial':'zero'}" style="width:${total?ac/total*100:0}%"></div></div><span style="font-size:.78rem;color:var(--text-muted)">${ac}/${total} AC</span><span class="st-sum-score">${pts}đ</span></div>`}sumEl.innerHTML=sumH;
const tbody=document.getElementById('stu-results-tbody');if(result.details){tbody.innerHTML=result.details.map((d,i)=>`<tr><td style="text-align:center">${String(i+1).padStart(2,'0')}</td><td>ST${d.subtaskId}</td><td><span class="verdict ${d.verdict}">${d.verdict}</span></td><td style="font-family:var(--font-mono);font-size:.78rem">${d.time}ms</td></tr>`).join('')}
// Auto-switch to results tab in console section
document.querySelectorAll('.oj-ctab').forEach(b=>b.classList.remove('active'));const resultsTab=document.querySelector('.oj-ctab[data-ctab="results"]');if(resultsTab)resultsTab.classList.add('active');document.querySelectorAll('.oj-ctab-content').forEach(p=>p.classList.remove('active'));const resultsPanel=document.getElementById('ctab-results');if(resultsPanel)resultsPanel.classList.add('active')}

// ===== LEADERBOARD =====
_renderLeaderboard(lb,containerId,selfName,pCountOverride){const c=document.getElementById(containerId);if(!lb||!Object.keys(lb).length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có dữ liệu</p>';return}const sorted=Object.values(lb).sort((a,b)=>b.totalScore-a.totalScore||(a.lastSubmit-b.lastSubmit));// BUG-10 FIX: Use pCountOverride if provided to avoid stale state
const pCount=pCountOverride||this.problems?.length||this.publishedCount||1;let h='<table class="lb-table"><thead><tr><th>Hạng</th><th>Họ tên</th><th>Tổng</th>';for(let i=0;i<pCount;i++)h+=`<th>Bài ${i+1}</th>`;h+='</tr></thead><tbody>';sorted.forEach((s,i)=>{const rank=i+1;const rankCls=rank<=3?`lb-rank-${rank}`:'';const isSelf=s.name===selfName;const medals=['','🥇','🥈','🥉'];h+=`<tr class="${isSelf?'self':''} lb-flash"><td class="lb-rank ${rankCls}">${medals[rank]||rank}</td><td class="lb-name">${this._esc(s.name)}</td><td class="lb-score">${s.totalScore}</td>`;for(let j=0;j<pCount;j++){const ps=s.problems&&s.problems[j]||0;const cls=ps>=100?'full':ps>0?'partial':'zero';h+=`<td><span class="lb-prob-score ${cls}">${ps}</span></td>`}h+='</tr>'});h+='</tbody></table>';c.innerHTML=h}

// ===== CONTEST ENDED READONLY (HS xem code đã nộp) =====
async _showContestEndedReadonly(){if(!this.roomCode||!this.studentName)return;
// Make editor readonly
if(this.cmStudent)this.cmStudent.setOption('readOnly',true);
document.getElementById('btn-stu-submit').disabled=true;
document.getElementById('btn-stu-submit').textContent='🔒 Hết giờ';
// Load submitted code for current problem
try{
const snap=await this.fb.db.ref(`rooms/${this.roomCode}/students/${this.studentName}/finalCode`).once('value');
const finalCodes=snap.val()||{};
if(finalCodes[this.currentProbIdx]&&this.cmStudent){this.cmStudent.setValue(finalCodes[this.currentProbIdx])}
const consoleOut=document.getElementById('oj-console-output');
consoleOut.innerHTML=`<div style="padding:16px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">⏰</div><div style="font-weight:600;font-size:1rem;margin-bottom:4px">Đã hết thời gian!</div><div style="color:var(--text-muted);font-size:.82rem">Code bên trên là bài bạn đã nộp (chỉ xem, không sửa được).</div><div style="color:var(--text-muted);font-size:.78rem;margin-top:8px">⏳ Chờ GV chấm bài và công bố kết quả...</div></div>`;
}catch(e){console.error('Load final code failed:',e)}}

// ===== PHASE 2: GV CHẤM BÀI HÀNG LOẠT =====
async _gradeAllStudents(targetRoomCode){
const rc=targetRoomCode||this.roomCode||this._viewingRoomCode;
if(!rc){this._toast('Không có phòng thi','error');return}
// BUG-M01 FIX: Verify contest has ended before grading
const infoCheck=await this.fb.db.ref(`rooms/${rc}/info/status`).once('value');
if(infoCheck.val()==='active'){this._toast('⚠️ Cuộc thi đang diễn ra! Kết thúc trước khi chấm.','error');return}
const ok=await this._confirmDialog('🔬 Chấm bài','Hệ thống sẽ chạy code của TẤT CẢ học sinh với test cases. Quá trình này có thể mất vài phút.','Bắt đầu chấm','btn-accent');
if(!ok)return;
const gradeBtn=document.getElementById('btn-grade-all');if(gradeBtn)gradeBtn.disabled=true;
const progressEl=document.getElementById('grade-progress');if(progressEl)progressEl.classList.remove('hidden');
const statusEl=document.getElementById('grade-status');
try{
const probSnap=await this.fb.db.ref(`rooms/${rc}/problems`).once('value');
const problems=probSnap.val()||[];const probArr=Array.isArray(problems)?problems:Object.values(problems);
const stuSnap=await this.fb.db.ref(`rooms/${rc}/students`).once('value');
const students=stuSnap.val()||{};
const stuNames=Object.keys(students).filter(n=>students[n].finalCode);
if(!stuNames.length){this._toast('Không có HS nào đã nộp bài','error');if(gradeBtn)gradeBtn.disabled=false;if(progressEl)progressEl.classList.add('hidden');return}
await this.pyEngine.init();
const totalJobs=stuNames.length*probArr.length;let done=0;
const allResults={};
for(const name of stuNames){allResults[name]={};
const codes=students[name].finalCode||{};
for(let pi=0;pi<probArr.length;pi++){
const p=probArr[pi];const code=codes[pi];
done++;if(statusEl)statusEl.textContent=`Đang chấm: ${name} — Bài ${pi+1} (${done}/${totalJobs})`;
if(document.getElementById('grade-bar'))document.getElementById('grade-bar').style.width=(done/totalJobs*100)+'%';
if(!code){allResults[name][pi]={score:0,details:[],note:'Chưa nộp'};continue}
try{
const result=await this.grader.grade(code,p.testCases||[],p.subtasks||[],p.fileIO,p.taskName,p.uppercase,p.timePerTest||5);
// Scale score by maxScore: raw score is 0-100, scale to 0-maxScore
const maxScore=p.maxScore||100;
const scaledScore=Math.round(result.score*maxScore/100*100)/100;
allResults[name][pi]={score:scaledScore,rawScore:result.score,maxScore,details:result.details,code};
await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}/${pi}`).set({score:scaledScore,rawScore:result.score,maxScore,details:result.details,gradedAt:Date.now()});
}catch(e){const maxScore=p.maxScore||100;allResults[name][pi]={score:0,rawScore:0,maxScore,details:[],error:e.message,code};
await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}/${pi}`).set({score:0,rawScore:0,maxScore,details:[],error:e.message,gradedAt:Date.now()});}}}
await this.fb.db.ref(`rooms/${rc}/info/gradeStatus`).set('graded');
if(progressEl)progressEl.classList.add('hidden');
if(gradeBtn){gradeBtn.disabled=false;gradeBtn.textContent='✅ Đã chấm xong'}
this._gradeResults=allResults;this._gradeProblems=probArr;
this._renderGradeResults(allResults,probArr,stuNames);
this._toast('🎉 Chấm xong tất cả!','success');
if(this._viewingRoomCode===rc)setTimeout(()=>this._viewRoomHistory(rc),500);
}catch(e){if(progressEl)progressEl.classList.add('hidden');if(gradeBtn)gradeBtn.disabled=false;this._toast('Lỗi chấm: '+e.message,'error')}}

// === Contest Problem Subtask Editing ===

_contestStCounters={};

_initContestStEditor(pi, subtasks, totalTests){
// Populate the hidden subtask editor for problem pi
this._contestStCounters[pi]=0;
const list=document.getElementById(`contest-st-list-${pi}`);if(!list)return;
list.innerHTML='';
(subtasks.length?subtasks:[{id:1,name:'Subtask 1',percent:100}]).forEach(st=>{
const testCount=Math.round(totalTests*(st.percent||0)/100);
this._addContestSubtaskRow(pi,st.id||1,st.name,st.percent||0,testCount)});
this._updateContestStTotal(pi)}

_toggleContestStEditor(pi, subtasksJson, roomCode){
const ed=document.getElementById(`contest-st-editor-${pi}`);if(!ed)return;
const isHidden=ed.style.display==='none'||!ed.style.display;
ed.style.display=isHidden?'block':'none'}

_addContestSubtask(pi){
if(!this._contestStCounters)this._contestStCounters={};
this._addContestSubtaskRow(pi,Date.now(),'Subtask mới',0,0);
this._updateContestStTotal(pi)}

_addContestSubtaskRow(pi,id,name,pct,testCount){
if(!this._contestStCounters)this._contestStCounters={};
this._contestStCounters[pi]=(this._contestStCounters[pi]||0)+1;
const cnt=this._contestStCounters[pi];
const list=document.getElementById(`contest-st-list-${pi}`);if(!list)return;
const row=document.createElement('div');row.className='view-st-row';row.dataset.stId=id;
row.innerHTML=`<span style="font-size:.7rem;color:var(--text-muted);min-width:28px">ST${cnt}</span><input type="text" class="view-st-name" value="${this._esc(name||('Subtask '+cnt))}"><input type="number" class="view-st-pct" value="${pct||0}" min="0" max="100" step="5"><span style="font-size:.72rem;color:var(--text-muted)">%</span><span class="view-st-count" style="min-width:44px">${testCount} test</span><button class="btn-danger-sm" title="Xóa">✕</button>`;
row.querySelector('.view-st-pct').oninput=()=>this._updateContestStTotal(pi);
row.querySelector('.btn-danger-sm').onclick=()=>{if(list.querySelectorAll('.view-st-row').length<=1){this._toast('Cần ít nhất 1 subtask','error');return}row.remove();this._updateContestStTotal(pi)};
list.appendChild(row)}

_updateContestStTotal(pi){
const rows=document.querySelectorAll(`#contest-st-list-${pi} .view-st-row`);
let sum=0;rows.forEach(r=>sum+=parseInt(r.querySelector('.view-st-pct').value)||0);
const badge=document.getElementById(`contest-st-total-${pi}`);
if(badge){badge.textContent='Tổng: '+sum+'%';badge.style.color=sum===100?'#10b981':'#f87171'}}

async _saveContestSubtasks(roomCode, pi){
const rows=document.querySelectorAll(`#contest-st-list-${pi} .view-st-row`);
const newSt=[...rows].map((r,i)=>({id:parseInt(r.dataset.stId)||i+1,name:r.querySelector('.view-st-name').value.trim()||('Subtask '+(i+1)),percent:parseInt(r.querySelector('.view-st-pct').value)||0}));
const total=newSt.reduce((s,st)=>s+st.percent,0);
if(total!==100){this._toast('Tổng % subtask phải = 100%','error');return}
const ok=await this._confirmDialog('💾 Lưu & Chấm lại',`Sửa subtask bài ${pi+1} và chấm lại TẤT CẢ học sinh?`,'Lưu & Chấm lại','btn-accent');
if(!ok)return;
try{
// Save new subtasks to room problems
await this.fb.db.ref(`rooms/${roomCode}/problems/${pi}/subtasks`).set(newSt);
this._toast('✅ Đã lưu subtask. Bắt đầu chấm lại...','success');
// Hide editor
const ed=document.getElementById(`contest-st-editor-${pi}`);if(ed)ed.style.display='none';
// Re-grade all students (uses updated subtasks from Firebase)
await this._gradeAllStudents(roomCode);
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// Room-specific grading wrappers
async _gradeRoomHistory(code){await this._gradeAllStudents(code)}
async _publishRoomHistory(code){await this._publishResults(code)}
async _aiAnalyzeRoom(code){const oldRc=this.roomCode;this.roomCode=code;await this._aiAnalyzeAll();this.roomCode=oldRc;if(this._viewingRoomCode===code)setTimeout(()=>this._viewRoomHistory(code),500)}

_renderGradeResults(results,problems,stuNames,containerId){
const container=document.getElementById(containerId||'grade-results');if(!container)return;container.classList.remove('hidden');
const totalMaxScore=problems.reduce((s,p)=>s+(p?.maxScore||100),0);
let h='<h3 style="font-size:.95rem;font-weight:700;margin-bottom:12px">📊 Kết Quả Chấm <span style="font-weight:400;color:var(--text-muted);font-size:.82rem">(Tổng tối đa: '+totalMaxScore+'đ)</span></h3>';
h+='<table class="lb-table"><thead><tr><th>#</th><th>Họ tên</th>';
problems.forEach((p,i)=>{const ms=p?.maxScore||100;h+=`<th>Bài ${i+1}<br><span style="font-size:.68rem;font-weight:400;color:var(--text-muted)">${ms}đ</span></th>`});
h+='<th>Tổng</th><th>Chi tiết</th></tr></thead><tbody>';
const rows=stuNames.map(name=>{let total=0;const scores=[];
problems.forEach((_,pi)=>{const r=results[name]?.[pi];const s=r?.score||0;total+=s;scores.push(s)});
return{name,total,scores}}).sort((a,b)=>b.total-a.total);
rows.forEach((r,idx)=>{
h+=`<tr><td>${idx+1}</td><td style="font-weight:600">${this._esc(r.name)}</td>`;
r.scores.forEach((s,si)=>{const ms=problems[si]?.maxScore||100;const cls=s>=ms?'full':s>0?'partial':'zero';h+=`<td><span class="lb-prob-score ${cls}">${s}</span></td>`});
h+=`<td class="lb-score">${r.total}</td>`;
h+=`<td><button class="btn btn-sm btn-ghost" onclick="window._uic._viewStudentSubmissions('${this._esc(r.name)}')">👁️</button></td>`;
h+='</tr>'});
h+='</tbody></table>';
container.innerHTML=h}

// ===== AI ANALYSIS (optional) =====

// Shared prompt builder for AI student code review
_buildAIReviewPrompt(problem, code, score, maxScore, testDetails){
const title=problem?.title||'Không rõ';
const desc=problem?.description||'Không có mô tả';
const pct=maxScore>0?Math.round(score/maxScore*100):0;

// Build test result summary if available
let testSummary='';
if(testDetails&&testDetails.length){
const ac=testDetails.filter(d=>d.verdict==='AC').length;
const wa=testDetails.filter(d=>d.verdict==='WA').length;
const tle=testDetails.filter(d=>d.verdict==='TLE').length;
const rte=testDetails.filter(d=>d.verdict==='RTE').length;
testSummary=`\nKết quả chấm: ${ac}/${testDetails.length} test đúng (AC)`;
if(wa>0)testSummary+=`, ${wa} sai (WA)`;
if(tle>0)testSummary+=`, ${tle} quá thời gian (TLE)`;
if(rte>0)testSummary+=`, ${rte} lỗi runtime (RTE)`;
// Show which tests failed
const failedTests=testDetails.map((d,i)=>d.verdict!=='AC'?`Test ${i+1}(${d.verdict},ST${d.subtaskId||1})`:null).filter(Boolean);
if(failedTests.length&&failedTests.length<=10)testSummary+=`\nTest sai: ${failedTests.join(', ')}`;
}

return `Bạn là một giáo viên lập trình Python dạy học sinh cấp 2-3 (THCS-THPT). Hãy nhận xét bài làm của học sinh một cách xây dựng, khuyến khích, nhưng chính xác.

## ĐỀ BÀI: "${title}"
${desc}

## KẾT QUẢ
Điểm: ${score}/${maxScore} (${pct}%)${testSummary}

## CODE CỦA HỌC SINH
\`\`\`python
${code}
\`\`\`

## YÊU CẦU PHÂN TÍCH
Hãy nhận xét theo cấu trúc sau:

**📊 Tổng quan**: Đánh giá ngắn gọn bài làm (1-2 câu).

**${score>=maxScore?'✅':'❌'} Phân tích${score<maxScore?' lỗi':''}**: ${score>=maxScore?'Giải thích tại sao cách giải đúng, thuật toán phù hợp.':'Chỉ ra lỗi logic cụ thể khiến test sai. Nêu trường hợp input nào sẽ cho kết quả sai và tại sao.'}

**💡 Điểm mạnh**: Nêu 1-2 điểm tốt trong code (nếu có: cách đặt tên biến, cấu trúc, ý tưởng...).

**🔧 Gợi ý cải thiện**: ${score>=maxScore?'Gợi ý tối ưu hoá (nếu thuật toán chưa tối ưu) hoặc cải thiện phong cách code.':'Hướng dẫn cách sửa lỗi cụ thể (KHÔNG cho code hoàn chỉnh, chỉ gợi ý hướng suy nghĩ).'}

## QUY TẮC
- Trả lời bằng tiếng Việt
- Tối đa 250 từ
- KHÔNG cho lời giải hoàn chỉnh, chỉ gợi ý hướng suy nghĩ
- Giọng văn thân thiện, khuyến khích học sinh cố gắng
- Nếu code đúng hết, hãy khen ngợi và gợi ý nâng cao`;}

async _aiAnalyzeAll(){if(!this._gradeResults||!this._gradeProblems){this._toast('Chấm bài trước','error');return}
const rc=this._viewingRoomCode||this.roomCode;
if(!rc){this._toast('Không có phòng thi','error');return}
const k=document.getElementById('ai-api-key')?.value?.trim()||this.gemini.getApiKey();
if(!k){this._toast('Nhập Gemini API Key trong tab AI trước','error');return}
this.gemini.setApiKey(k);
const ok=await this._confirmDialog('🤖 AI Phân Tích','AI sẽ phân tích code của từng HS. Cần API key và mất vài phút.','Phân tích','btn-accent');
if(!ok)return;
const names=Object.keys(this._gradeResults);
const statusEl=document.getElementById('grade-status');if(statusEl)statusEl.textContent='AI đang phân tích...';
let count=0;
for(const name of names){
for(let pi=0;pi<this._gradeProblems.length;pi++){
const r=this._gradeResults[name]?.[pi];if(!r||!r.code)continue;
count++;if(statusEl)statusEl.textContent=`AI phân tích: ${name} — Bài ${pi+1} (${count})`;
try{
const p=this._gradeProblems[pi];
const prompt=this._buildAIReviewPrompt(p,r.code,r.score,r.maxScore||p.maxScore||100,r.details);
const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.3,maxOutputTokens:500}})});
const d=await resp.json();const analysis=d.candidates?.[0]?.content?.parts?.[0]?.text||'Không phân tích được';
await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}/${pi}/aiAnalysis`).set(analysis);
if(this._gradeResults[name]?.[pi])this._gradeResults[name][pi].aiAnalysis=analysis;
}catch(e){console.error('AI analyze failed:',name,pi,e)}
await new Promise(r=>setTimeout(r,500))}}
if(statusEl)statusEl.textContent='✅ AI phân tích xong!';
this._toast('🤖 AI đã phân tích xong!','success')}

// ===== VIEW STUDENT SUBMISSIONS =====
async _viewStudentSubmissions(name){const rc=this._viewingRoomCode||this.roomCode;if(!rc)return;
try{
const snap=await this.fb.db.ref(`rooms/${rc}/students/${name}`).once('value');
const stu=snap.val();if(!stu)return;
const gradeSnap=await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}`).once('value');
const grades=gradeSnap.val()||{};
const probCount=this.publishedCount||this._gradeProblems?.length||1;
const probs=this._gradeProblems||[];
// Load teacher notes for this student
const noteSnap=await this.fb.db.ref(`rooms/${rc}/teacherNotes/${name}`).once('value');
const existingNotes=noteSnap.val()||{};
let h=`<div class="modal-overlay" id="modal-student-detail" style="display:flex"><div class="modal-content" style="max-width:850px;max-height:85vh;overflow-y:auto">`;
h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3>👤 ${this._esc(name)}</h3><button class="btn btn-ghost btn-sm" onclick="document.getElementById('modal-student-detail').remove()">✕ Đóng</button></div>`;
for(let pi=0;pi<probCount;pi++){
const g=grades[pi]||{};const code=(stu.finalCode&&stu.finalCode[pi])||'(Chưa nộp)';
const prob=probs[pi]||{};
const ms=g.maxScore||prob.maxScore||100;
h+=`<div style="margin-bottom:16px;padding:12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px">`;
h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><strong>Bài ${pi+1}${prob.title?': '+this._esc(prob.title):''}</strong><span class="lb-prob-score ${(g.score||0)>=ms?'full':(g.score||0)>0?'partial':'zero'}">${g.score||0}/${ms}đ</span></div>`;
if(prob.description){h+=`<details style="margin-bottom:8px;font-size:.78rem;color:var(--text-muted)"><summary style="cursor:pointer">📝 Xem đề bài</summary><div style="padding:6px 8px;margin-top:4px;background:rgba(0,0,0,.15);border-radius:4px;white-space:pre-wrap;color:var(--text-secondary)">${this._esc(prob.description)}</div></details>`}
h+=`<pre style="background:rgba(0,0,0,.3);padding:10px;border-radius:4px;font-size:.75rem;max-height:200px;overflow:auto;margin-bottom:8px;white-space:pre-wrap">${this._esc(code)}</pre>`;
// Test case details (grading results per test)
if(g.details&&g.details.length){h+=`<details style="margin-bottom:8px;font-size:.78rem"><summary style="cursor:pointer;font-weight:600;color:var(--accent-light)">📋 Chi tiết chấm (${g.details.filter(d=>d.verdict==='AC').length}/${g.details.length} AC)</summary><div style="max-height:200px;overflow-y:auto;margin-top:6px"><table style="width:100%;font-size:.73rem;border-collapse:collapse"><thead><tr><th style="padding:3px 6px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">#</th><th style="padding:3px 6px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Verdict</th><th style="padding:3px 6px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Time</th><th style="padding:3px 6px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted)">Subtask</th></tr></thead><tbody>${g.details.map((d,di)=>`<tr style="border-bottom:1px solid rgba(255,255,255,.03)"><td style="padding:3px 6px;color:var(--text-muted)">${di+1}</td><td style="padding:3px 6px"><span class="verdict ${d.verdict}" style="font-weight:700">${d.verdict}</span></td><td style="padding:3px 6px;font-family:var(--font-mono)">${d.time||0}ms</td><td style="padding:3px 6px;color:var(--text-muted)">ST${d.subtaskId||1}</td></tr>`).join('')}</tbody></table></div></details>`}
// AI Analysis display
if(g.aiAnalysis){h+=`<div id="ai-result-${this._esc(name)}-${pi}" style="padding:8px 12px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:6px;font-size:.78rem;margin-bottom:8px"><strong>🤖 AI:</strong> ${this._esc(g.aiAnalysis).replace(/\n/g,'<br>')}</div>`}
else{h+=`<div id="ai-result-${this._esc(name)}-${pi}" style="display:none;padding:8px 12px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:6px;font-size:.78rem;margin-bottom:8px"></div>`}
// Submission history
if(stu.submissions&&stu.submissions[pi]){
const subs=stu.submissions[pi];const subKeys=Object.keys(subs).sort();
h+=`<details style="font-size:.78rem;color:var(--text-muted)"><summary>📜 ${subKeys.length} lần nộp</summary>`;
subKeys.forEach(ts=>{const sub=subs[ts];const d=new Date(parseInt(ts));
h+=`<div style="padding:4px 8px;margin:2px 0;background:rgba(255,255,255,.02);border-radius:4px">Lần ${sub.attempt||'?'} — ${d.toLocaleTimeString('vi')}</div>`});
h+=`</details>`}
// Teacher note input
const existNote=existingNotes[pi]||'';
h+=`<div style="margin-top:8px"><label style="font-size:.72rem;font-weight:600;color:var(--text-muted)">💬 Nhận xét GV:</label><textarea id="tnote-${this._esc(name)}-${pi}" rows="2" style="width:100%;margin-top:4px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:6px;font-size:.78rem;color:var(--text-primary);resize:vertical" placeholder="Nhập nhận xét cho ${this._esc(name)}...">${this._esc(existNote)}</textarea></div>`;
h+=`</div>`}
// Action buttons: Save + AI + Publish
h+=`<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">`;
h+=`<button class="btn btn-accent btn-sm" onclick="window._uic._saveTeacherNotes('${this._esc(name)}',${probCount})">💾 Lưu nhận xét</button>`;
h+=`<button class="btn btn-ghost btn-sm" id="btn-ai-student-${this._esc(name)}" onclick="window._uic._aiAnalyzeStudent('${this._esc(name)}',${probCount})">🤖 AI Phân Tích</button>`;
h+=`<button class="btn btn-ghost btn-sm" onclick="window._uic._publishFromModal()">📢 Công Bố Kết Quả</button>`;
h+=`</div>`;
h+=`</div></div>`;
document.body.insertAdjacentHTML('beforeend',h);
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _saveTeacherNotes(name,probCount){
const rc=this._viewingRoomCode||this.roomCode;if(!rc)return;
for(let pi=0;pi<probCount;pi++){
const el=document.getElementById(`tnote-${name}-${pi}`);
if(el&&el.value.trim()){
await this.fb.db.ref(`rooms/${rc}/teacherNotes/${name}/${pi}`).set(el.value.trim())}}
this._toast('💾 Đã lưu nhận xét!','success')}

// AI analyze single student from modal
async _aiAnalyzeStudent(name,probCount){
const rc=this._viewingRoomCode||this.roomCode;if(!rc)return;
const k=document.getElementById('ai-api-key')?.value?.trim()||this.gemini.getApiKey();
if(!k){this._toast('Nhập Gemini API Key trong tab AI trước','error');return}
this.gemini.setApiKey(k);
const btn=document.getElementById(`btn-ai-student-${name}`);
if(btn){btn.disabled=true;btn.textContent='⏳ Đang phân tích...'}
const probs=this._gradeProblems||[];
try{
for(let pi=0;pi<probCount;pi++){
const gradeSnap=await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}/${pi}`).once('value');
const g=gradeSnap.val();if(!g)continue;
const codeSnap=await this.fb.db.ref(`rooms/${rc}/students/${name}/finalCode/${pi}`).once('value');
const code=codeSnap.val();if(!code)continue;
const p=probs[pi]||{};
const prompt=this._buildAIReviewPrompt(p,code,g.score,g.maxScore||100,g.details);
try{
const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.3,maxOutputTokens:500}})});
const d=await resp.json();const analysis=d.candidates?.[0]?.content?.parts?.[0]?.text||'Không phân tích được';
await this.fb.db.ref(`rooms/${rc}/gradeResults/${name}/${pi}/aiAnalysis`).set(analysis);
// Update UI inline
const aiEl=document.getElementById(`ai-result-${name}-${pi}`);
if(aiEl){aiEl.innerHTML=`<strong>🤖 AI:</strong> ${this._esc(analysis).replace(/\n/g,'<br>')}`;aiEl.style.display='block'}
}catch(e){console.error('AI analyze:',name,pi,e)}
await new Promise(r=>setTimeout(r,500))}
if(btn){btn.disabled=false;btn.textContent='✅ Đã phân tích'}
this._toast('🤖 AI đã phân tích xong!','success');
}catch(e){if(btn){btn.disabled=false;btn.textContent='🤖 AI Phân Tích'}this._toast('Lỗi AI: '+e.message,'error')}}

// Publish from student detail modal
async _publishFromModal(){
const rc=this._viewingRoomCode||this.roomCode;
if(!rc){this._toast('Không có phòng thi','error');return}
// Close modal before publishing
const modal=document.getElementById('modal-student-detail');
if(modal)modal.remove();
await this._publishResults(rc)}


// ===== PHASE 3: PUBLISH RESULTS =====
async _publishResults(targetRoomCode){
const rc=targetRoomCode||this.roomCode||this._viewingRoomCode;
if(!rc){this._toast('Không có phòng thi','error');return}
const ok=await this._confirmDialog('📢 Công Bố Kết Quả','Học sinh sẽ thấy điểm và nhận xét. Hành động này không thể hoàn tác.','Công bố','btn-accent');
if(!ok)return;
try{
const gradeSnap=await this.fb.db.ref(`rooms/${rc}/gradeResults`).once('value');
const grades=gradeSnap.val()||{};
const probSnap=await this.fb.db.ref(`rooms/${rc}/problems`).once('value');
const probs=probSnap.val()||{};
const probArr=Array.isArray(probs)?probs:Object.values(probs);
const lb={};
for(const name of Object.keys(grades)){
let total=0;const problems={};
for(const pi of Object.keys(grades[name])){
const s=grades[name][pi].score||0;total+=s;problems[pi]=s;}
lb[name]={name,totalScore:total,problems,lastSubmit:Date.now()}}
await this.fb.db.ref(`rooms/${rc}/leaderboard`).set(lb);
// Calculate totalMaxScore from problems
const totalMaxScore=probArr.reduce((s,p)=>s+(p?.maxScore||100),0);
await this.fb.db.ref(`rooms/${rc}/info`).update({gradeStatus:'published',published:true,publishedAt:Date.now(),totalMaxScore});
const names=Object.keys(lb);
for(const name of names){
this.drive.logData('ContestResults',[rc,name,lb[name].totalScore,...Object.values(lb[name].problems),new Date().toISOString()]).catch(()=>{});}
this._toast('📢 Đã công bố kết quả!','success');
if(this._viewingRoomCode===rc)setTimeout(()=>this._viewRoomHistory(rc),500);
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// ===== PHASE 5: DELETE ROOM =====
async _deleteRoom(roomCode){
const ok=await this._confirmDialog('🗑️ Xóa kỳ thi','Xóa TOÀN BỘ dữ liệu phòng thi #'+roomCode+'?\nBao gồm: đề bài, bài nộp, kết quả.\n\nHành động này KHÔNG THỂ hoàn tác!','Xóa vĩnh viễn','btn-danger');
if(!ok)return;
try{
await this.fb.db.ref(`rooms/${roomCode}`).remove();
this.drive.deleteRow('Rooms',roomCode).catch(()=>{});
// Reset active room if this is the one being deleted
if(this.roomCode===roomCode){this.roomCode=null;localStorage.removeItem('themis_activeRoom');
document.getElementById('teacher-room-bar').classList.add('hidden');this._hideActiveRoomDashboard()}
// Reset viewing state if viewing this room's details
if(this._viewingRoomCode===roomCode){this._viewingRoomCode=null;
document.getElementById('t-contest-problems').classList.add('hidden')}
// Remove from local cache and re-render immediately
if(this._allRooms&&this._allRooms[roomCode])delete this._allRooms[roomCode];
this._renderRoomHistory();
this._toast('🗑️ Đã xóa phòng #'+roomCode,'success');
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

// ===== SUBTASK/LINE/VAR (same as v3, compacted) =====
addSubtask(pct=0,name=null){this.subtaskCounter++;const id=this.subtaskCounter;if(!name)name='Subtask '+id;const c=document.createElement('div');c.className='subtask-card';c.dataset.stId=id;c.innerHTML=`<span class="subtask-name">${name}</span><input type="number" class="subtask-pct-input" value="${pct}" min="0" max="100" step="5"><span>%</span><span class="subtask-count">0</span><button class="btn-danger-sm btn-rm-st">✕</button>`;c.querySelector('.subtask-pct-input').oninput=()=>this._updateSTTotal();c.querySelector('.btn-rm-st').onclick=()=>{if(document.getElementById('subtasks-container').children.length<=1){this._toast('Cần ít nhất 1 subtask','error');return}c.remove();this._updateSTTotal();this._rebuildConstraints();this._validateForm()};document.getElementById('subtasks-container').appendChild(c);this._updateSTTotal();this._validateForm()}

_updateSTTotal(){const cards=document.querySelectorAll('#subtasks-container .subtask-card');const total=parseInt(document.getElementById('total-tests').value)||20;let sum=0;cards.forEach(c=>{sum+=parseInt(c.querySelector('.subtask-pct-input').value)||0});document.getElementById('subtask-total-pct').textContent=sum+'%';document.getElementById('subtask-total-icon').textContent=sum===100?'✅':'❌';document.getElementById('subtask-total').className='subtask-total '+(sum===100?'ok':'error');let rem=total;[...cards].forEach((c,i,a)=>{const pct=parseInt(c.querySelector('.subtask-pct-input').value)||0;const cnt=i===a.length-1?rem:Math.round(total*pct/100);rem-=cnt;c.querySelector('.subtask-count').textContent=Math.max(0,cnt)+' tests'});this._validateForm()}

_getSubtasks(){return[...document.querySelectorAll('#subtasks-container .subtask-card')].map(c=>({id:parseInt(c.dataset.stId),name:c.querySelector('.subtask-name').textContent,percent:parseInt(c.querySelector('.subtask-pct-input').value)||0}))}

applyPreset(key){const p=PRESETS[key];if(!p)return;document.getElementById('input-lines-container').innerHTML='';this.lineCounter=0;this.varCounter=0;for(const l of p.lines){const lid=this.addInputLine(l.repeatRef||null);for(const v of l.variables)this._addVar(lid,v.name,v.type,v.lengthRef||null,v.charset||'az',v.pattern||'random')}this._toggleEmpty();this._validateForm();this._toast('Mẫu: '+p.name,'info')}

addInputLine(repeatRef=null){this.lineCounter++;const lid=this.lineCounter;const c=document.createElement('div');c.className='input-line-card';c.dataset.lineId=lid;const vars=this._getAllVarNames();const opts=vars.map(n=>`<option value="${n}" ${n===repeatRef?'selected':''}>${n}</option>`).join('');c.innerHTML=`<div class="input-line-header"><span class="line-title">Dòng ${lid}</span><div class="line-actions"><div class="repeat-group"><label><input type="checkbox" class="chk-repeat" ${repeatRef?'checked':''}> Lặp</label><select class="repeat-var-select ${repeatRef?'':'hidden'}">${opts||'<option value="">—</option>'}</select></div><button class="btn btn-sm btn-accent btn-add-var-to-line">＋</button><button class="btn-danger-sm btn-rm-line">✕</button></div></div><div class="input-line-body" data-line-vars="${lid}"></div>`;c.querySelector('.chk-repeat').onchange=function(){c.querySelector('.repeat-var-select').classList.toggle('hidden',!this.checked)};c.querySelector('.btn-add-var-to-line').onclick=()=>this._addVar(lid);c.querySelector('.btn-rm-line').onclick=()=>{c.remove();this._toggleEmpty();this._validateForm()};document.getElementById('input-lines-container').appendChild(c);this._toggleEmpty();this._validateForm();return lid}

_addVar(lineId,name='',type='integer',lengthRef=null,charset='az',pattern='random'){this.varCounter++;const container=document.querySelector(`[data-line-vars="${lineId}"]`);if(!container)return;const sts=this._getSubtasks();const row=document.createElement('div');row.className='var-row';let chips='';const charsetOpts=`<option value="az">a-z</option><option value="AZ">A-Z</option><option value="azAZ">Chữ cái</option><option value="09">0-9</option><option value="az_space">a-z + cách</option><option value="az09">a-z + số</option><option value="mixed">Hỗn hợp</option><option value="printable">Mọi ký tự</option>`;sts.forEach((st,i)=>{const dl=DLIM[i]||DLIM[DLIM.length-1];const cc='st-'+Math.min(st.id,5);chips+=`<div class="constraint-chip ${cc}" data-st-id="${st.id}"><span class="st-label">ST${st.id}</span><input type="number" class="cst-min" value="${dl.min}"><span class="sep">—</span><input type="number" class="cst-max" value="${dl.max}"><select class="cst-charset hidden">${charsetOpts}</select><div class="cst-ratio-group hidden"><input type="number" class="cst-ratio-digits" value="34" min="0" max="100" step="1" title="% Số"><input type="number" class="cst-ratio-lower" value="33" min="0" max="100" step="1" title="% thường"><input type="number" class="cst-ratio-upper" value="33" min="0" max="100" step="1" title="% HOA"></div></div>`});const vars=this._getAllVarNames();const refO=vars.map(n=>`<option value="${n}" ${n===lengthRef?'selected':''}>${n}</option>`).join('');row.innerHTML=`<input type="text" class="var-name-input" value="${name}" placeholder="Tên"><select class="var-type-select"><option value="integer" ${type==='integer'?'selected':''}>Số nguyên</option><option value="float" ${type==='float'?'selected':''}>Số thực</option><option value="array" ${type==='array'?'selected':''}>Mảng</option><option value="string" ${type==='string'?'selected':''}>Chuỗi</option></select><div class="var-constraints-inline">${chips}</div><button class="btn-danger-sm btn-rm-var">✕</button>`;const extraArr=document.createElement('div');extraArr.className='var-extra-row '+(type==='array'?'':'hidden');extraArr.innerHTML=`<label>Dài:</label><select class="arr-length-ref"><option value="">Tự cấu hình</option>${refO}</select><label>Pattern:</label><select class="arr-pattern"><option value="random">Random</option><option value="ascending">Tăng</option><option value="descending">Giảm</option></select>`;row.appendChild(extraArr);const typeSel=row.querySelector('.var-type-select');const _showHideCharset=()=>{const isStr=typeSel.value==='string';row.querySelectorAll('.cst-charset').forEach(sel=>{sel.classList.toggle('hidden',!isStr)});row.querySelectorAll('.cst-ratio-group').forEach(g=>g.classList.add('hidden'));if(isStr){row.querySelectorAll('.cst-charset').forEach(sel=>{if(sel.value==='mixed')sel.closest('.constraint-chip').querySelector('.cst-ratio-group')?.classList.remove('hidden')})}extraArr.classList.toggle('hidden',typeSel.value!=='array')};typeSel.onchange=_showHideCharset;row.querySelectorAll('.cst-charset').forEach(sel=>{sel.onchange=function(){const ratioG=this.closest('.constraint-chip').querySelector('.cst-ratio-group');if(ratioG)ratioG.classList.toggle('hidden',this.value!=='mixed')}});if(type==='string'){row.querySelectorAll('.cst-charset').forEach(s=>{s.classList.remove('hidden');s.value=charset});if(charset==='mixed')row.querySelectorAll('.cst-ratio-group').forEach(g=>g.classList.remove('hidden'))}row.querySelector('.btn-rm-var').onclick=()=>{row.remove();this._validateForm()};container.appendChild(row);this._validateForm()}

_rebuildConstraints(){const sts=this._getSubtasks();const charsetOpts=`<option value="az">a-z</option><option value="AZ">A-Z</option><option value="azAZ">Chữ cái</option><option value="09">0-9</option><option value="az_space">a-z + cách</option><option value="az09">a-z + số</option><option value="mixed">Hỗn hợp</option><option value="printable">Mọi ký tự</option>`;document.querySelectorAll('.var-constraints-inline').forEach(c=>{const varRow=c.closest('.var-row');const isStr=varRow&&varRow.querySelector('.var-type-select')?.value==='string';const old={};c.querySelectorAll('.constraint-chip').forEach(ch=>{old[ch.dataset.stId]={min:ch.querySelector('.cst-min').value,max:ch.querySelector('.cst-max').value,charset:ch.querySelector('.cst-charset')?.value||'az'}});c.innerHTML='';sts.forEach((st,i)=>{const dl=DLIM[i]||DLIM[DLIM.length-1];const o=old[st.id]||{};const cs=o.charset||'az';c.innerHTML+=`<div class="constraint-chip st-${Math.min(st.id,5)}" data-st-id="${st.id}"><span class="st-label">ST${st.id}</span><input type="number" class="cst-min" value="${o.min||dl.min}"><span class="sep">—</span><input type="number" class="cst-max" value="${o.max||dl.max}"><select class="cst-charset ${isStr?'':'hidden'}">${charsetOpts}</select><div class="cst-ratio-group hidden"><input type="number" class="cst-ratio-digits" value="34" min="0" max="100" step="1" title="% Số"><input type="number" class="cst-ratio-lower" value="33" min="0" max="100" step="1" title="% thường"><input type="number" class="cst-ratio-upper" value="33" min="0" max="100" step="1" title="% HOA"></div></div>`});// Restore charset values and bind events
c.querySelectorAll('.constraint-chip').forEach(ch=>{const stId=ch.dataset.stId;if(old[stId]?.charset){const sel=ch.querySelector('.cst-charset');if(sel)sel.value=old[stId].charset}const sel=ch.querySelector('.cst-charset');if(sel)sel.onchange=function(){const rg=this.closest('.constraint-chip').querySelector('.cst-ratio-group');if(rg)rg.classList.toggle('hidden',this.value!=='mixed')}})})}

_getAllVarNames(){const n=[];document.querySelectorAll('.var-name-input').forEach(i=>{if(i.value.trim())n.push(i.value.trim())});return n}
_toggleEmpty(){document.getElementById('no-lines-msg').classList.toggle('hidden',document.getElementById('input-lines-container').children.length>0)}

_validateForm(){const has=this.cmMain&&this.cmMain.getValue().trim().length>0;const lines=document.getElementById('input-lines-container').children.length>0;const sts=this._getSubtasks();const sum=sts.reduce((s,st)=>s+st.percent,0);const ok=has&&lines&&sum===100;const btn=document.getElementById('btn-generate');if(btn)btn.disabled=!ok;const hint=document.getElementById('generate-hint');if(hint)hint.textContent=!has?'Nhập code':!lines?'Thêm dòng input':sum!==100?`Subtask: ${sum}%≠100%`:'✅ Sẵn sàng!'}

collectFormData(){const sts=this._getSubtasks();const inputLines=[];document.querySelectorAll('#input-lines-container .input-line-card').forEach(lc=>{const chk=lc.querySelector('.chk-repeat');const sel=lc.querySelector('.repeat-var-select');const repeatRef=chk&&chk.checked&&sel.value?sel.value:null;const variables=[];lc.querySelectorAll('.var-row').forEach(vr=>{const v={name:vr.querySelector('.var-name-input').value.trim()||'X',type:vr.querySelector('.var-type-select').value,subtaskLimits:{}};vr.querySelectorAll('.var-constraints-inline .constraint-chip').forEach(ch=>{const minVal=parseFloat(ch.querySelector('.cst-min').value)||0;const maxVal=parseFloat(ch.querySelector('.cst-max').value)||100;const stId=parseInt(ch.dataset.stId);if(v.type==='string'){const charsetSel=ch.querySelector('.cst-charset');const cs=charsetSel?charsetSel.value:'az';const lim={min:0,max:0,lenMin:Math.max(1,Math.round(minVal)),lenMax:Math.max(1,Math.round(maxVal)),charset:cs};if(cs==='mixed'){const dEl=ch.querySelector('.cst-ratio-digits');const lEl=ch.querySelector('.cst-ratio-lower');const uEl=ch.querySelector('.cst-ratio-upper');if(dEl&&lEl&&uEl){lim.charsetRatio={digits:parseInt(dEl.value)||0,lower:parseInt(lEl.value)||0,upper:parseInt(uEl.value)||0}}}v.subtaskLimits[stId]=lim}else{v.subtaskLimits[stId]={min:minVal,max:maxVal}}});if(v.type==='array'){const ref=vr.querySelector('.arr-length-ref');v.lengthRef=ref&&ref.value?ref.value:null;v.pattern=vr.querySelector('.arr-pattern')?.value||'random'}variables.push(v)});inputLines.push({variables,repeatRef})});return{pythonCode:this.cmMain.getValue(),taskName:document.getElementById('task-name').value||'BAITAP',uppercase:document.getElementById('chk-uppercase').checked,fileIO:document.getElementById('chk-file-io').checked,totalTests:parseInt(document.getElementById('total-tests').value)||20,subtasks:sts,inputLines}}

async startGeneration(){if(this.isGenerating)return;this.isGenerating=true;document.getElementById('btn-generate').disabled=true;document.getElementById('error-area').classList.add('hidden');document.getElementById('section-preview').classList.add('hidden');document.getElementById('progress-area').classList.remove('hidden');this.themis.clear();try{const cfg=this.collectFormData();this._setProg(5,'⏳ Pyodide...');await this.pyEngine.init();this._setProg(20,'✅ Pyodide OK');const gen=new DataGenerator(cfg);const inputs=gen.generateAllInputs();this.themis.setTaskName(cfg.taskName,cfg.uppercase);const inpN=this.themis.taskName+(cfg.uppercase?'.INP':'.inp'),outN=this.themis.taskName+(cfg.uppercase?'.OUT':'.out');for(let i=0;i<inputs.length;i++){this._setProg(30+Math.round(i/inputs.length*55),`🐍 Test ${i+1}/${inputs.length}`);const out=cfg.fileIO?await this.pyEngine.runFileIO(cfg.pythonCode,inputs[i].input,inpN,outN):await this.pyEngine.runStdio(cfg.pythonCode,inputs[i].input);this.themis.addTestCase(i+1,inputs[i].input,out,inputs[i].subtaskId,inputs[i].subtaskName);await new Promise(r=>setTimeout(r,10))}this._setProg(90,'📦 Đóng gói...');await this.themis.generateZip();this._setProg(100,'🎉 Xong!');this._showPreview();this._toast(`${inputs.length} test OK!`,'success');this._debouncedSaveDraft()}catch(e){document.getElementById('error-area').classList.remove('hidden');document.getElementById('error-text').textContent=e.message;this._toast('Lỗi','error')}finally{this.isGenerating=false;document.getElementById('btn-generate').disabled=false;setTimeout(()=>document.getElementById('progress-area').classList.add('hidden'),2000);this._validateForm()}}

_setProg(p,m){document.getElementById('progress-bar').style.width=p+'%';document.getElementById('progress-text').textContent=m;document.getElementById('progress-percent').textContent=p+'%'}

_showPreview(){const data=this.themis.getPreviewData();document.getElementById('section-preview').classList.remove('hidden');const counts={};data.forEach(d=>{counts[d.subtaskName]=(counts[d.subtaskName]||0)+1});let si=0;document.getElementById('preview-stats').innerHTML=Object.entries(counts).map(([n,c])=>{si++;return`<div class="stat-chip st-c${Math.min(si,5)}">${n}: ${c}</div>`}).join('');document.getElementById('preview-tbody').innerHTML=data.map(d=>`<tr><td>${String(d.index).padStart(2,'0')}</td><td><span class="stat-chip st-c${Math.min(d.subtaskId,5)}" style="padding:2px 6px;font-size:.72rem">${d.subtaskName}</span></td><td><pre>${this._esc(d.input)}</pre></td><td><pre>${this._esc(d.output)}</pre></td></tr>`).join('');document.getElementById('section-preview').scrollIntoView({behavior:'smooth'})}

_confirmDialog(title,message,confirmText='Xác nhận',btnClass='btn-accent'){
return new Promise(resolve=>{
const ov=document.createElement('div');ov.className='modal-overlay confirm-dialog-overlay';
ov.innerHTML=`<div class="modal-content confirm-dialog"><h3>${title}</h3><p style="font-size:.9rem;color:var(--text-secondary);line-height:1.6;margin-bottom:20px">${message}</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-ghost btn-sm confirm-cancel">Hủy bỏ</button><button class="btn ${btnClass} confirm-ok">${confirmText}</button></div></div>`;
document.body.appendChild(ov);
requestAnimationFrame(()=>ov.classList.add('active'));
ov.querySelector('.confirm-ok').onclick=()=>{ov.remove();resolve(true)};
ov.querySelector('.confirm-cancel').onclick=()=>{ov.remove();resolve(false)};
ov.onclick=e=>{if(e.target===ov){ov.remove();resolve(false)}}})}

_copyText(text){navigator.clipboard.writeText(text).then(()=>this._toast('📋 Đã copy!','success')).catch(()=>{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);this._toast('📋 Đã copy!','success')})}
_toast(m,t='info'){const c=document.getElementById('toast-container');const el=document.createElement('div');el.className='toast '+t;el.textContent=m;c.appendChild(el);setTimeout(()=>el.remove(),4500)}
_esc(s){if(s==null)return '';const d=document.createElement('div');d.textContent=String(s);return d.innerHTML.replace(/"/g,'&quot;').replace(/'/g,'&#39;')}

// ============ DRAFT AUTO-SAVE SYSTEM ============
_draftSaveTimer=null;
_isRestoringDraft=false;
_debouncedSaveDraft(){if(this._isRestoringDraft)return;if(this._draftSaveTimer)clearTimeout(this._draftSaveTimer);this._showDraftStatus('saving');this._draftSaveTimer=setTimeout(()=>this._saveDraft(),3000)}

_saveDraft(){try{
const draft={};
// Basic fields
draft.title=document.getElementById('problem-title')?.value||'';
draft.taskName=document.getElementById('task-name')?.value||'';
draft.topic=document.getElementById('problem-topic')?.value||'';
draft.totalTests=document.getElementById('total-tests')?.value||'20';
draft.fileIO=document.getElementById('chk-file-io')?.checked||false;
draft.uppercase=document.getElementById('chk-uppercase')?.checked||false;
draft.description=document.getElementById('problem-description')?.value||'';
draft.aiPrompt=document.getElementById('ai-prompt')?.value||'';
draft.difficulty=document.getElementById('ex-difficulty')?.value||'medium';
// Code editors
if(this.cmMain)draft.codeMain=this.cmMain.getValue();
if(this.cmBrute)draft.codeBrute=this.cmBrute.getValue();
if(this.cmAiPreview)draft.codeAiPreview=this.cmAiPreview.getValue();
// Subtasks
draft.subtasks=[...document.querySelectorAll('#subtasks-container .subtask-card')].map(c=>({id:parseInt(c.dataset.stId),name:c.querySelector('.subtask-name').textContent,pct:c.querySelector('.subtask-pct-input').value}));
// Input lines
draft.inputLines=[];document.querySelectorAll('#input-lines-container .input-line-card').forEach(lc=>{
const chk=lc.querySelector('.chk-repeat');const sel=lc.querySelector('.repeat-var-select');
const line={lineId:lc.dataset.lineId,repeatChecked:chk?.checked||false,repeatRef:sel?.value||'',vars:[]};
lc.querySelectorAll('.var-row').forEach(vr=>{
const v={name:vr.querySelector('.var-name-input')?.value||'',type:vr.querySelector('.var-type-select')?.value||'integer',constraints:[]};
vr.querySelectorAll('.constraint-chip').forEach(ch=>{const cData={stId:ch.dataset.stId,min:ch.querySelector('.cst-min')?.value||'',max:ch.querySelector('.cst-max')?.value||''};const csSel=ch.querySelector('.cst-charset');if(csSel&&v.type==='string'){cData.charset=csSel.value||'az';if(cData.charset==='mixed'){cData.ratioDigits=ch.querySelector('.cst-ratio-digits')?.value||'34';cData.ratioLower=ch.querySelector('.cst-ratio-lower')?.value||'33';cData.ratioUpper=ch.querySelector('.cst-ratio-upper')?.value||'33'}}v.constraints.push(cData)});
if(v.type==='array'){v.lengthRef=vr.querySelector('.arr-length-ref')?.value||'';v.pattern=vr.querySelector('.arr-pattern')?.value||'random'}
line.vars.push(v)});draft.inputLines.push(line)});
// Sample I/O
draft.sampleIO=this._getSampleIOs();
// Generated test cases (preserve for restore)
if(this.themis&&this.themis.testCases&&this.themis.testCases.length){
draft.generatedTests=this.themis.testCases.map(tc=>({index:tc.index,input:tc.input,output:tc.output,subtaskId:tc.subtaskId,subtaskName:tc.subtaskName}))}
draft.savedAt=Date.now();
try{localStorage.setItem('themis_draft_compose',JSON.stringify(draft))}catch(storageErr){
// If test data is too large, save without tests
delete draft.generatedTests;localStorage.setItem('themis_draft_compose',JSON.stringify(draft))}
this._showDraftStatus('saved');
}catch(e){console.warn('Draft save error:',e)}}

_restoreDraft(){try{
this._isRestoringDraft=true;
// Cancel any pending save that was triggered by CM init / default subtask creation
if(this._draftSaveTimer){clearTimeout(this._draftSaveTimer);this._draftSaveTimer=null}
const raw=localStorage.getItem('themis_draft_compose');if(!raw){this._isRestoringDraft=false;return}
let d;try{d=JSON.parse(raw)}catch(e){console.warn('Draft corrupt, removing');localStorage.removeItem('themis_draft_compose');this._isRestoringDraft=false;return}
// Check if draft is too old (> 7 days)
if(d.savedAt&&Date.now()-d.savedAt>7*24*60*60*1000){localStorage.removeItem('themis_draft_compose');this._isRestoringDraft=false;return}
// Check if draft has any meaningful content
const defaultCode='# Code đáp án\nn = int(input())\nprint(n * 2)';
const hasMeaningful=d.title||d.taskName||d.description||d.aiPrompt||(d.inputLines&&d.inputLines.length)||(d.generatedTests&&d.generatedTests.length)||(d.codeMain&&d.codeMain.trim()&&d.codeMain.trim()!==defaultCode&&d.codeMain.trim()!==defaultCode+'\n');
if(!hasMeaningful){this._isRestoringDraft=false;return}
// Restore basic fields
if(d.title)document.getElementById('problem-title').value=d.title;
if(d.taskName)document.getElementById('task-name').value=d.taskName;
if(d.topic)document.getElementById('problem-topic').value=d.topic;
if(d.totalTests)document.getElementById('total-tests').value=d.totalTests;
if(d.fileIO!==undefined)document.getElementById('chk-file-io').checked=d.fileIO;
if(d.uppercase!==undefined)document.getElementById('chk-uppercase').checked=d.uppercase;
if(d.description)document.getElementById('problem-description').value=d.description;
if(d.aiPrompt)document.getElementById('ai-prompt').value=d.aiPrompt;
if(d.difficulty){const diffEl=document.getElementById('ex-difficulty');if(diffEl)diffEl.value=d.difficulty}
// Restore subtasks FIRST (before input lines — _addVar reads subtask DOM for constraint chips)
if(d.subtasks&&d.subtasks.length){
document.getElementById('subtasks-container').innerHTML='';
this.subtaskCounter=0;
d.subtasks.forEach(st=>this.addSubtask(parseInt(st.pct)||0,st.name||null));
this._updateSTTotal()}
// Restore code editors (setValue triggers CM change, but _isRestoringDraft guard blocks saving)
if(d.codeMain&&this.cmMain){this.cmMain.setValue(d.codeMain);setTimeout(()=>this.cmMain.refresh(),50)}
if(d.codeBrute&&this.cmBrute){this.cmBrute.setValue(d.codeBrute);setTimeout(()=>this.cmBrute.refresh(),50)}
if(d.codeAiPreview&&this.cmAiPreview&&d.codeAiPreview.trim()){this.cmAiPreview.setValue(d.codeAiPreview);document.getElementById('ai-preview')?.classList.remove('hidden');setTimeout(()=>this.cmAiPreview.refresh(),50)}
// Restore input lines
if(d.inputLines&&d.inputLines.length){
document.getElementById('input-lines-container').innerHTML='';
this.lineCounter=0;this.varCounter=0;
d.inputLines.forEach(line=>{
const lid=this.addInputLine(line.repeatChecked&&line.repeatRef?line.repeatRef:null);
line.vars.forEach(v=>{
this._addVar(lid,v.name,v.type,v.type==='array'?v.lengthRef:null,v.charset||'az',v.pattern||'random');
const container=document.querySelector(`[data-line-vars="${lid}"]`);
if(!container)return;
const lastRow=container.lastElementChild;if(!lastRow)return;
// Restore constraints
if(v.constraints&&v.constraints.length){v.constraints.forEach(c=>{const chip=lastRow.querySelector(`.constraint-chip[data-st-id="${c.stId}"]`);if(chip){if(c.min!==undefined&&c.min!=='')chip.querySelector('.cst-min').value=c.min;if(c.max!==undefined&&c.max!=='')chip.querySelector('.cst-max').value=c.max;
// Restore per-subtask charset
if(v.type==='string'&&c.charset){const csSel=chip.querySelector('.cst-charset');if(csSel){csSel.classList.remove('hidden');csSel.value=c.charset;if(c.charset==='mixed'){const rg=chip.querySelector('.cst-ratio-group');if(rg){rg.classList.remove('hidden');const rd=chip.querySelector('.cst-ratio-digits');if(rd)rd.value=c.ratioDigits||'34';const rl=chip.querySelector('.cst-ratio-lower');if(rl)rl.value=c.ratioLower||'33';const ru=chip.querySelector('.cst-ratio-upper');if(ru)ru.value=c.ratioUpper||'33'}}}}}})}
// Restore array pattern
if(v.type==='array'){const ar=lastRow.querySelector('.arr-length-ref');if(ar&&v.lengthRef)ar.value=v.lengthRef;const ap=lastRow.querySelector('.arr-pattern');if(ap&&v.pattern)ap.value=v.pattern}
})});
this._toggleEmpty()}
// Restore sample I/O
if(d.sampleIO&&d.sampleIO.length){
document.getElementById('sample-io-container').innerHTML='';this._sampleIOCounter=0;
d.sampleIO.forEach(s=>this._addSampleIO(s.input||'',s.output||'',s.explanation||''))}
// Restore generated test cases
if(d.generatedTests&&d.generatedTests.length&&this.themis){
this.themis.clear();
d.generatedTests.forEach(tc=>this.themis.addTestCase(tc.index,tc.input,tc.output,tc.subtaskId,tc.subtaskName));
this.themis.setTaskName(d.taskName||'BAITAP',!!d.uppercase);
try{this.themis.generateZip().then(()=>{this._showPreview();this._validateForm()}).catch(()=>{})}catch(e){}}
this._validateForm();
const draftTitle=d.title||d.taskName||'chưa đặt tên';
const tcInfo=d.generatedTests?` (${d.generatedTests.length} test)`:'';
this._toast(`🔄 Đã khôi phục bài soạn dở: "${draftTitle}"${tcInfo}`,'info');
this._showDraftStatus('restored');
// Release the guard AFTER a short delay so any queued CM change events are suppressed
setTimeout(()=>{this._isRestoringDraft=false},500);
}catch(e){console.warn('Draft restore error:',e);this._isRestoringDraft=false}}

_clearDraft(){localStorage.removeItem('themis_draft_compose');const el=document.getElementById('draft-save-status');if(el){el.classList.add('hidden');el.className='draft-save-status hidden'}}

_showDraftStatus(state){
const el=document.getElementById('draft-save-status');if(!el)return;
el.classList.remove('hidden','saving','saved','restored');
if(state==='saving'){el.classList.add('saving');el.textContent='✏️ Đang lưu...'}
else if(state==='saved'){el.classList.add('saved');el.textContent='💾 Đã lưu tự động';if(this._draftStatusHideTimer)clearTimeout(this._draftStatusHideTimer);this._draftStatusHideTimer=setTimeout(()=>{el.classList.add('hidden')},5000)}
else if(state==='restored'){el.classList.add('restored');el.textContent='🔄 Đã khôi phục bài soạn';if(this._draftStatusHideTimer)clearTimeout(this._draftStatusHideTimer);this._draftStatusHideTimer=setTimeout(()=>{el.classList.add('hidden')},8000)}}

// ============ TEACHER NOTIFICATION SYSTEM ============
async _loadNotifStudentList(){
try{
const snap=await this.fb.db.ref('accounts').once('value');
const accts=snap.val()||{};
const el=document.getElementById('notif-stu-list');
const keys=Object.keys(accts).filter(k=>k!=='Admin');
if(!keys.length){el.innerHTML='<p style="color:var(--text-muted);font-size:.82rem;padding:8px">Chưa có học sinh</p>';return}
el.innerHTML=keys.map(k=>`<label class="notif-stu-chip" onclick="this.classList.toggle('selected')"><input type="checkbox" value="${this._esc(k)}">${this._esc(k)}</label>`).join('');
}catch(e){console.error('Load notif students:',e)}}

async _sendNotification(){
const title=document.getElementById('notif-title').value.trim();
const message=document.getElementById('notif-message').value.trim();
const type=document.getElementById('notif-type').value;
if(!title){this._toast('⚠️ Nhập tiêu đề thông báo','error');return}
if(!message){this._toast('⚠️ Nhập nội dung thông báo','error');return}
const targetRadio=document.querySelector('input[name="notif-target"]:checked');
const isAll=targetRadio&&targetRadio.value==='all';
let recipients=[];
if(isAll){recipients=['__all__']}
else{
const checkboxes=document.querySelectorAll('#notif-stu-list input[type="checkbox"]:checked');
recipients=[...checkboxes].map(c=>c.value);
if(!recipients.length){this._toast('⚠️ Chọn ít nhất 1 học sinh','error');return}}
const editId=document.getElementById('notif-edit-id').value;
try{
const data={title,message,type,recipients,createdAt:Date.now(),createdBy:'teacher'};
if(editId){
await this.fb.db.ref(`notifications/${editId}`).update(data);
this._toast('✅ Đã cập nhật thông báo!','success');
}else{
await this.fb.db.ref('notifications').push(data);
this._toast('📤 Đã gửi thông báo!','success');}
document.getElementById('notif-title').value='';
document.getElementById('notif-message').value='';
document.getElementById('notif-edit-id').value='';
document.getElementById('btn-cancel-notif-edit').classList.add('hidden');
document.getElementById('btn-send-notif').innerHTML='📤 Gửi Thông Báo';
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_cancelNotifEdit(){
document.getElementById('notif-title').value='';
document.getElementById('notif-message').value='';
document.getElementById('notif-edit-id').value='';
document.getElementById('btn-cancel-notif-edit').classList.add('hidden');
document.getElementById('btn-send-notif').innerHTML='📤 Gửi Thông Báo'}

_editNotification(id,notif){
document.getElementById('notif-title').value=notif.title||'';
document.getElementById('notif-message').value=notif.message||'';
document.getElementById('notif-type').value=notif.type||'announcement';
document.getElementById('notif-edit-id').value=id;
document.getElementById('btn-cancel-notif-edit').classList.remove('hidden');
document.getElementById('btn-send-notif').innerHTML='💾 Lưu Thay Đổi';
// Set target
if(notif.recipients&&notif.recipients[0]==='__all__'){
document.querySelector('input[name="notif-target"][value="all"]').checked=true;
document.getElementById('notif-stu-list').classList.add('hidden');
}else{
document.querySelector('input[name="notif-target"][value="select"]').checked=true;
document.getElementById('notif-stu-list').classList.remove('hidden');
this._loadNotifStudentList().then(()=>{
const targets=notif.recipients||[];
document.querySelectorAll('#notif-stu-list input[type="checkbox"]').forEach(cb=>{
const isTarget=targets.includes(cb.value);
cb.checked=isTarget;
cb.closest('.notif-stu-chip').classList.toggle('selected',isTarget)})})}
this._toast('✏️ Đang sửa thông báo...','info');
document.getElementById('notif-title').scrollIntoView({behavior:'smooth',block:'center'})}

async _deleteNotification(id){
const ok=await this._confirmDialog('🗑️ Xóa thông báo','Bạn chắc chắn muốn xóa thông báo này?','Xóa','btn-danger');
if(!ok)return;
try{await this.fb.db.ref(`notifications/${id}`).remove();this._toast('🗑️ Đã xóa!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _resendNotification(id){
try{await this.fb.db.ref(`notifications/${id}`).update({createdAt:Date.now()});this._toast('🔄 Đã gửi lại!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_renderSentNotifications(notifs){
const el=document.getElementById('notif-sent-list');if(!el)return;
const keys=Object.keys(notifs||{});
if(!keys.length){el.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:20px">Chưa có thông báo nào</p>';return}
keys.sort((a,b)=>(notifs[b].createdAt||0)-(notifs[a].createdAt||0));
let h='';keys.forEach(id=>{
const n=notifs[id];
const d=new Date(n.createdAt||0);
const typeLabel={deadline:'⏰ Hạn nộp',reminder:'🔔 Nhắc nhở',announcement:'📋 Thông báo'};
const recipientText=n.recipients&&n.recipients[0]==='__all__'?'📢 Tất cả HS':`👤 ${n.recipients?n.recipients.join(', '):''}`;
h+=`<div class="notif-sent-card">
<div class="notif-sent-header">
<div class="notif-sent-title">${this._esc(n.title)}</div>
<div class="notif-sent-actions">
<button class="btn btn-ghost btn-sm" data-action="edit" data-id="${id}">✏️</button>
<button class="btn btn-ghost btn-sm" data-action="resend" data-id="${id}">🔄</button>
<button class="btn-danger-sm" data-action="delete" data-id="${id}">✕</button>
</div></div>
<div class="notif-sent-body">${this._esc(n.message)}</div>
<div class="notif-sent-meta">
<span class="notif-type-badge ${n.type||'announcement'}">${typeLabel[n.type]||'📋 Thông báo'}</span>
<span>📨 ${recipientText}</span>
<span>📅 ${d.toLocaleString('vi')}</span>
</div></div>`});
this._notifDataCache=notifs;
el.innerHTML=h;
// BUG-M02 FIX: Safe event delegation — no inline onclick with user-controlled data
el.querySelectorAll('[data-action]').forEach(btn=>{
  const action=btn.dataset.action;const nid=btn.dataset.id;if(!nid)return;
  btn.onclick=()=>{
    if(action==='edit'){const nd=this._notifDataCache&&this._notifDataCache[nid];if(nd)this._editNotification(nid,nd)}
    else if(action==='resend')this._resendNotification(nid);
    else if(action==='delete')this._deleteNotification(nid)}})}


_initTeacherNotifListener(){
const ref=this.fb.db.ref('notifications');
const _tNotifCb=s=>{this._renderSentNotifications(s.val()||{})};
ref.on('value',_tNotifCb);
this.fb._listeners.push(()=>ref.off('value',_tNotifCb))}

// ============ STUDENT NOTIFICATION LISTENER ============
_listenStudentNotifications(){
const ref=this.fb.db.ref('notifications');
const _sNotifCb=s=>{
const all=s.val()||{};
const myNotifs={};
Object.keys(all).forEach(id=>{
const n=all[id];
if(n.recipients&&(n.recipients.includes('__all__')||n.recipients.includes(this.studentName))){
myNotifs[id]=n}});
this._studentNotifs=myNotifs;
this._renderStudentNotifs()};
ref.on('value',_sNotifCb);
this.fb._studentDashListeners.push(()=>ref.off('value',_sNotifCb))}

_renderStudentNotifs(){
const notifs=this._studentNotifs||{};
const el=document.getElementById('stu-notif-list');
const bellBtn=document.getElementById('btn-stu-notif-bell');
if(!el)return;
let readNotifs={};try{readNotifs=JSON.parse(localStorage.getItem(`themis_read_notifs_${this.studentName}`)||'{}')}catch(e){readNotifs={}}
const keys=Object.keys(notifs);
if(!keys.length){el.innerHTML='<div class="notif-dropdown-empty">🔔 Không có thông báo mới</div>';if(bellBtn){const badge=bellBtn.querySelector('.notif-bell-badge');if(badge)badge.remove()}return}
keys.sort((a,b)=>(notifs[b].createdAt||0)-(notifs[a].createdAt||0));
let unreadCount=0;
let h='';
keys.forEach(id=>{
const n=notifs[id];
const isRead=!!readNotifs[id];
if(!isRead)unreadCount++;
const typeIcons={deadline:'⏰',reminder:'🔔',announcement:'📋'};
const ago=this._timeAgo(n.createdAt);
h+=`<div class="notif-item ${isRead?'':'unread'}" onclick="window._uic._markNotifRead('${id}')">
<div class="notif-item-title">${!isRead?'<span class="notif-unread-dot"></span>':''}${typeIcons[n.type]||'📋'} ${this._esc(n.title)}</div>
<div class="notif-item-body">${this._esc(n.message)}</div>
<div class="notif-item-time">${ago}</div>
</div>`});
el.innerHTML=h;
// Update badge
if(bellBtn){
const existing=bellBtn.querySelector('.notif-bell-badge');
if(existing)existing.remove();
if(unreadCount>0){
const badge=document.createElement('span');
badge.className='notif-bell-badge';
badge.textContent=unreadCount;
bellBtn.appendChild(badge)}}}

_markNotifRead(id){
const key=`themis_read_notifs_${this.studentName}`;
let read={};try{read=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){read={}}
read[id]=true;
localStorage.setItem(key,JSON.stringify(read));
this._renderStudentNotifs()}

_markAllNotifsRead(){
const key=`themis_read_notifs_${this.studentName}`;
const notifs=this._studentNotifs||{};
let read={};try{read=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){read={}}
Object.keys(notifs).forEach(id=>read[id]=true);
localStorage.setItem(key,JSON.stringify(read));
this._renderStudentNotifs();
this._toast('✅ Đã đánh dấu tất cả đã đọc','success')}

_timeAgo(ts){
if(!ts)return '';
const diff=Date.now()-ts;
const mins=Math.floor(diff/60000);
if(mins<1)return 'Vừa xong';
if(mins<60)return `${mins} phút trước`;
const hrs=Math.floor(mins/60);
if(hrs<24)return `${hrs} giờ trước`;
const days=Math.floor(hrs/24);
if(days<7)return `${days} ngày trước`;
return new Date(ts).toLocaleDateString('vi')}

// ============ AI TUTOR ============
_initAITutor(){
if(this._aiTutorInited)return;this._aiTutorInited=true;
this._aiTutorHistory=[];this._aiTutorCooldown=0;this._aiTutorTimer=null;
const sendBtn=document.getElementById('btn-ai-tutor-send');
const input=document.getElementById('ai-tutor-input');
const clearBtn=document.getElementById('btn-ai-clear');
if(!sendBtn||!input)return;
sendBtn.onclick=()=>this._sendAITutorMessage();
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this._sendAITutorMessage()}});
if(clearBtn)clearBtn.onclick=()=>this._clearAITutor();
this._showAITutorWelcome()}

_showAITutorWelcome(){
const msgEl=document.getElementById('ai-tutor-messages');if(!msgEl)return;
if(this.roomCode&&!this._currentExercise){
msgEl.innerHTML='<div class="ai-tutor-disabled"><div class="ai-tutor-disabled-icon">🔒</div><div class="ai-tutor-disabled-text">Trợ lý AI bị tắt trong kỳ thi</div></div>';
const inp=document.getElementById('ai-tutor-input');const btn=document.getElementById('btn-ai-tutor-send');
if(inp)inp.disabled=true;if(btn)btn.disabled=true;return}
const inp=document.getElementById('ai-tutor-input');const btn=document.getElementById('btn-ai-tutor-send');
if(inp)inp.disabled=false;if(btn)btn.disabled=false;
const t=this._currentExercise?.title||'bài tập';
this._aiTutorHistory=[];msgEl.innerHTML='';
this._appendAIMsg('bot',`Xin chào! 👋 Mình là **Trợ lý Python**.\n\nMình có thể giúp em:\n• Giải thích **cú pháp**, câu lệnh Python\n• Hướng dẫn cách sử dụng **hàm, vòng lặp, điều kiện**\n• Gợi ý **hướng suy nghĩ** cho bài "${t}"\n\n⚠️ Mình **không viết code giải bài** cho em nhé!\n\nHỏi mình bất cứ điều gì về Python nào! 🐍`)}

_clearAITutor(){this._aiTutorHistory=[];this._showAITutorWelcome();this._toast('🗑 Đã xóa chat','info')}
_resetAITutorForExercise(){this._aiTutorHistory=[];const m=document.getElementById('ai-tutor-messages');if(m)this._showAITutorWelcome()}

async _sendAITutorMessage(){
const input=document.getElementById('ai-tutor-input');const sendBtn=document.getElementById('btn-ai-tutor-send');
if(!input||!sendBtn)return;
const q=input.value.trim();if(!q){this._toast('Nhập câu hỏi','error');return}
if(this.roomCode&&!this._currentExercise){this._toast('🔒 AI bị tắt trong kỳ thi','error');return}
if(this._aiTutorCooldown>0){this._toast(`⏳ Chờ ${this._aiTutorCooldown}s nữa`,'error');return}
const apiKey=this.gemini.getApiKey();
if(!apiKey){this._toast('⚠️ Chưa có API Key. GV cần nhập Gemini API Key.','error');return}
this._appendAIMsg('user',q);input.value='';input.disabled=true;sendBtn.disabled=true;
const msgEl=document.getElementById('ai-tutor-messages');
const typD=document.createElement('div');typD.className='ai-tutor-msg bot';typD.id='ai-tutor-typing';
typD.innerHTML='<div class="ai-tutor-avatar">🤖</div><div class="ai-tutor-bubble"><div class="ai-tutor-typing"><div class="ai-tutor-typing-dot"></div><div class="ai-tutor-typing-dot"></div><div class="ai-tutor-typing-dot"></div></div></div>';
msgEl.appendChild(typD);msgEl.scrollTop=msgEl.scrollHeight;
const exTitle=this._currentExercise?.title||'';
const exDesc=(this._currentExercise?.description||'').substring(0,200);
const sysPr=`Bạn là trợ lý dạy Python cho học sinh cấp 2-3 Việt Nam.\n\nQUY TẮC BẮT BUỘC:\n1. CHỈ trả lời về Python. Nếu câu hỏi KHÔNG liên quan Python → từ chối: "Mình chỉ hỗ trợ về Python thôi nhé! 🐍"\n2. TUYỆT ĐỐI KHÔNG viết code hoàn chỉnh giải bài. KHÔNG viết hơn 3 dòng code liên tiếp.\n   - Được: giải thích cú pháp, ví dụ MẪU nhỏ (1-3 dòng minh họa)\n   - KHÔNG được: viết lời giải, viết hàm giải bài, viết chương trình hoàn chỉnh\n3. Giải thích THẬT ĐƠN GIẢN, dùng ví dụ đời thường\n4. Trả lời bằng tiếng Việt, tối đa 200 từ\n5. Nếu HS hỏi cách giải bài → CHỈ gợi ý HƯỚNG SUY NGHĨ, KHÔNG cho code\n6. Khuyến khích HS tự thử\n7. Dùng markdown: **in đậm**, \`code\`\n\nHS đang làm bài: "${exTitle}"${exDesc?('\nMô tả: '+exDesc):''}`;
const contents=[];
contents.push({role:'user',parts:[{text:sysPr}]});
contents.push({role:'model',parts:[{text:'Tôi hiểu. Tôi sẽ tuân thủ: chỉ Python, không code hoàn chỉnh, giải thích đơn giản.'}]});
const hist=this._aiTutorHistory.slice(-10);
for(const m of hist)contents.push({role:m.role==='user'?'user':'model',parts:[{text:m.text}]});
contents.push({role:'user',parts:[{text:q}]});
try{
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,{
method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({contents,generationConfig:{temperature:0.4,maxOutputTokens:800}})});
const typ=document.getElementById('ai-tutor-typing');if(typ)typ.remove();
if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error?.message||`API Error ${r.status}`)}
const d=await r.json();
const ans=d.candidates?.[0]?.content?.parts?.[0]?.text||'Xin lỗi, mình không thể trả lời lúc này.';
this._aiTutorHistory.push({role:'user',text:q});
this._aiTutorHistory.push({role:'bot',text:ans});
this._appendAIMsg('bot',ans);
}catch(err){
const typ=document.getElementById('ai-tutor-typing');if(typ)typ.remove();
this._appendAIMsg('bot',`❌ Lỗi: ${err.message}\n\nHãy thử lại sau nhé!`)}
input.disabled=false;sendBtn.disabled=false;
this._startAICooldown(10)}

_startAICooldown(sec){
this._aiTutorCooldown=sec;
const cdEl=document.getElementById('ai-tutor-cooldown');
const btn=document.getElementById('btn-ai-tutor-send');
const inp=document.getElementById('ai-tutor-input');
if(btn)btn.disabled=true;if(inp)inp.disabled=true;
if(this._aiTutorTimer)clearInterval(this._aiTutorTimer);
this._aiTutorTimer=setInterval(()=>{
this._aiTutorCooldown--;
if(cdEl)cdEl.textContent=this._aiTutorCooldown>0?`⏳ ${this._aiTutorCooldown}s`:'';
if(this._aiTutorCooldown<=0){
clearInterval(this._aiTutorTimer);this._aiTutorTimer=null;
if(btn)btn.disabled=false;if(inp)inp.disabled=false;inp?.focus()}},1000);
if(cdEl)cdEl.textContent=`⏳ ${sec}s`}

_appendAIMsg(role,text){
const msgEl=document.getElementById('ai-tutor-messages');if(!msgEl)return;
const div=document.createElement('div');div.className=`ai-tutor-msg ${role}`;
const av=role==='bot'?'🤖':'👤';
div.innerHTML=`<div class="ai-tutor-avatar">${av}</div><div class="ai-tutor-bubble">${this._renderAIMd(text)}</div>`;
msgEl.appendChild(div);msgEl.scrollTop=msgEl.scrollHeight}

_renderAIMd(text){
if(!text)return '';
let h=text
.replace(/```(\w*)\n([\s\S]*?)```/g,(m,l,c)=>`<pre><code>${this._escAI(c.trim())}</code></pre>`)
.replace(/`([^`]+)`/g,'<code>$1</code>')
.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
.replace(/\*(.+?)\*/g,'<em>$1</em>')
.replace(/^[•\-]\s+(.+)$/gm,'<li>$1</li>')
.replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>')
.replace(/\n/g,'<br>');
h=h.replace(/((?:<li>.*?<\/li>(?:<br>)?)+)/g,'<ul>$1</ul>');
h=h.replace(/<ul>([\s\S]*?)<\/ul>/g,(m,i)=>'<ul>'+i.replace(/<br>/g,'')+'</ul>');
return h}

_escAI(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

// ============ QUIZ MODULE — TEACHER ============
_quizQCounter=0;
_initTeacherQuiz(){
const $=id=>document.getElementById(id);
$('btn-quiz-add-q').onclick=()=>{this._addQuizQuestion();this._updateQuizQCount()};
$('btn-quiz-save').onclick=()=>this._saveQuiz('draft');
$('btn-quiz-publish').onclick=()=>this._saveQuiz('published');
$('btn-quiz-cancel-edit').onclick=()=>this._cancelQuizEdit();
$('btn-quiz-import-excel').onclick=()=>$('quiz-excel-file').click();
$('quiz-excel-file').onchange=e=>{if(e.target.files[0])this._importQuizFromExcel(e.target.files[0]);e.target.value=''};
// AI Quiz Generation
$('btn-quiz-ai-gen').onclick=()=>{
const cfg=$('quiz-ai-config');cfg.classList.toggle('hidden');
// Auto-fill topic from quiz-topic field
const topicVal=$('quiz-topic')?.value;
if(topicVal&&!$('quiz-ai-topic').value)$('quiz-ai-topic').value=topicVal;
// Auto-fill API key from localStorage or compose tab
const qk=$('quiz-ai-key');
if(qk&&!qk.value){const saved=this.gemini.getApiKey()||$('ai-api-key')?.value||'';if(saved)qk.value=saved}};
$('btn-quiz-ai-close').onclick=()=>$('quiz-ai-config').classList.add('hidden');
$('btn-quiz-ai-run').onclick=()=>this._generateQuizWithAI();
// Sync quiz-ai-key to gemini helper and compose tab on change
const qkEl=$('quiz-ai-key');
if(qkEl)qkEl.onchange=()=>{const v=qkEl.value.trim();if(v){this.gemini.setApiKey(v);const ck=$('ai-api-key');if(ck)ck.value=v}};
}

_addQuizQuestion(content='',options=['','','',''],correctIndex=0,explanation=''){
this._quizQCounter++;const idx=this._quizQCounter;
const container=document.getElementById('quiz-questions-container');
const card=document.createElement('div');card.className='quiz-q-card';card.dataset.qIdx=idx;
const labels=['A','B','C','D'];
let optHtml='';labels.forEach((l,i)=>{
const checked=i===correctIndex?'checked':'';
const correctClass=i===correctIndex?'correct':'';
optHtml+=`<div class="quiz-option-row ${correctClass}" data-oi="${i}">
<span class="quiz-option-label">${l}</span>
<input type="text" class="quiz-option-input" placeholder="Đáp án ${l}..." value="${this._esc(options[i]||'')}">
<input type="radio" name="quiz-correct-${idx}" class="quiz-correct-radio" value="${i}" ${checked} title="Đánh dấu đáp án đúng">
</div>`});
card.innerHTML=`<div class="quiz-q-card-header">
<span class="quiz-q-num"><span class="quiz-q-num-badge">${idx}</span> Câu ${idx}</span>
<button class="btn-danger-sm" title="Xóa câu hỏi này">✕</button>
</div>
<div class="quiz-q-card-body">
<div class="form-group"><label style="font-size:.8rem;color:var(--text-muted)">📝 Nội dung câu hỏi</label>
<textarea class="quiz-q-content" rows="3" placeholder="Nhập nội dung câu hỏi tại đây...">${this._esc(content)}</textarea></div>
<div class="quiz-options-group"><label style="font-size:.8rem;color:var(--text-muted);margin-bottom:6px;display:block">📋 Các lựa chọn (chọn radio = đáp án đúng)</label>
${optHtml}</div>
<div class="quiz-q-explain"><input type="text" class="quiz-q-explain-input" placeholder="💡 Giải thích đáp án (tùy chọn)..." value="${this._esc(explanation)}"></div>
</div>`;
// Wire events
card.querySelector('.btn-danger-sm').onclick=()=>{card.remove();this._updateQuizQCount()};
card.querySelectorAll('.quiz-correct-radio').forEach(r=>{r.onchange=()=>{
card.querySelectorAll('.quiz-option-row').forEach(row=>row.classList.remove('correct'));
card.querySelector(`.quiz-option-row[data-oi="${r.value}"]`).classList.add('correct')}});
container.appendChild(card);this._updateQuizQCount()}

_updateQuizQCount(){const n=document.querySelectorAll('#quiz-questions-container .quiz-q-card').length;document.getElementById('quiz-q-count').textContent=n}

_collectQuizQuestions(){
const cards=document.querySelectorAll('#quiz-questions-container .quiz-q-card');
return[...cards].map(card=>{
const content=card.querySelector('.quiz-q-content').value.trim();
const options=[...card.querySelectorAll('.quiz-option-input')].map(i=>i.value.trim());
const correctRadio=card.querySelector('.quiz-correct-radio:checked');
const correctIndex=correctRadio?parseInt(correctRadio.value):0;
const explanation=card.querySelector('.quiz-q-explain-input')?.value.trim()||'';
return{content,options,correctIndex,explanation}}).filter(q=>q.content)}

async _saveQuiz(status){
const title=document.getElementById('quiz-title').value.trim();
const topic=document.getElementById('quiz-topic').value.trim()||'Chung';
const timeLimit=parseInt(document.getElementById('quiz-time-limit').value)||0;
const showResult=document.getElementById('quiz-show-result').value;
const description=document.getElementById('quiz-description').value.trim();
const questions=this._collectQuizQuestions();
if(!title){this._toast('Nhập tên bộ đề','error');return}
if(questions.length<1){this._toast('Thêm ít nhất 1 câu hỏi','error');return}
// Validate all questions have content and at least 2 options
for(let i=0;i<questions.length;i++){
const q=questions[i];const filled=q.options.filter(o=>o);
if(filled.length<2){this._toast(`Câu ${i+1}: Cần ít nhất 2 đáp án`,'error');return}
if(!q.options[q.correctIndex]){this._toast(`Câu ${i+1}: Đáp án đúng không được trống`,'error');return}}
const data={title,topic,timeLimit,showResult,description,status,questions};
const editId=document.getElementById('quiz-edit-id').value;
try{
if(editId){await this.fb.updateQuiz(editId,data);this._toast('✅ Đã cập nhật bộ đề!','success')}
else{await this.fb.createQuiz(data);this._toast('✅ Đã tạo bộ đề!','success')}
this._resetQuizForm();
}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_resetQuizForm(){
document.getElementById('quiz-edit-id').value='';
document.getElementById('quiz-title').value='';
document.getElementById('quiz-topic').value='';
document.getElementById('quiz-time-limit').value='15';
document.getElementById('quiz-show-result').value='after_submit';
document.getElementById('quiz-description').value='';
document.getElementById('quiz-questions-container').innerHTML='';
document.getElementById('btn-quiz-cancel-edit').style.display='none';
this._quizQCounter=0;this._updateQuizQCount()}

_cancelQuizEdit(){this._resetQuizForm();this._toast('Đã hủy chỉnh sửa','info')}

_editQuiz(id){
const quiz=(this._teacherQuizzes||{})[id];if(!quiz)return;
document.getElementById('quiz-edit-id').value=id;
document.getElementById('quiz-title').value=quiz.title||'';
document.getElementById('quiz-topic').value=quiz.topic||'';
document.getElementById('quiz-time-limit').value=quiz.timeLimit||0;
document.getElementById('quiz-show-result').value=quiz.showResult||'after_submit';
document.getElementById('quiz-description').value=quiz.description||'';
document.getElementById('btn-quiz-cancel-edit').style.display='';
// Populate questions
document.getElementById('quiz-questions-container').innerHTML='';
this._quizQCounter=0;
if(quiz.questions){quiz.questions.forEach(q=>this._addQuizQuestion(q.content,q.options,q.correctIndex,q.explanation))}
// Scroll to form
document.getElementById('t-tab-quiz').scrollTo({top:0,behavior:'smooth'});
this._toast('✏️ Đang sửa bộ đề','info')}

async _deleteQuiz(id){
const quiz=(this._teacherQuizzes||{})[id];const name=quiz?quiz.title:'bộ đề';
const ok=await this._confirmDialog('🗑️ Xóa bộ đề',`Xóa <strong>${this._esc(name)}</strong>? Kết quả HS sẽ bị xóa.`,'Xóa','btn-danger');
if(!ok)return;try{await this.fb.deleteQuiz(id);this._toast('Đã xóa bộ đề!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

async _toggleQuizStatus(id){
const quiz=(this._teacherQuizzes||{})[id];if(!quiz)return;
const newStatus=quiz.status==='published'?'draft':'published';
try{await this.fb.updateQuiz(id,{status:newStatus});
this._toast(newStatus==='published'?'📢 Đã đăng!':'📝 Chuyển về nháp','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}}

_renderTeacherQuizList(quizzes){
const c=document.getElementById('t-quiz-list');if(!c)return;
const keys=Object.keys(quizzes||{});
const search=(document.getElementById('t-quiz-search')?.value||'').toLowerCase();
const filtered=keys.filter(k=>{const q=quizzes[k];
return(!search||(q.title||'').toLowerCase().includes(search)||(q.topic||'').toLowerCase().includes(search))});
if(!filtered.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Chưa có bộ đề.</p>';return}
const results=this._teacherQuizResults||{};
let h='<div class="quiz-bank-grid">';
filtered.sort((a,b)=>(quizzes[b].createdAt||0)-(quizzes[a].createdAt||0)).forEach(k=>{
const q=quizzes[k];const qCount=q.questions?q.questions.length:0;
const stuCount=results[k]?Object.keys(results[k]).length:0;
const statusCls=q.status==='published'?'published':'draft';
const statusTxt=q.status==='published'?'Đã đăng':'Nháp';
const time=q.timeLimit?q.timeLimit+' phút':'∞';
h+=`<div class="quiz-bank-card">
<div class="quiz-bank-card-header">
<h3 class="quiz-bank-card-title">${this._esc(q.title)}</h3>
<span class="quiz-bank-card-status ${statusCls}">${statusTxt}</span>
</div>
<div class="quiz-bank-card-meta">
<span>📂 ${this._esc(q.topic||'Chung')}</span>
<span>📝 ${qCount} câu</span>
<span>⏱ ${time}</span>
<span>👥 ${stuCount} HS</span>
</div>
${q.description?'<div class="quiz-bank-card-desc">'+this._esc(q.description)+'</div>':''}
<div class="quiz-bank-card-actions">
<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();window._uic._editQuiz('${k}')">✏️ Sửa</button>
<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();window._uic._toggleQuizStatus('${k}')">${q.status==='published'?'📝 Nháp':'📢 Đăng'}</button>
<button class="btn-danger-sm" onclick="event.stopPropagation();window._uic._deleteQuiz('${k}')">🗑</button>
${stuCount>0?`<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();window._uic._showQuizStats('${k}')">📊</button>`:''}
</div>
</div>`});
h+='</div>';c.innerHTML=h}

async _importQuizFromExcel(file){
try{const data=await file.arrayBuffer();
const wb=XLSX.read(data);const ws=wb.Sheets[wb.SheetNames[0]];
const rows=XLSX.utils.sheet_to_json(ws,{header:1});
if(rows.length<2){this._toast('File rỗng hoặc không đúng format','error');return}
// Skip header row
const container=document.getElementById('quiz-questions-container');
let imported=0;
for(let i=1;i<rows.length;i++){
const row=rows[i];if(!row||!row[0])continue;
const content=String(row[0]||'').trim();
const options=[String(row[1]||''),String(row[2]||''),String(row[3]||''),String(row[4]||'')];
const answerRaw=String(row[5]||'A').toUpperCase().trim();
const correctMap={A:0,B:1,C:2,D:3};
const correctIndex=correctMap[answerRaw]!==undefined?correctMap[answerRaw]:0;
const explanation=String(row[6]||'').trim();
this._addQuizQuestion(content,options,correctIndex,explanation);imported++}
this._toast(`✅ Đã import ${imported} câu hỏi!`,'success');
}catch(e){this._toast('Lỗi đọc file: '+e.message,'error')}}

_showQuizStats(quizId){
const quiz=(this._teacherQuizzes||{})[quizId];if(!quiz)return;
const results=(this._teacherQuizResults||{})[quizId]||{};
const stuNames=Object.keys(results);
if(!stuNames.length){this._toast('Chưa có HS nào làm bài','info');return}
let h=`<h3 style="font-size:1rem;font-weight:700;margin-bottom:12px">📊 Thống kê: ${this._esc(quiz.title)}</h3>`;
h+=`<div style="margin-bottom:12px;font-size:.82rem;color:var(--text-secondary)">
<span>👥 ${stuNames.length} HS</span> • <span>📝 ${quiz.questions?quiz.questions.length:0} câu</span></div>`;
h+='<table class="quiz-stats-table"><thead><tr><th>#</th><th>Họ tên</th><th>Điểm</th><th>Đúng</th><th>Thời gian</th><th>Nộp lúc</th></tr></thead><tbody>';
stuNames.sort((a,b)=>(results[b].score||0)-(results[a].score||0)).forEach((name,i)=>{
const r=results[name];const pct=Math.round((r.score||0));
const cls=pct>=80?'score-perfect':pct>=50?'score-pass':'score-fail';
const timeStr=r.timeSpent?Math.floor(r.timeSpent/60)+'p'+String(r.timeSpent%60).padStart(2,'0')+'s':'—';
const dateStr=r.submittedAt?new Date(r.submittedAt).toLocaleString('vi',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
h+=`<tr><td>${i+1}</td><td style="font-weight:600">${this._esc(name)}</td><td><span class="progress-score ${cls}">${pct}</span></td><td>${r.correct||0}/${r.total||0}</td><td>${timeStr}</td><td>${dateStr}</td></tr>`});
h+='</tbody></table>';
// Per-question stats
if(quiz.questions&&quiz.questions.length){
h+=`<h4 style="margin-top:16px;font-size:.88rem;font-weight:700">📋 Tỉ lệ đúng từng câu</h4>`;
h+='<div style="display:flex;flex-direction:column;gap:4px;margin-top:8px">';
quiz.questions.forEach((q,qi)=>{
let correctCount=0;stuNames.forEach(name=>{const r=results[name];
if(r.answers&&r.answers[qi]===q.correctIndex)correctCount++});
const pct=stuNames.length?Math.round(correctCount/stuNames.length*100):0;
const barColor=pct>=70?'var(--success)':pct>=40?'var(--warning)':'var(--error)';
h+=`<div style="display:flex;align-items:center;gap:8px;font-size:.78rem">
<span style="min-width:50px;font-weight:600">Câu ${qi+1}</span>
<div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px"></div></div>
<span style="min-width:40px;text-align:right;font-weight:700;color:${barColor}">${pct}%</span>
</div>`});h+='</div>'}
// Show as a modal-like overlay
const overlay=document.createElement('div');overlay.className='modal-overlay';overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:500';
const modal=document.createElement('div');modal.className='modal-content';modal.style.cssText='max-width:700px;max-height:85vh;overflow-y:auto';modal.innerHTML=h+'<div style="text-align:right;margin-top:16px"><button class="btn btn-ghost btn-sm" id="btn-close-quiz-stats">Đóng</button></div>';
overlay.appendChild(modal);document.body.appendChild(overlay);
modal.querySelector('#btn-close-quiz-stats').onclick=()=>overlay.remove();
overlay.onclick=e=>{if(e.target===overlay)overlay.remove()}}

async _generateQuizWithAI(){
const topic=document.getElementById('quiz-ai-topic')?.value.trim();
if(!topic){this._toast('Nhập chủ đề để AI tạo câu hỏi','error');return}
const numQ=parseInt(document.getElementById('quiz-ai-count')?.value)||10;
const difficulty=document.getElementById('quiz-ai-difficulty')?.value||'medium';
const runBtn=document.getElementById('btn-quiz-ai-run');
const runText=document.getElementById('quiz-ai-run-text');
// Sync API key from quiz-ai-key (quiz tab) or ai-api-key (compose tab)
const quizKeyInput=document.getElementById('quiz-ai-key');
const composeKeyInput=document.getElementById('ai-api-key');
// Priority: quiz tab key > compose tab key > localStorage
if(quizKeyInput&&quizKeyInput.value.trim()){this.gemini.setApiKey(quizKeyInput.value.trim());if(composeKeyInput)composeKeyInput.value=quizKeyInput.value.trim()}
else if(composeKeyInput&&composeKeyInput.value.trim()&&!this.gemini.getApiKey()){this.gemini.setApiKey(composeKeyInput.value.trim());if(quizKeyInput)quizKeyInput.value=composeKeyInput.value.trim()}
// If still no key, show inline error with guidance
if(!this.gemini||!this.gemini.getApiKey()){
this._toast('⚠️ Nhập Gemini API Key ở ô phía trên để AI tạo câu hỏi','error');
if(quizKeyInput){quizKeyInput.focus();quizKeyInput.style.borderColor='var(--danger)';setTimeout(()=>{quizKeyInput.style.borderColor=''},3000)}
return}
// Check if existing questions — confirm before clearing
const container=document.getElementById('quiz-questions-container');
if(container.children.length>0){
if(!confirm(`Đã có ${container.children.length} câu hỏi. Xóa hết và tạo mới bằng AI?`))return;
container.innerHTML='';this._quizQCounter=0;this._updateQuizQCount()}
// Loading state
runBtn.disabled=true;runText.textContent='⏳ AI đang tạo đề...';
try{
const questions=await this.gemini.generateQuiz(topic,numQ,difficulty);
if(!questions||!questions.length){this._toast('AI không trả về câu hỏi nào','error');return}
// Validate and populate questions
let added=0;
questions.forEach((q,i)=>{
const content=String(q.content||'').trim();
if(!content){console.warn(`[AI Quiz] Câu ${i+1} trống content, bỏ qua`);return}
const opts=Array.isArray(q.options)?q.options.map(o=>String(o||'')):['','','',''];
while(opts.length<4)opts.push('');
const ci=typeof q.correctIndex==='number'?Math.min(Math.max(q.correctIndex,0),3):0;
const explain=String(q.explanation||'');
this._addQuizQuestion(content,opts,ci,explain);
added++});
if(added===0){this._toast('AI tạo câu hỏi nhưng nội dung trống. Thử lại.','error');return}
// Auto-fill form fields if empty
const topicField=document.getElementById('quiz-topic');
if(!topicField.value)topicField.value=topic;
const titleField=document.getElementById('quiz-title');
if(!titleField.value)titleField.value=`Trắc nghiệm: ${topic}`;
this._toast(`🤖 AI đã tạo ${added} câu hỏi thành công!`,'success');
document.getElementById('quiz-ai-config').classList.add('hidden');
}catch(e){console.error('[AI Quiz] Error:',e);this._toast('AI lỗi: '+e.message,'error')}
finally{runBtn.disabled=false;runText.textContent='🚀 Tạo câu hỏi'}}

// ============ QUIZ MODULE — STUDENT ============
_renderStudentQuizList(){
const c=document.getElementById('stu-quiz-list');if(!c)return;
const quizzes=this._stuQuizzes||{};const results=this._stuQuizResults||{};
const keys=Object.keys(quizzes).filter(k=>quizzes[k].status==='published');
const search=(document.getElementById('stu-quiz-search')?.value||'').toLowerCase();
const filter=document.getElementById('stu-quiz-filter')?.value||'all';
const filtered=keys.filter(k=>{
const q=quizzes[k];const r=results[k]?results[k][this.studentName]:null;
const matchSearch=!search||(q.title||'').toLowerCase().includes(search)||(q.topic||'').toLowerCase().includes(search);
const isDone=!!r;
const matchFilter=filter==='all'||(filter==='done'&&isDone)||(filter==='notdone'&&!isDone);
return matchSearch&&matchFilter});
if(!filtered.length){c.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px">Không có bộ đề nào.</p>';return}
let h='<div class="stu-quiz-grid">';
filtered.sort((a,b)=>(quizzes[b].createdAt||0)-(quizzes[a].createdAt||0)).forEach(k=>{
const q=quizzes[k];const myResult=results[k]?results[k][this.studentName]:null;
const isDone=!!myResult;const qCount=q.questions?q.questions.length:0;
const time=q.timeLimit?q.timeLimit+' phút':'∞';
let scoreHtml='';
if(isDone){const pct=myResult.score||0;const cls=pct>=80?'perfect':pct>=50?'partial':'low';
scoreHtml=`<span class="stu-quiz-card-score ${cls}">${pct}%</span>`}
else{scoreHtml='<span class="stu-quiz-card-score notdone">Chưa làm</span>'}
h+=`<div class="stu-quiz-card ${isDone?'done':'notdone'}" onclick="window._uic._openStudentQuiz('${k}')">
${scoreHtml}
<div class="stu-quiz-card-title">${this._esc(q.title)}</div>
<span class="stu-quiz-card-topic">${this._esc(q.topic||'Chung')}</span>
<div class="stu-quiz-card-meta">
<span>📝 ${qCount} câu</span>
<span>⏱ ${time}</span>
${isDone?'<span>✅ Đã làm</span>':''}
</div>
</div>`});
h+='</div>';c.innerHTML=h}

_quizStartTime=0;_quizTimerInterval=null;_quizCurrentIdx=0;_quizAnswers=[];_currentQuizId=null;_currentQuizData=null;

_openStudentQuiz(quizId){
const quizzes=this._stuQuizzes||{};const quiz=quizzes[quizId];if(!quiz)return;
this._currentQuizId=quizId;this._currentQuizData=quiz;
const questions=quiz.questions||[];
this._quizAnswers=new Array(questions.length).fill(-1);
this._quizCurrentIdx=0;this._quizStartTime=Date.now();
// Switch screens
document.getElementById('stu-dashboard').classList.add('hidden');
document.getElementById('stu-quiz-taking').classList.remove('hidden');
document.getElementById('stu-quiz-title').textContent=quiz.title;
document.getElementById('stu-quiz-player').textContent=this.studentName;
// Render questions
this._renderQuizTakingQuestions(questions);
this._renderQuizNavGrid(questions);
this._scrollToQuizQuestion(0);
// Timer
if(this._quizTimerInterval){clearInterval(this._quizTimerInterval);this._quizTimerInterval=null}
if(quiz.timeLimit&&quiz.timeLimit>0){
const totalSec=quiz.timeLimit*60;
const timerEl=document.getElementById('stu-quiz-timer');
this._quizTimerInterval=setInterval(()=>{
const elapsed=Math.floor((Date.now()-this._quizStartTime)/1000);
const remain=Math.max(0,totalSec-elapsed);
const m=Math.floor(remain/60);const s=remain%60;
timerEl.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
if(remain<=60)timerEl.classList.add('critical');
if(remain<=0){clearInterval(this._quizTimerInterval);this._quizTimerInterval=null;this._submitQuiz()}},1000)}
else{document.getElementById('stu-quiz-timer').textContent='∞'}
// Submit button
document.getElementById('btn-quiz-submit').onclick=()=>this._submitQuiz();
document.getElementById('btn-quiz-result-close').onclick=()=>this._exitQuizTaking()}

_renderQuizTakingQuestions(questions){
const main=document.getElementById('quiz-taking-main');
let h='';questions.forEach((q,i)=>{
const labels=['A','B','C','D'];
h+=`<div class="quiz-take-q" id="quiz-take-q-${i}">
<div class="quiz-take-q-header">
<span class="quiz-take-q-badge">${i+1}</span>
<span class="quiz-take-q-num">Câu ${i+1}. Chọn đáp án đúng nhất</span>
</div>
<div class="quiz-take-q-content">${this._esc(q.content)}</div>
<div class="quiz-take-options">`;
q.options.forEach((opt,oi)=>{if(!opt)return;
h+=`<div class="quiz-take-option" data-qi="${i}" data-oi="${oi}" onclick="window._uic._selectQuizOption(${i},${oi})">
<span class="quiz-take-option-letter">${labels[oi]}</span>
<span class="quiz-take-option-text">${this._esc(opt)}</span>
</div>`});
h+='</div></div>'});
main.innerHTML=h}

_selectQuizOption(qi,oi){
this._quizAnswers[qi]=oi;
// Update visual
document.querySelectorAll(`.quiz-take-option[data-qi="${qi}"]`).forEach(el=>{el.classList.remove('selected')});
const sel=document.querySelector(`.quiz-take-option[data-qi="${qi}"][data-oi="${oi}"]`);if(sel)sel.classList.add('selected');
// Update nav grid
this._updateQuizNavBtn(qi)}

_renderQuizNavGrid(questions){
const grid=document.getElementById('quiz-nav-grid');
let h='';questions.forEach((q,i)=>{
h+=`<button class="quiz-nav-btn${i===0?' current':''}" data-qi="${i}" onclick="window._uic._scrollToQuizQuestion(${i})">${i+1}</button>`});
grid.innerHTML=h}

_updateQuizNavBtn(qi){
const btn=document.querySelector(`.quiz-nav-btn[data-qi="${qi}"]`);
if(btn&&this._quizAnswers[qi]>=0)btn.classList.add('answered')}

_scrollToQuizQuestion(qi){
const el=document.getElementById(`quiz-take-q-${qi}`);
if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
// Update current in nav
document.querySelectorAll('.quiz-nav-btn').forEach(b=>b.classList.remove('current'));
const btn=document.querySelector(`.quiz-nav-btn[data-qi="${qi}"]`);if(btn)btn.classList.add('current');
this._quizCurrentIdx=qi}

async _submitQuiz(){
if(this._quizTimerInterval){clearInterval(this._quizTimerInterval);this._quizTimerInterval=null}
const quiz=this._currentQuizData;if(!quiz)return;
const questions=quiz.questions||[];const answers=this._quizAnswers;
const unanswered=answers.filter(a=>a<0).length;
if(unanswered>0){
const ok=await this._confirmDialog('📤 Nộp bài',`Bạn còn ${unanswered} câu chưa trả lời. Nộp bài?`,'Nộp','btn-accent');
if(!ok)return}
// Grade
let correct=0;answers.forEach((a,i)=>{if(questions[i]&&a===questions[i].correctIndex)correct++});
const total=questions.length;const score=total>0?Math.round(correct/total*100):0;
const timeSpent=Math.floor((Date.now()-this._quizStartTime)/1000);
const result={score,correct,total,timeSpent,answers};
// Save to Firebase
try{await this.fb.submitQuizResult(this._currentQuizId,this.studentName,result);
this._toast('✅ Đã nộp bài!','success')}catch(e){this._toast('Lỗi: '+e.message,'error')}
// Show result
this._showQuizResult(quiz,result)}

_showQuizResult(quiz,result){
const overlay=document.getElementById('quiz-result-overlay');
const headerEl=document.getElementById('quiz-result-header');
const bodyEl=document.getElementById('quiz-result-body');
const scoreCls=result.score>=80?'perfect':result.score>=50?'partial':'low';
const emoji=result.score>=80?'🎉':result.score>=50?'👍':'😔';
const timeStr=result.timeSpent?Math.floor(result.timeSpent/60)+'p'+String(result.timeSpent%60).padStart(2,'0')+'s':'—';
headerEl.innerHTML=`<div style="font-size:1.5rem">${emoji}</div>
<div class="quiz-result-score ${scoreCls}">${result.score}%</div>
<div class="quiz-result-stats">
<span>✅ ${result.correct}/${result.total} câu đúng</span>
<span>⏱ ${timeStr}</span>
</div>`;
// Detail review
const questions=quiz.questions||[];
const showResult=quiz.showResult||'after_submit';
if(showResult==='never'){bodyEl.innerHTML='<p style="text-align:center;color:var(--text-muted);padding:20px">Giáo viên đã tắt hiển thị đáp án.</p>'}
else{
let h='';questions.forEach((q,i)=>{
const userAns=result.answers[i];const isCorrect=userAns===q.correctIndex;
const labels=['A','B','C','D'];
const userLabel=userAns>=0?labels[userAns]:'—';
const correctLabel=labels[q.correctIndex];
h+=`<div class="quiz-review-item">
<div class="quiz-review-q">${i+1}. ${this._esc(q.content)}</div>
<div class="quiz-review-answer ${isCorrect?'correct':'wrong'}">
${isCorrect?'✅':'❌'} Bạn chọn: ${userLabel}${!isCorrect?' → Đáp án đúng: '+correctLabel:''}
</div>
${q.explanation?'<div class="quiz-review-explain">💡 '+this._esc(q.explanation)+'</div>':''}
</div>`});
bodyEl.innerHTML=h}
overlay.classList.remove('hidden')}

_exitQuizTaking(){
if(this._quizTimerInterval){clearInterval(this._quizTimerInterval);this._quizTimerInterval=null}
document.getElementById('stu-quiz-taking').classList.add('hidden');
document.getElementById('quiz-result-overlay').classList.add('hidden');
document.getElementById('stu-dashboard').classList.remove('hidden');
this._currentQuizId=null;this._currentQuizData=null;
this._renderStudentQuizList()}
}

document.addEventListener('DOMContentLoaded',()=>{const uic=new UIController();window._uic=uic;uic.init()});
