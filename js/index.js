const fs = require('fs')

const wasmModule   = new WebAssembly.Module(fs.readFileSync(__dirname + '/../build/eddie.wasm'))
const wasmImports  = {env: {memory: new WebAssembly.Memory({initial: 16})}}
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports)


let MEM32   = new Uint32Array(0)
let STR1    = ''
let STR2    = ''
let LEN1    = 0
let LEN2    = 0
let OFFSET1 = 0
let OFFSET2 = 0


function passArgs(s1, s2) {
    if (true && (s1.length !== LEN1 || s2.length !== LEN2)) {
        LEN1 = s1.length;
        LEN2 = s2.length;
        wasmInstance.exports._set_len(LEN1, LEN2)
    }

    if (true && (MEM32.buffer !== wasmInstance.exports.memory.buffer)) {
        MEM32   = new Uint32Array(wasmInstance.exports.memory.buffer)
        OFFSET1 = wasmInstance.exports._get_ptr1() / 4
        OFFSET2 = wasmInstance.exports._get_ptr2() / 4
    }

    if (true && (s1 !== STR1)) {
        STR1 = s1
        for (let i = 0; i < LEN1; i++) {
            MEM32[i + OFFSET1] = s1.codePointAt(i)
        }
    }

    if (true && (s2 !== STR2)) {
        STR2 = s2
        for (let i = 0; i < LEN2; i++) {
            MEM32[i + OFFSET2] = s2.codePointAt(i)
        }
    }
}


exports.levenshtein = function levenshtein(s1, s2) {
    passArgs(s1, s2)
    const out = wasmInstance.exports.leven()
    return out
}