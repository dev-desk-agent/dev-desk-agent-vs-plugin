(function () {
  const vscode = acquireVsCodeApi();
  const configForm = document.getElementById("config-form");

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(configForm);
    const config = Object.fromEntries(formData.entries());
    vscode.postMessage({ type: "saveConfig", value: config });
  });

  // TODO: Load existing configuration and populate form fields
})();
