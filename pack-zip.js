const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const zip = new AdmZip();
const root = __dirname;

const files = [
  "plugin.json",
  "readme.md",
  "CHANGELOG.md",
  "package.json",
  "icon.png"
];

files.forEach(file => {
  const filePath = path.join(root, file);

  if (fs.existsSync(filePath)) {
    zip.addLocalFile(filePath);
    console.log(`Added: ${file}`);
  }
});

function addFolder(folder) {
  const folderPath = path.join(root, folder);

  if (!fs.existsSync(folderPath)) return;

  fs.readdirSync(folderPath).forEach(file => {
    const fullPath = path.join(folderPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      addFolder(path.join(folder, file));
    } else {
      zip.addLocalFile(fullPath, path.dirname(path.join(folder, file)));
      console.log(`Added: ${path.join(folder, file)}`);
    }
  });
}

addFolder("dist");

zip.writeZip(path.join(root, "plugin.zip"));

console.log("✅ plugin.zip created successfully!");
