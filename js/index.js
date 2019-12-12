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
    let updateOffsets = false

    if (s1.length !== STR1.length || s2.length !== STR2.length) {
        wasmInstance.exports._set_len(s1.length, s2.length)
        updateOffsets = true
    }

    if (MEM32.buffer !== wasmInstance.exports.memory.buffer) {
        MEM32 = new Uint32Array(wasmInstance.exports.memory.buffer)
        updateOffsets = true
    }

    if (updateOffsets) {
        OFFSET1 = wasmInstance.exports._get_ptr1() / 4
        OFFSET2 = wasmInstance.exports._get_ptr2() / 4
    }

    if (s1 !== STR1) {
        for (let i = 0; i < s1.length; i++) {
            MEM32[i + OFFSET1] = s1.codePointAt(i)
        }
        STR1 = s1
    }

    if (s2 !== STR2) {
        for (let i = 0; i < s2.length; i++) {
            MEM32[i + OFFSET2] = s2.codePointAt(i)
        }
        STR2 = s2
    }
}


exports.levenshtein = function levenshtein(s1, s2) {
    passArgs(s1, s2)
    const out = wasmInstance.exports.leven()
    return out
}
