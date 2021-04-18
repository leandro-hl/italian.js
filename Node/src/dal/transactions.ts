export class Transaction {
  insertions: string[] = [];

  insertArrival2 = (p: any) => {
    this.insertions.push(`INSERT INTO [dbo].[arrivals]
            ([Apellido]
            ,[Nombre]
            ,[Parentesco]
            ,[Edad]
            ,[Sexo]
            ,[Estado_Civil]
            ,[Profesión]
            ,[Religión]
            ,[Puerto_salida]
            ,[Buque]
            ,[Fecha_arribo]
            ,[Educación]
            ,[Clase])
      VALUES
            (${p[0]}
            ,${p[1]}
            ,${p[2]}
            ,${p[3]}           
            ,${p[4]}           
            ,${p[5]}
            ,${p[6]}
            ,${p[7]}
            ,${p[8]}
            ,${p[9]}
            ,${p[10]}
            ,${p[11]}
            ,${p[12]})`);
  };

  insertArrival = (p: any) => {
    this.insertions.push(p);
  };
}
