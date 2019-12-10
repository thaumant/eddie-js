const {Suite} = require('benchmark')

function run(fn) {
    fn('kitten')
    fn('xabxcdxxefxgx')
    fn('xabxcdxxefxgx')
    fn('javawasneat')
    fn('example')
    fn('sturgeon')
    fn('levenshtein')
    fn('distance')
    fn('因為我是中國人所以我會說中文')
}

function uint32Map(str) {
    const arr = Uint32Array.from(str, (c) => c.codePointAt(0))
    return arr
}

function uint32Loop(str) {
    const arr = new Uint32Array(str.length)
    for (let i = 0; i < str.length; i++) arr[i] = str.codePointAt(i)
    return arr
}

const MAX_CAPACITY = 100
const BUFFER = new ArrayBuffer(MAX_CAPACITY * Uint32Array.BYTES_PER_ELEMENT)

function uint32LoopBuff(str) {
    const len = Math.min(str.length, MAX_CAPACITY)
    const arr = new Uint32Array(BUFFER, 0, len)
    for (let i = 0; i < len; i++) arr[i] = str.codePointAt(i)
    return arr
}

const ENCODER = new TextEncoder()

function uint8Encoder(str) {
    const arr = ENCODER.encode(str)
    return arr
}

new Suite()
    .add('uint32Map', () => {
        run(uint32Map)
    })
    .add('uint32Loop', () => {
        run(uint32Loop)
    })
    .add('uint32LoopBuff', () => {
        run(uint32LoopBuff)
    })
    .add('uint8Encoder', () => {
        run(uint8Encoder)
    })
    .on('complete', function (event) {
        this.forEach(bench => {
            console.log(bench.toString())
        })
    })
    .run()
