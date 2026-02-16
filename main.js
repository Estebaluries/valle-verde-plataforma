const contenedorPropiedades = document.getElementById('lista-propiedades');
const modal = document.getElementById('modal-lead');

// 1. CARGAR PROPIEDADES (CON OPCIÓN DE FILTRO)
async function obtenerPropiedades(filtros = {}) {
    try {
        const respuesta = await fetch('https://valle-verde-plataforma.onrender.com/api/propiedades');
        let propiedades = await respuesta.json();

        // Aplicar filtros en el cliente (Frontend)
        if (filtros.tipo && filtros.tipo !== 'todos') {
            propiedades = propiedades.filter(p => p.tipo === filtros.tipo);
        }
        if (filtros.operacion && filtros.operacion !== 'todos') {
            propiedades = propiedades.filter(p => p.operacion === filtros.operacion);
        }

        dibujarTarjetas(propiedades);
    } catch (error) {
        console.error("Error:", error);
    }
}

function dibujarTarjetas(propiedades) {
    contenedorPropiedades.innerHTML = '';
    propiedades.forEach(prop => {
        let imagenUrl = prop.imagenes?.[0]?.url || 'https://via.placeholder.com/400x300';
        let precio = new Intl.NumberFormat('es-MX', { style: 'currency', currency: prop.moneda }).format(prop.precio);
        
        contenedorPropiedades.innerHTML += `
            <article class="card">
                <img src="${imagenUrl}">
                <div class="card-content">
                    <span class="badge">${prop.operacion.toUpperCase()}</span>
                    <h3>${prop.titulo}</h3>
                    <p class="precio">${precio}</p>
                    <p>📍 ${prop.colonia}</p>
                    <button onclick="abrirModal(${prop.id}, '${prop.titulo}')">Me interesa</button>
                </div>
            </article>
        `;
    });
}

// 2. LÓGICA DEL FORMULARIO DE LEADS
function abrirModal(id, titulo) {
    document.getElementById('propiedad-id').value = id;
    document.getElementById('propiedad-seleccionada-nombre').innerText = titulo;
    modal.style.display = "block";
}

function cerrarModal() {
    modal.style.display = "none";
}

// 3. ENVIAR EL LEAD A FLASK (Y DE AHÍ A SUPABASE)
document.getElementById('form-lead').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoLead = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        notas: document.getElementById('notas').value,
        propiedad_interes_id: document.getElementById('propiedad-id').value
    };

    try {
        const res = await fetch('https://valle-verde-plataforma.onrender.com/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLead)
        });

        if (res.ok) {
            alert("¡Gracias! Un asesor de Inmobiliaria Valle Verde te contactará pronto.");
            cerrarModal();
            document.getElementById('form-lead').reset();
        }
    } catch (error) {
        alert("Error al enviar tus datos. Intenta más tarde.");
    }
});

// Filtros rápidos
function aplicarFiltros() {
    const tipo = document.getElementById('filtro-tipo').value;
    const operacion = document.getElementById('filtro-operacion').value;
    obtenerPropiedades({ tipo, operacion });
}

obtenerPropiedades();