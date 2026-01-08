// Script to extract specific data from BIM - Digital Twin 2025.xlsx
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'BIM - Digital Twin 2025.xlsx');
console.log('Reading file:', filePath);

try {
    const workbook = XLSX.readFile(filePath);
    console.log('\n📋 All Sheet names:', workbook.SheetNames.join(', '));

    const outputData = {};

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length > 0) {
            outputData[sheetName] = {
                headers: Object.keys(data[0]),
                rowCount: data.length,
                sample: data.slice(0, 10) // First 10 rows
            };
        }
    });

    // Write to JSON file for easy reading
    const outputPath = path.join(__dirname, 'excel-data-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log('\n✅ Data exported to:', outputPath);

    // Print summary
    console.log('\n📊 Sheet Summary:');
    Object.entries(outputData).forEach(([name, info]) => {
        console.log(`\n--- ${name} (${info.rowCount} rows) ---`);
        console.log('Headers:', info.headers.join(' | '));
    });

} catch (error) {
    console.error('Error reading Excel file:', error.message);
}
