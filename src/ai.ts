import { Model, ModelCell } from "./model";
/**
 *负责AI玩家的决策
 */

const plies=[4,7,7]
interface Plan {
    nextColumn:number;
    max:number
}
//负责判断是否能再下一个棋子就赢
export function immediateWin(player:ModelCell,model:Model):number{
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
//简单模式的启发式算法
export function heuristEasy(model: Model):number {
    return -heuristHard(model);
}
//中等模式的启发式算法
export function heuristMedium(model: Model):number {
    return Math.random()*48+1;
}
//
export function allAdjacentEmpty(model: Model, i: number, j: number):boolean {
    const rowNum=model.rowNum
    const columnNum=model.columnNum
    for(let k=-1;k<=1;k++){
        for(let l=-1;l<=1;l++){
            if(k===0&&l===0){
                continue
            }
            if(i+k>=0&&i+k<=rowNum&&model.get(i+k,j+k)!==undefined){}
            return false
        }
    }
    return true
}
//统计已有的3个一线的情况
export function count3InRow(model: Model, player: ModelCell):number {
    const rowNum=model.rowNum
    const columnNum=model.columnNum
    let count=0
    for(let i=0; i<columnNum; i++){
        const height=model.columns[i].cells.length
        for(let j=height;j<rowNum;j++){
            if(model.get(i,j)!==undefined){
                continue
            }
            if(allAdjacentEmpty(model,i,j)){
                continue
            }
            if(!model.available(i)){
                continue
            }
            if(model.winIfPut(i,j,player)){
                count++
            }
        }
    }
    return count;
}
//困难模式的启发式算法
export function heuristHard(model: Model):number {
    const count=count3InRow(model,ModelCell.Human)
    return count===0?Math.random()*48+1:count*100;
}
//启发式算法
export function heurist(level: number, model: Model):number{
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
//递归式alpha-beta决策树算法
export function negamax(model:Model,player:ModelCell,height:number,alpha:number,beta:number,level:number,nextColumn:number):Plan {
    if(height===0||model.full()){
        switch (player) {
            case ModelCell.AI:
                return {max:heurist(level,model),nextColumn:nextColumn}
            case ModelCell.Human:
                return {max:-heurist(level,model),nextColumn:nextColumn}
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
            const plan=negamax(model,player===ModelCell.AI?ModelCell.Human:ModelCell.AI,height-1,-1*beta,-1*alpha,level,nextColumn)
            nextColumn=plan.nextColumn
            temp=-plan.max
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
    if(height===plies[level]){
        nextColumn=next
    }
    return {nextColumn:nextColumn,max:max}
}
//决策算法
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
//AI下棋
export function aiPlay(model:Model,level:number):boolean {
    const x=aiDecision(model, level)
    if(!model.available(x)){
        return false
    }
    model.put(x,ModelCell.AI)
    return true
}