use std::cell::RefCell;
use eddie::slice::{Levenshtein, DamerauLevenshtein, Jaro, JaroWinkler};


thread_local! {
    static LEVEN: Levenshtein = Levenshtein::new();
    static DAMLEV: DamerauLevenshtein<u32> = DamerauLevenshtein::new();
    static JARO: Jaro = Jaro::new();
    static JARWIN: JaroWinkler = JaroWinkler::new();

    static BUFFERS: RefCell<(Vec<u32>, Vec<u32>)> = RefCell::new((
        Vec::with_capacity(100),
        Vec::with_capacity(100),
    ));
}


#[no_mangle]
pub fn _leven() -> usize {
    BUFFERS.with(|cell| {
        let (buffer1, buffer2) = &mut *cell.borrow_mut();
        LEVEN.with(|lev| lev.distance(&buffer1[..], &buffer2[..]))
    })
}


#[no_mangle]
pub fn _damlev() -> usize {
    BUFFERS.with(|cell| {
        let (buffer1, buffer2) = &mut *cell.borrow_mut();
        DAMLEV.with(|damlev| damlev.distance(&buffer1[..], &buffer2[..]))
    })
}


#[no_mangle]
pub fn _jaro() -> f64 {
    BUFFERS.with(|cell| {
        let (buffer1, buffer2) = &mut *cell.borrow_mut();
        JARO.with(|jaro| jaro.similarity(&buffer1[..], &buffer2[..]))
    })
}


#[no_mangle]
pub fn _jarwin() -> f64 {
    BUFFERS.with(|cell| {
        let (buffer1, buffer2) = &mut *cell.borrow_mut();
        JARWIN.with(|jarwin| jarwin.similarity(&buffer1[..], &buffer2[..]))
    })
}


#[no_mangle]
pub fn _get_ptr1() -> *mut u32  {
    BUFFERS.with(|cell| {
        let (buffer1, _) = &mut *cell.borrow_mut();
        buffer1.as_mut_ptr()
    })
}


#[no_mangle]
pub fn _get_ptr2() -> *mut u32  {
    BUFFERS.with(|cell| {
        let (_, buffer2) = &mut *cell.borrow_mut();
        buffer2.as_mut_ptr()
    })
}


#[no_mangle]
pub fn _set_len(len1: usize, len2: usize) {
    BUFFERS.with(|cell| {
        let (buffer1, buffer2) = &mut *cell.borrow_mut();
        buffer1.resize(len1, 0);
        buffer2.resize(len2, 0);
    })
}
