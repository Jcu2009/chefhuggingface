import React from "react"
import IngredientList from "./IngredientList"
import HuggingFaceRecipe from "./HuggingFaceRecipe"
import { getRecipeFromMistral } from "./ai"

export function MainBody() {
 const [ingredients, setIngredients] = React.useState([])
 const [recipe, setRecipe] = React.useState("")

 const recipeSection = React.useRef(null)
    
 React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            recipeSection.current.scrollIntoView({behavior: "smooth"})  
        }
    }, [recipe])

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeMarkdown)
    }

    

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }
    
    function remIngredient(formData) {
        const newIngredient = formData.get("ingredient")

        setIngredients(prevIngredients => {return prevIngredients.slice(0, -1)})
    }

    return (
        <main>
            <form className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button formAction={addIngredient}>Add ingredient</button>
                <button className="remove" formAction={remIngredient}>Rem ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientList
                    ref={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    
                />
            }

            {recipe && <HuggingFaceRecipe recipe={recipe}/>}
        </main>
    )
}