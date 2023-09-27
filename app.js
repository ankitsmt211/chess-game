const chessBoard = document.querySelector("#chess-board")

const playerTurnDisplay = document.querySelector("#player")

const infoPanel = document.querySelector("#info")

let NowPlays = 'black'

playerTurnDisplay.textContent = 'black'

let pointsWhite=0
let pointsBlack=0



const startPieces = [rookBlack,knightBlack,bishopBlack,queenBlack,kingBlack,bishopBlack,knightBlack,rookBlack,
    pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,pawnBlack,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,emptySquare,
    pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,pawnWhite,
    rookWhite,knightWhite,bishopWhite,kingWhite,queenWhite,bishopWhite,knightWhite,rookWhite]


const pointsMap = {"queen":9,"bishop":3, "knight":3,"rook":5,"pawn":1}


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

function displayPoints(currentPlayer){
    if(currentPlayer==='black'){
        document.querySelector('#points-black').innerText="Black: "+pointsBlack
        return
    }

    document.querySelector('#points-white').innerText="White: "+pointsWhite
}

function updatePoints(currentPlayer,pieceAcquired){
    if(currentPlayer==='black'){
        pointsBlack+=pointsMap[pieceAcquired]

    }

    else{
        pointsWhite+=pointsMap[pieceAcquired]
    }

    displayPoints(currentPlayer)
}

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
            updatePoints(NowPlays,e.target.classList.item(0))
            changePlayer()
        }

        else if(isValidMove(e.target)){
            if(chosenElement.classList.contains('pawn')){
                chosenElement.classList.add('moved')
            }
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
    //grabs the class at first index aka colour of chessmen
    const chessman = chosenElement.classList.item(0)

    if(isCheck() && chessman !=='king'){
        console.log("move your king, it's check")
        return false
    }

    //to validate first pawn move
    const hasMovedOnce = chosenElement.classList.contains('moved')
    const targetPosition = parseInt(target.getAttribute('square-id')) || parseInt(target.parentNode.getAttribute('square-id'))
  
    console.log('start Position: '+startPosition+ '    targetPos: '+targetPosition)
    switch (chessman) {
        case 'pawn':
            return validatePawnMoves(target,currentPosition,targetPosition,hasMovedOnce)
           

       case 'rook':
            return validateRookMoves(target,currentPosition,targetPosition)

        case 'knight':
            return validateKnightMoves(target,currentPosition,targetPosition)


        case 'bishop':
            return validateBishopMoves(target,currentPosition,targetPosition)


        case 'queen':
            return validateQueenMoves(target,currentPosition,targetPosition)
        

        case 'king':
            return validateKingMoves(target,currentPosition,targetPosition)
            
    }
}


function validatePawnMoves(target,currentPosition,targetPosition,hasMovedOnce){

    // if(isCheck()){
    //     console.log("king in check, please move king")
    //     return
    // }

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


function validateRookMoves(target,currentPosition,targetPosition){

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


function validateBishopMoves(target,currentPosition,targetPosition){
    if(target?.classList.contains(NowPlays)){
        return false
    }

    if((targetPosition%7===currentPosition%7 )|| (targetPosition%9===currentPosition%9)){
        return true
    }
    else{
        return false
    }
}


function validateQueenMoves(target,currentPosition,targetPosition){
    if(target?.classList.contains(NowPlays)){
        return false
    }

    return validateBishopMoves(target,currentPosition,targetPosition) || validateRookMoves(target,currentPosition,targetPosition)
}

function validateKingMoves(target,currentPosition,targetPosition){
    if(target?.classList.contains(NowPlays)){
        return false
    }

    const possiblePositions = new Set()

    possiblePositions.add(currentPosition-1)
    possiblePositions.add(currentPosition+1)
    possiblePositions.add(currentPosition-8)
    possiblePositions.add(currentPosition+8)
    possiblePositions.add(currentPosition-7)
    possiblePositions.add(currentPosition+7)
    possiblePositions.add(currentPosition-9)
    possiblePositions.add(currentPosition+9)

    if(possiblePositions.has(targetPosition)){
        return true
    }

    else{
        return false
    }
}

function isCheck(){
    const opponent = NowPlays==='black'?'black':'white'
    let opponentPieces
    if(opponent==='black'){
        opponentPieces = document.querySelectorAll('.pieces.black')

    }

    else{
        opponentPieces = document.querySelectorAll('.pieces.white')
    }

    opponentPieces.forEach(piece=>{
        //check if each piece is attacking king?
        let pieceType = piece.classList.item(0)

        let king = getKing()
        let moved=true

        let attacksKing=false
        currentPosition = piece.getAttribute('square-id')
        targetPosition = king.getAttribute('square-id')

        switch (pieceType) {
            case 'pawn':
                attacksKing = validatePawnMoves(king,currentPosition,targetPosition,moved)
               
                break;
    
           case 'rook':
                attacksKing = validateRookMoves(king,currentPosition,targetPosition)
    
                break;
    
            case 'knight':
                attacksKing = validateKnightMoves(king,currentPosition,targetPosition)
    
                break;
    
            case 'bishop':
                attacksKing = validateBishopMoves(king,currentPosition,targetPosition)
    
                break;
    
            case 'queen':
                attacksKing = validateQueenMoves(king,currentPosition,targetPosition)
            
                break;
        }

        if(attacksKing===true) return true;


    })

}

function getKing(){
    const kingAttacked = NowPlays==='black'?'black':'white'
    let king
    if(kingAttacked==='black'){
        king = document.querySelector('.pieces.king.black') 
    }
    else{
        king = document.querySelector('.pieces.king.white')
    }

    return king
}

