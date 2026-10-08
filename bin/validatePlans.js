#!/usr/bin/env node
// Validate each YAML plan in public/plans/yaml against public/schema/plan-schema-v1.json.
// Exits non-zero if any plan is invalid.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const plansDir = join(root, "public", "plans", "yaml");
const schemaPath = join(root, "public", "schema", "plan-schema-v1.json");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, "utf8")));

const files = readdirSync(plansDir)
  .filter((f) => f.endsWith(".yaml"))
  .sort();

let invalid = 0;
for (const file of files) {
  let errors = [];
  try {
    const plan = parse(readFileSync(join(plansDir, file), "utf8"));
    if (!validate(plan)) {
      errors = validate.errors.map(
        (e) => `${e.instancePath || "/"} ${e.message}`,
      );
    }
  } catch (e) {
    errors = [`could not be parsed: ${e.message}`];
  }

  if (errors.length > 0) {
    invalid++;
    console.error(`INVALID ${file}`);
    for (const error of errors) {
      console.error(`  ${error}`);
    }
  }
}

console.log(`${files.length - invalid} of ${files.length} plans are valid`);
process.exit(invalid > 0 ? 1 : 0);
