import xlsx from "node-xlsx";
import * as fs from "fs";
import * as sql from "mssql";

fs.readdir("files", async (err, files) => {
  await sql.connect("");

  const table = new sql.Table("Arrivals");
  table.columns.add("Spreadsheet", sql.Int);
  table.columns.add("Apellido", sql.NVarChar(100));
  table.columns.add("Nombre", sql.NVarChar(100));
  table.columns.add("Parentesco", sql.NVarChar(100));
  table.columns.add("Edad", sql.Int);
  table.columns.add("Sexo", sql.NVarChar(100));
  table.columns.add("Estado_Civil", sql.NVarChar(100));
  table.columns.add("Profesión", sql.NVarChar(100));
  table.columns.add("Religión", sql.NVarChar(100));
  table.columns.add("Puerto_salida", sql.NVarChar(100));
  table.columns.add("Buque", sql.NVarChar(100));
  table.columns.add("Fecha_arribo", sql.DateTime);
  table.columns.add("Educación", sql.NVarChar(100));
  table.columns.add("Clase", sql.NVarChar(100));

  files.forEach(file => {
    const workSheetsFromFile = xlsx.parse(`files/${file}`, { cellDates: true });
    const number = +file.split(".")[0];

    const spreadsheet = workSheetsFromFile[0].data as Array<Array<any>>;
    spreadsheet.forEach(row => {
      if (row.length > 0) {
        let arrivalDate: Date;

        try {
          if (row[10] && typeof row[10] == "string" && row[10].includes("-")) {
            const [day, month, year] = row[10].split("-");

            arrivalDate = new Date(+year, +month, +day);
          } else if (Date.parse(row[10])) {
            arrivalDate = new Date(row[10]);
          }
        } catch (err) {
          console.log(err);
          console.log(row);
        }

        //Truncating weird ages
        const age = 100 / row[3] > 1 ? row[3] / 10 : row[3];

        table.rows.add(
          number,
          row[0],
          row[1],
          row[2],
          age,
          row[4],
          row[5],
          row[6],
          row[7],
          row[8],
          row[9],
          arrivalDate,
          row[11],
          row[12]
        );
      }
    });

    console.log(`file: ${file} ready to import.`);
  });

  console.log("starting inserting...");

  const request = new sql.Request();
  request.bulk(table, (err, result) => {
    console.log(err);
    console.log(result);
    console.log(`import finished.`);
  });
});
