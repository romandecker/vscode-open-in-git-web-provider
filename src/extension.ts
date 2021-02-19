import * as vscode from "vscode";
import { getActiveRelativePath, getLines, getRevision } from "./utils";
import mustache from "mustache";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "open-in-git-web-provider.open-in-git-web-provider",
    async () => {
      const config = vscode.workspace.getConfiguration(
        "open-in-git-web-provider"
      );

      const urlTemplate = config.get<string>("urlTemplate");

      if (!urlTemplate) {
        const CONFIGURE_NOW = "Configure now";
        const response = await vscode.window.showErrorMessage(
          "Looks like you have not yet configured a url-format for the current project.",
          CONFIGURE_NOW
        );

        if (response === CONFIGURE_NOW) {
          vscode.commands.executeCommand(
            "workbench.action.openWorkspaceSettings"
          );
          vscode.window.showInformationMessage(
            "Please configure `open-in-git-web-provider.urlTemplate`"
          );
        }

        return;
      }

      if (!vscode.window.activeTextEditor) {
        return vscode.window.showErrorMessage(
          "You must have a file open to navigate to it in your git web provider"
        );
      }

      try {
        const revision = await getRevision();
        const lines = getLines();
        const filePath = await getActiveRelativePath();

        const url = mustache.render(urlTemplate, {
          revision,
          lines,
          filePath,
          urlencoded: () => (text: string, render: (raw: string) => string) =>
            encodeURIComponent(render(text)),
        });

        console.log("Opening", url);

        vscode.env.openExternal(vscode.Uri.parse(url));
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
