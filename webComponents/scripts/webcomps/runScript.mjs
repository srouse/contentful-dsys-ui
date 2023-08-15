import childProcess from 'child_process';
import {logDone, logError, logStart, logUpdate} from './log.mjs';

/**
 * Run a script with real time output
 * @param {string} command
 * @param {object} args
 * @param {boolean} doRealTimeOutput
 * @param {function} callback
 */
export default async function runScript(
  command,
  args,
) {
  return new Promise((resolve, reject) => {
    logStart('Child Process', true);
    const child = childProcess.spawn(
      command,
      args,
    );

    const allOutput = [];
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        logUpdate(data);
        allOutput.push(data.toString());
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        logError(data);
        allOutput.push(data.toString());
        reject(data);
    });

    child.on('close', (exitCode) => {
        logDone(`Child Process, exit code: ${exitCode}`, true);
        resolve(allOutput.join('\n'));
    });
  });
}

/**
 * Run Script with Inherit on
 * @param {string} command
 * @param {string[]} args
 */
export async function runScriptInherit(
  command,
  args,
) {
  logStart('Child Process');
  return new Promise((resolve) => {
    const child = childProcess.spawn(
      command,
      args,
      {stdio: 'inherit'},
    );

    child.on('close', (exitCode) => {
      logDone(`Child Process, exit code: ${exitCode}`);
      resolve(exitCode);
    });
  });
}
