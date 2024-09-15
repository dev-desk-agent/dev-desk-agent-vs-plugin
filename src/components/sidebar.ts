import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "sendMessage":
          // TODO: Implement sending message to Dev Desk service
          vscode.window.showInformationMessage(
            `Sending message: ${data.value}`
          );
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "sidebar.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "sidebar.css")
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dev Desk Agent Chat</title>
        <link rel="stylesheet" type="text/css" href="${styleUri}">
      </head>
      <body>
        <div id="chat-container">
          <div id="chat-messages"></div>
          <div id="input-container">
            <textarea id="message-input" rows="4" placeholder="Type your message here..."></textarea>
            <button id="send-button">Send</button>
          </div>
        </div>
        <div id="message-preview">
          <h3>Message Preview</h3>
          <pre id="preview-content"></pre>
        </div>
        <script src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }

  public showConfigurationPage = (): void => {
    const panel = vscode.window.createWebviewPanel(
      "devDeskAgentConfig",
      "Dev Desk Agent Configuration",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this._extensionUri],
      }
    );

    panel.webview.html = this._getConfigHtmlForWebview(panel.webview);

    panel.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "saveConfig":
          // TODO: Implement saving configuration
          vscode.window.showInformationMessage(
            `Saving configuration: ${JSON.stringify(data.value)}`
          );
          break;
      }
    });
  };

  private _getConfigHtmlForWebview = (webview: vscode.Webview): string => {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "config.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "config.css")
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dev Desk Agent Configuration</title>
        <link rel="stylesheet" type="text/css" href="${styleUri}">
      </head>
      <body>
        <div id="config-container">
          <h2>Dev Desk Agent Configuration</h2>
          <form id="config-form">
            <div class="form-group">
              <label for="apiKey">API Key:</label>
              <input type="password" id="apiKey" name="apiKey" required>
            </div>
            <div class="form-group">
              <label for="model">Model:</label>
              <select id="model" name="model">
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </select>
            </div>
            <div class="form-group">
              <label for="maxTokens">Max Tokens:</label>
              <input type="number" id="maxTokens" name="maxTokens" min="1" max="4096" value="2048">
            </div>
            <button type="submit">Save Configuration</button>
          </form>
        </div>
        <script src="${scriptUri}"></script>
      </body>
      </html>
    `;
  };
}
