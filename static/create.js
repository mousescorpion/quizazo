let cards = document.querySelector("#cards");
const addCardButton = document.querySelector("#addcard")
const submitButton = document.querySelector("#submitButton")
const name = document.querySelector("#setname")
const essentialTypes=["Essential","Semi-essential","Non-essential"]
const essentialTypesShortened=["E","S","N"]
const cardOne=document.querySelector("#cardOne")
let cardIndex1=0
let cardIndex2=[0]

createNewCard(cardOne)

const submit=document.querySelector("#submitButton")
const nameError=document.querySelector("#nameInUseError")
const essentialError=document.querySelector("#essentialError")

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
            submit.disabled=true
        }
      }
        catch (error) {
        console.error('Fetch error:', error);
      }
    }
})

function createNewCard(card){
    cardIndex1++
    cardIndex2.push(0)
    const addButton = document.createElement("button")
    const endCard = document.createElement("div")
    endCard.classList.add("carrier")
    const beginCard = document.createElement("div")
    beginCard.classList.add("carrier")
    endCard.appendChild(addButton)
    addButton.textContent="+"

    const removeButton = document.createElement("button")
    removeButton.textContent="🗑"
    removeButton.type="button"
    endCard.appendChild(removeButton)
    removeButton.addEventListener("click", ()=>{
        card.remove()
        cardIndex1--
    })

    addButton.addEventListener("click", e=>{
        cardIndex2[cardIndex1]++
        const newAttribute = document.createElement("div")

        const question = document.createElement("input")
        const answer = document.createElement("input")
        question.setAttribute("name","q"+cardIndex1+","+cardIndex2[cardIndex1])
        answer.setAttribute("name","a"+cardIndex1+","+cardIndex2[cardIndex1])
        question.placeholder="Question"
        answer.placeholder="Answer"

        newAttribute.appendChild(question)
        newAttribute.appendChild(answer)

        const selectEssential = document.createElement("select")
        for(let i = 0;i<essentialTypes.length;i++){
            const option = document.createElement("option")
            option.value=essentialTypesShortened[i]
            option.textContent=essentialTypes[i]
            selectEssential.appendChild(option)
        }
        selectEssential.setAttribute("name","e"+cardIndex1+","+cardIndex2[cardIndex1])

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
    newCard.classList.add("carrier")
    cards.appendChild(newCard)
    createNewCard(newCard)
})



setInterval(() => {
    submit.disabled = true
    let good = true
    for(let i =0;i<cardIndex1;i++){
        let j=0;
        let k =0;
        const temp = cards.querySelectorAll(":scope > div")[i].querySelector(":scope > div").children
        for(let index=0;index<temp.length;index++){
            if(temp[index].querySelector(":scope > select").value=="E"){
                j++;
            }
            else if(temp[index].querySelector(":scope > select").value=="S"){
                k++;
            }
            if(temp[index].querySelectorAll(":scope > input")[0].value==""||temp[index].querySelectorAll(":scope > input")[1].value==""){
                good=false
            }
        }
        if(j==0&&k<2){
            good=false
        }
    }
    if(!good){
        essentialError.style.visibility="visible"
    }
    else{
        essentialError.style.visibility="hidden"
        submit.disabled = false
    }
}, 500);