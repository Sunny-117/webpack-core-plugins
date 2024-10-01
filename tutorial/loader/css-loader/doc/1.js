let list1 = [[1,'1'],[2,'2']];
let list2 = [[3,'3'],[4,'4']];
//list2.push(...list1);
list2.unshift(...list1);
//list2 = [...list1,...list2];
console.log(list2);