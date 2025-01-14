import { JsToken, JsVariable } from "./femscript_wasm.js"

class Error {
    constructor(value) {
        this.value = value
    }
}

function rustToJs(token) {
    let value

    switch (token._type) {
        case "Str":
            value = token.value
            break
        case "Int":
            value = token.number
            break
        case "Bool":
            value = !!token.number
            break
        case "None":
            value = null
            break
        case "List":
            value = token.list.map(token => rustToJs(token))
            break
        case "Scope":
            value = Object.fromEntries(token.scope.map(variable => [variable.name, rustToJs(variable.value)]))
            break
        case "Error":
        case "Undefined":
        case "RecursionError":
        case "SyntaxError":
        case "TypeError":
        case "IndexError":
        case "Unsupported":
            value = `${token._type}: ${token.value}`
            break
    }

    return value
}

export function jsToRust(value) {
    let token = new JsToken("None", "", 0.0, [], {})

    if (value === null || value === undefined) {
        return token
    }

    if (Array.isArray(value)) {
        return new JsToken("List", "", 0.0, value.map(value => jsToRust(value)), {})
    }

    if (value?.constructor === Error) {
        return new JsToken("Error", value.value, 0.0, [], {})
    }

    switch (typeof value) {
        case "string":
            token = new JsToken("Str", value, 0.0, [], {})
            break
        case "number":
            token = new JsToken("Int", "", value, [], {})
            break
        case "boolean":
            token = new JsToken("Bool", value, Number(value), [], {})
            break
        case "object":
            token = new JsToken("Scope", "", 0.0, [], Object.entries(value).map(item => new JsVariable(item[0], jsToRust(item[1]))))
            break
    }

    return token
}

export function call_js(_function, args) {
    if (!window._femscript_builtins[_function]) {
        return new JsToken("Error", `function ${_function} not found`)
    }

    return jsToRust(
        window._femscript_builtins[_function](...args.map(token => rustToJs(token)))
    )
}