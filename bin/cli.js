#!/usr/bin/env node

const { Command } = require('commander')
const { compile, save } = require('../lib/index')
const pkg = require('../package.json')
const logger = require('../lib/logger')

const MailDuck = new Command()
  .version(pkg.version)
  .description('Mailduck CLI 🦆')
  .argument('<inputs>')
  .option('-d, --debug', 'output extra debugging')
  .option('-w, --watch <watchdir>', 'enable watch directory')
  .option('-s, --sass <sasspath>', 'external SASS file for mail styles')
  .option('-m, --minify', 'minify HTML output')
  .requiredOption('-o, --outdir <outdir>', 'output directory')
  .action(async (inputs, options) => {
    options.minify = options.minify || true

    if (options.debug) console.info('Mailduck called with options %o', options)

    logger.start({ inputs, minify: options.minify })

    const emails = await compile({
      inputs,
      sasspath: options.sass,
      minify: options.minify
    })

    logger.save({ outdir: options.outdir })

    await save({
      emails,
      outdir: options.outdir
    })

    logger.finish({ outdir: options.outdir })
  })

MailDuck.parse(process.argv)
