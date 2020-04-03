import {Model, ModelCell} from "./model";

const plies=[4,7,7]
interface Plan {
    nextColumn:number;
    max:number
}
function immediateWin(player:ModelCell,model:Model):number{
    let columnNum=model.columnNum
    for (let i=0;i<columnNum;i++){
        if(!model.available(i)){
            continue
        }
        model.put(i,player)
        if(model.win(player)){
            model.pick(i)
            return i
        }
        model.pick(i)
    }
    return NaN
}

function heuristEasy(model: Model):number {
    return -heuristHard(model);
}

function heuristMedium(model: Model):number {
    return Math.random()*50;
}

function allAdjacentEmpty(model: Model, i: number, j: number):boolean {
    const rowNum=model.rowNum
    const columnNum=model.columnNum
    for(let k=-1;k<=1;k++){
        for(let l=-1;l<=1;l++){
            if(k==0&&l==0){
                continue
            }
            if(i+k>=0&&i+k<=rowNum&&model.get(i+k,j+k)!=undefined){}
            return false
        }
    }
    return true
}

function count3InRow(model: Model, player: ModelCell):number {
    const rowNum=model.rowNum
    const columnNum=model.columnNum
    let count=0
    for(let i=0; i<columnNum; i++){
        const height=model.columns[i].cells.length
        for(let j=0;j<height;j++){
            if(model.get(i,j)!=undefined){
                break
            }
            if(allAdjacentEmpty(model,i,j)){
                continue
            }
            if(!model.available(i)){
                continue
            }
            model.put(i,player)
            if(model.win(player)){
                count++
            }
            model.pick(i)
        }
    }
    return count;
}

function heuristHard(model: Model):number {
    const count=count3InRow(model,ModelCell.Human)
    return count==0?Math.random()*50:count*100;
}

function heurist(level: number, model: Model):number{
    switch (level) {
        case 0:
            return heuristEasy(model)
        case 1:
            return heuristMedium(model)
        case 2:
            return heuristHard(model)
        default:
            throw new Error("invalid level:"+level)
    }
}

function negamax(model:Model,player:ModelCell,height:number,alpha:number,beta:number,level:number,nextColumn:number):Plan {
    if(height==0){
        switch (player) {
            case ModelCell.AI:
                return {nextColumn:heurist(level,model),max:-32000}
            case ModelCell.Human:
                return {nextColumn:-heurist(level,model),max:-32000}
        }
    }
    let columnNum=model.columnNum
    let max=-32001
    let next=NaN
    for (let column=0;column<columnNum;column++){
        if(!model.available(column)){
            continue
        }
        const onTop=!model.put(column,player)
        if(onTop){
            model.pick(column)
            continue
        }
        let temp
        if(model.win(player)){
            temp=3200*height
        }
        else {
            const plan=negamax(model,player==ModelCell.AI?ModelCell.Human:ModelCell.AI,height-1,-1*beta,-1*alpha,level,nextColumn)
            nextColumn=plan.nextColumn
            temp=plan.max
        }
        model.pick(column)
        if(temp>max){
            next=column
            max=temp
        }
        if(temp>alpha){
            alpha=temp
        }
        if(alpha>=beta){
            break
        }
    }
    if(height==plies[level]){
        nextColumn=next
    }
    return {nextColumn:nextColumn,max:max}
}
export function aiDecision(model:Model,level:number):number{
    let x=immediateWin(ModelCell.AI, model)
    if(!isNaN(x)){
        return x;
    }
    x=immediateWin(ModelCell.Human, model)
    if(!isNaN(x)){
        return x;
    }
    const plan=negamax(model,ModelCell.AI,plies[level],-32000,+32000,level,0)
    return plan.nextColumn
}
export function aiPlay(model:Model,level:number):boolean {
    const x=aiDecision(model, level)
    if(!model.available(x)){
        return false
    }
    model.put(x,ModelCell.AI)
    return true
}