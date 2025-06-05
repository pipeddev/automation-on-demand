# Ejecutar pruebas E2E con WebdriverIO en Cloud Run (on demand)

Este proyecto permite ejecutar pruebas end-to-end (E2E) utilizando **WebdriverIO + Chrome Headless**, desplegado como un servicio **on demand** en **Google Cloud Run**, y disparado desde un **endpoint HTTP** o un **workflow de Google Cloud**.

---

## ✨ Tecnologías utilizadas

- Node.js + Express
- WebdriverIO (con Chrome Headless)
- Google Cloud Run
- Google Cloud Build
- Google Cloud Workflows

---

## 🚀 Comandos utilizados exitosamente

### ✅ Autenticación y configuración

```bash
gcloud auth login
gcloud config set project <name of project in GCP>
gcloud config set run/region <region in GCP>
```

### ✅ Build y despliegue a Cloud Run

```bash
gcloud builds submit --config cloudbuild.yaml
```

### ✅ Hacer el endpoint de Cloud Run público

```bash
gcloud run services add-iam-policy-binding wdio-tests-service \
  --region=<region in GCP> \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### ✅ Ejecutar el endpoint manualmente

```bash
curl -X POST https://wdio-tests-service-538282289270.<region in GCP>.run.app
```

### ✅ Desplegar workflow

```bash
gcloud workflows deploy ejecutarPruebas \
  --source=workflow.yaml \
  --location=us-central1
```

### ✅ Ejecutar workflow on demand

```bash
gcloud workflows execute ejecutarPruebas \
  --location=us-central1
```

### ✅ Eliminar recursos

```bash
gcloud workflows delete ejecutarPruebas --location=us-central1

gcloud run services delete wdio-tests-service \
  --region=us-central1 \
  --platform=managed
```

---

## 🌓 Endpoint Cloud Run

```
POST https://wdio-tests-service-538282289270.us-central1.run.app
```

Este endpoint ejecuta `npm run wdio` desde el contenedor, corre las pruebas, y retorna el resultado como JSON.

---

## 🎉 Resultado esperado

```json
{
  "success": true,
  "output": "...resultado de las pruebas..."
}
```

---

## 📄 Archivos clave

- `api/index.ts`: servidor Express que expone el endpoint
- `wdio.conf.ts`: configuración de WebdriverIO
- `Dockerfile`: define el entorno con Chrome Headless
- `cloudbuild.yaml`: build + deploy automático a Cloud Run
- `workflow.yaml`: ejecuta el servicio via HTTP desde Cloud Workflows

---

## ⚡ Recomendaciones

- Usa `--memory=1Gi` en Cloud Run para evitar errores con Chrome Headless.
- Protege el endpoint con IAM si no deseas que sea público (`allUsers`).
- Usa `esModuleInterop` y `allowSyntheticDefaultImports` en TypeScript para importar correctamente librerías de Node.js.

---

## 🚨 Seguridad

Para hacer el servicio **privado** nuevamente:

```bash
gcloud run services remove-iam-policy-binding wdio-tests-service \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

---

## 🎓 Referencias

- [WebdriverIO](https://webdriver.io/)
- [Google Cloud Run](https://cloud.google.com/run)
- [Cloud Workflows](https://cloud.google.com/workflows)
- [Cloud Build](https://cloud.google.com/build)
