import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db= new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"AadhyaRaj@0!",
  port:"5432"
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result =await db.query("select country_code from visited_countries");
  // console.log(result);
  let countries=[];
  result.rows.forEach((country)=> {
    countries.push(country.country_code);
  });
  
  // console.log(result.rows);
  // console.log(countries);
  res.render("index.ejs",{countries:countries,total:countries.length});

});

app.post("/add",async(req,res)=>{
  const user_country =req.body["country"];
  const result = await db.query("Select country_code from countries where country_name = $1 ",[user_country]);
  // console.log(result);
  // console.log(result.rows[0].country_code);
  if (result.rows.length!==0){
    await db.query("Insert into visited_countries (country_code) values ($1)",[result.rows[0].country_code]);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
