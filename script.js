// 1. Initialize the Ace Editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setOptions({
    fontSize: "14px",
    showPrintMargin: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
});

// 2. Global variable to hold the MicroPython instance
let mp = null;

// 3. Initialize MicroPython and override input()
async function initMicroPython() {
    try {
        const stdoutWriter = (line) => {
            const outputElement = document.getElementById("output");
            outputElement.innerText += line + "\n";
            outputElement.scrollTop = outputElement.scrollHeight;
        };

        // Load MicroPython runtime with stdout mapping
        mp = await loadMicroPython({ stdout: stdoutWriter });

        // Override Python's built-in input() to use browser's window.prompt()
        await mp.runPythonAsync(`
            import js
            def input(prompt_str=""):
                res = js.window.prompt(prompt_str)
                return "" if res is None else res
            __builtins__.input = input
        `);

        console.log("MicroPython WASM initialized with input() support.");
    } catch (error) {
        console.error("Failed to load MicroPython:", error);
    }
}

initMicroPython();

// 4. Extract and execute code when the button is clicked
window.runCode = async function() {
    if (!mp) {
        alert("MicroPython is still loading. Please wait a moment.");
        return;
    }

    // Clear previous output
    document.getElementById("output").innerText = "";

    // Get code from Ace Editor
    var pythonCode = editor.getValue();

    try {
        await mp.runPythonAsync(pythonCode);
    } catch (error) {
        document.getElementById("output").innerText += "Error: " + error + "\n";
    }
};