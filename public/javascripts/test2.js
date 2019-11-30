const { encryptWithSalt } = require('../../util/util');

let str = encryptWithSalt('123123123', 'e0fdc7aaec0b286f4e211c607d018afb3bc07c9d721a5100646cfd8d6e3b7136', 'Hex');
let str2 = encryptWithSalt(str, '61aed6d699dfd5bb968cb7d60a7d786c1ca8c5f4e175946225b1a2302c60f059', 'Hex');
console.log(str2);