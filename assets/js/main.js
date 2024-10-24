// FUNCION READY SE EJECUTA CUANDO EL HTML ES CARGADO COMPLETAMENTE
$(() => {
    const prendas = [ // UN ARREGLO DE OBJETOS
        { id: 1, nombre: "Polera Caballeros", precio: 9_990, imagen: "poleraCaballeros.jpeg" },
        { id: 2, nombre: "Poleron Damas", precio: 14_990, imagen: "poleronDamas.jpg" },
        { id: 3, nombre: "Pantalon Caballeros", precio: 19_990, imagen: "pantalonCaballeros.png" },
        { id: 4, nombre: "Pantalon Damas", precio: 24_990, imagen: "PantalonDamas.jpg" }
    ]

    const carrito = []

    // FUNCIÓN DE PRENDAS PARA RECORRER Y MOSTRAR LAS PRENDAS EN EL HTML
    const listarPrendas = prendas => {
        $("#listado-prendas").html("");
            for (const item of prendas) { // EL OBJETO ES PRENDAS, QUE FUNCIONA COMO PARÁMETRO
            // APPEND INSERTA CODIGO HTML Y LO QUE EXISTE LO MANTIENE Y BAJA DE ÚLTIMO
                $("#listado-prendas").append(`
                    <div>
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="assets/img/prendas/${item.imagen}" class="img-fluid rounded-start" alt="${item.nombre}">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                    <h5 class="card-title">${item.nombre}</h5>
                                        <div>
                                            <span class="fw-bold">Precio:</span>
                                            <span>$${item.precio.toLocaleString('es-CL')}</span>
                                        </div>
                                        <div class="mt-4 d-flex">
                                            <input class="form-control precio" type="number" value="1" readonly>
                                            <button class="btn btn-success cantidad aumenta">+</button>
                                            <button class="btn btn-danger cantidad disminuye">-</button>
                                            <button class="btn btn-primary agregar" data-id="${item.id}">Añadir</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            }
    }
    listarPrendas(prendas)

    const mostrarResumen = carrito => {
        $("#resumen-compra").html(""); // INSERTAMOS UN HTML VACÍO
        // HACEMOS RECORRIDO DEL CARRITO CON UN FOR OF
            for (const item of carrito) {
                $("#resumen-compra").append(`
                        <div class="fila-resumen d-flex justify-content-between separador pt-2">
                            <div>
                                <div class="py-0">${item.nombre}</div>
                                <div class="py-0"><b>Cantidad:</b> ${item.cantidad}</div>
                                <div class="py-0"><b>Precio:</b> $${item.precio.toLocaleString('es-CL')}</div>
                            </div>
                            <div class="text-end">
                                <button class="btn btn-danger d-none1 remover" type="button" data-id="${item.id}">Remover</button>
                            </div>
                        </div>
                `);
            }
    }

    const calcularTotal = carrito => {
        let total = 0
        for (const item of carrito) {
        total += item.precio * item.cantidad
        }
        return total
    }

    $(".aumenta").click(function() {
        // console.log("Aumentando...");
        // FUNCION SIBLINGS ES PARA CAPTURAR EL INPUT HERMANO QUE ESTA DENTRO DE UN DIV
        // UTILIZO AL "HERMANO" PARA OBTENER EL VALOR, ESE LO AUMENTO EN 1 Y OCUPANDO EL MISMO SELECTOR LE AGREGO EL VALOR NUEVO
        let valor = $(this).siblings("input").val()
        valor++;
        $(this).siblings("input").val(valor)
    })

    $(".disminuye").click(function() {
        // console.log("Disminuyendo...");
        let valor = $(this).siblings("input").val()
        // IF PARA QUE CUANDO LLEGUE A CERO NO SIGA CON NÚMEROS NEGATIVOS
        if(Number(valor) !== 1) {
        valor--;
        $(this).siblings("input").val(valor)
        }
    })

    $(".agregar").click(function() {
        const idPrenda = $(this).attr("data-id")
        let cantidad = Number($(this).siblings("input").val()) // CAPTURAMOS EL VALOR DEL INPUT Y LE DIMOS UNA CONSTANTE Y LO TRANSFORMAMOS EN UN NUMERO, DEJANDO DE SER STRING
        const itemCarrito = carrito.find(item => item.id == idPrenda) // VERIFICAMOS SI EL PRODUCTO ESTÁ O NO EN EL CARRITO
        // SI EL ITEM CARRITO NO TIENE NADA, HACEMOS BUSQUEDA DEL PRODUCTO
        // ALIMENTAMOS EL CARRITO PARA EL RESUMEN DE LA COMPRA
        if (!itemCarrito) { // CASO EN DONDE LA PRENDA --NO-- ESTÁ EN EL CARRITO
        const prenda = prendas.find(item => item.id == idPrenda) // BUSCA EN EL CARRITO
        carrito.push({
            ...prenda, // OPERADOR DE PROPAGACIÓN
            cantidad: cantidad
        })
        } else { // CASO EN DONDE LA PRENDA --SI-- ESTÁ EN EL CARRITO
        itemCarrito.cantidad += cantidad
        }
        $(this).siblings("input").val(1) // TOMO EL "HERMANO" INPUT Y ASIGNO 1
        mostrarResumen(carrito)

        const total = calcularTotal(carrito)
        // $("#monto-total").html(`<span class="text-danger">${total}</span>`)
        // $("#monto-total").text(`<span class="text-danger">${total}</span>`) // ESCRIBE TODA LA CADENA DE CARACTERES, DESDE EL SPAN
        $("#monto-total").text(`$${total.toLocaleString('es-CL')}`)
    })
    // EVENTO MOSTRAR
    $(document).on("mouseenter", ".fila-resumen", function() {
        // console.log("Mostrar");
        $(this).children("td:last-child").children("button").removeClass("d-none"); // DE LA FILA QUE ME GENERÓ EL EVENTO, BUSCAME EL ULTIMO TD QUE TIENE COMO HIJO 
    })

    // EVENTO OCULTAR
    $(document).on("mouseleave", ".fila-resumen", function() {
        // console.log("Ocultar");   
        $(this).children("td:last-child").children("button").addClass("d-none");
    })

    // EVENTO REMOVER
    $(document).on("click", ".remover", function() {
        const idPrenda = $(this).attr("data-id")
        // console.log(idPrenda);
        if(confirm("¿Desea eliminar esta prenda del Carrito?")){
            const index = carrito.findIndex(item => item.id == idPrenda)
            if(index != -1){
                carrito.splice(index,1)
            }
        }
        mostrarResumen(carrito)
        const total = calcularTotal(carrito)
        $("#monto-total").text(`$${total.toLocaleString('es-CL')}`)
    })
})