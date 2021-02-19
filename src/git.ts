import { execFile, ExecFileOptionsWithStringEncoding } from "child_process";
import { urlToOptions } from "vscode-test/out/util";
import path from "path";
import * as vscode from "vscode";

export async function git(...args: string[]) {
  if (!vscode.window.activeTextEditor) {
    throw new Error("Cannot detect repo root without an active file");
  }

  const cwd = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
  const { stdout } = await shellBuffer("git", args, { cwd });

  return stdout.trim();
}

interface ShellBufferOptions
  extends Omit<ExecFileOptionsWithStringEncoding, "encoding"> {}

async function shellBuffer(
  executable: string,
  args: string[],
  options?: ShellBufferOptions
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    console.log(executable, ...args);

    execFile(
      executable,
      args,
      { ...options, encoding: "utf-8" },
      (error, stdout, stderr) => {
        console.log({ error, stdout, stderr });

        if (error) {
          console.error(stderr);
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
}
