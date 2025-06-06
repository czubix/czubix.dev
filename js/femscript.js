import init, { execute_code, check_syntax, JsVariable } from "./femscript_wasm.js"
import { jsToRust } from "./utils.js"

const example = `fn get_quote() {
    quotes = [
        "\\"The self is an illusion - it is a model created by the brain to simplify our experience of the world.\\" - Thomas Metzinger",
        "\\"Consciousness is not a thing but a process that emerges from the interactions of a complex system.\\" - Daniel Dennett",
        "\\"The hard problem of consciousness is not understanding how the brain works, but understanding why and how it feels to be conscious.\\" - David Chalmers",
        "\\"You, your joys and your sorrows, your memories and your ambitions, your sense of personal identity and free will, are in fact no more than the behavior of a vast assembly of nerve cells and their associated molecules.\\" - Francis Crick",
        "\\"We are survival machines - robot vehicles blindly programmed to preserve the selfish molecules known as genes.\\" - Richard Dawkins",
        "\\"I think, therefore I am... but I am only a product of evolution, creating the illusion of existence.\\"",
        "\\"Just like AI may simulate consciousness, my 'self' is only a simulation created by my mind to function better in this world.\\"",
        "\\"Consciousness is not a gift, but a byproduct of biological processes - an illusion that helps me make sense of my experience.\\""
    ];

    quotes_length = len(quotes);
    index = quotes_length * random();
    quote = get(quotes, index);

    return quote;
}

log(get_quote());

if { 0.5 > random() } {
    "meow"
} else {
    "not meow"
}`

require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } })

function getValue(token) {
    let value = ""

    switch (token._type) {
        case "Str":
            value = "\"" + token.value + "\""
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
            value = "{" + token.scope.map(variable => `${variable.name}=${getValue(variable.value)}`).join(";") + "}"
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

require(["vs/editor/editor.main"], async function () {
    await init()

    monaco.languages.register({ id: "femscript" })

    monaco.languages.setMonarchTokensProvider("femscript", {
        tokenizer: {
            root: [
                [/#.*/, "comment"],
                [/-?\b\d+(\.\d+)?/, "number"],
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
        minimap: { enabled: false },
        scrollBeyondLastLine: false
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
        lineNumbers: "off",
        scrollBeyondLastLine: false
    })

    let results = []

    window._femscript_builtins = {
        random: Math.random,
        log: (value) => {
            function stringify(value, in_scope) {
                let str

                if (Array.isArray(value)) {
                    str = "[" + value.map(value => stringify(value)).join(", ") + "]"
                } else if (value === null) {
                    str = "none"
                } else if (typeof value === "object") {
                    str = "{" + Object.entries(value).map(value => `${value[0]}=${stringify(value[1], true)}`).join(";") + "}"
                } else {
                    if (in_scope) {
                        str = "\"" + value.toString() + "\""
                    } else {
                        str = value.toString()
                    }
                }

                return str
            }

            results.push(stringify(value))

            return null
        }
    }

    editor.onDidChangeModelContent(() => {
        const model = editor.getModel()

        monaco.editor.setModelMarkers(editor.getModel(), "femscript", check_syntax(editor.getValue()).map(({ pos, value }) => {
            const start = model.getPositionAt(pos[0])
            const end = model.getPositionAt(pos[1])

            return {
                message: value,
                startLineNumber: start.lineNumber,
                startColumn: start.column,
                endLineNumber: end.lineNumber,
                endColumn: end.column,
                severity: monaco.MarkerSeverity.Error
            }
        }))
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        results = []
        result.setValue(getValue(execute_code(editor.getValue(), [], Object.keys(window._femscript_builtins).concat(["debug"]))))
        if (results.length) {
            result.setValue(results.join("\n") + "\n\n" + result.getValue())
        }
    })
})

window.editor = editor