
//  *******CODIGO COPIADO ACA **********

(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);


// CARGAR INFORMACION DEL JSON*******

let productos = [];

// Función para cargar un archivo JSON dado su nombre y agregar los productos al array principal
function cargarJSON(nombreArchivo) {
    return fetch(`/data/${nombreArchivo}`)
        .then(response => response.json())
        .then(data => {
            // Agregar los productos al array principal
            productos.push(...Object.values(data).flat());
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para buscar productos en el array cargado
function buscarProducto() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    if (query.trim() === '') {
        return; // Si el input está vacío, no mostrar resultados
    }

    const resultadosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(query) ||
        (producto.talla && producto.talla.toLowerCase().includes(query)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );

    if (resultadosFiltrados.length === 0) {
        resultados.innerHTML = '<p>No se encontraron productos...</p>';
    } else {
        resultadosFiltrados.forEach(producto => {
            const nombreFormateado = encodeURIComponent(`Me interesa el producto ${producto.nombre}`);
            const whatsappLink = `https://wa.me/935909756?text=${nombreFormateado}`;
            
            const divProducto = document.createElement('div');
            divProducto.classList.add('producto');
            const imgElement = `<img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" onerror="imagenError(this)">`;
            divProducto.innerHTML = `
                ${imgElement}
                <div>
                    <strong>${producto.nombre}</strong> 
                    <p>Talla: ${producto.talla || 'N/A'}</p>
                    <p>Descripción: ${producto.descripcion || 'N/A'}</p>
                    <strong>Precio: S/. ${producto.precio.toFixed(2)}</strong><br>
                    <a class=" ver-producto whatsapp-link" href="${whatsappLink}" target="_blank">Pedir Info</a>
                </div>
            `;
            resultados.appendChild(divProducto);
        });
    }
}


// Función para crear el HTML de un producto
function createProductItem(product) {
    // Construir dinámicamente el enlace de WhatsApp usando el nombre del producto
    const nombreFormateado = encodeURIComponent(`Me interesa el producto ${product.nombre}`);
    const whatsappLink = `https://wa.me/935909756?text=${nombreFormateado}!!`;

    return `
        <div class="gallery-item">
            <img src="${product.imagen}" alt="${product.nombre}">
            <div class="product-name">${product.nombre}</div>
            <div class="product-price">S/ ${product.precio}</div>
            <a class="ver-producto" href="${whatsappLink}" target="_blank">Pedir info</a>
        </div>
    `;
}


// Función para cargar la galería de productos desde un archivo JSON específico
function cargarGaleria(nombreArchivo) {
    return fetch(`/data/${nombreArchivo}`)
        .then(response => response.json())
        .then(products => {
            const niñosGallery = document.getElementById('niños-gallery');
            const hombresGallery = document.getElementById('hombres-gallery');
            const mujeresGallery = document.getElementById('mujeres-gallery');

            // Limpiar el contenido actual de las galerías
            if (niñosGallery) niñosGallery.innerHTML = '';
            if (hombresGallery) hombresGallery.innerHTML = '';
            if (mujeresGallery) mujeresGallery.innerHTML = '';

            // Llenar la galería de cada categoría si existen en el JSON
            if (products.niños) {
                products.niños.forEach(product => {
                    niñosGallery.innerHTML += createProductItem(product);
                });
            }

            if (products.hombres) {
                products.hombres.forEach(product => {
                    hombresGallery.innerHTML += createProductItem(product);
                });
            }

            if (products.mujeres) {
                products.mujeres.forEach(product => {
                    mujeresGallery.innerHTML += createProductItem(product);
                });
            }
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

// Determina el archivo JSON a cargar según el archivo HTML
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo HTML actual
    const htmlFileName = window.location.pathname.split('/').pop();

    // Determinar el archivo JSON según el archivo HTML
    let jsonFileName = '';

    switch (htmlFileName) {
        case 'polos.html':
            jsonFileName = 'productos.json';
            break;
        case 'poleras.html':
            jsonFileName = 'productos2.json';
            break;
        case 'jeans.html':
            jsonFileName = 'productos3.json';
            break;
        // Añadir más casos según sea necesario
        default:
            console.error('No se encontró un archivo JSON correspondiente para este HTML.');
            return;
    }

    // Cargar el JSON y la galería correspondiente
    cargarGaleria(jsonFileName);
});

// Cargar todos los archivos JSON antes de habilitar el buscador
Promise.all([
    cargarJSON('productos.json'),
    cargarJSON('productos2.json'),
    cargarJSON('productos3.json'),
    // cargarJSON('productos4.json')
]).then(() => {
    // Los productos están cargados, ahora se puede buscar
    console.log('Todos los productos han sido cargados');
    // Aquí podrías habilitar el buscador o notificar al usuario que puede buscar productos
});


if (window.location.pathname.endsWith('/categoria/stock.html')) {

    // Función para cargar la galería de productos desde un archivo JSON específico
    function cargarGaleria(nombreArchivo) {
        return fetch(`/data/${nombreArchivo}`) // Ruta relativa a stock.html
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el archivo ${nombreArchivo}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(products => {
                const niñosGallery = document.getElementById('niños-gallery');
                const hombresGallery = document.getElementById('hombres-gallery');
                const mujeresGallery = document.getElementById('mujeres-gallery');

                if (niñosGallery && products.niños) {
                    products.niños.forEach(product => {
                        niñosGallery.innerHTML += createProductItem(product);
                    });
                }

                if (hombresGallery && products.hombres) {
                    products.hombres.forEach(product => {
                        hombresGallery.innerHTML += createProductItem(product);
                    });
                }

                if (mujeresGallery && products.mujeres) {
                    products.mujeres.forEach(product => {
                        mujeresGallery.innerHTML += createProductItem(product);
                    });
                }
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
    }

    // Cargar las galerías
    cargarGaleria('productos.json');
    cargarGaleria('productos2.json');
    cargarGaleria('productos3.json');
    // cargarGaleria('productos4.json'); // Descomentar si necesitas cargar otro archivo

}





// MENU CATEGORIA DE PRODUCTOS ********
        

// PRIMERO:::::::::::::::::::::::::

function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// SEGUNDO::::::::::::::::::::::

function openPage2(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent2, tablinks2;
    tabcontent2 = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent2.length; i++) {
        tabcontent2[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks2 = document.getElementsByClassName("tablink2");
    for (i = 0; i < tablinks2.length; i++) {
        tablinks2[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}


// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

/*********************************************************/

