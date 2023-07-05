function addToCart(event) {
    event.preventDefault();
    const productId = event.target.querySelector("[name='productId']").value;
    fetch("/api/carts", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Producto agregado al carrito.");
      })
      .catch((error) => console.error(error));
  }


