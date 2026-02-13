import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing the YAML files
const plansDir = path.join(__dirname, '../public/plans/yaml');
// Path to the schema file
const schemaPath = path.join(__dirname, '../public/schema/plan-schema.json');

// Read all YAML files in the directory
fs.readdir(plansDir, (err, files) => {
  if (err) {
    console.error('Error reading plans directory:', err);
    process.exit(1);
  }

  files.filter(file => file.endsWith('.yaml')).forEach(file => {
    const filePath = path.join(plansDir, file);
    console.log(`Validating plan ${filePath} ...`);

    // Quote the schema and data file paths to handle spaces
    const command = `ajv -s "${schemaPath}" -d "${filePath}"`;
    exec(command, (error, stderr) => {
      if (error) {
        console.error(`Validation failed for ${filePath}:`, stderr);
      } else {
        console.log(`Validation succeeded for ${filePath}`);
      }
    });
  });
});