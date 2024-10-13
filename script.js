const inputs=document.querySelectorAll("input");
const buttons=document.querySelectorAll(".input button");
const total=document.querySelector(".payment span");
const msg=document.querySelector(".input p");

// ========================= functions 

function getCost(){
    if(inputs[1].value!='' && inputs[2].value!='' && inputs[3].value!=''){
        let result=Number(inputs[1].value) + Number(inputs[2].value)  + Number(inputs[3].value) - Number(inputs[4].value);
        total.style.backgroundColor='green';
        total.innerHTML =`cost: ${result}`;
    }
    else{
        total.style.backgroundColor='red';
        total.innerHTML =`cost :`;
    }
}
function getTotal(prod){
    return (Number(prod.price) + Number(prod.taxes)  + Number(prod.ads) - Number(prod.discount))*Number(prod.count)
}
function clearInputs(){
    for(let j=0;j<7;j++){inputs[j].value='';}
    total.style.backgroundColor='red';
    total.innerHTML =`cost : `;
}

// initialiser array : 
let products;
if(localStorage.Produits != undefined){products=JSON.parse(localStorage.Produits);}
else{products=[];}
// create data into localStorage : 
let mode="create";
let tmp;
buttons[0].addEventListener("click",()=>{
    let allValide=true;
    for(let i=0;i<7;i++){
        item=inputs[i];
        if(item.value.trim()==''){
            item.style.border="1px solid red";
            msg.style.display='block';
            allValide=false;
        }
        else{item.style.border="none";}
    }
    if(allValide){
        msg.style.display='none';
        let product={
            title:inputs[0].value,
            price:inputs[1].value,
            taxes:inputs[2].value,
            ads:inputs[3].value,
            discount:inputs[4].value,
            count:inputs[5].value,
            category:inputs[6].value,
            Totalcost:0
        }
        product.Totalcost=getTotal(product);
        if(mode=="create"){
            products.push(product);
        }
        else if(mode=="update"){
            products[tmp]=product;
            mode="create";
            buttons[0].innerHTML='Create';
        }
        localStorage.setItem("Produits",JSON.stringify(products));
    }
    clearInputs();
    showData();
});
// read data and put it into table:
function showData(){
    let data='';
    if(products.length>0){
        products.forEach((item,index) => {
            data+=  `     
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    <td>${item.taxes}</td>
                    <td>${item.ads}</td>
                    <td>${item.discount}</td>
                    <td>${item.count}</td>
                    <td>${item.Totalcost}</td>
                    <td>${item.category}</td>
                    <td><button onclick="updateOne(${index})">Update</button></td>
                    <td><button onclick="deleteOne(${index})">Delete</button></td>
                </tr>
                `;
            document.querySelector('#tbody').innerHTML=data;
        });
    }
    else{
        document.querySelector('#tbody').innerHTML="";
    }
    if(products.length>0){
        buttons[3].style.display="block";
        buttons[3].innerHTML=`delete all (${products.length})`;
    }
    else{
        buttons[3].style.display="none";
        buttons[3].innerHTML=``;
    }
}
showData();
// ===============delete all
buttons[3].addEventListener("click",()=>{
    localStorage.removeItem("Produits");
    products.splice(0,products.length);
    showData();
});

// =========delete one
function deleteOne(pos){
    products.splice(pos,1);
    localStorage.Produits=JSON.stringify(products);
    showData();
}
function updateOne(pos){
    let elt=products[pos];
    inputs[0].value=elt.title;
    inputs[1].value=elt.price;
    inputs[2].value=elt.taxes;
    inputs[3].value=elt.ads;
    inputs[4].value=elt.discount;
    inputs[5].value=elt.count;
    inputs[6].value=elt.category;
    getCost(elt);
    buttons[0].innerHTML="Update"
    mode="update";
    tmp=pos;
    scroll({
        top:0,
        behavior:"smooth"
    });
}
//  ========================search
let mood="title"
function searchMode(md){
    inputs[7].placeholder=md;
    inputs[7].focus();
    if(md.includes("Title")){mood='title'}
    else if(md.includes("Category")){mood='category'}
}
function searchResult(text){
    let resultat=''
    products.forEach((item,index)=>{
        if(mood=='title'){
            if(item.title.trim().toLowerCase().includes(text.toLowerCase())){
                resultat += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.title}</td>
                        <td>${item.price}</td>
                        <td>${item.taxes}</td>
                        <td>${item.ads}</td>
                        <td>${item.discount}</td>
                         <td>${item.count}</td>
                        <td>${item.Totalcost}</td>
                        <td>${item.category}</td>
                        <td><button onclick="updateOne(${index})">Update</button></td>
                        <td><button onclick="deleteOne(${index})">Delete</button></td>
                    </tr>
                `;
            }
        }
        else{
            if(item.category.trim().toLowerCase().includes(text.toLowerCase())){
                resultat += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.title}</td>
                        <td>${item.price}</td>
                        <td>${item.taxes}</td>
                        <td>${item.ads}</td>
                        <td>${item.discount}</td>
                        <td>${item.count}</td>
                        <td>${item.Totalcost}</td>
                        <td>${item.category}</td>
                        <td><button onclick="updateOne(${index})">Update</button></td>
                        <td><button onclick="deleteOne(${index})">Delete</button></td>
                    </tr>
                `;
            }
        }
    });
    document.querySelector('#tbody').innerHTML=resultat;
}