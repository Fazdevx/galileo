# Firebase Firestore Database Setup

## ✅ Estado Actual

**Firebase está completamente integrado y reemplaza a JSONBin.**

## ⚠️ Estructura Correcta de Firebase

### Colección: `olimpiadas`

- **Documento ID**: `olimpiadas-data`
- **Campos del documento**:
  ```json
  {
    "sections": [
      {
        "id": "s-a",
        "name": "Sección A",
        "color": "bg-brand-500",
        "initial": "A"
      }
    ],
    "sports": ["Fútbol", "Vóley"],
    "games": [
      {
        "id": "g-1",
        "local": "Sección A",
        "localScore": 3,
        "visit": "Sección B",
        "visitScore": 1,
        "status": "Finalizado",
        "sport": "Fútbol",
        "date": "15 Feb 2026"
      }
    ],
    "heroStats": {
      "secciones": 0,
      "disciplinas": 0,
      "dias": 0
    }
  }
  ```

## ❌ Estructura Incorrecta (NO usar esto)

- Colección: `olimpiadas-data` ❌
- Documentos separados: `games`, `heroStats`, `sectione`, `sports` ❌

## Cómo Arreglar la Estructura

1. **Eliminar la colección incorrecta**:
   - En Firebase Console, elimina la colección `olimpiadas-data`

2. **Crear la estructura correcta**:
   - Crea una nueva colección llamada `olimpiadas`
   - Crea un documento con ID `olimpiadas-data`
   - Agrega los campos: `sections`, `sports`, `games`, `heroStats`

3. **O deja que el código lo cree automáticamente**:
   - El código está configurado para crear la estructura correcta
   - Usa el panel admin para crear datos
   - Firebase se inicializará correctamente

## Integración Completa

### Archivos Modificados:

1. **`src/lib/firebase.ts`** - Configuración de Firebase SDK
2. **`src/data/api.ts`** - API que usa Firestore en lugar de JSONBin
3. **`src/lib/olimpiadasClient.ts`** - Cliente que usa Firestore en lugar de JSONBin
4. **`src/pages/admin.astro`** - Panel admin con Firebase client-side
5. **`.env.example`** - Variables de entorno para Firebase

### Funcionalidades:

- ✅ Lectura de datos desde Firestore
- ✅ Escritura de datos a Firestore
- ✅ Fallback automático a localStorage si Firebase falla
- ✅ Panel admin actualizado para usar Firebase
- ✅ Eliminadas todas las referencias a JSONBin

## Variables de Entorno Configuradas

El archivo `.env` debe contener las siguientes variables de Firebase:

```env
PUBLIC_FIREBASE_API_KEY=tu_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## Uso del Sistema

### Para Usuarios Finales:

- Los datos se cargan automáticamente desde Firestore
- Si hay problemas de conexión, usa localStorage como respaldo
- Los cambios se sincronizan con Firestore cuando es posible

### Para Administradores:

- Accede al panel en `/admin`
- Usa la contraseña: `galileo2026`
- Los cambios se guardan en Firestore y localStorage simultáneamente
- Si Firestore falla, los datos se preservan en localStorage

## Reglas de Firestore

Para desarrollo, las reglas actuales permiten acceso completo. Para producción, considera:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /olimpiadas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // O tu lógica de autenticación
    }
  }
}
```

## Verificación

El servidor de desarrollo está corriendo en `http://localhost:4321`. Puedes verificar:

1. Visita la página principal para ver los datos cargados
2. Visita `/admin` para probar el panel de administración
3. Revisa la consola del navegador para mensajes de Firebase

## Notas Técnicas

- El documento ID `olimpiadas-data` es fijo en el código
- La estructura de datos coincide con el tipo TypeScript `OlimpiadasData`
- Firestore permite actualizaciones en tiempo real (funcionalidad futura)
- localStorage sirve como cache y fallback para máxima disponibilidad
