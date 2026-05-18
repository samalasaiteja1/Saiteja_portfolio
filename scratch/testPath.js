const path = require('path');
const fs = require('fs');

const resumeUrl = '/uploads/resume-1779117828130.pdf';
const controllerDir = 'e:\\Hva\\Portfolio Management System\\controllers';
const filePath = path.join(controllerDir, '../public', resumeUrl);

console.log('CONSTRUCTED FILE PATH:', filePath);
console.log('EXISTS?:', fs.existsSync(filePath));
