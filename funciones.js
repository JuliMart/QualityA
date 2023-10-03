var dbVehiculos = localStorage.getItem("dbVehiculos"); // Obtener datos de localStorage
var operacion = "A"; //"A" = agregar; "E" = editar
dbVehiculos = JSON.parse(dbVehiculos); // Convertir a objeto
if (dbVehiculos === null) // Si no existe, creamos un array vacío.
    dbVehiculos = [];

function Mensaje(t) {
    switch (t) {
        case 1:
            $(".mensaje-alerta").append(
                "<div class='alert alert-success' role='alert'>Se agregó con éxito el vehículo</div>"
            );
            break;
        case 2:
            $(".mensaje-alerta").append(
                "<div class='alert alert-danger' role='alert'>Se eliminó el vehículo</div>"
            );
            break;
        default:
    }
}

function AgregarVehiculo() {
    // Seleccionamos los datos de los inputs de formulario
    var datos_vehiculo = {
        Marca: $("#brand").val(),
        Modelo: $("#model").val(),
        Patente: $("#plateCode").val(),
        Color: $("#color").val(), // Obtener el valor del combo box
        Anio: $("#date").val(),
    };

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
        "<th> Marca </th>" +
        "<th> Modelo </th>" +
        "<th> Patente </th>" +
        "<th> Color </th>" +
        "<th> Año </th>" +
        "<th> </th>" +
        "<th>  </th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
    );

    for (var i in dbVehiculos) {
        var d = dbVehiculos[i];
        $("#dbVehiculos-list tbody").append(
            "<tr>" +
            "<td>" + i + "</td>" +
            "<td>" + d.Marca + "</td>" +
            "<td>" + d.Modelo + "</td>" +
            "<td>" + d.Patente + "</td>" +
            "<td>" + d.Color + "</td>" +
            "<td>" + d.Anio + "</td>" +
            "<td> <a id='editar_" + i + "' class='btnEditar' href='#'> <span class='glyphicon glyphicon-pencil'></span> </a> </td>" +
            "<td> <a id='eliminar_" + i + "' class='btnEliminar' href='#'> <span class='glyphicon glyphicon-trash'></span> </a> </td>" +
            "</tr>"
        );
    }

    // Agregar el evento de clic para los botones de eliminar y editar
    $(".btnEliminar").click(function () {
        var id = $(this).attr("id").split("_")[1];
        Eliminar(id);
    });

    $(".btnEditar").click(function () {
        var id = $(this).attr("id").split("_")[1];
        Editar(id);
    });
}

if (dbVehiculos.length !== 0) {
    ListarVehiculos();
} else {
    $("#dbVehiculos-list").append("<h2> No tienes vehículos en arriendo</h2>");
}

function contarVehiculos() {
    var nVehiculos = dbVehiculos.length;

    $("#numeroVehiculos").html(
        "<a>Tienes actualmente" + "<br>" + "<span class='badge'>" + nVehiculos + "</span></a> Vehículos en arriendo"
    );
    return nVehiculos;
}

function Eliminar(id) {
    // Mostrar un cuadro de diálogo de confirmación
    var confirmacion = confirm("¿Estás seguro de que deseas eliminar este vehículo?");

    // Si el usuario hace clic en "Aceptar" en el cuadro de diálogo de confirmación
    if (confirmacion) {
        dbVehiculos.splice(id, 1); // Eliminar el elemento en la posición 'id'
        localStorage.setItem("dbVehiculos", JSON.stringify(dbVehiculos));
        ListarVehiculos();
        return Mensaje(2);
    }
    // Si el usuario hace clic en "Cancelar", no se realizará la eliminación.
    return false;
}

function Editar(id) {
    operacion = "E"; // Cambiar a modo editar
    // Llenar el formulario con los datos del vehículo seleccionado
    var vehiculo = dbVehiculos[id];
    $("#brand").val(vehiculo.Marca);
    $("#model").val(vehiculo.Modelo);
    $("#plateCode").val(vehiculo.Patente);
    $("#color").val(vehiculo.Color);
    $("#date").val(vehiculo.Anio);

    // Actualizar el índice seleccionado
    indice_seleccionado = id;
}

$("#vehiculos-form").bind("submit", function (e) {
    e.preventDefault(); // Evitar el envío del formulario por defecto
    if (operacion == "A") {
        // Validar el formulario antes de agregar el vehículo
        var marca = $("#brand").val();
        var modelo = $("#model").val();
        var patente = $("#plateCode").val();
        var color = $("#color").val();
        var anio = $("#date").val();

        if (!marca || !modelo || !patente || !color || !anio) {
            alert("Por favor, completa todos los campos.");
            return false;
        }

        if (!validarMarca(marca)) {
            alert("La marca debe contener solo letras.");
            return false;
        }

        if (!validarPatente(patente)) {
            alert("La patente debe tener cuatro letras mayúsculas seguidas de dos números.");
            return false;
        }

        return AgregarVehiculo();
    } else if (operacion == "E") {
        return EditarGuardar(); // Llamar a la función EditarGuardar al editar
    }
});
// Función para validar la patente
function validarPatente() {
    var patente = $("#plateCode").val();
    var regex = /^[A-Z]{4}\d{2}$/; // Expresión regular para validar la patente
    return regex.test(patente);
}

// Función para validar la marca (solo letras)
function validarMarca(marca) {
    var regex = /^[A-Za-z]+$/; // Expresión regular para validar letras (mayúsculas y minúsculas)
    return regex.test(marca);
}
function validarModelo(modelo) {
    var regex = /^[A-Za-z]+$/; // Expresión regular para validar letras (mayúsculas y minúsculas)
    return regex.test(modelo);
}

contarVehiculos();

function EditarGuardar() {
    // Obtener los valores editados del formulario
    var marca = $("#brand").val();
    var modelo = $("#model").val();
    var patente = $("#plateCode").val();
    var color = $("#color").val(); // Obtener el valor del combo box
    var anio = $("#date").val();

    // Actualizar el vehículo en dbVehiculos con los nuevos valores
    var vehiculoEditado = {
        Marca: marca,
        Modelo: modelo,
        Patente: patente,
        Color: color,
        Anio: anio
    };

    dbVehiculos[indice_seleccionado] = vehiculoEditado;

    // Guardar los cambios en localStorage
    localStorage.setItem("dbVehiculos", JSON.stringify(dbVehiculos));

    // Limpiar el formulario y volver al modo "Agregar"
    LimpiarFormulario();
    operacion = "A";

    // Actualizar la lista de vehículos
    ListarVehiculos();

    return Mensaje(1);
}

function LimpiarFormulario() {
    $("#brand").val("");
    $("#model").val("");
    $("#plateCode").val("");
    $("#color").val("");
    $("#date").val("");
}



