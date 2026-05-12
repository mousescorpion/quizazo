const box = document.querySelector("#questions_box")
const prompt = document.querySelector("#prompt")
const more = document.querySelector("#answers")
const submit = document.querySelector("#next")

const data= JSON.parse(data_json)
const lengths= JSON.parse(lengths_json)

var inputs=[]
var answers=[]
var essentials = []
var card_nums=[]
for(let i =0;i<lengths.length;i++){
    card_nums.push(i);
}
card_nums=shuffle(card_nums)
var progress = 0

submit.addEventListener("click",()=>{
    more.replaceChildren()
    if(progress<lengths.length){
        new_card(card_nums[progress])
        progress++
    }
    else{
        prompt.replaceChildren()
        const end = document.createElement("a")
        end.textContent="Go Back"
        end.href='../view_set/'+name
        more.appendChild(end)
    }
} )

function new_card(card_num){
    inputs=[]
    answers=[]
    essentials = []
    for(let i=0;i<lengths[card_num];i++){
        if(data["e"+(card_num+1)+","+(i+1)]=="E"){
            essentials+=i
        }
    }
    let prompter = essentials[Math.floor(Math.random()*essentials.length)]
    for(let i=0;i<lengths[card_num];i++){
        if(i == prompter){
            prompt.textContent=data["q"+(card_num+1)+","+(i+1)]+": "+data["a"+(card_num+1)+","+(i+1)]
        }
        else{
            const divider = document.createElement("divider")
            const input=document.createElement("input")
            const check = document.createElement("button")
            check.textContent="?"
            input.classList.add("inputBox")
            input.name=(card_num+1)+","+(i+1)
            inputs+=input
            answers+=(data["a"+(card_num+1)+","+(i+1)])
            const textPrompt=document.createElement("textPrompt")
            textPrompt.textContent=(data["q"+(card_num+1)+","+(i+1)]+"? ")
            check.addEventListener("click", ()=>{
                if(input.value==data["a"+(card_num+1)+","+(i+1)]){
                    input.style.borderColor="green"
                    console.log(input.value+"yes")
                }
                else{
                    console.log(input.value+"no")
                    input.value=data["a"+(card_num+1)+","+(i+1)]
                }
            })
            divider.appendChild(textPrompt)
            divider.appendChild(input)
            divider.appendChild(check)
            more.appendChild(divider)
        }
    }
}

// Fisher-yates shuffling
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
}

new_card(card_nums[progress])
progress++