#!/usr/bin/env node
import { runAllEvals } from './index';
import * as dotenv from 'dotenv';
import { EvalConfig } from './types';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
dotenv.config();

async function main() {
  // Get the path to user's evals from command line args
  const userEvalsPath = process.argv[2];
  if (!userEvalsPath) {
    console.error('Please provide a path to your evals file');
    process.exit(1);
  }

  // Convert relative path to absolute
  const absolutePath = path.resolve(process.cwd(), userEvalsPath);

  // Dynamically import user's evals
  const userModule = await import(absolutePath);
  console.log('Loaded module:', userModule); // Debug log
  const config: EvalConfig = userModule.default;
  console.log('Config:', config); // Debug log

  if (!config || !config.evals) {
    console.error('Invalid config: must export a default config with evals array');
    process.exit(1);
  }

  console.log('Running all evaluations...\n');
  const results = await runAllEvals(config);
  
  console.log('\nEvaluation Results:');
  for (const [name, result] of results.entries()) {
    console.log(`\n${name}:`);
    console.log(JSON.stringify(result, null, 2));
  }
  process.exit(0);
}

main().catch(error => {
  console.error('Error running evaluations:', error);
  process.exit(1);
}); 