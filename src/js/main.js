$(document).ready(function() {
  new Vue({
    el: "#app",
    data: {
      items: [
        {
          id: 2321312,
          name: "Smartphone Apple iPhone 7 128GB",
          images: [
            "https://thumbs.buscape.com.br/celular-e-smartphone/smartphone-apple-iphone-7-128gb_600x600-PU98460_1.jpg",
            "https://thumbs.buscape.com.br/celular-e-smartphone/smartphone-apple-iphone-7-128gb/__200x400-PU98460_2_c.jpg?v=2347575274",
            "https://thumbs.buscape.com.br/celular-e-smartphone/smartphone-apple-iphone-7-128gb/__200x400-PU98460_3_c.jpg?v=318433138",
            "https://thumbs.buscape.com.br/celular-e-smartphone/smartphone-apple-iphone-7-128gb/__200x400-PU98460_4_c.jpg?v=33273730"
          ],
          price: {
            value: 3509.1,
            installments: 10,
            installmentValue: 389.9,
            best: true
          },
          favorite: true
        },
        {
          id: 9971,
          name: "Smart TV Samsung Série 4 UN32J4300AG 32 polegadas LED Plana",
          images: [
            "https://mthumbs.buscape.com.br/tv/smart-tv-samsung-serie-4-un32j4300ag-32-polegadas-led-plana_600x600-PU95547_1.jpg",
            "https://thumbs.buscape.com.br/__400x400-PU95547_2_c.jpg?v=3988579075",
            "https://thumbs.buscape.com.br/__400x400-PU95547_4_c.jpg?v=4208003525",
            "https://thumbs.buscape.com.br/__231312400x400-PU95547_5_c.jpg?v=1473261122"
          ],
          price: {
            value: 1139.9,
            installments: 10,
            installmentValue: 134.11,
            best: true
          },
          favorite: false
        },
        {
          id: 6717131,
          name: "Câmera Digital Canon EOS Rebel T5i 18.0 Megapixels",
          images: [
            "https://mthumbs.buscape.com.br/camera-digital/canon-eos-rebel-t5i-18-0-megapixels_600x600-PU7bf7b_1.jpg"
          ],
          price: {
            value: 1999.2,
            installments: 10,
            installmentValue: 235.2,
            best: true
          },
          favorite: false
        },
        {
          id: 6717132,
          name:
            "Lenovo IdeaPad 310 80UH0004BR Intel Core i7-6500U 2.5 GHz 8192 MB 1024 GB",
          images: [
            "https://mthumbs.buscape.com.br/notebook/lenovo-ideapad-310-80uh0004br-intel-core-i7-6500u-2-5-ghz-8192-mb-1024-gb_600x600-PU98e6e_1.jpg"
          ],
          price: {
            value: 2599.0,
            installments: 10,
            installmentValue: 259.9,
            best: false
          },
          favorite: true
        }
      ],
      carrinho: []
    },
    created: function() {
      if(JSON.parse(localStorage.getItem("carrinho")) == null) {
        localStorage.setItem("carrinho", JSON.stringify("[]"));
      } else if(JSON.parse(localStorage.getItem("carrinho")) != "") {
        this.carrinho = JSON.parse(localStorage.getItem("carrinho"));
      }
    },
    computed: {
      subtotal: function() {
        var total = 0;
        var items = this.carrinho;
        var produto;
        if (items.length == 0) {
          return 0;
        }
        for (var cont = 0; cont < items.length; cont++) {
          produto = this.findItem(items[cont].id);
          total += produto[0].price.value * items[cont].qtde;
        }
        return total;
      },
      numParcelas: function() {
        var items = this.carrinho;
        var parcelas;
        var produto;
        if (items.length == 0) {
          return 0;
        }
        for (var cont = 0; cont < items.length; cont++) {
          produto = this.findItem(items[cont].id);
          if (cont == 0) {
            parcelas = produto[0].price.installments;
          } else {
            if (parcelas > produto[0].price.installments) {
              parcelas = produto[0].price.installments;
            }
          }
        }
        return parcelas;
      },
      valorParcelas: function() {
        if (this.subtotal == 0) {
          return 0;
        }
        return this.subtotal / this.numParcelas;
      },
      quantidade: function() {
        var cart = this.carrinho;
        var qtde = 0;
        var cont = 0;
        var len = cart.length;
        for (cont; cont < len; cont++) {
          qtde += cart[cont].qtde;
        }
        return qtde;
      }
    },
    methods: {
      changeImage(produto, image) {
        var indexImage = produto.images.indexOf(image);
        var indexProd = this.items.indexOf(produto);
        var element = $(".image-main>img")[indexProd];
        $(element).attr("src", this.items[indexProd].images[indexImage]);
      },
      toggleFavorite(item) {
        if (item.favorite == true) {
          item.favorite = false;
        } else {
          item.favorite = true;
        }
      },
      addItem(produto) {
        var index = this.carrinho.findIndex(item => {
          return item.id == produto.id;
        });
        if (index >= 0) {
          this.alterQuantity(index, 1);
        } else {
          var item = {
            id: produto.id,
            qtde: 1,
            total: produto.price.value * 1
          };
          this.carrinho.push(item);
          localStorage.setItem("carrinho", JSON.stringify(this.carrinho));
        }
      },
      removeItem(index) {
        var items = this.carrinho;
        items.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(this.carrinho));
      },
      findItem(id) {
        var produto = this.items.filter(item => {
          return item.id == id;
        });
        return produto;
      },
      alterQuantity(index, qtde) {
        var item = this.carrinho[index];
        item.qtde += qtde;
        item.total = item.qtde * this.findItem(item.id)[0].price.value;
        localStorage.setItem("carrinho", JSON.stringify(this.carrinho));
      }
    },
    filters: {
      moeda(valor) {
        var newValor = valor.toFixed(2);
        newValor = String(newValor);
        newValor = newValor.replace(".", ",");
        return newValor;
      },
      quantidade(qtde) {
        if (qtde > 9) {
          return "+9";
        } else {
          return qtde;
        }
      }
    }
  });

  var delay = false;
  $(".header--toggle").on("click", function(event) {
    if (!delay) {
      delay = true;
      $(this).toggleClass("open");
      $("body").toggleClass("blocked");
      setTimeout(function() {
        delay = false;
      }, 350);
    }
  });

  $("img").on("error", function(event) {
    $(this).attr("src", "./dist/img/not-found.png");
  });

  $(".produto--descricao>p>a").on("click", function(event) {
    event.preventDefault();
  });
});
