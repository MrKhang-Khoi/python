const fs=require('fs');
const c=fs.readFileSync('script.js','utf8');
try{new Function(c);console.log('Syntax: OK')}catch(e){console.log('Syntax ERR:',e.message)}
console.log('Has testGenCode schema:', c.includes('testGenCode'));
console.log('Has TUYET DOI KHONG:', c.includes('TUYỆT ĐỐI KHÔNG'));
console.log('Has input() validation:', c.includes("if(!code.includes('input("));  
console.log('Has sys.__stdout__:', c.includes('sys.__stdout__'));
console.log('No sys.__stdout (single):', !c.includes("sys.__stdout'"));
console.log('Has maxN in subtask schema:', c.includes('maxN'));
console.log('Has mock_input in runPy:', c.includes('_mock_input') || c.includes('_inp'));
