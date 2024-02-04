const selectors={
    columnContainer1: document.querySelector('.column-container1'),
    columnContainer2: document.querySelector('.column-container2'),
    column1:document.querySelector('.column1'),
    column2:document.querySelector('.column2'),
    timer:document.querySelector('timer'),
}

const state={ 
    dimension:4,
    displaywindow:-1,
    flippedCards: 0,
    matrix:null,
    unselected: "#282A3A",
    colours: ["#F08080","#399E5A","#FCDFA6","#B38CB4"],
    item1:[-1,-1,-1,-1],
    item2:[-1,-1,-1,-1],
    selectedCard: null,
    linesstart:[],
    linesend:[],
    score2:0,
    score1:0,
    score3:0,
    score:0
    // loop: setInterval(() => {
    //     state.totalTime++
    //     selectors.timer.innerText = `Time: ${state.totalTime} sec`
    // }, 1000),
    
}

const shuffle = num => {
    const array1 = []
    const array2 = []
    const array3 = []
    for(let i=0;i<num;i++){
        const num1=Math.floor(Math.random()*49+1)
        const num2=Math.floor(Math.random()*49+1)
        const num3=num1+num2;
        array1.push(num1.toString().concat("+",num2.toString()))
        array2.push(num3.toString())
        array3.push(i)
    }
    for (let i = array3.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = array3[i]

        array3[i] = array3[randomIndex]
        array3[randomIndex] = original
    }

    return [array1,array2,array3]
}
function redrawStoredLines(){
    var canvas=document.getElementById("matchcanvas")
    var ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(var i=0;i<state.linesend.length;i++){
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.moveTo(state.linesstart[i][0],state.linesstart[i][1]);
        ctx.lineTo(state.linesend[i][0],state.linesend[i][1]);
        ctx.strokeStyle = document.getElementById("A".concat((i).toString())).style.background;
        ctx.stroke();
    }
}
const getcenters=(card1,origin)=>{  
    var targetNode = card1.getBoundingClientRect(); 
    var targetNode2 = origin.getBoundingClientRect();
    let center1X = targetNode.left-targetNode2.left + targetNode.right / 2;
    let center1Y = targetNode.top-targetNode2.top + targetNode.bottom / 2;

    const ret=[center1X*0.65-170,center1Y*0.685-75]
    // console.log(ret)
    return ret

}
const generateGame=()=>{
    const data=shuffle(state.dimension)
    state.matrix=data
    const item1=data[0]
    const item2=data[1]
    const order=data[2]
    const cards1 = `
        <div class="column1" style="grid-template-columns: repeat(${1}, auto)">
            ${item2.map((item,index) => 
                `<div class="card1" style="background:${state.unselected}" id=A${index} data-idnum=${item2.indexOf(item)}>
                ${item}
                </div>
            `).join('')}
        
       </div>
       
    `
    const cards2 = `
    <div class="column2" style="grid-template-columns: repeat(${1}, auto)">
        ${order.map((item,index) => `
            <div class="card2" style="background:${state.unselected}" id=A${index+state.dimension} data-idnum=${item}>
                ${item1[item]}
            </div>
        `).join('')}
   </div>
`   
    const parser1 = new DOMParser().parseFromString(cards1, 'text/html')
    const parser2 = new DOMParser().parseFromString(cards2, 'text/html')

    selectors.column1.replaceWith(parser1.querySelector('.column1'))
    selectors.column2.replaceWith(parser2.querySelector('.column2'))
    const lines=document.querySelectorAll(".card1")
    const offset=document.getElementById("matchcanvas")
    for(var i=0;i<lines.length;i++){
        var ret1=getcenters(lines[i],offset)
        var ret2=getcenters(lines[i],offset)
        state.linesstart.push(ret1)
        state.linesend.push(ret2)
    }
    var num1 = Math.floor(Math.random() * 100);
    var num2 = Math.floor(Math.random() * 100);
    var num3 = Math.floor(Math.random() * 100);
    var num4 = Math.floor(Math.random() * 100);
    var num5 = Math.floor(Math.random() * 100);
    var num6 = Math.floor(Math.random() * 100);
    var num7 = Math.floor(Math.random() * 100);
    var num8 = Math.floor(Math.random() * 100);

    // Display the random numbers
    document.getElementById("num1").textContent = num1;
    document.getElementById("num2").textContent = num2;
    document.getElementById("num3").textContent = num3;
    document.getElementById("num4").textContent = num4;
    document.getElementById("num5").textContent = num5;
    document.getElementById("num6").textContent = num6;
    document.getElementById("num7").textContent = num7;
    document.getElementById("num8").textContent = num8;

    var selected_ans=Math.floor(Math.random()*3.99);
    console.log("K0".concat(selected_ans.toString()))
    div=document.getElementById("K0".concat(selected_ans.toString()))
    div.classList.add("correct-answer")
    base=Math.floor(Math.random()*49+1)
    console.log(base)
    others=document.querySelectorAll('.number-option')
    for(let i=0;i<others.length;i++){
        if(i==selected_ans){
            others[i].innerHTML=base.toString()
        }
        else{
            others[i].innerHTML=(base+Math.floor(Math.random()*49+1)).toString()
        }
    }
    console.log(others)
    document.getElementById("First").style.display="none"
    document.getElementById("game").style.display="none"
    document.getElementById("exercise").style.display="none"
    document.getElementById("right").style.display="none"
    document.getElementById("left").style.display="none"
    document.getElementById("final").style.display="none"

}
const decolor = card=>{
    if(state.item1.includes(card.id)){
        const ind=state.item1.indexOf(card.id)
        //find the pair
        const C1= document.getElementById(state.item1[ind])
        const C2= document.getElementById(state.item2[ind])
        //clear occupancy
        state.item1[ind]=-1
        state.item2[ind]=-1
        //update
        C1.style.background=state.unselected
        C2.style.background=state.unselected
          
        //linesupate
        offset=document.getElementById("matchcanvas")
        if(C1.className=="card1"){
            const ind =Number(C1.id.slice(1))
            state.linesend[ind]=(getcenters(C1,offset))
        }
        if(C2.className=="card1"){
            const ind=Number(C2.id.slice(1))
            state.linesend[ind]=getcenters(C2,offset)
        }
        redrawStoredLines()
        if(C1.dataset.idnum==C2.dataset.idnum){
            state.score2-=10;
        }
    }
    if(state.item2.includes(card.id)){
        const ind=state.item2.indexOf(card.id)
        const C1= document.getElementById(state.item1[ind])
        const C2= document.getElementById(state.item2[ind])
        state.item1[ind]=-1
        state.item2[ind]=-1
        C1.style.background=state.unselected
        C2.style.background=state.unselected
        offset=document.getElementById("matchcanvas")
        if(C1.className=="card1"){
            const ind =Number(C1.id.slice(1))
            state.linesend[ind]=(getcenters(C1,offset))
        }
        if(C2.className=="card1"){
            const ind=Number(C2.id.slice(1))
            state.linesend[ind]=getcenters(C2,offset)
        }
        // console.log(state.linesstart,state.linesend)
        redrawStoredLines()
        if(C1.dataset.idnum==C2.dataset.idnum){
            state.score2-=10;
        }
    }
}
function checkAnswers() {
    var answer1 = parseInt(document.getElementById("answer1").value);
    var answer2 = parseInt(document.getElementById("answer2").value);
    var answer3 = parseInt(document.getElementById("answer3").value);
    var answer4 = parseInt(document.getElementById("answer4").value);
    num1=Number(document.getElementById("num1").textContent) ;
    num2=Number(document.getElementById("num2").textContent) ;
    num3=Number(document.getElementById("num3").textContent) ;
    num4=Number(document.getElementById("num4").textContent) ;
    num5=Number(document.getElementById("num5").textContent) ;
    num6=Number(document.getElementById("num6").textContent) ;
    num7=Number(document.getElementById("num7").textContent) ;
    num8=Number(document.getElementById("num8").textContent) ;
    let score3=0;
    if (answer1 === (num1 + num2) && answer2 === (num3 + num4) && answer3 === (num5 + num6) && answer4 === (num7 + num8)) {
        score3+=40;
    } 
    else if (
    answer1 !== (num1 + num2) && answer2 === (num3 + num4) && answer3 === (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 !== (num3 + num4) && answer3 === (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 === (num3 + num4) && answer3 !== (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 === (num3 + num4) && answer3 === (num5 + num6) && answer4 !== (num7 + num8)){
    	score3+=30;
    }
    else if (
    answer1 !== (num1 + num2) && answer2 !== (num3 + num4) && answer3 === (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 !== (num1 + num2) && answer2 === (num3 + num4) && answer3 !== (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 !== (num1 + num2) && answer2 === (num3 + num4) && answer3 === (num5 + num6) && answer4 !== (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 !== (num3 + num4) && answer3 !== (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 !== (num3 + num4) && answer3 === (num5 + num6) && answer4 !== (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 === (num3 + num4) && answer3 !== (num5 + num6) && answer4 !== (num7 + num8)
    ){
    	score3+=20;
    }
    else if (
    answer1 !== (num1 + num2) && answer2 !== (num3 + num4) && answer3 !== (num5 + num6) && answer4 === (num7 + num8) ||
    answer1 !== (num1 + num2) && answer2 !== (num3 + num4) && answer3 === (num5 + num6) && answer4 !== (num7 + num8) ||
    answer1 !== (num1 + num2) && answer2 === (num3 + num4) && answer3 !== (num5 + num6) && answer4 !== (num7 + num8) ||
    answer1 === (num1 + num2) && answer2 !== (num3 + num4) && answer3 !== (num5 + num6) && answer4 !== (num7 + num8)){
    	score3+=10;
    }
    else {
        score3+=0;
    }
    state.score3=score3
    console.log(state.score3)
    state.score=state.score1+state.score2+state.score3
    document.getElementById("interact").dataset.score=state.score
    console.log(state.score)
    state.displaywindow=3
    document.getElementById("final").style.display="block"
    document.getElementById("right").style.display="none"
    document.getElementById("left").style.display="none"
    console.log("name:",document.getElementById("name").value)
    document.getElementById("scoresheet").innerHTML=(document.getElementById("name").value).concat(", your score is ",state.score.toString() )
    pagerefresh()
    

}
const Selector= card=>{
    
    if(state.selectedCard==null){
        state.selectedCard=card
        decolor(card)
        card.style.background="#7067CF";
    }
    else{
        if(state.selectedCard.className==card.className){
            console.log("same column")
            state.selectedCard.style.background=state.unselected    
        }
        else{            
            console.log("dif column")
            const freecol=state.item1.indexOf(-1)
            decolor(card)
            //newcolour
            state.selectedCard.style.background=state.colours[freecol]
            card.style.background=state.colours[freecol]
            //occupying
            state.item1[freecol]=state.selectedCard.id
            state.item2[freecol]=card.id
            const offset=document.getElementById("matchcanvas")
            if(state.selectedCard.className=="card1"){
                const ind =Number(state.selectedCard.id.slice(1))
                state.linesend[ind]=(getcenters(card,offset))
            }
            if(card.className=="card1"){
                const ind =Number(card.id.slice(1))
                state.linesend[ind]=(getcenters(state.selectedCard,offset))
            }
            console.log(state.linesstart,state.linesend)
            redrawStoredLines()
            if(card.dataset.idnum==state.selectedCard.dataset.idnum){
                state.score2+=10;
            }
        }
        state.selectedCard=null
        
        
    }
}
const pagerefresh=()=>{
    var disState=state.displaywindow
    if(disState==0){
        document.getElementById("First").style.display="block"
    }
    else{
        document.getElementById("First").style.display="none"
    }
    if(disState==1){
        document.getElementById("game").style.display="block"
    }
    else{
        document.getElementById("game").style.display="none"
    }
    if(disState==2){
        document.getElementById("exercise").style.display="block"
    }
    else{
        document.getElementById("exercise").style.display="none"

    }

}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        console.log(eventTarget)
        const eventParent = eventTarget.parentElement
        if (eventTarget.className.includes('card') ) {
            Selector(eventTarget)
            state.score=state.score1+state.score2+state.score3
            document.getElementById("interact").dataset.score=state.score
            return
        } 
        if(eventTarget.id=="start"){
            document.getElementById("username").style.display="none"
            document.getElementById("right").style.display="block"
            document.getElementById("left").style.display="block"
            document.getElementById("start").style.display="none"
            state.displaywindow++
            
        }
        if(eventTarget.id=="right"){
            state.displaywindow=(state.displaywindow+1)%3
            
        }
        if(eventTarget.id=="left"){
            if(state.displaywindow==0){
                state.displaywindow=2
                
            }
            else{
            state.displaywindow=(state.displaywindow-1)%3}
            
        }
        if (event.target.classList.contains('number-option')) {
            var options = document.getElementsByClassName('number-option');
            for (var i = 0; i < options.length; i++) {
                options[i].classList.remove('selected');
            }
            event.target.classList.add('selected');
            if (event.target.classList.contains('correct-answer')) {
                state.score1 = 10;
            }
            else{
                state.score1=0;
            }
        }
        state.score=state.score1+state.score2+state.score3
        document.getElementById("interact").dataset.score=state.score
        pagerefresh()
    })
}
generateGame()
attachEventListeners()