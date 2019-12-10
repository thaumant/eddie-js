const fs = require('fs')

const wasmSource   = fs.readFileSync(__dirname + '/../build/eddie_js_bg.wasm')
const wasmModule   = new WebAssembly.Module(wasmSource)
const wasmInstance = new WebAssembly.Instance(wasmModule, {})
const wasm         = wasmInstance.exports

const MAX_CAPACITY = 100

let mem32   = new Uint32Array(wasm.memory.buffer)
let ptr1    = wasm._levenshtein_get_ptr1()
let ptr2    = wasm._levenshtein_get_ptr2()
let offset1 = ptr1 / 4
let offset2 = ptr2 / 4

exports.levenshtein = function levenshtein(s1, s2) {
    if (mem32.buffer !== wasm.memory.buffer) {
        mem32   = new Uint32Array(wasm.memory.buffer)
        ptr1    = wasm._levenshtein_get_ptr1()
        ptr2    = wasm._levenshtein_get_ptr2()
        offset1 = ptr1 / 4
        offset2 = ptr2 / 4
    }

    const len1 = Math.min(s1.length, MAX_CAPACITY)
    const len2 = Math.min(s2.length, MAX_CAPACITY)

    for (let i = 0; i < len1; i++) mem32[i + offset1] = s1.codePointAt(i)
    for (let i = 0; i < len2; i++) mem32[i + offset2] = s2.codePointAt(i)

    const out = wasm.levenshtein(len1, len2)
    return out
}
