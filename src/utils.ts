import * as vscode from "vscode";
import path from "path";
import { git } from "./git";

export async function getRepoPath(): Promise<string> {
  return git("rev-parse", "--show-toplevel");
}

export async function getActiveRelativePath(): Promise<string> {
  if (!vscode.window.activeTextEditor) {
    throw new Error("Cannot get active file path without an open file");
  }

  return path.relative(
    await getRepoPath(),
    vscode.window.activeTextEditor.document.uri.fsPath
  );
}

export async function getRevision(): Promise<string> {
  return git("rev-parse", "--abbrev-ref", "HEAD");
}

export function getLines(): string[] {
  if (
    !vscode.window.activeTextEditor ||
    (vscode.window.activeTextEditor.selections.length === 1 &&
      vscode.window.activeTextEditor.selection.isEmpty)
  ) {
    return [];
  }

  return vscode.window.activeTextEditor.selections.map((sel) =>
    sel.isSingleLine
      ? `${sel.anchor.line + 1}`
      : `${sel.anchor.line + 1}-${sel.end.line + 1}`
  );
}
