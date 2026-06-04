#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import pc from 'picocolors';
import { Command } from 'commander';
import boxen from 'boxen';

const program = new Command();

program
  .name('pkg-roast')
  .description('Scans your package.json and brutally roasts your dependency choices.')
  .version('1.0.0')
  .parse(process.argv);

const banner = `
    ██████╗ ██╗  ██╗ ██████╗    ██████╗  ██████╗  █████╗ ███████╗████████╗
    ██╔══██╗██║ ██╔╝██╔════╝    ██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝
    ██████╔╝█████╔╝ ██║  ███╗   ██████╔╝██║   ██║███████║███████╗   ██║   
    ██╔═══╝ ██╔═██╗ ██║   ██║   ██╔══██╗██║   ██║██╔══██║╚════██║   ██║   
    ██║     ██║  ██╗╚██████╔╝   ██║  ██║╚██████╔╝██║  ██║███████║   ██║   
    ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   
`;

console.log(pc.red(banner));
console.log(pc.gray('    Prepare to be judged.\n'));

const pkgPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.log(pc.red('❌ No package.json found in this directory. Are you even writing code?'));
  console.log(pc.cyan('\nArchitected by @lakshanmuruganandam\n'));
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
} catch (e) {
  console.log(pc.red('❌ Your package.json is invalid JSON. I can\'t even roast this, it\'s just broken.'));
  console.log(pc.cyan('\nArchitected by @lakshanmuruganandam\n'));
  process.exit(1);
}

const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const depNames = Object.keys(deps);

if (depNames.length === 0) {
  console.log(pc.green('✨ Zero dependencies? Look at you, Mr. Vanilla JS. I respect it.'));
  console.log(pc.cyan('\nArchitected by @lakshanmuruganandam\n'));
  process.exit(0);
}

const roasts = [];

const rules = [
  { match: 'moment', text: "Moment.js? It's been deprecated since dinosaurs roamed the earth. Use dayjs or date-fns." },
  { match: 'lodash', text: "Lodash? Just learn how to use modern JavaScript array methods. It's not 2015 anymore." },
  { match: 'request', text: "Request was officially deprecated in 2020. Have you heard of 'fetch' or 'axios'?" },
  { match: 'jquery', text: "JQuery?! Are we building a WordPress site in 2012?" },
  { match: 'express', text: "Express is fine, I guess. But maybe it's time to learn Fastify or Hono like the cool kids." },
  { match: 'react', text: "React. Let me guess, you have 10 layers of Context Providers and wonder why your app is slow?" },
  { match: 'redux', text: "Redux? Have fun writing 500 lines of boilerplate just to toggle a boolean." },
  { match: 'tailwindcss', text: "Tailwind. Because writing class='text-red-500 w-full h-10 mt-5 flex justify-center' is totally cleaner than actual CSS." },
  { match: 'mongoose', text: "Mongoose. Good luck fighting the ODM schema when you just wanted to write a simple SQL join." },
  { match: 'chalk', text: "Chalk? You should be using picocolors. It's 10x faster and smaller. Upgrade your life." },
  { match: 'typescript', text: "TypeScript. You probably spend more time fighting 'any' types than writing actual logic." },
  { match: 'nodemon', text: "Nodemon? Node has native --watch now. Keep up." }
];

for (const dep of depNames) {
  for (const rule of rules) {
    if (dep.includes(rule.match)) {
      roasts.push(`📦 ${pc.yellow(dep)}:\n   ↳ ${pc.white(rule.text)}`);
    }
  }
}

const typeWriter = async (text, speed = 10) => {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await new Promise(r => setTimeout(r, speed));
  }
  console.log();
};

const run = async () => {
  console.log(pc.blue(`Scanning ${depNames.length} dependencies...`));
  await new Promise(r => setTimeout(r, 1000));
  console.log();

  if (roasts.length === 0) {
    await typeWriter(pc.green("Honestly... your stack is surprisingly clean. I can't even roast you. Good job."));
  } else {
    for (const roast of roasts) {
      await typeWriter(roast, 15);
      await new Promise(r => setTimeout(r, 500));
      console.log();
    }
    await typeWriter(pc.red("Do better."));
  }

  console.log(pc.cyan('\nArchitected by @lakshanmuruganandam\n'));
};

run();
