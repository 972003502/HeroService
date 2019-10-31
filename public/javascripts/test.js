let john = {name: 'john'};

let arr = [john];

let map = new WeakMap();
map.set(john, '...')

let jack = john;
john = null;

console.log(map.get(john));

// map.has(john);