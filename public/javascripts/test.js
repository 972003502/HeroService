// let user = {
//   hero: {
//     id: String,
//     name: String
//   }
// }
// console.log(!'hero' in user);
// // console.log(JSON.stringify(user))
// let map = new Map();
// //map.set('1', '123')
// // console.log(map.size);

// // for(let i in user) {
// //   console.log(i, user[i]);
// // }
// let mod;
// function foo() {
//   return;
// }
// mod = map.get(1);
// if(!mod) {
//   console.log('ok');
// }

obj = {
  str: 'john'
}

obj1 = {
  str: 'geek'
}

obj2 = {
  str: 'alen'
}



function sayHello(obj) {
  console.log(obj.str);
}

function foo(...args) {
  console.log('start');
  if(args) {
    for(let i of args){
      sayHello(i);
    }
  }
}


foo(obj1,obj2);
