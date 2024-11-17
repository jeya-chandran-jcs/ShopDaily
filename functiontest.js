// const myarray=[
//     {name:"apple",price:100},
//     {name:"banana",price:50},
//     {name:"orange",price:70},
//     {name:"mango",price:150},
// ]

// const filter= myarray.reduce((accumulator,currentValue)=>{
//     return accumulator + currentValue.price
// },1)

// console.log(filter)

const newarray= [1,2,3,4,5]

const add= newarray.reduce((prevValue,currentValue)=>
{
    return console.log(prevValue,currentValue)
},0
)
