import init, { execute_code } from "./femscript_wasm.js"

const example = `fn map_fn(i) {
    format("meow {}", str(69 + i))
}

x = [random(), random()];
y = map(x, "map_fn");

z = {
    borrow(y);

    a = &y.0;
    b = &y.1;
};

join((z.a, z.b), "\\n")`

require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } })

function getValue(token) {
    let value = ""

    switch (token._type) {
        case "Str":
            value = token.value
            break
        case "Int":
            value = "" + token.number
            break
        case "Bool":
            value = token.number ? "true" : "false"
            break
        case "None":
            value = "none"
            break
        case "List":
            value = "[" + token.list.map(token => getValue(token)).join(", ") + "]"
            break
        case "Scope":
            value = "{" + token.scope.map(variable => `${variable.name} = ${getValue(variable.value)}`).join(";") + "}"
            break
        case "Error":
        case "Undefined":
        case "RecursionError":
        case "SyntaxError":
        case "TypeError":
        case "IndexError":
        case "Unsupported":
            value = token.value
            break
    }

    return value
}

require(["vs/editor/editor.main"], async function() {
    await init()

    monaco.languages.register({ id: "femscript" })

    monaco.languages.setMonarchTokensProvider("femscript", {
        tokenizer: {
            root: [
                [/#.*/, "comment"],
                [/-?\b\d+(\.\d+)?/ , "number"],
                [/true|false/, "boolean"],
                [/none|;/, "none"],
                [/"([^"\\]|\\.)*$/, "string.invalid"],
                [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                [/fn|if|else|and| or |borrow|return/, "keyword"],
                [/\b\w+(?=\()/, "function"],
                [/\b\w+ ?(?=\{)/, "function"],
                [/=|>|<|!|-|\+|\*|\\/, "operator"]
            ],
            string: [
                [/[^\\"]+/, "string"],
                [/\\n/, "string.newline"],
                [/\\./, "string.escape.invalid"],
                [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
            ]
        }
    })

    monaco.languages.setLanguageConfiguration("femscript", {
        comments: {
            lineComment: "#"
        },
        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"]
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" }
        ],
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" }
        ]
    })

    monaco.editor.defineTheme("femscript-theme", {
        base: "vs-dark",
        inherit: false,
        rules: [
            { token: "comment", foreground: "57514B" },
            { token: "number", foreground: "30bfbf" },
            { token: "boolean", foreground: "c71585" },
            { token: "none", foreground: "c5c7cd" },
            { token: "string", foreground: "50c878" },
            { token: "string.newline", foreground: "da3287" },
            { token: "string.invalid", foreground: "e52b50" },
            { token: "keyword", foreground: "5083f0" },
            { token: "function", foreground: "9370db" },
            { token: "operator", foreground: "6690b5" }
        ],
        colors: {
            "editor.foreground": "#FFFFF0"
        }
    })

    let editor = monaco.editor.create(document.getElementById("editor"), {
        value: example,
        language: "femscript",
        theme: "femscript-theme",
        minimap: { enabled: false }
    })

    let result = monaco.editor.create(document.getElementById("result"), {
        value: "press ctrl + s to run the code",
        minimap: { enabled: false },
        readOnly: true,
        overviewRulerLines: 0,
        scrollbar: {
            vertical: "hidden",
            horizontal: "hidden"
        },
        wordWrap: "on",
        lineNumbers: "off"
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        result.setValue(getValue(execute_code(editor.getValue().replace(/\r/g, ""))))
    })

    femscript.style.display = "none"
})