const socket = io();
const noteform = document.querySelector("#noteForm");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");
const code = document.querySelector("#code");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const table = document.getElementById("myTable");

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

noteform.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const data = {
      title: title.value,
      price: parseInt(price.value),
      code: code.value,
      thumbnail: thumbnail.value,
      stock: parseInt(stock.value),
      category: category.value,
      description: description.value,
    };
    const url = "http://localhost:8080/realtimeproducts";

    response = await postData(url, data);
  } catch (error) {
    console.log(error);
  }
});

socket.emit("allProducts");

socket.on("producto", async (data) => {
  await attachRow(data);
});

// funcion creacion del producto
const attachRow = async (data) => {
  const fila = document.createElement("tr");
  fila.id = data._id;
  fila.innerHTML = `<td>${data._id}</td><td>${data.title}</td> <td>${data.description}</td>
      <td>${data.price}</td><td>${data.thumbnail}</td><td>${data.code}</td><td>${data.stock}</td><td>${data.category}</td><button onclick="deleteProduct('${data._id}')" class="btn btn-danger">X</button>`;

  table.appendChild(fila);
};
//actualizamos la tabla cada vez que agregamos productos
socket.on("productos", async (data) => {
  table.innerHTML = ` <th>ID</th><th>Title</th><th>Description</th><th>Price</th><th>Thumbnail</th><th>Code</th><th>Stock</th><th>Category</th>`;
  data.forEach( async (data) => {
    await attachRow(data);
  });
});

const deleteProduct = async (_id) => {
  await fetch(`http://localhost:8080/realtimeproducts/${_id}`,{
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
