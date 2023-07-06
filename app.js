const chessBoard = document.querySelector("#chess-board")

const playerTurnDisplay = document.querySelector("#player")

const infoPanel = document.querySelector("#info")

let NowPlays = 'black'

playerTurnDisplay.textContent = 'black'



const startPieces = [rookBlack,knightBlack,bishopBlack,queenBlack,kingBlack,bishopBlack,knightBlack,rookBlack,
    pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,
    rookWhite,knightWhite,bishopWhite,kingWhite,queenWhite,bishopWhite,knightWhite,rookWhite]


function createBoard(){
    startPieces.forEach((startPiece,index)=>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.setAttribute('square-id',index)
        square.innerHTML=startPiece

        const row = Math.floor((63-index)/8)+1

        square.firstChild?.setAttribute('draggable',true)

        if(row%2===0){
            square.classList.add(index%2===0?"teal":"mint-green")
        }
        else{
            square.classList.add(index%2===0?"mint-green":"teal")
        }

        chessBoard.appendChild(square)
    })
}

createBoard()


const squares = document.querySelectorAll('#chess-board .square')

squares.forEach(square=>{
    square.addEventListener('dragstart',dragstart)
    square.addEventListener('dragover',dragover)
    square.addEventListener('drop',dragdrop)
})


let chosenElemen
let startPosition


function dragstart(e){
    //console.log(e.target)
    startPosition = e.target.parentNode.getAttribute('square-id')
   // console.log(targetSquare)

   chosenElement = e.target
   //console.log(chosenElement)

}

function dragover(e){
    e.preventDefault()
}

function dragdrop(e){
    e.stopPropagation()
  //console.log(e.target)
    //e.target.append(chosenElement)
    const pieceExists = e.target.classList.contains('pieces')
    
    const validTurn = chosenElement.classList.contains(NowPlays)

   // console.log(chosenElement.firstChild)

    const opponent = NowPlays==='black'?'white':'black'
    const isOpponentPiece = e.target?.classList.contains(opponent)
    //console.log(e.target)

   console.log('is valid move? ',isValidMove(e.target))
//    console.log('prev',e.target.previousSibling)
//    console.log('next',e.target.nextSibling)
    if(validTurn){
        if(isOpponentPiece && isValidMove(e.target)){
            e.target.parentNode.append(chosenElement)
            e.target.remove()
            if(chosenElement.classList.contains('pawn')){
                chosenElement.classList.add('moved')
    }
            changePlayer()
        }

        else if(isValidMove(e.target)){
            e.target.append(chosenElement)
            changePlayer()
        }
        
    }
   
   
}

function changePlayer(){
    if(NowPlays==='white'){
        NowPlays='black'
        playerTurnDisplay.textContent='black'
        reverseIds()
    }
    else {
        NowPlays='white'
        playerTurnDisplay.textContent='white'
        reverseIds()
    }
}


function reverseIds(){
    squares.forEach(square=>{
        const currentId = parseInt(square.getAttribute('square-id'))
        const reversedId = 63 - currentId

        square.setAttribute('square-id',reversedId)
    })
}

function isValidMove(target){
    const currentPosition = parseInt(startPosition)
    //grabs the class at first index
    const chessman = chosenElement.classList.item(0)

    //to validate first pawn move
    const hasMovedOnce = chosenElement.classList.contains('moved')
    const targetPosition = parseInt(target.getAttribute('square-id')) || parseInt(target.parentNode.getAttribute('square-id'))
   // console.log(target)
  // console.log(chosenElement.classList.item(0))

 // console.log('targetPos '+targetPosition +'     '+'currentPos '+currentPosition +'   '+'diff '+(targetPosition-currentPosition))
  
    switch (chessman) {
        case 'pawn':
            return validatePawnMove(target,currentPosition,targetPosition,hasMovedOnce)
           
            break;

       case 'rook':
            //check no in between pawns
            //check if same colour chessman at targetPosition
            //check if on same row or col
            return validateRookmove(currentPosition,targetPosition)

       
    }
}


function validatePawnMove(target,currentPosition,targetPosition,hasMovedOnce){
    

    if((targetPosition-currentPosition===7)||(targetPosition-currentPosition===9)){
        if(target.classList.contains('pieces')){
            return true
        }
    }

    if(hasMovedOnce){
        if(targetPosition-currentPosition===8) {
            if(!target.classList.contains('pieces')){
                return true
            }
           
        }

        
    }
    else if(!hasMovedOnce) {
        if((targetPosition-currentPosition===8 || targetPosition-currentPosition===16)){
            if(!target.classList.contains('pieces')){
                return true
            }
        }
    }

    // else{
    //     //check +1 and -1 pos of targetpos
       
    // }

    return false
}


function validateRookmove(currentPosition,targetPosition){
    if((targetPosition%8===currentPosition%8) || (parseInt(targetPosition/8))===parseInt(currentPosition/8)){
        const targetOnSameRank = (targetPosition%8)===(currentPosition%8)?true:false

        if(targetOnSameRank){
            let matchTarget = currentPosition
            console.log('targetPos '+targetPosition+' '+'current '+currentPosition)
            //check if any square b/w currentPosition and targetPosition contains an opponent piece'
            if((targetPosition<currentPosition) && matchTarget>=0){
               
                while(matchTarget!=targetPosition){
                    matchTarget=matchTarget-8
                    const checkElement = document.querySelector('[square-id="matchTarget"]')
                    console.log('checkEle'+checkElement)
                    if(checkElement.classList.contains('pieces')){
                        return false
                    }
                    
                }
            }
            else if(targetPosition>currentPosition && matchTarget<=63){
                while(matchTarget!=targetPosition){
                    matchTarget=matchTarget+8
                    const checkElement = document.querySelector('[square-id="matchTarget"]')
                   // console.log(checkElement)
                    if(checkElement.classList.contains('pieces')){
                        return false
                    }
                }
            }
        }

        else{
            //cover for same row

        }

        return true

       
    }
}

