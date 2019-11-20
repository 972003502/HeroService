const crypto = require('crypto');
const rand =  require('csprng');
const CryptoJS = require("crypto-js");

let password = '123123123';
let salt = 'bc30b459a4c5af7208263dc3557e4decebeb3c9bd17865edc5b16d7e92d620d5';

const hash = crypto.createHash('sha256');
hash.update(password);
let passwordHash = hash.digest('Hex');
const hash2 = crypto.createHash('sha256');
hash2.update(passwordHash + salt);
let passwordSalt = hash2.digest('Hex');
console.log(passwordSalt);

let res = CryptoJS.SHA256(CryptoJS.SHA256(password) + salt);
console.log(res.toString(CryptoJS.enc.Hex));

// // 1 7 6 8 2 4 3 5 9 11 10 12

// //主线程直接执行
// console.log('1');

// //丢到宏事件队列中
// setTimeout(function () {
//   console.log('2');
// //微事件3
//   process.nextTick(function () {
//     console.log('3');
//   })
//   new Promise(function (resolve) {
//     console.log('4');
//     resolve();
//   }).then(function () {
// //微事件4
//     console.log('5')
//   })
// })

// //微事件1
// process.nextTick(function () {
//   console.log('6');
// })

// //主线程直接执行
// new Promise(function (resolve) {
//   console.log('7');
//   resolve();
// }).then(function () {
//   //微事件2
//   console.log('8')
// })

// //丢到宏事件队列中
// setTimeout(function () {
//   console.log('9');
//   process.nextTick(function () {
//     console.log('10');
//   })

//   new Promise(function (resolve) {
//     console.log('11');
//     resolve();
//   }).then(function () {
//     console.log('12')
//   })
// })


