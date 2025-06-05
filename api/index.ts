import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.post("/", (_req, res) => {
  console.log("🚀 Solicitud recibida: ejecutando pruebas WebdriverIO...");

  exec(
    "npm run wdio",
    { cwd: path.resolve(__dirname) },
    (err, stdout, stderr) => {
      //console.log("error", err);
      //console.log("stdout", stdout);
      //console.log("stderr", stderr);
      let status = true;
      if (err) {
        console.error("❌ Error al ejecutar pruebas:", stderr);
        /*return res.status(500).json({
          success: false,
          error: stderr,
        });*/
        status = false;
      }

      const specResult =
        stdout.match(/Spec Files:.*?passed.*?\(.*?completed\)/)?.[0] || "";
      console.log("📊 Resultado de las pruebas:", stdout);
      console.log("✅ Pruebas completadas correctamente.");
      res.json({
        success: status,
        output: specResult,
      });
    }
  );
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
});
