let cards = document.querySelector("#cards");
const addCardButton = document.querySelector("#addcard")
const submitButton = document.querySelector("#submitButton")
const name = document.querySelector("#setname")
const essentialTypes=["Essential","Semi-essential","Non-essential"]
const essentialTypesShortened=["E","S","N"]
const cardOne=document.querySelector("#card")
let cardIndex1=0
let cardIndex2=0

var cardList=[cardOne]
createNewCard(cardOne)

const submit=document.querySelector("#submitButton")
const nameError=document.querySelector("#nameInUseError")

name.addEventListener("input", async (e)=>{
    submit.disabled=true
    nameError.style.visibility="hidden"
    if(name.value!=""){
        try {
        const response = await fetch(`/create/get_name/${name.value}`, {method: "GET", headers: {'Content-Type': 'application/json'},});
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.text();
        if(data=="T"){
            submit.disabled=false
        }else{
            nameError.style.visibility="visible"
        }
      }
        catch (error) {
        console.error('Fetch error:', error);
      }
    }
})

function createNewCard(card){
    cardIndex1++
    const addButton = document.createElement("button")
    const endCard = document.createElement("div")
    endCard.classList.add("carrier")
    const beginCard = document.createElement("div")
    beginCard.classList.add("carrier")
    endCard.appendChild(addButton)
    addButton.textContent="+"

    addButton.addEventListener("click", e=>{
        cardIndex2++
        const newAttribute = document.createElement("div")

        const question = document.createElement("input")
        const answer = document.createElement("input")
        question.setAttribute("name","q"+cardIndex1+","+cardIndex2)
        answer.setAttribute("name","a"+cardIndex1+","+cardIndex2)

        newAttribute.appendChild(question)
        newAttribute.appendChild(answer)

        const selectEssential = document.createElement("select")
        for(let i = 0;i<essentialTypes.length;i++){
            const option = document.createElement("option")
            option.value=essentialTypesShortened[i]
            option.textContent=essentialTypes[i]
            selectEssential.appendChild(option)
        }
        selectEssential.setAttribute("name","e"+cardIndex1+","+cardIndex2)

        newAttribute.appendChild(selectEssential)
        beginCard.appendChild(newAttribute)
    });
    addButton.type="button"

    card.appendChild(beginCard)
    card.appendChild(endCard)
    card.classList.add("carrier")
}

addCardButton.addEventListener("click", e=>{
    const newCard = document.createElement("div")
    cardList+=newCard
    cards.appendChild(newCard)
    createNewCard(newCard)
})