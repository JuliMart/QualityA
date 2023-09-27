var dbVehiculos = localStorage.getItem("dbVehiculos"); // Obtener datos de localStorage
var operacion = "A"; //"A" = agregar; "E" = editar
dbVehiculos = JSON.parse(dbVehiculos); // Convertir a objeto
if (dbVehiculos === null) // Si no existe, creamos un array vacío.
    dbVehiculos = [];

function Mensaje(t) {
    switch (t) {
        case 1: //
            $(".mensaje-alerta").append(
                "<div class='alert alert-success' role='alert'>Se agregó con éxito el vehículo</div>"
            );
            break;
        case 2: //
            $(".mensaje-alerta").append(
                "<div class='alert alert-danger' role='alert'>Se eliminó el vehículo</div>"
            );
            break;
        default:

    }
}

function AgregarVehiculo() {
    // Seleccionamos los datos de los inputs de formulario
    var datos_vehiculo = JSON.stringify({
        Marca: $("#brand").val(),
        Patente: $("#plateCode").val(),
        Color: $("#color").val(),
        Anio: $("#date").val(),
    });

    dbVehiculos.push(datos_vehiculo); // Guardar datos en el array definido globalmente
    localStorage.setItem("dbVehiculos", JSON.stringify(dbVehiculos));

    ListarVehiculos();

    return Mensaje(1);
}

function ListarVehiculos() {
    $("#dbVehiculos-list").html(
        "<thead>" +
        "<tr>" +
        "<th> ID </th>" +
        "<th> Nombre </th>" +
        "<th> Correo </th>" +
        "<th> Peso </th>" +
        "<th> Fecha de Nacimiento </th>" +
        "<th> </th>" +
        "<th>  </th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
    );

    for (var i in dbVehiculos) {
        var d = JSON.parse(dbVehiculos[i]);
        $("#dbVehiculos-list").append(
            "<tr>" +
            "<td>" + i + "</td>" +
            "<td>" + d.Nombre + "</td>" +
            "<td>" + d.Correo + "</td>" +
            "<td>" + d.Peso + "</td>" +
            "<td>" + d.Fecha_nacimiento + "</td>" +
            "<td> <a id='" + i + "' class='btnEditar' href='#'> <span class='glyphicon glyphicon-pencil'> </span>  </a> </td>" +
            "<td> <a id='" + i + "' class='btnEliminar' href='#'> <span class='glyphicon glyphicon-trash'> </span> </a> </td>" +
            "</tr>"
        );
    }
}

if (dbVehiculos.length !== 0) {
    ListarVehiculos();
} else {
    $("#dbVehiculos-list").append("<h2> No tienes vehículos en arriendo</h2>");
}

function contarVehiculos() {
    var vehiculos = dbVehiculos;
    var nVehiculos = vehiculos.length;

    $("#numeroVehiculos").append(
        "<a>Tienes actualmente" + "<br>" + "<span class='badge'>" + nVehiculos + "</span></a> Vehículos en arriendo"
    );
    return nVehiculos;
}

function Eliminar(e) {
    dbVehiculos.splice(e, 1); // Args (posición en el array, numero de items a eliminar)
    localStorage.setItem("dbVehiculos", JSON.stringify(dbVehiculos));
    return Mensaje(2);
}

function Editar() {
    dbVehiculos[indice_seleccionado] = JSON.stringify({
        Nombre: $("#nombre").val(),
        Correo: $("#correo").val(),
        Peso: $("#peso").val(),
        Fecha_nacimiento: $("#fecha_nacimiento").val(),
    });
    localStorage.setItem("dbVehiculos", JSON.stringify(dbVehiculos));
    operacion = "A"; // Regresamos el valor original
    return true;
}

// Función para eliminar un vehículo
$(".btnEliminar").on("click", function () {
    // Obtener el ID del vehículo desde el atributo "id" del botón
    var id = $(this).attr("id");
    
    // Preguntar al usuario si realmente quiere eliminar el vehículo
    if (confirm("¿Quieres eliminar este vehículo?")) {
        Eliminar(id); // Llamar a la función Eliminar
        ListarVehiculos(); // Actualizar la lista de vehículos después de la eliminación
    }
});

// Función para editar un vehículo
$(".btnEditar").on("click", function () {
    // Obtener el ID del vehículo desde el atributo "id" del botón
    var id = $(this).attr("id");
    
    // Preguntar al usuario si realmente quiere editar el vehículo
    if (confirm("¿Quieres editar este vehículo?")) {
        // Cambiar el modo a edición
        $(".modo").html("<span class='glyphicon glyphicon-pencil'></span> Modo edición");
        operacion = "E";
        indice_seleccionado = id; // Usar el ID como índice de vehículo a editar
        
        // Llenar el formulario con los datos actuales del vehículo a editar
        var vehiculoItem = JSON.parse(dbVehiculos[id]);
        $("#nombre").val(vehiculoItem.Nombre);
        $("#correo").val(vehiculoItem.Correo);
        $("#peso").val(vehiculoItem.Peso);
        $("#fecha_nacimiento").val(vehiculoItem.Fecha_nacimiento);
        $("#nombre").focus();
    }
});

contarVehiculos();

// Esperar el evento de envío del formulario !!
$("#vehiculos-form").bind("submit", function () {
    debugger;
    if (operacion == "A")
        return AgregarVehiculo();
    else {
        return Editar();
    }
});
