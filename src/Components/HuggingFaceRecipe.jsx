import ReactMarkdown from 'react-markdown'

export default function HuggingFaceRecipe(props) {
    return ( 
        <section className="suggested-recipe-container">
            <h2>Chef Gemini Recommends:</h2>
            <ReactMarkdown children={props.recipe}/>
            
        </section>
    )
}