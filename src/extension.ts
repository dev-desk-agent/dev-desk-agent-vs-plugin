import * as vscode from "vscode";
import { SidebarProvider } from "./components/sidebar";

export const activate = (context: vscode.ExtensionContext): void => {
  console.log("Dev Desk Agent is now active!");

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "devDeskAgentSidebar",
      sidebarProvider
    )
  );

  const disposable = vscode.commands.registerCommand(
    "dev-desk-agent.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from Dev Desk Agent!");
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("dev-desk-agent.openConfig", () => {
      sidebarProvider.showConfigurationPage();
    })
  );
};

export const deactivate = (): void => {};
