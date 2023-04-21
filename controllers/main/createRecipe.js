/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { offloadFields } = require("../../utils");
const { Ingredient } = require("../../models/ingredient");
const { Recipe } = require("../../models/recipe");
const { defIngs, units } = require("../../API/constants.json");

//get
router.get("/createRecipe", async (req, res) => {
  const sess = req.session;
  if (!sess.recipe || !sess.recipe.create) {
    sess.recipe = {
      create: true,
      recipeName: "",
      recipeImages: null,
      ingredients: [defIngs],
      instructions: "",
      color: "original",
    };
  }
  res.render("template", {
    pageTitle: "Dishcraft - Recipe Craft",
    page: "createRecipe",
    units: units,
    user: sess.user || null,
    recipe: sess.recipe,
  });
});

//post
router.post("/createRecipe", async (req, res) => {
  var sess = req.session;
  var recipe = sess.recipe;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  offloadFields(["recipeName", "recipeImages", "instructions", "color"], sess.recipe, req.body);
  const { amount, unit, name } = req.body;
  if (Array.isArray(name)) for (var i = 0; i < name.length; i++) list.push({ amount: amount[i], unit: unit[i], name: name[i] });
  else list.push({ amount: amount, unit: unit, name: name });
  recipe.ingredients = list;
  //add ingredient
  if (buttonPress == "addmore") {
    recipe.ingredients.push(defIngs);
  } //remove ingredient
  else if (buttonPress == "remove") {
    recipe.ingredients.splice(index, 1);
  } //Create and save recipe
  else if (buttonPress == "publish") {
    var recipeData = offloadFields(["recipeName", "recipeImages", "instructions", "color"], this, req.body);
    recipeData.userID = sess.user.id;
    recipeData.ingredients = recipe.ingredients;
    recipeData.nutritions = await Ingredient.calcRecipeNutVal(recipeData.ingredients);
    sess.recipe = null;
    var recipe = new Recipe(recipeData);
    let { success, msg } = await recipe.addRecipe();
    if (success) return res.redirect("/home");
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
