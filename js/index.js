const fs = require('fs')

const wasmModule   = new WebAssembly.Module(fs.readFileSync(__dirname + '/../build/eddie.wasm'))
const wasmImports  = {env: {memory: new WebAssembly.Memory({initial: 16})}}
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports)
const wasmExports  = wasmInstance.exports

const {
    _set_len,
    _get_ptr1,
    _get_ptr2,
    _leven,
    _damlev,
    _jaro,
    _jarwin,
} = wasmExports


let MEM32   = new Uint32Array(0)
let STR1    = ''
let STR2    = ''
let LEN1    = 0
let LEN2    = 0
let OFFSET1 = 0
let OFFSET2 = 0


function passStrings(str1, str2) {
    let updateOffsets = false

    if (str1.length !== LEN1 || str2.length !== LEN2) {
        _set_len(str1.length, str2.length)
        updateOffsets = str1.length > LEN1 || str2.length > LEN2
    }

    if (MEM32.buffer !== wasmExports.memory.buffer) {
        MEM32 = new Uint32Array(wasmExports.memory.buffer)
        updateOffsets = true
    }

    if (updateOffsets) {
        OFFSET1 = _get_ptr1() / 4
        OFFSET2 = _get_ptr2() / 4
    }

    if (str1.length !== LEN1 || str1 !== STR1) {
        for (let i = 0; i < str1.length; i++) {
            MEM32[i + OFFSET1] = str1.charCodeAt(i)
        }
    }

    if (str2.length !== LEN2 || str2 !== STR2) {
        for (let i = 0; i < str2.length; i++) {
            MEM32[i + OFFSET2] = str2.charCodeAt(i)
        }
    }

    STR1 = str1
    STR2 = str2
}


function compare(str1, str2, defaultVal, wasmFn) {
    if (str1.length === str2.length && str1 === str2) {
        return defaultVal
    }
    passStrings(str1, str2)
    const out = wasmFn()
    return out
}


exports.leven  = (s1, s2) => compare(s1, s2, 0,   _leven)
exports.damlev = (s1, s2) => compare(s1, s2, 0,   _damlev)
exports.jaro   = (s1, s2) => compare(s1, s2, 1.0, _jaro)
exports.jarwin = (s1, s2) => compare(s1, s2, 1.0, _jarwin)
