use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use eddie::{Levenshtein}; // , DamerauLevenshtein, Hamming, Jaro, JaroWinkler

thread_local! {
    static STATE: RefCell<(Levenshtein<u32>, Vec<u32>, Vec<u32>)> = RefCell::new((
        Levenshtein::new(),
        Vec::with_capacity(100),
        Vec::with_capacity(100),
    ));
}

#[wasm_bindgen]
pub fn levenshtein(len1: usize, len2: usize) -> usize {
    STATE.with(|cell| {
        let (lev, buffer1, buffer2) = &mut *cell.borrow_mut();
        unsafe {
            buffer1.set_len(len1);
            buffer2.set_len(len2);
        }
        lev.distance(&buffer1[..], &buffer2[..])
    })
}

#[wasm_bindgen]
pub fn _levenshtein_get_capacity() -> usize {
    STATE.with(|cell| {
        let (_, buffer1, _) = &*cell.borrow();
        buffer1.len()
    })
}

#[wasm_bindgen]
pub fn _levenshtein_get_ptr1() -> *mut u32  {
    STATE.with(|cell| {
        let (_, buffer1, _) = &mut *cell.borrow_mut();
        buffer1.as_mut_ptr()
    })
}

#[wasm_bindgen]
pub fn _levenshtein_get_ptr2() -> *mut u32  {
    STATE.with(|cell| {
        let (_, _, buffer2) = &mut *cell.borrow_mut();
        buffer2.as_mut_ptr()
    })
}
