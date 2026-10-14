#!/usr/bin/env node
import { run } from '../lib/cli.js';

try {
  process.exitCode = await run(process.argv.slice(2));
} catch (error) {
  console.error(`GitStart: ${error.message}`);
  process.exitCode = 1;
}
