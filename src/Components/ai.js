export async function getRecipeFromMistral(ingredientsArr) {
  try {
    const response = await fetch("http://localhost:3001/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${text}`);
    }

    const data = await response.json();
    return data.recipe;

  } catch (err) {
    console.error("AI ERROR:", err.message);
  }
}
