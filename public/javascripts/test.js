let john = {name: 'john'};

let arr = [john];

let map = new WeakMap();
map.set(john, '...')

let jack = john;
john = null;

console.log(123);

// map.has(john);