// Patch script: Fix AI prompt + test generation for Themis compatibility
const fs = require('fs');
const file = 'script.js';
let code = fs.readFileSync(file, 'utf8');

// 1. Replace the prompt (from "const dl=" to the schema line)
const promptStart = "const dl={easy:'Dễ',medium:'Trung bình',hard:'Khó',hsg:'HSG tỉnh'}[diff]||'Trung bình';\r\n";
const promptAndSchemaEnd = "try{const schema={type:'object',properties:{title:{type:'string'},description:{type:'string'},inputFormat:{type:'string'},outputFormat:{type:'string'},constraints:{type:'array',items:{type:'string'}},sampleIO:{type:'array',items:{type:'object',properties:{input:{type:'string'},output:{type:'string'},explain:{type:'string'}},required:['input','output']}},solutionCode:{type:'string'},subtasks:{type:'array',items:{type:'object',properties:{name:{type:'string'},percent:{type:'number'}},required:['name','percent']}}},required:['title','description','inputFormat','outputFormat','solutionCode','sampleIO','constraints','subtasks']};";

const newPromptAndSchema = `const dl={easy:'Dễ',medium:'Trung bình',hard:'Khó',hsg:'HSG tỉnh'}[diff]||'Trung bình';\r
const prompt=\`Bạn là giáo viên Tin học GIỎI, soạn đề thi Python lớp \${grade}.

## YÊU CẦU:
- Chủ đề: \${topic}
- Độ khó: \${dl}
\${extra?'- Thêm: '+extra:''}

## ĐỀ BÀI:
- Tiếng Việt rõ ràng, chi tiết, có tình huống thực tế
- Input format: ghi rõ TỪNG DÒNG input gồm gì
- Output format: ghi rõ kết quả in ra màn hình
- Constraints: giới hạn cụ thể (VD: 1 ≤ N ≤ 10^6)
- 2 ví dụ kèm giải thích CHI TIẾT

## CODE ĐÁP ÁN (solutionCode) — CỰC KỲ QUAN TRỌNG:
CODE PHẢI CHẠY ĐƯỢC ĐỘC LẬP TRÊN THEMIS ONLINE JUDGE:
1. DÒNG ĐẦU: đọc dữ liệu bằng input()
2. GIỮA: xử lý thuật toán
3. DÒNG CUỐI: print() kết quả ra stdout
⚠️ TUYỆT ĐỐI KHÔNG chỉ viết function rồi dừng — PHẢI có phần main đọc input() và print()
⚠️ KHÔNG dùng if __name__
- Python 3 ĐƠN GIẢN, biến tiếng Việt không dấu
- Comment tiếng Việt giải thích mỗi bước
- KHÔNG thư viện ngoài, chỉ input()/print()

VD ĐÚNG:
n = int(input())
tong = 0
for i in range(1, n+1): tong += i
print(tong)

VD SAI (KHÔNG ĐƯỢC làm thế này):
def tinh(n): return n*(n+1)//2
# ← THIẾU input() và print()

## CODE SINH TEST (testGenCode) — QUAN TRỌNG:
Code Python ĐỘC LẬP sinh 1 bộ test ngẫu nhiên.
- Nhận tham số MAX_N qua biến max_n ở dòng đầu: max_n = int(input())
- print() ra dữ liệu INPUT theo đúng format đề bài
- Dùng import random

VD: Input đề là "dòng 1: N, dòng 2: N số":
import random
max_n = int(input())
n = random.randint(1, max_n)
print(n)
print(' '.join(str(random.randint(1,10**9)) for _ in range(n)))

## SUBTASKS:
- 2-4 subtask, tổng 100%
- Mỗi subtask PHẢI có maxN cụ thể\`;`;

const newSchema = `try{const schema={type:'object',properties:{title:{type:'string'},description:{type:'string'},inputFormat:{type:'string'},outputFormat:{type:'string'},constraints:{type:'array',items:{type:'string'}},sampleIO:{type:'array',items:{type:'object',properties:{input:{type:'string'},output:{type:'string'},explain:{type:'string'}},required:['input','output']}},solutionCode:{type:'string'},testGenCode:{type:'string',description:'Code Python sinh 1 bộ test input. Dòng đầu: max_n=int(input()). Sau đó print dữ liệu input theo format đề.'},subtasks:{type:'array',items:{type:'object',properties:{name:{type:'string'},percent:{type:'number'},maxN:{type:'number',description:'Giới hạn N tối đa cho subtask'}},required:['name','percent','maxN']}}},required:['title','description','inputFormat','outputFormat','solutionCode','testGenCode','sampleIO','constraints','subtasks']};`;

// Find and replace prompt
const oldPromptIdx = code.indexOf(promptStart);
const oldSchemaIdx = code.indexOf(promptAndSchemaEnd);
if (oldPromptIdx === -1) { console.log('ERR: prompt start not found'); process.exit(1); }
if (oldSchemaIdx === -1) { console.log('ERR: schema not found'); process.exit(1); }

const beforePrompt = code.substring(0, oldPromptIdx);
const afterSchema = code.substring(oldSchemaIdx + promptAndSchemaEnd.length);

// Remove old prompt line between promptStart and schema
const oldPromptLine = code.substring(oldPromptIdx, oldSchemaIdx);
console.log('Old prompt found, length:', oldPromptLine.length);

code = beforePrompt + newPromptAndSchema + '\r\n' + newSchema + afterSchema;

// 2. Add validation after parsing JSON
const parseOk = "this._utilData=JSON.parse(txt);if(!this._utilData.title||!this._utilData.solutionCode)throw new Error('AI trả thiếu dữ liệu');";
const parseOkNew = `this._utilData=JSON.parse(txt);if(!this._utilData.title||!this._utilData.solutionCode)throw new Error('AI trả thiếu dữ liệu');
// VALIDATE: code phải có input()
if(!this._utilData.solutionCode.includes('input(')){this._toast('⚠️ AI sinh code thiếu input() — kiểm tra lại!','error')}`;

code = code.replace(parseOk, parseOkNew);

// 3. Replace verify + test gen pipeline
const oldVerifyStart = "async _utilVerifyAndGenTests(){";
const oldVerifyEnd = "}catch(e){addV('❌',e.message);document.getElementById('btn-util-back2').classList.remove('hidden')}}";

const verifyStartIdx = code.indexOf(oldVerifyStart);
const verifyEndIdx = code.indexOf(oldVerifyEnd);
if (verifyStartIdx === -1) { console.log('ERR: verify start not found'); process.exit(1); }
if (verifyEndIdx === -1) { console.log('ERR: verify end not found'); process.exit(1); }

const beforeVerify = code.substring(0, verifyStartIdx);
const afterVerify = code.substring(verifyEndIdx + oldVerifyEnd.length);

const newVerify = `async _utilVerifyAndGenTests(){const code=this._utilCM?this._utilCM.getValue():'';if(!code.trim()){this._toast('Chưa có code','error');return}
if(!code.includes('input(')){this._toast('⚠️ Code thiếu input() — Themis cần đọc stdin!','error');return}
const data=this._utilData;if(!data)return;data.title=document.getElementById('util-title').value.trim()||data.title;data.description=document.getElementById('util-description').value||data.description;data.inputFormat=document.getElementById('util-input-format').value||data.inputFormat;data.outputFormat=document.getElementById('util-output-format').value||data.outputFormat;data.solutionCode=code;
this._utilSetStep(3);document.getElementById('util-step2').classList.add('hidden');document.getElementById('util-step3').classList.remove('hidden');
const vs=document.getElementById('util-verify-status');vs.innerHTML='';
const addV=(ic,tx)=>{vs.innerHTML+=\`<div class="util-verify-item"><span class="util-verify-icon">\${ic}</span><span>\${tx}</span></div>\`};
addV('⏳','Khởi tạo Pyodide...');
try{if(!window.pyodideReady){if(!window.pyodideReadyPromise)window.pyodideReadyPromise=loadPyodide();await window.pyodideReadyPromise;window.pyodideReady=true}
const py=await window.pyodideReadyPromise||window.pyodide;addV('✅','Pyodide sẵn sàng');
// Helper: chạy Python với mock stdin, trả stdout
const runPy=async(c,inp)=>{
py.globals.set('__stdin_data',inp||'');
py.runPython(\`import sys,io
_lines=__stdin_data.strip().split('\\\\n') if __stdin_data.strip() else []
_idx=[0]
def _inp(p=''):
 if _idx[0]<len(_lines):r=_lines[_idx[0]];_idx[0]+=1;return r
 return ''
__builtins__.__dict__['input']=_inp
_out=io.StringIO();sys.stdout=_out\`);
try{py.runPython(c)}catch(err){py.runPython('sys.stdout=sys.__stdout__');throw err}
const out=py.runPython('_out.getvalue()');
py.runPython('sys.stdout=sys.__stdout__');
return (out||'').trim()};
// Bước 1: Verify sample IO
addV('⏳','Kiểm tra code với ví dụ mẫu...');
let ok=true;for(let i=0;i<(data.sampleIO||[]).length;i++){const s=data.sampleIO[i];try{const o=await runPy(code,s.input);const exp=s.output.trim();if(o===exp)addV('✅',\`Ví dụ \${i+1}: Đúng\`);else{addV('❌',\`Ví dụ \${i+1}: Sai — got "\${o}" expected "\${exp}"\`);ok=false}}catch(ex){addV('❌',\`Ví dụ \${i+1}: Runtime error — \${ex.message}\`);ok=false}}
if(!ok){addV('⚠️','Code sai hoặc input/output không đúng format Themis. Kiểm tra lại!');document.getElementById('btn-util-back2').classList.remove('hidden');return}
// Bước 2: Sinh test bằng testGenCode
addV('⏳','Sinh test cases...');const tests=[];const subs=data.subtasks||[{name:'Full',percent:100,maxN:100}];
const genCode=data.testGenCode||'';
if(!genCode.trim()){addV('⚠️','Không có testGenCode — chỉ dùng sample IO');data.sampleIO.forEach((s,i)=>tests.push({input:s.input,output:s.output.trim(),subtaskId:0}))}
else{for(let si=0;si<subs.length;si++){const sub=subs[si];const maxN=sub.maxN||100;addV('⏳',\`Subtask \${si+1}: \${sub.name} (N≤\${maxN})...\`);
let genOk=0;for(let ti=0;ti<5;ti++){try{
const testInput=await runPy(genCode,String(maxN));
if(!testInput.trim()){addV('⚠️',\`Test \${si+1}.\${ti+1}: Generator trả rỗng\`);continue}
const testOutput=await runPy(code,testInput);
tests.push({input:testInput,output:testOutput,subtaskId:si});genOk++
}catch(ex){addV('⚠️',\`Test \${si+1}.\${ti+1}: \${ex.message}\`)}}
if(genOk>0)addV('✅',\`Subtask \${si+1}: \${genOk} tests ✓\`);
else addV('❌',\`Subtask \${si+1}: Không sinh được test!\`)}}
// Bước 3: Edge cases (N=1 và N=max)
if(genCode.trim()){addV('⏳','Sinh edge cases...');
try{const e1=await runPy(genCode,'1');const o1=await runPy(code,e1);tests.push({input:e1,output:o1,subtaskId:subs.length-1});
const maxSub=subs[subs.length-1]?.maxN||1000;const e2=await runPy(genCode,String(maxSub));const o2=await runPy(code,e2);tests.push({input:e2,output:o2,subtaskId:subs.length-1});
addV('✅','2 edge cases ✓')}catch(ex){addV('⚠️','Edge: '+ex.message)}}
this._utilTestCases=tests;const tp=document.getElementById('util-test-preview'),tl=document.getElementById('util-test-list');tp.classList.remove('hidden');
tl.innerHTML=tests.slice(0,8).map((t,i)=>\`<div class="util-test-row"><span class="util-test-num">Test \${i+1}<br><small>ST\${t.subtaskId+1}</small></span><div class="util-test-io"><pre>\${this._esc(t.input.substring(0,200))}</pre><pre>\${this._esc(t.output.substring(0,200))}</pre></div></div>\`).join('')+(tests.length>8?\`<p style="text-align:center;color:var(--text-muted);font-size:.82rem">... và \${tests.length-8} test khác</p>\`:'');
addV('🎉',\`\${tests.length} test cases!\`);['btn-util-back2','btn-util-publish','btn-util-to-contest'].forEach(id=>document.getElementById(id).classList.remove('hidden'));
}catch(e){addV('❌',e.message);document.getElementById('btn-util-back2').classList.remove('hidden')}}`;

code = beforeVerify + newVerify + afterVerify;

fs.writeFileSync(file, code, 'utf8');
console.log('DONE! File patched successfully.');
console.log('Lines:', code.split('\n').length);

// Verify syntax
try { new Function(code); console.log('Syntax: OK'); } 
catch(e) { console.log('Syntax ERROR:', e.message); }
