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


let chosenElement
let startPosition


function dragstart(e){
    startPosition = e.target.parentNode.getAttribute('square-id')
   chosenElement = e.target
}

function dragover(e){
    e.preventDefault()
}

function dragdrop(e){
    e.stopPropagation()
  
    const pieceExists = e.target.classList.contains('pieces')
    
    const validTurn = chosenElement.classList.contains(NowPlays)


    const opponent = NowPlays==='black'?'white':'black'
    const isOpponentPiece = e.target?.classList.contains(opponent)

   console.log('is valid move? ',isValidMove(e.target))

    if(validTurn){
        if(isOpponentPiece && isValidMove(e.target)){
            e.target.parentNode.append(chosenElement)
            e.target.remove()
            console.log(chosenElement.classList)
            pieceMoved()
            changePlayer()
        }

        else if(isValidMove(e.target)){
            if(chosenElement.classList.contains('pawn')){
                chosenElement.classList.add('moved')
            }
            e.target.append(chosenElement)
            pieceMoved()
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
    //grabs the class at first index aka colour of chessmen
    const chessman = chosenElement.classList.item(0)

    //to validate first pawn move
    const hasMovedOnce = chosenElement.classList.contains('moved')
    const targetPosition = parseInt(target.getAttribute('square-id')) || parseInt(target.parentNode.getAttribute('square-id'))
  
    console.log('start Position: '+startPosition+ '    targetPos: '+targetPosition)
    switch (chessman) {
        case 'pawn':
            return validatePawnMove(target,currentPosition,targetPosition,hasMovedOnce)
           
            break;

       case 'rook':
            return validateRookmove(target,currentPosition,targetPosition)

            break;

        case 'knight':
            return validateKnightMoves(target,currentPosition,targetPosition)

            break;
       
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

    else {
        return false
    }
}


function validateRookmove(target,currentPosition,targetPosition){

    if(((targetPosition % 8) === (currentPosition % 8) ) || (parseInt(targetPosition/8))===parseInt(currentPosition/8)){
        const targetOnSameFile = (targetPosition % 8 )===(currentPosition % 8)?true:false

        if(targetOnSameFile){
            //validates moves on same file
            return checkIfFileContainsPiece(target,currentPosition,targetPosition)
        }

        else{
            //validates moves on same rank
            return checkIfRankContainsPiece(target,currentPosition,targetPosition)
        }
       
    }
}

function checkIfFileContainsPiece(target,currentPosition,targetPosition){
    let containsPiece = false
    if(target?.classList.contains(NowPlays)){
        return containsPiece
    }

    squares.forEach(square=>{
        const checkId = Number(square.getAttribute('square-id'))

        //check forward on same file 
        if(targetPosition > currentPosition){
           if((checkId%8)===(currentPosition%8)){
            if((checkId<targetPosition) && (checkId>currentPosition)){
                
                if(square.firstChild? true:false){
                   
                    if(square.firstChild.classList.contains('pieces')){
                        containsPiece=true
                    }
                }
            }
           }
        }

        else if(targetPosition < currentPosition){
            //check backwards on same file
            if((checkId%8)===(currentPosition%8)){

                if(checkId > targetPosition && checkId<currentPosition){

                    if(square.firstChild? true:false){
                       
                        if(square.firstChild.classList.contains('pieces')){
                            containsPiece=true
                        }
                    }
                }
            }
        }
    })
    return !containsPiece
}


function checkIfRankContainsPiece(target,currentPosition,targetPosition){
    let containsPiece = false

    //checks if target square has same colour chessmen
    if(target?.classList.contains(NowPlays)){
        
          return containsPiece
      }

    squares.forEach(square=>{
        const checkId = Number(square.getAttribute('square-id'))

        //check left side on rank
        if(targetPosition > currentPosition){
            if(parseInt(checkId/8) === parseInt(currentPosition/8)){
                if(checkId<targetPosition && checkId>currentPosition){
                    if(square.firstChild? true:false){
                    
                         if(square.firstChild.classList.contains('pieces')){
                             containsPiece=true
                         }
                     }
                }
            }
        }

        //check right side on rank

        else if(targetPosition < currentPosition){

            if(parseInt(checkId/8)===parseInt(currentPosition/8)){
                if(checkId > targetPosition && checkId<currentPosition){
                    console.log('square-id: '+checkId)
                    if(square.firstChild? true:false){
                    
                        if(square.firstChild.classList.contains('pieces')){
                            containsPiece=true
                        }
                    }
                }
            }
        }
    })

    return !containsPiece

}


function validateKnightMoves(target,currentPosition,targetPosition){

    if(target?.classList.contains(NowPlays)){
        console.log('it has same color piece')
        return false
    }

    //check if move is valid

    //todo: for now knight moves are hardcoded, should be a better way

    const possiblePositions = new Set();

    //-8 reflects going to a row up
    //+8 reflects going one row down
    //other int values reflect column movements
    possiblePositions.add(currentPosition-8-2)
    possiblePositions.add(currentPosition+8-2)
    possiblePositions.add(currentPosition-8+2)
    possiblePositions.add(currentPosition+8+2)
    possiblePositions.add(currentPosition+8+8-1)
    possiblePositions.add(currentPosition+8+8+1)
    possiblePositions.add(currentPosition-8-8+1)
    possiblePositions.add(currentPosition-8-8-1)

    if(possiblePositions.has(targetPosition)){
        return true
    }

    else{
        return false
    }

}


