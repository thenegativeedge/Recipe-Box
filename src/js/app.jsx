import React from "react";
import ReactDOM from "react-dom";

class Box extends React.Component{
	constructor(){
		super();

		// Print Default Recipes in LocalStorage
		if (localStorage.getItem("Recipes") === null){
			let defaultRecipes = [
				{title: "Recipe 1",
				ingredients: ["Ingredient 1", "Ingredient 2"]
			},
				{title: "Recipe 2",
				ingredients: ["Ingredient 3", "Ingredient 4"]}
			];
			localStorage.setItem("Recipes", JSON.stringify(defaultRecipes));
		}
		let local = localStorage.getItem("Recipes");

		// States
		this.state = {
			recipes: JSON.parse(local),
			modal: false,
			edit: false,
			titleEdit: "",
			ingredientsEdit: [],
			indexEdit: 0
		};
		// Function Binding
		this.addNewRecipe = this.addNewRecipe.bind(this);
		this.saveNewRecipe = this.saveNewRecipe.bind(this);
		this.eachRecipe = this.eachRecipe.bind(this);
		this.delRecipe = this.delRecipe.bind(this);
		this.editRecipe = this.editRecipe.bind(this);
		this.saveEditRecipe = this.saveEditRecipe.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	addNewRecipe(){ // Open modal to New Recipes
		this.setState({modal: !this.state.modal});
	}
	transformStringToObj(title, ingredients){
		let ingredientsList = [];
		let obj = {
			title: title,
			ingredients: ingredientsList
		};
		// Trim any space between the commas ","
		ingredients = ingredients.split(",");
		ingredients.forEach(function(word){
			word = word.trim();
			ingredientsList.push(word);
		});
		return obj;
	}
	saveNewRecipe(){ // Save Modal
		let title = document.querySelector("[name='title']").value;
		let ingredients = document.querySelector("[name='ingredients']").value;
		let added = this.transformStringToObj(title, ingredients);

		this.state.recipes.push(added);
		this.setState({recipes: this.state.recipes, modal: !this.state.modal});
		localStorage.setItem("Recipes", JSON.stringify(this.state.recipes));
	}
	editRecipe(i){
		let recipeTitle = this.state.recipes[i].title;
		let recipeIngredientList = this.state.recipes[i].ingredients;
		this.setState({edit: !this.state.edit, titleEdit: recipeTitle, ingredientsEdit: recipeIngredientList, indexEdit: i});
	}
	saveEditRecipe(){
		let title = document.querySelector("[name='title']").value;
		let ingredients = document.querySelector("[name='ingredients']").value;
		let edited = this.transformStringToObj(title, ingredients);
		this.state.recipes[this.state.indexEdit] = edited;
		this.setState({edit: !this.state.edit, recipes: this.state.recipes});
		localStorage.setItem("Recipes", JSON.stringify(this.state.recipes));
	}
	closeModal(){
		if(this.state.edit){
			this.setState({edit: false});
		}
		else if(this.state.modal){
			this.setState({modal: false});
		}
	}
	delRecipe(i){ // Delete Recipe
		let array = this.state.recipes;
		array.splice(i, 1);
		this.setState({recipes: array});
		localStorage.setItem("Recipes", JSON.stringify(this.state.recipes));
	}
	eachRecipe(obj, i){
		return (
				<Recipe key={i} index={i} title={obj.title} ingredients={obj.ingredients} delRecipe={this.delRecipe} editRecipe={this.editRecipe}/>
			);
	}
	render(){
		return (
			<div>
				<h1 className="headerTitle">Virtual Recipe Box</h1>
				<div className="outsideBox">
					{this.state.recipes.map(this.eachRecipe)}
					<Modal isOpen={this.state.modal} isEdit={this.state.edit} saveNew={this.saveNewRecipe} saveEdit={this.saveEditRecipe} close={this.closeModal} titleDefault={this.state.titleEdit} ingredientsDefault={this.state.ingredientsEdit}></Modal>
					<button className="add" onClick={this.addNewRecipe}>Add Recipe</button>
				</div>
			</div>
		);
	}
}

class Recipe extends React.Component{
	constructor(){
		super();
		this.state = {fullToggle: false};
		// Function Binding
		this.delete = this.delete.bind(this);
		this.edit = this.edit.bind(this);
		this.toggleView = this.toggleView.bind(this);
	}
	delete(){ // Calls the parent function to Delete Recipe
		this.props.delRecipe(this.props.index);
	}
	edit(){
		this.props.editRecipe(this.props.index);
	
	}
	toggleView(){
		this.setState({fullToggle: !this.state.fullToggle});
	}
	eachIngredient(ing, i){
		return (
				<li key={i}>{ing}</li>
			);
	}
	indexView(){
		return (
			<div className="recipeBox">
				<div onClick={this.toggleView} className="title">
					<h1>{this.props.title}</h1>
				</div>
			</div>
		);
	}
	fullView(){
		return (
			<div className="recipeBox">
				<div onClick={this.toggleView} className="title">
					<h1>{this.props.title}</h1>
				</div>
				<div className="ingredients">
					<ul>
						{this.props.ingredients.map(this.eachIngredient)}
					</ul>
					<button className="delete" onClick={this.delete}>Delete</button>
					<button className="edit" onClick={this.edit}>Edit</button>
				</div>
			</div>
		);
	}
	render(){
		if (this.state.fullToggle){
			return this.fullView();
		}
		else{
			return this.indexView();
		}
		
	}
}

class Modal extends React.Component{
	modalAdd(){
		return	(
			<div className="outsideModal">
				<div id="modal" className="modal">
					<button className="closeModal" onClick={this.props.close}>X</button>
					<h1>Add Recipe</h1>
					<p>Title: </p><textarea name="title" cols="50" rows="1"/>
					<p>Ingredients: </p><textarea name="ingredients" id="" cols="75" rows="10"/>
					<button onClick={this.props.saveNew} className="save">Save New Recipe</button>
				</div>
			</div>
			);
	}
	modalEdit(){
		return	(
			<div className="outsideModal">
				<div id="modal" className="modal">
					<button className="closeModal" onClick={this.props.close}>X</button>
					<h1>Edit Recipe</h1>
					<p>Title: </p>
					<textarea name="title" cols="50" defaultValue={this.props.titleDefault}/>
					<p>Ingredients:</p>
					<textarea name="ingredients" id="" cols="97" rows="10" defaultValue={this.props.ingredientsDefault}></textarea>
					<button onClick={this.props.saveEdit} className="save">Save Edit</button>
				</div>
			</div>
			);
	}
	render(){
		if(this.props.isOpen){
			return this.modalAdd();
		}
		else if(this.props.isEdit){
			return this.modalEdit();
		}
		else{
			return null;
		}
	}
}

ReactDOM.render(<Box/>, document.getElementById("container"));