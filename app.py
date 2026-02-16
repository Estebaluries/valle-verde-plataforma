import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargamos secretos del .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Conexión a Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- RUTA 1: Obtener Propiedades (Con sus imágenes) ---
@app.route('/api/propiedades', methods=['GET'])
def obtener_propiedades():
    try:
        # Traemos propiedades e imágenes relacionadas (JOIN)
        respuesta = supabase.table("propiedades").select("*, imagenes(url)").eq("activo", True).execute()
        return jsonify(respuesta.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- RUTA 2: Recibir Leads del Formulario ---
@app.route('/api/leads', methods=['POST'])
def crear_lead():
    try:
        datos_cliente = request.json
        
        # Insertamos en la tabla 'leads' de Supabase
        resultado = supabase.table("leads").insert({
            "nombre": datos_cliente['nombre'],
            "email": datos_cliente['email'],
            "telefono": datos_cliente['telefono'],
            "notas": datos_cliente.get('notas', ''),
            "propiedad_interes_id": datos_cliente['propiedad_interes_id'],
            "origen": "web_valle_verde"
        }).execute()
        
        return jsonify({"status": "success", "data": resultado.data}), 201
    except Exception as e:
        print(f"Error al guardar lead: {e}")
        return jsonify({"error": "No se pudo registrar el interesado"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)