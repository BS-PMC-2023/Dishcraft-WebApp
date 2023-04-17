/*[ Import ]*/
const express = require("express");
const router = express.Router();
const Example = require("../../models/example");

router.get("/example/2", async (req, res) => {
  /*const example = new Example({ id: "1", username: "1", password: "1" });
    let result = await example.verify();
    console.log(result.successful);
    console.log(result.text);
    const { successful, text } = result;*/

  const text = "Example 2";
  res.render("main/main", {
    pageTitle: text,
    path: "/example/2",
    text: text,
    redirect: "/",
  });
});

/*[ External access ]*/
module.exports = router;