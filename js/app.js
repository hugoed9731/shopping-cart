// VARIABLES
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];



// EVENTS LISTENERS
cargarEventListeners();

function cargarEventListeners() {
    // cuando agregas un curso presionando agregar "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // MUESTRA LOS CURSOS DE LOCALSTORAGE
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // si el usuario no ha agregado nada al carrito marca un null, por eso agregamos el arreglo vacío
        carritoHTML();
    });

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // resetear el arreglo
        limpiarHTML(); //Eliminamos todo el HTML
        Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Products deleted!',
            customClass: "sweetAlert",
            showConfirmButton: false,
            timer: 1500
          });
        console.log(articulosCarrito);
    });
}


// funciones

function agregarCurso(e) {
    e.preventDefault(); // prevenimos la accion por default del a="#"
    // donde le estamos dando click prevenimos el EVENT BUBLING
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        // HACER UN TRAVERSING PARA VER LOS DATOS QUE VAMOS A AGREGAR AL CARRITO
        leerDatosCurso(cursoSeleccionado);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Product added to cart',
            customClass: "sweetAlert",
            showConfirmButton: false,
            timer: 1500
          });
    }
}

// ELIMINAR DATOS DEL CURSO

function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // elimina del arreglo por el datid
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        console.log(articulosCarrito);

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Product deleted',
            customClass: "sweetAlert",
            showConfirmButton: false,
            timer: 1500
          });
    }

    // tomamos de nuevo el articulo original para iterar sobre el 
    carritoHTML();
}

// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
// dentro del parentisis puedes nombrarlo como tu desees
function leerDatosCurso(curso) {
    // console.log(curso, 'aqui el curso');

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1 // la primera vez que agreguemos algo la cantidad sera igual a 1
    }

    // Revisa si un elemento ya existe en el carrito
    // .some - verificar si un objeto existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        // actualizamos la cantidad map - crea un nuevo arreglo
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna objeto actualizado
                // retornamos valor porque map lo necesita para el nuevo arr[]
            } else {
                // retornamos el curso como esta
                return curso; // retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
        console.log(articulosCarrito);
        // agregamos el curso al carrito
        // agrega elementos al arreglo de carrito
        /* usamos el spread para ir agregando el carrito de compras y hacer copias de cada arreglo
          y no perder el valor */

    }

    carritoHTML();
}

// Muestra el Carrito de compras en el HTML 
function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el html
    articulosCarrito.forEach(curso => {
        console.log(curso);
        const { imagen, titulo, precio, cantidad, id } = curso; // destruction objects
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href=# class="borrar-curso" data-id="${id}"> X </a></td>
        
        `;
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row); // vamos agregando cada row, en cada interación
    });


    // Sincronizar con Storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
    // esta funcion se ejecuta siempre que se agrega un curso o se elimina 
    // siempre obtiene una lista de cursos actualizados
}

// Eliminar los cursos del table body
function limpiarHTML() {
    // FORMA LENTA
    // innerHTML - formas de acceder al HTML
    // string vacio, se limpia
    // contenedorCarrito.innerHTML = '';
    // FORMA RAPIDA

    while (contenedorCarrito.firstChild) { // si el contenedor carrito tiene al menos un elemento adentro
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

/* NOTA: remove solo necesita referencia al child. 
removeChild necesita referencia al padre y al child; el resultado es el mismo. */